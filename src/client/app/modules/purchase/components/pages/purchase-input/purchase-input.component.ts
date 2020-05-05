import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as libphonenumber from 'libphonenumber-js';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { getAmount } from '../../../../../functions';
import { ViewType } from '../../../../../models';
import { PurchaseService, UserService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';
import {
    CreditcardSecurityCodeModalComponent
} from '../../../../shared/components/parts/creditcard/security-code-modal/security-code-modal.component';
import { CreditCardSelectModalComponent } from '../../../../shared/components/parts/creditcard/select-modal/select-modal.component';
import { LibphonenumberFormatPipe } from '../../../../shared/pipes/libphonenumber-format.pipe';

@Component({
    selector: 'app-purchase-input',
    templateUrl: './purchase-input.component.html',
    styleUrls: ['./purchase-input.component.scss']
})
export class PurchaseInputComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public profileForm: FormGroup;
    public creditCardForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public amount: number;
    public environment = getEnvironment();
    public viewType: typeof ViewType = ViewType;
    public usedCreditCard?: factory.paymentMethod.paymentCard.creditCard.ICheckedCard;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private modal: BsModalService,
        private formBuilder: FormBuilder,
        private utilService: UtilService,
        private userService: UserService,
        private purchaseService: PurchaseService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        try {
            this.purchase = this.store.pipe(select(reducers.getPurchase));
            this.user = this.store.pipe(select(reducers.getUser));
            this.isLoading = this.store.pipe(select(reducers.getLoading));
            await this.createProfileForm();
            this.createCreditCardForm();
            const purchase = await this.purchaseService.getData();
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.amount = getAmount(purchase.authorizeSeatReservations);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 購入情報フォーム作成
     */
    private async createProfileForm() {
        const profile = this.environment.PROFILE;
        this.profileForm = this.formBuilder.group({});
        profile.forEach(p => {
            const validators: ValidatorFn[] = [];
            if (p.required !== undefined && p.required) {
                validators.push(Validators.required);
            }
            if (p.maxLength !== undefined) {
                validators.push(Validators.maxLength(p.maxLength));
            }
            if (p.minLength !== undefined) {
                validators.push(Validators.minLength(p.minLength));
            }
            if (p.pattern !== undefined) {
                validators.push(Validators.pattern(p.pattern));
            }
            if (p.key === 'familyName' || p.key === 'givenName') {
                validators.push((control: AbstractControl) => {
                    const field = control.root.get(p.key);
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
                });
            }
            if (p.key === 'email') {
                validators.push(Validators.email);
            }
            if (p.key === 'telephone') {
                validators.push((control: AbstractControl) => {
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
                });
            }
            this.profileForm.addControl(p.key, new FormControl(p.value, validators));
        });
        const purchase = await this.purchaseService.getData();
        const user = await this.userService.getData();
        const profileData = (user.isMember && purchase.profile === undefined)
        ? user.profile : purchase.profile;
        if (profileData === undefined) {
            return;
        }
        Object.keys(profileData).forEach(key => {
            const value = (<any>profileData)[key];
            if (value === undefined || this.profileForm.controls[key] === undefined) {
                return;
            }
            if (key === 'telephone') {
                this.profileForm.controls.telephone
                    .setValue(new LibphonenumberFormatPipe().transform(value));
                return;
            }
            this.profileForm.controls[key].setValue(value);
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
        Object.keys(this.profileForm.controls).forEach((key) => {
            this.profileForm.controls[key].markAsTouched();
        });
        this.profileForm.controls.familyName.setValue((<HTMLInputElement>document.getElementById('familyName')).value);
        this.profileForm.controls.givenName.setValue((<HTMLInputElement>document.getElementById('givenName')).value);
        this.profileForm.controls.email.setValue((<HTMLInputElement>document.getElementById('email')).value);
        this.profileForm.controls.telephone.setValue((<HTMLInputElement>document.getElementById('telephone')).value);
        if (this.profileForm.invalid) {
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
                givenName: this.profileForm.controls.givenName.value,
                familyName: this.profileForm.controls.familyName.value,
                telephone: this.profileForm.controls.telephone.value,
                email: this.profileForm.controls.email.value,
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
        this.modal.show(CreditcardSecurityCodeModalComponent, {
            class: 'modal-dialog-centered'
        });
    }

    /**
     * 登録済みクレジットカード表示
     */
    public openRegisteredCreditCard() {

        this.user.subscribe((user) => {
            this.modal.show(CreditCardSelectModalComponent, {
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

    /**
     * 必須判定
     */
    public isRequired(key: String) {
        return this.environment.PROFILE.find(p => p.key === key && p.required) !== undefined;
    }

}
