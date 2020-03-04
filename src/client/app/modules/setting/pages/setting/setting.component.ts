import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../environments/environment';
import { connectionType, printers, ViewType } from '../../../../models';
import { MasterService, OrderService, UserService, UtilService } from '../../../../services';
import * as reducers from '../../../../store/reducers';

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
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private masterService: MasterService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private orderService: OrderService,
        private router: Router
    ) { }

    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
        try {
            await this.masterService.getSellers();
            await this.masterService.getTheaters();
            const userData = await this.userService.getData();
            const masterData = await this.masterService.getData();
            if (userData.seller !== undefined
                && userData.pos !== undefined
                && userData.printer !== undefined
                && userData.theater === undefined) {
                // 互換性担保
                const seller = userData.seller;
                const findResult = masterData.theaters.find(t => {
                    return (seller.location !== undefined
                        && t.branchCode === seller.location.branchCode);
                });
                const theater = (findResult === undefined) ? masterData.theaters[0] : findResult;
                this.userService.updateBaseSetting({
                    seller: userData.seller,
                    pos: userData.pos,
                    theater: theater,
                    printer: userData.printer
                });
            }
            await this.createBaseForm();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    private async createBaseForm() {
        this.baseForm = this.formBuilder.group({
            theaterBranchCode: ['', [Validators.required]],
            posId: ['', [Validators.required]],
            printerType: ['', [Validators.required]],
            printerIpAddress: [''],
        });
        const user = await this.userService.getData();
        if (user.theater !== undefined) {
            this.baseForm.controls.theaterBranchCode.setValue(user.theater.branchCode);
        }
        if (user.pos !== undefined) {
            this.changePosList();
            this.baseForm.controls.posId.setValue(user.pos.id);
        }
        if (user.printer !== undefined) {
            this.baseForm.controls.printerType.setValue(user.printer.connectionType);
            this.baseForm.controls.printerIpAddress.setValue(user.printer.ipAddress);
        }
    }

    /**
     * 端末情報変更
     */
    public changePosList() {
        this.baseForm.controls.posId.setValue('');
        const theaterBranchCode = this.baseForm.controls.theaterBranchCode.value;
        if (theaterBranchCode === '') {
            this.posList = [];
            return;
        }
        this.master.subscribe((master) => {
            const findResult =
                master.sellers.find(s => s.location !== undefined && s.location.branchCode === theaterBranchCode);
            if (findResult === undefined) {
                this.posList = [];
                return;
            }
            this.posList = (findResult.hasPOS === undefined) ? [] : findResult.hasPOS;
        }).unsubscribe();
    }

    /**
     * 更新
     */
    public async updateBase() {
        Object.keys(this.baseForm.controls).forEach((key) => {
            this.baseForm.controls[key].markAsTouched();
        });
        if (this.baseForm.invalid) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('setting.alert.validation')
            });
            return;
        }
        try {
            const masterData = await this.masterService.getData();
            const theaterBranchCode = this.baseForm.controls.theaterBranchCode.value;
            const posId = this.baseForm.controls.posId.value;
            const seller = masterData.sellers.find(s => (s.location !== undefined && s.location.branchCode === theaterBranchCode));
            if (seller === undefined || seller.hasPOS === undefined) {
                throw new Error('seller not found').message;
            }
            const pos = seller.hasPOS.find(p => p.id === posId);
            if (pos === undefined) {
                throw new Error('pos not found').message;
            }
            const theater = masterData.theaters.find(t => (t.branchCode === theaterBranchCode));
            if (theater === undefined) {
                throw new Error('theater not found').message;
            }
            this.userService.updateBaseSetting({
                seller,
                pos,
                theater,
                printer: {
                    ipAddress: this.baseForm.controls.printerIpAddress.value,
                    connectionType: this.baseForm.controls.printerType.value
                }
            });
            this.utilService.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('setting.alert.success')
            });
        } catch (error) {
            console.error(error);
        }
    }

    public async print() {
        try {
            const printer = {
                connectionType: this.baseForm.controls.printerType.value,
                ipAddress: this.baseForm.controls.printerIpAddress.value
            };
            await this.orderService.print({ orders: [], printer });
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: `
                <p class="mb-4">${this.translate.instant('setting.alert.print')}</p>
                <div class="p-3 bg-light-gray select-text error">
                    <code>${error}</code>
                </div>`
            });
        }
    }

    /**
     * プリンター変更
     */
    public changePrinterType() {
        if (this.baseForm.controls.printerType.value === connectionType.StarBluetooth) {
            this.baseForm.controls.printerIpAddress.setValue(this.translate.instant('setting.starBluetoothAddress'));
        }
    }

}
