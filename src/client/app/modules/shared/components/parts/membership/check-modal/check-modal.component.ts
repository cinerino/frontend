import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ActionService, QRCodeService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-membership-check-modal',
    templateUrl: './check-modal.component.html',
    styleUrls: ['./check-modal.component.scss'],
})
export class MembershipCheckModalComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public inputForm: FormGroup;
    public errorMessage: string;
    public isSuccess: boolean;
    public successMessage: string;

    constructor(
        public modal: BsModalRef,
        private store: Store<reducers.IState>,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private qrcodeService: QRCodeService,
        private actionService: ActionService
    ) {}

    public ngOnInit() {
        this.errorMessage = '';
        this.successMessage = '';
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.createForm();
    }

    public createForm() {
        const CODE_MAX_LENGTH = 30;
        const PASSWORD_MAX_LENGTH = 30;
        this.inputForm = this.formBuilder.group({
            code: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(CODE_MAX_LENGTH),
                    Validators.pattern(/^[0-9a-zA-Z]+$/),
                ],
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(PASSWORD_MAX_LENGTH),
                    Validators.pattern(/^[0-9a-zA-Z]+$/),
                ],
            ],
        });
    }

    /**
     * onSubmit
     */
    public async onSubmit() {
        Object.keys(this.inputForm.controls).forEach((key) => {
            this.inputForm.controls[key].markAsTouched();
        });
        this.inputForm.controls.code.setValue(
            (<HTMLInputElement>document.getElementById('code')).value
        );
        this.inputForm.controls.password.setValue(
            (<HTMLInputElement>document.getElementById('password')).value
        );

        if (this.inputForm.invalid) {
            return;
        }
        this.errorMessage = '';
        this.successMessage = '';
        try {
            this.actionService.purchase.payment.checkMembership({
                membership: {
                    code: this.inputForm.controls.code.value,
                    password: this.inputForm.controls.password.value,
                },
            });
            this.createForm();
            this.successMessage = this.translate.instant(
                'modal.membership.check.success'
            );
            this.isSuccess = true;
        } catch (error) {
            console.error(error);
            this.isSuccess = false;
            this.errorMessage = this.translate.instant(
                'modal.membership.check.alert.error'
            );
        }
    }

    public openQRReader() {
        this.qrcodeService.openQRCodeReader({
            cb: (data: string) => {
                const code = data.split('@')[0];
                const password = data.split('@')[1];
                this.inputForm.controls.code.setValue(code);
                this.inputForm.controls.password.setValue(password);
            },
        });
    }
}
