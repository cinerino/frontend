import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { QRCodeReaderModalComponent } from '../modules/shared/components/parts/qrcode/reader-modal/reader-modal.component';
import { QRCodeViewerModalComponent } from '../modules/shared/components/parts/qrcode/viewer-modal/viewer-modal.component';

@Injectable({
    providedIn: 'root'
})
export class QRCodeService {

    constructor(
        private modal: BsModalService
    ) { }

    /**
     * QRコードリーダー表示
     */
    public openQRCodeReader(args: {
        cb: Function;
    }) {
        this.modal.show(QRCodeReaderModalComponent, {
            initialState: { cb: args.cb },
            class: 'modal-dialog-centered',
            animated: false
        });
    }

    /**
     * QRコードビューアー表示
     */
    public openQRCodeViewer(args: {
        title?: string;
        body?: string;
        code: string;
    }) {
        const title = args.title;
        const body = args.body;
        const code = args.code;
        this.modal.show(QRCodeViewerModalComponent, {
            initialState: { title, body, code },
            class: 'modal-dialog-centered'
        });
    }

}
