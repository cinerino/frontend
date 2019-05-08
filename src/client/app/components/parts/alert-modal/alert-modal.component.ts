import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html',
    styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {
    @Input() public title: string;
    @Input() public body: string;

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
    }

}
