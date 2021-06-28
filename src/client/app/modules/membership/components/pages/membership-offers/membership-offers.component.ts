import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';
import { CreditCardSelectModalComponent } from '../../../../shared/components/parts/creditcard/select-modal/select-modal.component';

@Component({
    selector: 'app-membership-offers',
    templateUrl: './membership-offers.component.html',
    styleUrls: ['./membership-offers.component.scss'],
})
export class MembershipOffersComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public profileForm?: FormGroup;
    public creditCardForm?: FormGroup;
    public amount: number;
    public environment = getEnvironment();
    public viewType = Models.Common.ViewType;
    public usedCreditCard?: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private modal: BsModalService,
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
            const user = await this.actionService.user.getData();
            if (user.login) {
                // ログイン
                await this.actionService.user.getProfile();
                // await this.actionService.user.getCreditCards();
            }
            const { transaction, authorizeSeatReservations } =
                await this.actionService.purchase.getData();
            if (transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.amount = Functions.Purchase.getAmount(
                authorizeSeatReservations
            );
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
        // クレジットカード情報フォーム
        if (
            this.amount > 0 &&
            this.usedCreditCard === undefined &&
            this.creditCardForm !== undefined
        ) {
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
            if (this.creditCardForm.invalid) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant(
                        'purchase.input.alert.payment'
                    ),
                });
                return;
            }
        }
        this.actionService.purchase.removeCreditCard();
        if (
            this.amount > 0 &&
            this.usedCreditCard === undefined &&
            this.creditCardForm !== undefined
        ) {
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
                await this.actionService.purchase.payment.createCreditCardToken(
                    creditCard
                );
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
        if (this.amount > 0 && this.usedCreditCard !== undefined) {
            // 登録済みクレジットカード
            const creditCard = {
                memberId: 'me',
                cardSeq: Number(this.usedCreditCard.cardSeq),
            };
            this.actionService.purchase.registerCreditCard(creditCard);
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
            await this.actionService.purchase.setProfile(contact);
            this.router.navigate(['/purchase/confirm']);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * 登録済みクレジットカード表示
     */
    public openRegisteredCreditCard() {
        this.user
            .subscribe((user) => {
                this.modal.show(CreditCardSelectModalComponent, {
                    initialState: {
                        creditCards: user.creditCards,
                        cb: (
                            creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
                        ) => {
                            this.usedCreditCard = creditCard;
                        },
                    },
                    class: 'modal-dialog-centered',
                });
            })
            .unsubscribe();
    }

    /**
     * クレジットカード情報入力へ変更
     */
    public changeInputCreditCard() {
        this.usedCreditCard = undefined;
    }
}
