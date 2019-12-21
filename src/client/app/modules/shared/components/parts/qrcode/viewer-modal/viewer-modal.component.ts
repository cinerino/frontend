import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-qrcode-viewer-modal',
    templateUrl: './viewer-modal.component.html',
    styleUrls: ['./viewer-modal.component.scss']
})
export class QRCodeViewerModalComponent implements OnInit {
    @Input() public title: string;

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
    }

}
