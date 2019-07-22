import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import jsqr from 'jsqr';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { movieTicketAuthErroCodeToMessage } from '../../../functions';
import { ChangeLanguagePipe } from '../../../pipes/change-language.pipe';
import { PurchaseService } from '../../../services';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-mvtk-check-modal',
    templateUrl: './mvtk-check-modal.component.html',
    styleUrls: ['./mvtk-check-modal.component.scss']
})
export class MvtkCheckModalComponent implements OnInit, OnDestroy {
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
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.stream = null;
        this.video = <HTMLVideoElement>document.getElementById('video');
        this.video.width = 300;
        this.errorMessage = '';
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.createMvtkForm();
    }

    public ngOnDestroy() {
        this.stopCamera();
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
                this.errorMessage = this.translate.instant('modal.mvtkCheck.alert.validation');
                return;
            }

            if (checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut[0].ykknmiNum === '0') {
                this.isSuccess = false;
                this.errorMessage = this.translate.instant('modal.mvtkCheck.alert.used');
                return;
            }

            const knyknrNoMkujyuCd = checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut[0].knyknrNoMkujyuCd;
            if (knyknrNoMkujyuCd !== undefined) {
                const message = new ChangeLanguagePipe(this.translate)
                    .transform(movieTicketAuthErroCodeToMessage(knyknrNoMkujyuCd));
                this.isSuccess = false;
                this.errorMessage = `${this.translate.instant('modal.mvtkCheck.alert.validation')}<br>
                [${knyknrNoMkujyuCd}] ${message}`;
                return;
            }

            this.createMvtkForm();
            this.isSuccess = true;
        } catch (error) {
            console.error(error);
            this.isSuccess = false;
            this.errorMessage = this.translate.instant('modal.mvtkCheck.alert.error');
        }
    }

    public async activationCamera() {
        try {
            const constraints = {
                audio: false,
                video: { facingMode: { exact: 'environment' } }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.stream = stream;
            this.video.srcObject = this.stream;
            const scanLoopTime = 500;
            this.scanLoop = setInterval(() => {
                const result = this.scan();
                if (result !== null) {
                    // 読み取り完了
                    const code = result.slice(0, 10);
                    const password = result.slice(10, result.length);
                    this.mvtkForm.controls.code.setValue(code);
                    this.mvtkForm.controls.password.setValue(password);
                    this.stopCamera();
                }
            }, scanLoopTime);
            this.isShowVideo = true;
        } catch (error) {
            console.error(error);
        }
    }

    public stopCamera() {
        if (this.stream === null) {
            return;
        }
        this.stream.getVideoTracks().forEach((track) => {
            track.stop();
        });
        this.stream = null;
        this.isShowVideo = false;
    }

    public scan() {
        if (this.stream === null) {
            return null;
        }
        // キャンバスへ反映
        const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        const context = <CanvasRenderingContext2D>canvas.getContext('2d');
        const width = this.video.offsetWidth;
        const height = this.video.offsetHeight;
        canvas.setAttribute('width', String(width));
        canvas.setAttribute('height', String(height));
        context.drawImage(this.video, 0, 0, width, height);
        // QRコードデコード
        const imageData = context.getImageData(0, 0, width, height);
        const qrcode = jsqr(imageData.data, width, height);
        if (qrcode === null) {
            return null;
        }
        return qrcode.data;
    }

}
