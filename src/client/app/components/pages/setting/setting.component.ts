import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ViewType } from '../../../models';
import { UtilService } from '../../../services';
import { userAction } from '../../../store/actions';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public customerContactForm: FormGroup;
    public paymentForm: FormGroup;
    public baseForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public amount: number;
    public viewType: typeof ViewType = ViewType;
    public environment = environment;

    constructor(
        private store: Store<reducers.IState>,
        private util: UtilService,
        private formBuilder: FormBuilder,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.createBaseForm();
    }

    private createBaseForm() {
        this.baseForm = this.formBuilder.group({
            limitedPurchaseCount: ['', [
                Validators.required,
                Validators.pattern(/^[0-9]+$/)
            ]],
            viewType: ['', [
                Validators.required
            ]]
        });
        this.user.subscribe((user) => {
            this.baseForm.controls.limitedPurchaseCount.setValue(user.limitedPurchaseCount);
            this.baseForm.controls.viewType.setValue(user.viewType);
        }).unsubscribe();
    }

    public updateBase() {
        Object.keys(this.baseForm.controls).forEach((key) => {
            this.baseForm.controls[key].markAsTouched();
        });
        this.baseForm.controls.limitedPurchaseCount.setValue((<HTMLInputElement>document.getElementById('limitedPurchaseCount')).value);
        this.baseForm.controls.viewType.setValue((<HTMLInputElement>document.getElementById('viewType')).value);
        if (this.baseForm.invalid) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('setting.alert.base')
            });
            return;
        }

        const limitedPurchaseCount = Number(this.baseForm.controls.limitedPurchaseCount.value);
        const viewType = this.baseForm.controls.viewType.value;

        this.store.dispatch(new userAction.UpdateBaseSetting({ limitedPurchaseCount, viewType }));
        this.util.openAlert({
            title: this.translate.instant('setting.success.title'),
            body: this.translate.instant('setting.success.read')
        });
    }

}
