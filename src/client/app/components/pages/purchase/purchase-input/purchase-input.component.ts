import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as libphonenumber from 'libphonenumber-js';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { getAmount } from '../../../../functions';
import { ViewType } from '../../../../models';
import { LibphonenumberFormatPipe } from '../../../../pipes/libphonenumber-format.pipe';
import { PurchaseService, UtilService } from '../../../../services';
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
        private router: Router,
        private modal: BsModalService,
        private formBuilder: FormBuilder,
        private utilService: UtilService,
        private purchaseService: PurchaseService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.createCustomerContactForm();
        this.createCreditCardForm();
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.amount = getAmount(purchase.authorizeSeatReservations);
            if (purchase.customerContact !== undefined
                && purchase.customerContact.familyName !== undefined
                && purchase.customerContact.givenName !== undefined
                && purchase.customerContact.email !== undefined
                && purchase.customerContact.telephone !== undefined) {
                this.customerContactForm.controls.familyName.setValue(purchase.customerContact.familyName);
                this.customerContactForm.controls.givenName.setValue(purchase.customerContact.givenName);
                this.customerContactForm.controls.email.setValue(purchase.customerContact.email);
                this.customerContactForm.controls.telephone.setValue(
                    new LibphonenumberFormatPipe().transform(purchase.customerContact.telephone)
                );
                return;
            }
            this.user.subscribe((user) => {
                if (user.isMember
                    && user.profile !== undefined
                    && user.profile.familyName !== undefined
                    && user.profile.givenName !== undefined
                    && user.profile.email !== undefined
                    && user.profile.telephone !== undefined) {
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
        const TEL_MAX_LENGTH = 15;
        const TEL_MIN_LENGTH = 9;
        this.customerContactForm = this.formBuilder.group({
            familyName: ['', [
                Validators.required,
                Validators.maxLength(NAME_MAX_LENGTH),
                (control: AbstractControl): (ValidationErrors | null) => {
                    const field = control.root.get('familyName');
                    const language = document.documentElement.lang;
                    if (field !== null) {
                        if (field.value === '') {
                            return null;
                        }
                        if (language === 'ja' && !new RegExp(/^[ァ-ヶー]+$/).test(field.value)) {
                            return { customPattern: true };
                        }
                        if (language !== 'ja' && !new RegExp(/^[a-z]+$/).test(field.value)) {
                            return { customPattern: true };
                        }
                    }

                    return null;
                }
            ]],
            givenName: ['', [
                Validators.required,
                Validators.maxLength(NAME_MAX_LENGTH),
                (control: AbstractControl): (ValidationErrors | null) => {
                    const field = control.root.get('givenName');
                    const language = document.documentElement.lang;
                    if (field !== null) {
                        if (field.value === '') {
                            return null;
                        }
                        if (language === 'ja' && !new RegExp(/^[ァ-ヶー]+$/).test(field.value)) {
                            return { customPattern: true };
                        }
                        if (language !== 'ja' && !new RegExp(/^[a-z]+$/).test(field.value)) {
                            return { customPattern: true };
                        }
                    }

                    return null;
                }
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
                (control: AbstractControl): ValidationErrors | null => {
                    const field = control.root.get('telephone');
                    if (field !== null) {
                        if (field.value === '') {
                            return null;
                        }
                        const parsedNumber = (new RegExp(/^\+/).test(field.value))
                            ? libphonenumber.parse(field.value)
                            : libphonenumber.parse(field.value, 'JP');
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
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.input.alert.customer')
            });
            return;
        }
        // クレジットカード情報フォーム
        if (this.usedCreditCard === undefined && this.amount > 0) {
            Object.keys(this.creditCardForm.controls).forEach((key) => {
                this.creditCardForm.controls[key].markAsTouched();
            });
            this.creditCardForm.controls.cardNumber.setValue((<HTMLInputElement>document.getElementById('cardNumber')).value);
            this.creditCardForm.controls.securityCode.setValue((<HTMLInputElement>document.getElementById('securityCode')).value);
            this.creditCardForm.controls.holderName.setValue((<HTMLInputElement>document.getElementById('holderName')).value);
            if (this.creditCardForm.invalid) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.input.alert.payment')
                });
                return;
            }
        }
        this.purchaseService.removeCreditCard();
        if (this.amount > 0 && this.usedCreditCard === undefined) {
            // クレジットカード入力
            try {
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
                await this.purchaseService.createGmoTokenObject(creditCard);
            } catch (error) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.input.alert.gmoToken')
                });
                return;
            }
        }
        if (this.amount > 0 && this.usedCreditCard !== undefined) {
            // 登録済みクレジットカード
            const creditCard = {
                memberId: 'me',
                cardSeq: Number(this.usedCreditCard.cardSeq)
            };
            this.purchaseService.registerCreditCard(creditCard);
        }
        try {
            const contact = {
                givenName: this.customerContactForm.controls.givenName.value,
                familyName: this.customerContactForm.controls.familyName.value,
                telephone: this.customerContactForm.controls.telephone.value,
                email: this.customerContactForm.controls.email.value,
            };
            await this.purchaseService.registerContact(contact);
            this.router.navigate(['/purchase/confirm']);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * セキュリティコード詳細表示
     */
    public openSecurityCode() {
        this.modal.show(SecurityCodeModalComponent, {
            class: 'modal-dialog-centered'
        });
    }

    /**
     * 登録済みクレジットカード表示
     */
    public openRegisteredCreditCard() {

        this.user.subscribe((user) => {
            this.modal.show(RegisteredCreditCardModalComponent, {
                initialState: {
                    creditCards: user.creditCards,
                    cb: (creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) => {
                        this.usedCreditCard = creditCard;
                    }
                },
                class: 'modal-dialog-centered'
            });
        }).unsubscribe();
    }

    /**
     * クレジットカード情報入力へ変更
     */
    public changeInputCreditCard() {
        this.usedCreditCard = undefined;
        this.createCreditCardForm();
    }

    /**
     * クリップボードへコピー
     */
    public copyDomain() {
        const str = this.translate.instant('email.domain');
        const element = document.createElement('textarea');
        element.value = str;
        element.selectionStart = 0;
        element.selectionEnd = element.value.length;
        document.body.appendChild(element);
        element.focus();
        document.execCommand('copy');
        element.blur();
        document.body.removeChild(element);
    }

}
