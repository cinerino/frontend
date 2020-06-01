import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as libphonenumber from 'libphonenumber-js';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { UserService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-mypage-profile',
    templateUrl: './mypage-profile.component.html',
    styleUrls: ['./mypage-profile.component.scss']
})
export class MypageProfileComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public profileForm: FormGroup;

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private userService: UserService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.createProfileForm();
    }

    /**
     * プロフィールフォーム作成
     */
    private createProfileForm() {
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
                Validators.pattern(/^[0-9]+$/),
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
        this.user.subscribe((user) => {
            if (user.profile === undefined) {
                return;
            }
            this.profileForm.controls.familyName.setValue(user.profile.familyName);
            this.profileForm.controls.givenName.setValue(user.profile.givenName);
            this.profileForm.controls.email.setValue(user.profile.email);
            if (user.profile.telephone !== undefined) {
                this.profileForm.controls.telephone.setValue(Functions.Util.formatTelephone(user.profile.telephone, 'National').replace(/\-/g, ''));
            }
        }).unsubscribe();
    }

    /**
     * プロフィール更新
     */
    public async updateProfile() {
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
                body: this.translate.instant('setting.alert.customer')
            });
            return;
        }
        try {
            const profile = {
                givenName: this.profileForm.controls.givenName.value,
                familyName: this.profileForm.controls.familyName.value,
                telephone: this.profileForm.controls.telephone.value,
                email: this.profileForm.controls.email.value,
            };
            await this.userService.updateProfile(profile);
        } catch (error) {
            console.error(error);
        }
    }

}
