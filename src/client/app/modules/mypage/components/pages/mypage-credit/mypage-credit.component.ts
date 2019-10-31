import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { MasterService, UserService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-mypage-credit',
    templateUrl: './mypage-credit.component.html',
    styleUrls: ['./mypage-credit.component.scss']
})
export class MypageCreditComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public isLoading: Observable<boolean>;
    public creditCardForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private masterService: MasterService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private router: Router
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        try {
            await this.masterService.getSellers();
            await this.userService.getCreditCards();
            this.createCreditCardForm();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * クレジットカードフォーム作成
     */
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

    /**
     * クレジットカード情報登録
     */
    public async addCreditCard() {
        Object.keys(this.creditCardForm.controls).forEach((key) => {
            this.creditCardForm.controls[key].markAsTouched();
        });

        this.creditCardForm.controls.cardNumber.setValue((<HTMLInputElement>document.getElementById('cardNumber')).value);
        this.creditCardForm.controls.securityCode.setValue((<HTMLInputElement>document.getElementById('securityCode')).value);
        this.creditCardForm.controls.holderName.setValue((<HTMLInputElement>document.getElementById('holderName')).value);

        if (this.creditCardForm.invalid) {
            this.utilService.openAlert({
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
        try {
            const master = await this.masterService.getData();
            const seller = master.sellers.find(s => s.id === this.creditCardForm.controls.sellerId.value);
            if (seller === undefined) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('mypage.credit.alert.add')
                });
                return;
            }
            await this.userService.addCreditCard({ creditCard, seller });
            this.createCreditCardForm();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * クレジットカード情報削除確認
     * @param creditCard
     */
    public confirmRemoveCreditCard(creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('mypage.credit.confirm.remove'),
            cb: async () => {
                try {
                    await this.userService.removeCreditCard(creditCard);
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('mypage.credit.alert.remove')
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

}

