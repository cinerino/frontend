import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UtilService } from '../../../../services';
import { masterAction, userAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-mypage-credit',
    templateUrl: './mypage-credit.component.html',
    styleUrls: ['./mypage-credit.component.scss']
})
export class MypageCreditComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public creditCardForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private util: UtilService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private router: Router
    ) { }

    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        try {
            await this.getSellers();
            await this.getCreditCards();
            this.createCreditCardForm();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    private createCreditCardForm() {
        this.cardExpiration = {
            year: [],
            month: []
        };
        for (let i = 0; i < 12; i++) {
            this.cardExpiration.month.push(`0${String(i + 1)}`.slice(-2));
        }
        for (let i = 0; i < 10; i++) {
            this.cardExpiration.year.push(moment().add(i, 'year').format('YYYY'));
        }
        this.creditCardForm = this.formBuilder.group({
            sellerId: ['', [Validators.required]],
            cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            cardExpirationMonth: [this.cardExpiration.month[0], [Validators.required]],
            cardExpirationYear: [this.cardExpiration.year[0], [Validators.required]],
            securityCode: ['', [Validators.required]],
            holderName: ['', [Validators.required]]
        });
    }

    private getSellers() {
        return new Promise((resolve, reject) => {
            this.store.dispatch(new masterAction.GetSellers({ params: {} }));
            const success = this.actions.pipe(
                ofType(masterAction.ActionTypes.GetSellersSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(masterAction.ActionTypes.GetSellersFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    private getCreditCards() {
        return new Promise((resolve, reject) => {
            this.store.dispatch(new userAction.GetCreditCards());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.GetCreditCardsSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.GetCreditCardsFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    public addCreditCard() {
        Object.keys(this.creditCardForm.controls).forEach((key) => {
            this.creditCardForm.controls[key].markAsTouched();
        });

        this.creditCardForm.controls.cardNumber.setValue((<HTMLInputElement>document.getElementById('cardNumber')).value);
        this.creditCardForm.controls.securityCode.setValue((<HTMLInputElement>document.getElementById('securityCode')).value);
        this.creditCardForm.controls.holderName.setValue((<HTMLInputElement>document.getElementById('holderName')).value);

        if (this.creditCardForm.invalid) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('mypage.credit.alert.addCredit')
            });
            return;
        }

        const cardExpiration = {
            year: this.creditCardForm.controls.cardExpirationYear.value,
            month: this.creditCardForm.controls.cardExpirationMonth.value
        };

        const creditCard = {
            cardno: this.creditCardForm.controls.cardNumber.value,
            expire: `${cardExpiration.year}${cardExpiration.month}`,
            holderName: this.creditCardForm.controls.holderName.value,
            securityCode: this.creditCardForm.controls.securityCode.value
        };
        this.master.subscribe((master) => {
            const seller = master.sellers.find(s => s.id === this.creditCardForm.controls.sellerId.value);
            if (seller === undefined) {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('mypage.credit.alert.add')
                });
                return;
            }
            this.store.dispatch(new userAction.AddCreditCard({ creditCard, seller }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(userAction.ActionTypes.AddCreditCardSuccess),
            tap(() => {
                this.createCreditCardForm();
            })
        );

        const fail = this.actions.pipe(
            ofType(userAction.ActionTypes.AddCreditCardFail),
            tap(() => { })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    public confirmRemoveCreditCard(creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.util.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('mypage.credit.confirm.remove'),
            cb: () => {
                this.removeCreditCard(creditCard);
            }
        });
    }

    private removeCreditCard(creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.store.dispatch(new userAction.RemoveCreditCard({ creditCard }));
        const success = this.actions.pipe(
            ofType(userAction.ActionTypes.RemoveCreditCardSuccess),
            tap(() => { })
        );
        const fail = this.actions.pipe(
            ofType(userAction.ActionTypes.RemoveCreditCardFail),
            tap(() => {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('mypage.credit.alert.remove')
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}

