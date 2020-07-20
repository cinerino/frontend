import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-creditcard-select-modal',
    templateUrl: './select-modal.component.html',
    styleUrls: ['./select-modal.component.scss']
})
export class CreditCardSelectModalComponent implements OnInit {
    @Input() public creditCards: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    @Input() public cb: (creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard) => void;

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() { }

    public close(creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.modal.hide();
        this.cb(creditCard);
    }

}
