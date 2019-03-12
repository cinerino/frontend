import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as libphonenumber from 'libphonenumber-js';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { getAmount } from '../../../../functions';
import { ViewType } from '../../../../models';
import { LibphonenumberFormatPipe } from '../../../../pipes/libphonenumber-format.pipe';
import { UtilService } from '../../../../services';
import * as purchaseAction from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { RegisteredCreditCardModalComponent, SecurityCodeModalComponent } from '../../../parts';

@Component({
    selector: 'app-purchase-input',
    templateUrl: './purchase-input.component.html',
    styleUrls: ['./purchase-input.component.scss']
})
export class PurchaseInputComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public customerContactForm: FormGroup;
    public creditCardForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public amount: number;
    public environment = environment;
    public viewType: typeof ViewType = ViewType;
    public usedCreditCard?: factory.paymentMethod.paymentCard.creditCard.ICheckedCard;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private modal: NgbModal,
        private formBuilder: FormBuilder,
        private util: UtilService,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.amount = 0;
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.createCustomerContactForm();
        this.createCreditCardForm();
        this.purchase.subscribe((purchase) => {
            this.amount = getAmount(purchase.authorizeSeatReservations);
            if (purchase.customerContact !== undefined) {
                this.customerContactForm.controls.familyName.setValue(purchase.customerContact.familyName);
                this.customerContactForm.controls.givenName.setValue(purchase.customerContact.givenName);
                this.customerContactForm.controls.email.setValue(purchase.customerContact.email);
                this.customerContactForm.controls.telephone.setValue(
                    new LibphonenumberFormatPipe().transform(purchase.customerContact.telephone)
                );
                return;
            }
            this.user.subscribe((user) => {
                if (environment.ENV === 'local') {
                    this.customerContactForm.controls.familyName.setValue('ハタグチ');
                    this.customerContactForm.controls.givenName.setValue('アキト');
                    this.customerContactForm.controls.email.setValue('hataguchi@motionpicture.jp');
                    this.customerContactForm.controls.telephone.setValue('0362778824');
                    this.creditCardForm.controls.cardNumber.setValue('4111111111111111');
                    this.creditCardForm.controls.securityCode.setValue('123');
                    this.creditCardForm.controls.holderName.setValue('HATAGUCHI');
                }
                if (user.isMember && user.profile !== undefined) {
                    this.customerContactForm.controls.familyName.setValue(user.profile.familyName);
                    this.customerContactForm.controls.givenName.setValue(user.profile.givenName);
                    this.customerContactForm.controls.email.setValue(user.profile.email);
                    this.customerContactForm.controls.telephone.setValue(
                        new LibphonenumberFormatPipe().transform(user.profile.telephone)
                    );
                }
            }).unsubscribe();
        }).unsubscribe();
    }

    /**
     * 購入情報フォーム作成
     */
    private createCustomerContactForm() {
        const NAME_MAX_LENGTH = 12;
        const MAIL_MAX_LENGTH = 50;
        const TEL_MAX_LENGTH = 11;
        const TEL_MIN_LENGTH = 9;
        this.customerContactForm = this.formBuilder.group({
            familyName: ['', [
                Validators.required,
                Validators.maxLength(NAME_MAX_LENGTH),
                Validators.pattern(/^[ァ-ヶー]+$/)
            ]],
            givenName: ['', [
                Validators.required,
                Validators.maxLength(NAME_MAX_LENGTH),
                Validators.pattern(/^[ァ-ヶー]+$/)
            ]],
            email: ['', [
                Validators.required,
                Validators.maxLength(MAIL_MAX_LENGTH),
                Validators.email
            ]],
            telephone: ['', [
                Validators.required,
                Validators.maxLength(TEL_MAX_LENGTH),
                Validators.minLength(TEL_MIN_LENGTH),
                Validators.pattern(/^[0-9]+$/),
                (control: AbstractControl): ValidationErrors | null => {
                    const field = control.root.get('telephone');
                    if (field !== null) {
                        const parsedNumber = libphonenumber.parse(field.value, 'JP');
                        if (parsedNumber.phone === undefined) {
                            return { telephone: true };
                        }
                        const isValid = libphonenumber.isValidNumber(parsedNumber);
                        if (!isValid) {
                            return { telephone: true };
                        }
                    }

                    return null;
                }
            ]]
        });
    }

    /**
     * クレジットカード情報フォーム作成
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
            cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            cardExpirationMonth: [this.cardExpiration.month[0], [Validators.required]],
            cardExpirationYear: [this.cardExpiration.year[0], [Validators.required]],
            securityCode: ['', [Validators.required]],
            holderName: ['', [Validators.required]]
        });
    }

    /**
     * 入力確定
     */
    public async onSubmit() {
        // 購入者情報Form
        Object.keys(this.customerContactForm.controls).forEach((key) => {
            this.customerContactForm.controls[key].markAsTouched();
        });
        this.customerContactForm.controls.familyName.setValue((<HTMLInputElement>document.getElementById('familyName')).value);
        this.customerContactForm.controls.givenName.setValue((<HTMLInputElement>document.getElementById('givenName')).value);
        this.customerContactForm.controls.email.setValue((<HTMLInputElement>document.getElementById('email')).value);
        this.customerContactForm.controls.telephone.setValue((<HTMLInputElement>document.getElementById('telephone')).value);
        if (this.customerContactForm.invalid) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.input.alert.customer')
            });
            return;
        }
        // クレジットカード情報Form
        if (this.usedCreditCard === undefined && this.amount > 0) {
            Object.keys(this.creditCardForm.controls).forEach((key) => {
                this.creditCardForm.controls[key].markAsTouched();
            });
            this.creditCardForm.controls.cardNumber.setValue((<HTMLInputElement>document.getElementById('cardNumber')).value);
            this.creditCardForm.controls.securityCode.setValue((<HTMLInputElement>document.getElementById('securityCode')).value);
            this.creditCardForm.controls.holderName.setValue((<HTMLInputElement>document.getElementById('holderName')).value);
            if (this.creditCardForm.invalid) {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.input.alert.payment')
                });
                return;
            }
        }
        try {
            this.store.dispatch(new purchaseAction.RemoveCreditCard());
            if (this.amount > 0) {
                if (this.usedCreditCard === undefined) {
                    try {
                        await this.createGmoTokenObject();
                    } catch (error) {
                        this.util.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('purchase.input.alert.gmoToken')
                        });
                        return;
                    }
                } else {
                    const creditCard = {
                        memberId: 'me',
                        cardSeq: Number(this.usedCreditCard.cardSeq)
                    };
                    this.store.dispatch(new purchaseAction.RegisterCreditCard({ creditCard }));
                }
            }
            await this.registerContact();
            this.router.navigate(['/purchase/confirm']);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * 購入者情報登録
     */
    private registerContact() {
        return new Promise<void>((resolve, reject) => {
            this.purchase.subscribe((purchase) => {
                if (purchase.transaction === undefined) {
                    this.router.navigate(['/error']);
                    return;
                }
                const transaction = purchase.transaction;
                const contact = {
                    givenName: this.customerContactForm.controls.givenName.value,
                    familyName: this.customerContactForm.controls.familyName.value,
                    telephone: this.customerContactForm.controls.telephone.value,
                    email: this.customerContactForm.controls.email.value,
                };
                this.store.dispatch(new purchaseAction.RegisterContact({ transaction, contact }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.RegisterContactSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.RegisterContactFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * GMOトークン取得
     */
    private createGmoTokenObject() {
        return new Promise<void>((resolve, reject) => {
            this.purchase.subscribe((purchase) => {
                if (purchase.seller === undefined) {
                    this.router.navigate(['/error']);
                    return;
                }
                const cardExpiration = {
                    year: this.creditCardForm.controls.cardExpirationYear.value,
                    month: this.creditCardForm.controls.cardExpirationMonth.value
                };
                this.store.dispatch(new purchaseAction.CreateGmoTokenObject({
                    seller: purchase.seller,
                    creditCard: {
                        cardno: this.creditCardForm.controls.cardNumber.value,
                        expire: `${cardExpiration.year}${cardExpiration.month}`,
                        holderName: this.creditCardForm.controls.holderName.value,
                        securityCode: this.creditCardForm.controls.securityCode.value
                    }
                }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CreateGmoTokenObjectSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CreateGmoTokenObjectFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * セキュリティコード詳細表示
     */
    public openSecurityCode() {
        this.modal.open(SecurityCodeModalComponent, {
            centered: true
        });
    }

    /**
     * 登録済みクレジットカード表示
     */
    public openRegisteredCreditCard() {
        const modalRef = this.modal.open(RegisteredCreditCardModalComponent, {
            centered: true
        });
        this.user.subscribe((user) => {
            modalRef.componentInstance.creditCards = user.creditCards;
        }).unsubscribe();

        modalRef.result.then((creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) => {
            this.usedCreditCard = creditCard;
        }).catch(() => { });
    }

    /**
     * クレジットカード情報入力へ変更
     */
    public changeInputCreditCard() {
        this.usedCreditCard = undefined;
        this.createCreditCardForm();
    }

}
