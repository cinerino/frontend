import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { environment } from '../../../../../../../environments/environment';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-purchase-transaction-modal',
    templateUrl: './transaction-modal.component.html',
    styleUrls: ['./transaction-modal.component.scss']
})
export class PurchaseTransactionModalComponent implements OnInit {
    @Input() public purchase: reducers.IPurchaseState;
    @Input() public user: reducers.IUserState;
    @Input() public cb: () => void;
    public environment = environment;

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
