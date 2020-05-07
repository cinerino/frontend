import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { movieTicketAuthErroCodeToMessage } from '../../../../../../functions';
import { PurchaseService, QRCodeService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';
import { ChangeLanguagePipe } from '../../../../../shared/pipes/change-language.pipe';

@Component({
    selector: 'app-mvtk-check-modal',
    templateUrl: './check-modal.component.html',
    styleUrls: ['./check-modal.component.scss']
})
export class MvtkCheckModalComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public mvtkForm: FormGroup;
    public errorMessage: string;
    public isSuccess: boolean;

    public stream: MediaStream | null;
    public isShowVideo: boolean;
    public video: HTMLVideoElement;
    public scanLoop: any;
    constructor(
        public modal: BsModalRef,
        private store: Store<reducers.IState>,
        private formBuilder: FormBuilder,
        private purchaseService: PurchaseService,
        private translate: TranslateService,
        private qrcodeService: QRCodeService
    ) { }

    public ngOnInit() {
        this.errorMessage = '';
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.createMvtkForm();
    }

    public createMvtkForm() {
        const CODE_LENGTH = 10;
        // const PASSWORD_LENGTH = 4;
        this.mvtkForm = this.formBuilder.group({
            code: ['', [
                Validators.required,
                Validators.maxLength(CODE_LENGTH),
                Validators.minLength(CODE_LENGTH),
                Validators.pattern(/^[0-9]+$/)
            ]],
            password: ['', [
                Validators.required
            ]]
        });
    }

    /**
     * checkMovieTicket
     */
    public async checkMovieTicket() {
        Object.keys(this.mvtkForm.controls).forEach((key) => {
            this.mvtkForm.controls[key].markAsTouched();
        });
        this.mvtkForm.controls.code.setValue((<HTMLInputElement>document.getElementById('code')).value);
        this.mvtkForm.controls.password.setValue((<HTMLInputElement>document.getElementById('password')).value);

        if (this.mvtkForm.invalid) {
            return;
        }
        this.errorMessage = '';
        try {
            await this.purchaseService.checkMovieTicket({
                code: this.mvtkForm.controls.code.value,
                password: this.mvtkForm.controls.password.value
            });
            const purchase = await this.purchaseService.getData();
            const checkMovieTicketAction = purchase.checkMovieTicketAction;
            if (checkMovieTicketAction === undefined
                || checkMovieTicketAction.result === undefined
                || checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut === null) {
                this.isSuccess = false;
                this.errorMessage = this.translate.instant('modal.mvtk.check.alert.validation');
                return;
            }

            if (checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut[0].ykknmiNum === '0') {
                this.isSuccess = false;
                this.errorMessage = this.translate.instant('modal.mvtk.check.alert.used');
                return;
            }

            const knyknrNoMkujyuCd = checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut[0].knyknrNoMkujyuCd;
            if (knyknrNoMkujyuCd !== undefined) {
                const message = new ChangeLanguagePipe(this.translate)
                    .transform(movieTicketAuthErroCodeToMessage(knyknrNoMkujyuCd));
                this.isSuccess = false;
                this.errorMessage = `${this.translate.instant('modal.mvtk.check.alert.validation')}<br>
                [${knyknrNoMkujyuCd}] ${message}`;
                return;
            }

            this.createMvtkForm();
            this.isSuccess = true;
        } catch (error) {
            console.error(error);
            this.isSuccess = false;
            this.errorMessage = this.translate.instant('modal.mvtk.check.alert.error');
        }
    }

    public openQRReader() {
        this.qrcodeService.openQRCodeReader({
            cb: (data: string) => {
                const code = data.slice(0, 10);
                const password = data.slice(10, data.length);
                this.mvtkForm.controls.code.setValue(code);
                this.mvtkForm.controls.password.setValue(password);
            }
        });
    }

}
