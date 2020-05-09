import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

    @Input() public title: string;
    @Input() public body: string;
    @Input() public cb: Function;

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {}

    public close() {
        this.modal.hide();
        this.cb();
    }

}
