import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-order-point-transfer-confirm',
    templateUrl: './order-point-transfer-confirm.component.html',
    styleUrls: ['./order-point-transfer-confirm.component.scss']
})
export class OrderPointTransferConfirmComponent implements OnInit {
    public isLoading: Observable<boolean>;
    public order: Observable<reducers.IOrderState>;
    public user: Observable<reducers.IUserState>;
    public moment = moment;
    public error: Observable<string | null>;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public environment = getEnvironment();
    public inputForm: FormGroup;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private actionService: ActionService,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.order = this.store.pipe(select(reducers.getOrder));
        this.createInputForm();
        try {
            const order = (await this.actionService.order.getData()).order;
            if (order === undefined) {
                throw new Error('order undefined');
            }
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
            accountNumber: ['', [
                Validators.required,
                Validators.pattern(/^[0-9]+$/),
                // Validators.maxLength(TEL_MAX_LENGTH),
                // Validators.minLength(TEL_MIN_LENGTH),
            ]],
        });
        const accountNumber = this.activatedRoute.snapshot.params.accountNumber;
        if (accountNumber !== undefined) {
            this.inputForm.controls.accountNumber.setValue(accountNumber);
        }
    }

    /**
     * 転送
     */
    public transfer() {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('order.point.transfer.confirm.confirm.transfer'),
            cb: async () => {
                try {
                    this.router.navigate(['/order/point/transfer/complete']);
                } catch (error) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: `
                        <p class="mb-4">${this.translate.instant('inquiry.confirm.alert.transfer')}</p>
                        <div class="p-3 bg-light-gray select-text error">
                            <code>${error}</code>
                        </div>`
                    });
                }
            }
        });
    }
}
