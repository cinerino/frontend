import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-select-modal',
    templateUrl: './select-modal.component.html',
    styleUrls: ['./select-modal.component.scss']
})
export class CreditCardSelectModalComponent implements OnInit {
    @Input() public creditCards: factory.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    @Input() public cb: (creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) => void;

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() { }

    public close(creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.modal.hide();
        this.cb(creditCard);
    }

}
