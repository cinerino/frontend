import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import {
    ActionService,
    QRCodeService,
    UtilService,
} from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-order-money-transfer-confirm',
    templateUrl: './order-money-transfer-confirm.component.html',
    styleUrls: ['./order-money-transfer-confirm.component.scss'],
})
export class OrderMoneyTransferConfirmComponent implements OnInit {
    public isLoading: Observable<boolean>;
    public order: Observable<reducers.IOrderState>;
    public user: Observable<reducers.IUserState>;
    public moment = moment;
    public error: Observable<string | null>;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public environment = getEnvironment();
    public inputForm: FormGroup;
    public theaterCode?: string;
    public eventOrders: Functions.Purchase.IEventOrder[];

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private actionService: ActionService,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private qrcodeService: QRCodeService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.order = this.store.pipe(select(reducers.getOrder));
        this.eventOrders = [];
        this.theaterCode = this.activatedRoute.snapshot.params.theaterCode;
        this.createInputForm();
        try {
            const order = (await this.actionService.order.getData()).order;
            if (order === undefined) {
                throw new Error('order undefined');
            }
            const findResult = order.acceptedOffers.find(
                (a) =>
                    a.itemOffered.typeOf !==
                    factory.chevre.reservationType.EventReservation
            );
            if (findResult !== undefined) {
                throw new Error('not EventReservation');
            }

            this.eventOrders = Functions.Purchase.order2EventOrders({ order });
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * フォーム作成
     */
    private createInputForm() {
        // const TEL_MAX_LENGTH = 15;
        // const TEL_MIN_LENGTH = 9;
        this.inputForm = this.formBuilder.group({
            accountNumber: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[0-9]+$/),
                    // Validators.maxLength(TEL_MAX_LENGTH),
                    // Validators.minLength(TEL_MIN_LENGTH),
                ],
            ],
        });
    }

    /**
     * 転送
     */
    public transfer() {
        Object.keys(this.inputForm.controls).forEach((key) => {
            this.inputForm.controls[key].markAsTouched();
        });
        this.inputForm.controls.accountNumber.setValue(
            (<HTMLInputElement>document.getElementById('accountNumber')).value
        );
        if (this.inputForm.invalid) {
            return;
        }
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant(
                'order.money.transfer.confirm.confirm.transfer'
            ),
            cb: async () => {
                try {
                    const { order } = await this.actionService.order.getData();
                    if (order === undefined) {
                        throw new Error('order === undefined');
                    }
                    await this.actionService.order.moneyTransfer({
                        order,
                        toLocation: {
                            typeOf: 'Account',
                            identifier:
                                this.inputForm.controls.accountNumber.value,
                        },
                        amount: {
                            typeOf: 'MonetaryAmount',
                            value: 1,
                            currency: 'Point',
                        },
                    });
                    if (this.theaterCode !== undefined) {
                        this.router.navigate([
                            `/order/money/transfer/${this.theaterCode}/complete`,
                        ]);
                        return;
                    }
                    this.router.navigate(['/order/money/transfer/complete']);
                } catch (error) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: `
                        <p class="mb-4">${this.translate.instant(
                            'order.money.transfer.confirm.alert.transfer'
                        )}</p>
                        <div class="p-3 bg-light-gray select-text error">
                            <code>${error}</code>
                        </div>`,
                    });
                }
            },
        });
    }

    public openQRReader() {
        this.qrcodeService.openQRCodeReader({
            cb: (data: string) => {
                const code = data;
                this.inputForm.controls.accountNumber.setValue(code);
            },
        });
    }
}
