import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-select-creditcard-modal',
    templateUrl: './select-creditcard-modal.component.html',
    styleUrls: ['./select-creditcard-modal.component.scss']
})
export class SelectCreditCardModalComponent implements OnInit {
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
