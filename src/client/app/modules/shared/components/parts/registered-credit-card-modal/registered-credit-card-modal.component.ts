import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-registered-credit-card-modal',
    templateUrl: './registered-credit-card-modal.component.html',
    styleUrls: ['./registered-credit-card-modal.component.scss']
})
export class RegisteredCreditCardModalComponent implements OnInit {
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
