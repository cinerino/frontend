import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-purchase-transaction-modal',
    templateUrl: './purchase-transaction-modal.component.html',
    styleUrls: ['./purchase-transaction-modal.component.scss']
})
export class PurchaseTransactionModalComponent implements OnInit {
    @Input() public purchase: reducers.IPurchaseState;
    @Input() public user: reducers.IUserState;

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
    }

}
