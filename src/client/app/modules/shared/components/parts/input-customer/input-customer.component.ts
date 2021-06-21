import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { factory } from '@cinerino/sdk';
import { TranslateService } from '@ngx-translate/core';
import {
    CountryISO,
    NgxIntlTelInputComponent,
    SearchCountryField,
    TooltipLabel,
} from 'ngx-intl-tel-input';
import { Subscription } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { LibphonenumberFormatPipe } from '../../../pipes/libphonenumber-format.pipe';

@Component({
    selector: 'app-input-customer',
    templateUrl: './input-customer.component.html',
    styleUrls: ['./input-customer.component.scss'],
})
export class InputCustomerComponent implements OnInit, OnDestroy {
    public environment = getEnvironment();
    public SearchCountryField = SearchCountryField;
    public TooltipLabel = TooltipLabel;
    public CountryISO = CountryISO;
    public formGroup: FormGroup;
    public subscription?: Subscription;
    @Input() public profile?: factory.person.IProfile;
    @Input() public language: string;
    @Output() public valueChanges = new EventEmitter<FormGroup>();
    @ViewChild('intlTelInput') private intlTelInput: NgxIntlTelInputComponent;

    constructor(
        private translate: TranslateService,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit() {
        this.formGroup = this.createForm();
        this.valueChanges.emit(this.formGroup);
        this.subscription = this.formGroup.valueChanges.subscribe(() => {
            this.valueChanges.emit(this.formGroup);
        });
        setTimeout(() => {
            if (this.intlTelInput === undefined) {
                return;
            }
            const findResult = this.intlTelInput.allCountries.find(
                (c) => c.iso2 === CountryISO.Japan
            );
            if (findResult === undefined) {
                return;
            }
            findResult.placeHolder = this.translate.instant(
                'form.placeholder.telephone'
            );
        }, 0);
    }

    public ngOnDestroy() {
        if (this.subscription === undefined) {
            return;
        }
        this.subscription.unsubscribe();
    }

    /**
     * フォーム作成
     */
    private createForm() {
        const profile = this.environment.PROFILE;
        const formGroup = this.formBuilder.group({});
        profile.forEach((p) => {
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
                        if (
                            language === 'ja' &&
                            !new RegExp(/^[ァ-ヶー]+$/).test(field.value)
                        ) {
                            return { customPattern: true };
                        }
                        if (
                            language !== 'ja' &&
                            !new RegExp(/^[a-z]+$/).test(field.value)
                        ) {
                            return { customPattern: true };
                        }
                    }

                    return null;
                });
            }
            if (p.key === 'email') {
                validators.push(Validators.email);
            }
            formGroup.addControl(p.key, new FormControl(p.value, validators));
        });
        if (this.profile === undefined) {
            return formGroup;
        }
        // プロフィール設定
        Object.keys(this.profile).forEach((key) => {
            const value = (<any>this.profile)[key];
            if (value === undefined || formGroup.controls[key] === undefined) {
                return;
            }
            if (key === 'telephone') {
                formGroup.controls.telephone.setValue(
                    new LibphonenumberFormatPipe().transform(value)
                );
                return;
            }
            formGroup.controls[key].setValue(value);
        });
        const additionalProperty = this.profile.additionalProperty;
        if (additionalProperty !== undefined) {
            additionalProperty.forEach((a) => {
                const key = `additionalProperty.${a.name}`;
                const value = a.value;
                if (
                    value === undefined ||
                    formGroup.controls[key] === undefined
                ) {
                    return;
                }
                formGroup.controls[key].setValue(value);
            });
        }
        return formGroup;
    }

    /**
     * 必須判定
     */
    public isRequired(key: String) {
        return (
            this.environment.PROFILE.find(
                (p) => p.key === key && p.required
            ) !== undefined
        );
    }

    /**
     * 購入者情報フォームのコントロールkeyを配列で返却
     */
    public getProfileFormKeys() {
        return Object.keys(this.formGroup.controls);
    }

    /**
     * プロフィール項目取得
     */
    public getProfileProperty(key: string) {
        return this.environment.PROFILE.find((p) => p.key === key);
    }

    /**
     * 追加特性項目取得
     */
    public getAdditionalProperty(key: string) {
        return this.environment.PROFILE.find(
            (p) => /additionalProperty/.test(p.key) && p.key === key
        );
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
