import { Component, Input, OnInit } from '@angular/core';
import * as qrcode from 'qrcode';

@Component({
    selector: 'app-qrcode-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss']
})
export class QRCodeImageComponent implements OnInit {
    @Input() public code: string;
    public url: Promise<string>;

    constructor() { }

    public ngOnInit() {
        this.url = qrcode.toDataURL(this.code, {
            margin: 0,
            scale: 5,
        });
    }

}
