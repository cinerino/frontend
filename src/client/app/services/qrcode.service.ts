import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { QRCodeReaderModalComponent } from '../modules/shared/components/parts/qrcode/reader-modal/reader-modal.component';
import { QRCodeViewerModalComponent } from '../modules/shared/components/parts/qrcode/viewer-modal/viewer-modal.component';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root'
})
export class QRCodeService {

    constructor(
        private utilService: UtilService,
        private translate: TranslateService,
        private modal: BsModalService
    ) { }

    /**
     * QRコードリーダー表示
     */
    public openQRCodeReader(params: {
        cb: Function;
    }) {
        this.modal.show(QRCodeReaderModalComponent, {
            initialState: {
                cb: params.cb,
                error: () => {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('qrcode.reader.notSupport')
                    });
                }
            },
            class: 'modal-dialog-centered',
            animated: false
        });
    }

    /**
     * QRコードビューアー表示
     */
    public openQRCodeViewer(params: {
        title?: string;
        body?: string;
        code: string;
    }) {
        const { title, body, code } = params;
        this.modal.show(QRCodeViewerModalComponent, {
            initialState: { title, body, code },
            class: 'modal-dialog-centered'
        });
    }

}
