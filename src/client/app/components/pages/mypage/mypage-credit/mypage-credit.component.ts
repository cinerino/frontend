import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UtilService } from '../../../../services';
import * as userAction from '../../../../store/actions/user.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-mypage-credit',
    templateUrl: './mypage-credit.component.html',
    styleUrls: ['./mypage-credit.component.scss']
})
export class MypageCreditComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public paymentForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private util: UtilService,
        private formBuilder: FormBuilder,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.createPaymentForm();
    }

    private createPaymentForm() {
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
        this.paymentForm = this.formBuilder.group({
            cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            cardExpirationMonth: [this.cardExpiration.month[0], [Validators.required]],
            cardExpirationYear: [this.cardExpiration.year[0], [Validators.required]],
            securityCode: ['', [Validators.required]],
            holderName: ['', [Validators.required]]
        });
    }

    public updatePayment() {
        Object.keys(this.paymentForm.controls).forEach((key) => {
            this.paymentForm.controls[key].markAsTouched();
        });

        this.paymentForm.controls.cardNumber.setValue((<HTMLInputElement>document.getElementById('cardNumber')).value);
        this.paymentForm.controls.securityCode.setValue((<HTMLInputElement>document.getElementById('securityCode')).value);
        this.paymentForm.controls.holderName.setValue((<HTMLInputElement>document.getElementById('holderName')).value);

        if (this.paymentForm.invalid) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('setting.alert.payment')
            });
            return;
        }

        this.store.dispatch(new userAction.UpdatePayment());

        const success = this.actions.pipe(
            ofType(userAction.ActionTypes.UpdatePaymentSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(userAction.ActionTypes.UpdatePaymentFail),
            tap(() => { })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}

