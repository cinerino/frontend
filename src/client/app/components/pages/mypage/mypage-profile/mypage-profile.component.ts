import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as libphonenumber from 'libphonenumber-js';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UtilService } from '../../../../services';
import * as userAction from '../../../../store/actions/user.action';
import * as reducers from '../../../../store/reducers';

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
        private actions: Actions,
        private util: UtilService,
        private formBuilder: FormBuilder,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.createProfileForm();
    }

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
                        const parsedNumber = libphonenumber.parse(field.value, 'JP');
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
            this.profileForm.controls.telephone.setValue(user.profile.telephone);
        }).unsubscribe();
    }

    public updateProfile() {
        Object.keys(this.profileForm.controls).forEach((key) => {
            this.profileForm.controls[key].markAsTouched();
        });
        this.profileForm.controls.familyName.setValue((<HTMLInputElement>document.getElementById('familyName')).value);
        this.profileForm.controls.givenName.setValue((<HTMLInputElement>document.getElementById('givenName')).value);
        this.profileForm.controls.email.setValue((<HTMLInputElement>document.getElementById('email')).value);
        this.profileForm.controls.telephone.setValue((<HTMLInputElement>document.getElementById('telephone')).value);
        if (this.profileForm.invalid) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('setting.alert.customer')
            });
            return;
        }

        const profile = {
            givenName: this.profileForm.controls.givenName.value,
            familyName: this.profileForm.controls.familyName.value,
            telephone: this.profileForm.controls.telephone.value,
            email: this.profileForm.controls.email.value,
        };
        this.store.dispatch(new userAction.UpdateProfile({ profile }));

        const success = this.actions.pipe(
            ofType(userAction.ActionTypes.UpdateProfileSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(userAction.ActionTypes.UpdateProfileFail),
            tap(() => { })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
