import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { connectionType, printers, ViewType } from '../../../models';
import { UtilService } from '../../../services';
import { masterAction, orderAction, userAction } from '../../../store/actions';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    public isLoading: Observable<boolean>;
    public baseForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public amount: number;
    public viewType: typeof ViewType = ViewType;
    public posList: { id: string; name: string; typeOf: string; }[];
    public printers: typeof printers = printers;
    public connectionType: typeof connectionType = connectionType;
    public environment = environment;

    constructor(
        private actions: Actions,
        private store: Store<reducers.IState>,
        private util: UtilService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private router: Router
    ) { }

    public ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
        this.createBaseForm();
    }

    private createBaseForm() {
        this.baseForm = this.formBuilder.group({
            sellerBranchCode: [''],
            posId: [''],
            printerType: [''],
            printerIpAddress: [''],
            purchaseCartMaxLength: ['', [
                Validators.required,
                Validators.pattern(/^[0-9]+$/)
            ]],
            viewType: ['', [
                Validators.required
            ]]
        });
        this.user.subscribe((user) => {
            if (user.seller !== undefined
                && user.seller.location !== undefined) {
                this.baseForm.controls.sellerBranchCode.setValue(user.seller.location.branchCode);
            }
            if (user.pos !== undefined) {
                this.changePosList();
                this.baseForm.controls.posId.setValue(user.pos.id);
            }
            if (user.printer !== undefined) {
                this.baseForm.controls.printerType.setValue(user.printer.connectionType);
                this.baseForm.controls.printerIpAddress.setValue(user.printer.ipAddress);
            }
            this.baseForm.controls.purchaseCartMaxLength.setValue(user.purchaseCartMaxLength);
            this.baseForm.controls.viewType.setValue(user.viewType);
        }).unsubscribe();
    }

    /**
     * 端末情報変更
     */
    public changePosList() {
        this.baseForm.controls.posId.setValue('');
        const sellerBranchCode = this.baseForm.controls.sellerBranchCode.value;
        if (sellerBranchCode === '') {
            this.posList = [];
            return;
        }
        this.master.subscribe((master) => {
            const findTheater =
                master.sellers.find(theater =>
                    (theater.location !== undefined && theater.location.branchCode === sellerBranchCode)
                );
            if (findTheater === undefined) {
                this.posList = [];
                return;
            }
            this.posList = (findTheater.hasPOS === undefined) ? [] : findTheater.hasPOS;
        }).unsubscribe();
    }

    /**
     * 更新
     */
    public updateBase() {
        Object.keys(this.baseForm.controls).forEach((key) => {
            this.baseForm.controls[key].markAsTouched();
        });
        this.baseForm.controls.purchaseCartMaxLength.setValue((<HTMLInputElement>document.getElementById('purchaseCartMaxLength')).value);
        this.baseForm.controls.viewType.setValue((<HTMLInputElement>document.getElementById('viewType')).value);
        if (this.baseForm.invalid) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('setting.alert.validation')
            });
            return;
        }
        this.master.subscribe((master) => {
            const findSeller = master.sellers.find((s) =>
                (s.location !== undefined && s.location.branchCode === this.baseForm.controls.sellerBranchCode.value));
            let findPos;
            if (findSeller !== undefined && findSeller.hasPOS !== undefined) {
                findPos = findSeller.hasPOS.find((pos: any) => {
                    return pos.id === this.baseForm.controls.posId.value;
                });
                if (findPos === undefined) {
                    return;
                }
            }
            const purchaseCartMaxLength = Number(this.baseForm.controls.purchaseCartMaxLength.value);
            const viewType = this.baseForm.controls.viewType.value;

            this.store.dispatch(new userAction.UpdateBaseSetting({
                seller: findSeller,
                pos: findPos,
                printer: (this.baseForm.controls.printerIpAddress.value === ''
                    || this.baseForm.controls.printerType.value === '')
                    ? undefined
                    : {
                        ipAddress: this.baseForm.controls.printerIpAddress.value,
                        connectionType: this.baseForm.controls.printerType.value
                    },
                purchaseCartMaxLength,
                viewType
            }));
            this.util.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('setting.alert.success')
            });

        }).unsubscribe();
    }

    /**
     * 販売者情報取得
     */
    public getTheaters() {
        this.store.dispatch(new masterAction.GetSellers({ params: {} }));

        const success = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetSellersSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetSellersFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    public print() {
        const printer = {
            connectionType: this.baseForm.controls.printerType.value,
            ipAddress: this.baseForm.controls.printerIpAddress.value
        };
        this.store.dispatch(new orderAction.Print({ orders: [], printer }));

        const success = this.actions.pipe(
            ofType(orderAction.ActionTypes.PrintSuccess),
            tap(() => {})
        );

        const fail = this.actions.pipe(
            ofType(orderAction.ActionTypes.PrintFail),
            tap(() => {
                this.error.subscribe((error) => {
                    this.util.openAlert({
                        title: this.translate.instant('common.error'),
                        body: `
                        <p class="mb-4">${this.translate.instant('setting.alert.print')}</p>
                            <div class="p-3 bg-light-gray select-text">
                            <code>${error}</code>
                        </div>`
                    });
                }).unsubscribe();
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
