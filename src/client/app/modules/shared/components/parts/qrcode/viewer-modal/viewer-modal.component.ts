import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as qrcode from 'qrcode';

@Component({
    selector: 'app-qrcode-viewer-modal',
    templateUrl: './viewer-modal.component.html',
    styleUrls: ['./viewer-modal.component.scss']
})
export class QRCodeViewerModalComponent implements OnInit {
    @Input() public title?: string;
    @Input() public body?: string;
    @Input() public code: string;
    public url: Promise<string>;

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        const option: qrcode.QRCodeToDataURLOptions = {
            margin: 0,
            scale: 5,
        };
        this.url = qrcode.toDataURL(this.code, option);
    }

}
