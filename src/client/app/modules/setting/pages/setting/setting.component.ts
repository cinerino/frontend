import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
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
    public environment = environment;

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
            await this.createBaseForm();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    private async createBaseForm() {
        this.baseForm = this.formBuilder.group({
            sellerBranchCode: ['', [Validators.required]],
            posId: ['', [Validators.required]],
            printerType: ['', [Validators.required]],
            printerIpAddress: [''],
            isPurchaseCart: ['0', [
                Validators.required,
                Validators.pattern(/^[0-9]+$/)
            ]],
            viewType: ['', [
                Validators.required
            ]]
        });
        const user = await this.userService.getData();
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
        this.baseForm.controls.isPurchaseCart.setValue((user.isPurchaseCart) ? '1' : '0');
        this.baseForm.controls.viewType.setValue(user.viewType);
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
        const master = await this.masterService.getData();
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
        const isPurchaseCart = (this.baseForm.controls.isPurchaseCart.value === '1') ? true : false;
        const viewType = this.baseForm.controls.viewType.value;
        this.userService.updateBaseSetting({
            seller: findSeller,
            pos: findPos,
            printer: {
                ipAddress: this.baseForm.controls.printerIpAddress.value,
                connectionType: this.baseForm.controls.printerType.value
            },
            isPurchaseCart,
            viewType
        });
        this.utilService.openAlert({
            title: this.translate.instant('common.complete'),
            body: this.translate.instant('setting.alert.success')
        });
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
