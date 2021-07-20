import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-input',
    templateUrl: './purchase-input.component.html',
    styleUrls: ['./purchase-input.component.scss'],
})
export class PurchaseInputComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public profileForm?: FormGroup;
    public creditCardForm?: FormGroup;
    public amount: number;
    public environment = getEnvironment();
    public viewType = Models.Common.ViewType;
    public paymentServices: factory.service.paymentService.IService[];
    public paymentService: factory.service.paymentService.IService;
    public providerCredentials?: factory.service.paymentService.IProviderCredentials;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private actionService: ActionService,
        private translate: TranslateService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        try {
            this.purchase = this.store.pipe(select(reducers.getPurchase));
            this.user = this.store.pipe(select(reducers.getUser));
            this.isLoading = this.store.pipe(select(reducers.getLoading));
            this.amount = 0;
            this.paymentServices = [];
            const { authorizeSeatReservations, seller } =
                await this.actionService.purchase.getData();
            if (seller === undefined) {
                throw new Error('seller undefined');
            }
            this.amount = Functions.Purchase.getAmount(
                authorizeSeatReservations
            );
            const products = await this.actionService.product.search({
                typeOf: {
                    $eq: factory.service.paymentService.PaymentServiceType
                        .CreditCard,
                },
            });
            products.forEach((p) => {
                if (
                    p.typeOf !==
                        factory.service.paymentService.PaymentServiceType
                            .CreditCard ||
                    p.provider === undefined
                ) {
                    return;
                }
                const findResult = p.provider.find(
                    (provider) => provider.id === seller.id
                );
                if (findResult === undefined) {
                    return;
                }
                this.paymentServices.push(p);
            });
            this.paymentService = this.paymentServices[0];
            this.providerCredentials =
                await Functions.Purchase.getProviderCredentials({
                    paymentService: this.paymentService,
                    seller,
                });
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 決済方法変更
     */
    public async changePaymentService(
        paymentService: factory.service.paymentService.IService
    ) {
        try {
            this.paymentService = paymentService;
            const { seller } = await this.actionService.purchase.getData();
            if (seller === undefined) {
                throw new Error('seller undefined');
            }
            this.providerCredentials =
                await Functions.Purchase.getProviderCredentials({
                    paymentService,
                    seller,
                });
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 入力確定
     */
    public async onSubmit() {
        if (this.profileForm === undefined) {
            return;
        }
        // 購入者情報Form
        Object.keys(this.profileForm.controls).forEach((key) => {
            this.profileForm?.controls[key].markAsTouched();
            if (key === 'telephone') {
                return;
            }
            this.profileForm?.controls[key].setValue(
                (<HTMLInputElement>document.getElementById(key)).value
            );
        });
        if (this.profileForm.invalid) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.input.alert.customer'),
            });
            return;
        }

        if (
            this.providerCredentials?.paymentUrl === undefined &&
            this.amount > 0 &&
            this.creditCardForm !== undefined
        ) {
            // クレジットカード情報フォーム
            Object.keys(this.creditCardForm.controls).forEach((key) => {
                this.creditCardForm?.controls[key].markAsTouched();
            });
            this.creditCardForm.controls.cardNumber.setValue(
                (<HTMLInputElement>document.getElementById('cardNumber')).value
            );
            this.creditCardForm.controls.securityCode.setValue(
                (<HTMLInputElement>document.getElementById('securityCode'))
                    .value
            );
            this.creditCardForm.controls.holderName.setValue(
                (<HTMLInputElement>document.getElementById('holderName')).value
            );
            if (
                this.creditCardForm.invalid ||
                this.paymentService.serviceType?.codeValue === undefined ||
                this.providerCredentials === undefined
            ) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant(
                        'purchase.input.alert.payment'
                    ),
                });
                return;
            }
            // クレジットカード入力
            try {
                const cardExpiration = {
                    year: this.creditCardForm.controls.cardExpirationYear.value,
                    month: this.creditCardForm.controls.cardExpirationMonth
                        .value,
                };
                const creditCard = {
                    cardno: this.creditCardForm.controls.cardNumber.value,
                    expire: `${cardExpiration.year}${cardExpiration.month}`,
                    holderName: this.creditCardForm.controls.holderName.value,
                    securityCode:
                        this.creditCardForm.controls.securityCode.value,
                };
                await this.actionService.purchase.payment.setPayment({
                    creditCard,
                    paymentMethod: this.paymentService.serviceType.codeValue,
                    providerCredentials: this.providerCredentials,
                });
            } catch (error) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant(
                        'purchase.input.alert.createCreditCardToken'
                    ),
                });
                return;
            }
        }

        if (
            this.providerCredentials?.paymentUrl !== undefined &&
            this.paymentService.serviceType?.codeValue !== undefined &&
            this.amount > 0
        ) {
            // 外部決済URLを発行する必要があります(トークンでの決済承認は不可)
            await this.actionService.purchase.payment.setPayment({
                paymentMethod: this.paymentService.serviceType.codeValue,
                providerCredentials: this.providerCredentials,
            });
        }

        try {
            const additionalProperty: { name: string; value: string }[] = [];
            Object.keys(this.profileForm.controls).forEach((key) => {
                if (!/additionalProperty/.test(key)) {
                    return;
                }
                additionalProperty.push({
                    name: key.replace('additionalProperty.', ''),
                    value: this.profileForm?.controls[key].value,
                });
            });

            const contact = {
                givenName:
                    this.profileForm.controls.givenName === undefined
                        ? undefined
                        : this.profileForm.controls.givenName.value,
                familyName:
                    this.profileForm.controls.familyName === undefined
                        ? undefined
                        : this.profileForm.controls.familyName.value,
                telephone:
                    this.profileForm.controls.telephone === undefined
                        ? undefined
                        : this.profileForm.controls.telephone.value.e164Number,
                email:
                    this.profileForm.controls.email === undefined
                        ? undefined
                        : this.profileForm.controls.email.value,
                address:
                    this.profileForm.controls.address === undefined
                        ? undefined
                        : this.profileForm.controls.address.value,
                age:
                    this.profileForm.controls.age === undefined
                        ? undefined
                        : this.profileForm.controls.age.value,
                gender:
                    this.profileForm.controls.gender === undefined
                        ? undefined
                        : this.profileForm.controls.gender.value,
                additionalProperty:
                    additionalProperty.length === 0
                        ? undefined
                        : additionalProperty,
            };
            await this.actionService.purchase.transaction.setProfile(contact);
            this.router.navigate(['/purchase/confirm']);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }
}
