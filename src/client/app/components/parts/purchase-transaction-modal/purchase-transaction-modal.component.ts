import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-purchase-transaction-modal',
    templateUrl: './purchase-transaction-modal.component.html',
    styleUrls: ['./purchase-transaction-modal.component.scss']
})
export class PurchaseTransactionModalComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
    }

}
