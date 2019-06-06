import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-transaction-modal',
    templateUrl: './purchase-transaction-modal.component.html',
    styleUrls: ['./purchase-transaction-modal.component.scss']
})
export class PurchaseTransactionModalComponent implements OnInit {
    @Input() public purchase: reducers.IPurchaseState;
    @Input() public user: reducers.IUserState;
    @Input() public cb: () => void;

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
    }

    public close() {
        this.modal.hide();
        this.cb();
    }

}
