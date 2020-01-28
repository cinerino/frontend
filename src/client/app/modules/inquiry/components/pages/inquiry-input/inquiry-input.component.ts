import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as libphonenumber from 'libphonenumber-js';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { OrderService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-inquiry-input',
    templateUrl: './inquiry-input.component.html',
    styleUrls: ['./inquiry-input.component.scss']
})
export class InquiryInputComponent implements OnInit {
    public inquiryForm: FormGroup;
    public environment = getEnvironment();
    public isLoading: Observable<boolean>;
    constructor(
        private store: Store<reducers.IState>,
        private formBuilder: FormBuilder,
        private utilService: UtilService,
        private orderService: OrderService,
        private router: Router,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.createInquiryForm();
    }

    /**
     * 照会フォーム作成
     */
    private createInquiryForm() {
        const TEL_MAX_LENGTH = 15;
        const TEL_MIN_LENGTH = 9;
        this.inquiryForm = this.formBuilder.group({
            confirmationNumber: ['', [
                Validators.required,
                Validators.pattern(/^[0-9]+$/)
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
     * 照会
     */
    public async onSubmit() {
        Object.keys(this.inquiryForm.controls).forEach((key) => {
            this.inquiryForm.controls[key].markAsTouched();
        });
        this.inquiryForm.controls.confirmationNumber.setValue((<HTMLInputElement>document.getElementById('confirmationNumber')).value);
        this.inquiryForm.controls.telephone.setValue((<HTMLInputElement>document.getElementById('telephone')).value);
        if (this.inquiryForm.invalid) {
            return;
        }
        const confirmationNumber = this.inquiryForm.controls.confirmationNumber.value;
        const telephone = this.inquiryForm.controls.telephone.value;
        try {
            await this.orderService.inquiry({
                confirmationNumber,
                customer: { telephone }
            });
            this.router.navigate(['/inquiry/confirm']);
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('inquiry.input.validation')
            });
        }
    }

    /**
     * 確認番号変更
     */
    public changeConfirmationNumber(value: string) {
        this.inquiryForm.controls.confirmationNumber.setValue(value);
    }

    /**
     * 電話番号変更
     */
    public changeTelephone(value: string) {
        this.inquiryForm.controls.telephone.setValue(value);
    }

}
