import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, NgxIntlTelInputComponent, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { Observable } from 'rxjs';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';
import { LibphonenumberFormatPipe } from '../../../../shared/pipes/libphonenumber-format.pipe';

@Component({
    selector: 'app-mypage-profile',
    templateUrl: './mypage-profile.component.html',
    styleUrls: ['./mypage-profile.component.scss']
})
export class MypageProfileComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public profileForm: FormGroup;
    public SearchCountryField = SearchCountryField;
    public TooltipLabel = TooltipLabel;
    public CountryISO = CountryISO;
    @ViewChild('intlTelInput') private intlTelInput: NgxIntlTelInputComponent;

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private actionService: ActionService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        await this.actionService.user.getProfile();
        await this.createProfileForm();
        setTimeout(() => {
            if (this.intlTelInput === undefined) {
                return;
            }
            const findResult = this.intlTelInput.allCountries.find(c => c.iso2 === CountryISO.Japan);
            if (findResult === undefined) {
                return;
            }
            findResult.placeHolder = this.translate.instant('form.placeholder.telephone');
        }, 0);
    }

    /**
     * プロフィールフォーム作成
     */
    private async createProfileForm() {
        const NAME_MAX_LENGTH = 12;
        const MAIL_MAX_LENGTH = 50;
        const TEL_MAX_LENGTH = 11;
        const TEL_MIN_LENGTH = 9;
        this.profileForm = this.formBuilder.group({
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
            ]]
        });
        const user = await this.actionService.user.getData();
        if (user.profile === undefined) {
            return;
        }
        Object.keys(user.profile).forEach(key => {
            const value = (<any>user.profile)[key];
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
     * プロフィール更新
     */
    public async updateProfile() {
        Object.keys(this.profileForm.controls).forEach((key) => {
            this.profileForm.controls[key].markAsTouched();
            if (key === 'telephone') {
                return;
            }
            this.profileForm.controls[key].setValue((<HTMLInputElement>document.getElementById(key)).value);
        });
        if (this.profileForm.invalid) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('mypage.profile.alert.customer')
            });
            return;
        }
        try {
            const profile = {
                givenName: this.profileForm.controls.givenName.value,
                familyName: this.profileForm.controls.familyName.value,
                telephone: this.profileForm.controls.telephone.value.e164Number,
                email: this.profileForm.controls.email.value,
            };
            await this.actionService.user.updateProfile(profile);
            this.utilService.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('mypage.profile.alert.complete')
            });
        } catch (error) {
            console.error(error);
        }
    }

}
