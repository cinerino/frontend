import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Models } from '../../../..';
import { getEnvironment } from '../../../../../environments/environment';
import { ActionService, MasterService, UtilService } from '../../../../services';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    public isLoading: Observable<boolean>;
    public baseForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public amount: number;
    public viewType = Models.Common.ViewType;
    public posList: { id: string; name: string; typeOf: string; }[];
    public printers = Models.Common.Printer.printers;
    public connectionType = Models.Common.Printer.ConnectionType;
    public theaters: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[];
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private masterService: MasterService,
        private actionService: ActionService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private router: Router
    ) { }

    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.error = this.store.pipe(select(reducers.getError));
        this.theaters = [];
        try {
            this.theaters = await this.masterService.searchMovieTheaters();
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
        const user = await this.actionService.user.getData();
        if (user.theater !== undefined) {
            this.baseForm.controls.theaterBranchCode.setValue(user.theater.branchCode);
            this.changePosList();
        }
        if (user.pos !== undefined) {
            this.baseForm.controls.posId.setValue(user.pos.id);
        }
        if (user.printer !== undefined) {
            this.baseForm.controls.printerType.setValue(user.printer.connectionType);
            this.baseForm.controls.printerIpAddress.setValue(user.printer.ipAddress);
        }
    }

    /**
     * POS変更
     */
    public changePosList() {
        this.baseForm.controls.posId.setValue('');
        const theaterBranchCode = this.baseForm.controls.theaterBranchCode.value;
        if (theaterBranchCode === '') {
            this.posList = [];
            return;
        }
        const findResult = this.theaters.find(t => (t.branchCode === theaterBranchCode));
        if (findResult === undefined) {
            this.posList = [];
            return;
        }
        this.posList = (findResult.hasPOS === undefined) ? [] : findResult.hasPOS;
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
            const theaterBranchCode = this.baseForm.controls.theaterBranchCode.value;
            const posId = this.baseForm.controls.posId.value;
            const theater = this.theaters.find(t => (t.branchCode === theaterBranchCode));
            if (theater === undefined || theater.hasPOS === undefined) {
                throw new Error('theater not found').message;
            }
            const pos = theater.hasPOS.find(p => p.id === posId);
            if (pos === undefined) {
                throw new Error('pos not found').message;
            }
            this.actionService.user.updateBaseSetting({
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
            await this.actionService.order.print({ orders: [], printer });
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
        if (this.baseForm.controls.printerType.value === Models.Common.Printer.ConnectionType.StarBluetooth) {
            this.baseForm.controls.printerIpAddress.setValue(this.translate.instant('setting.starBluetoothAddress'));
        }
    }

}
