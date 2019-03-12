import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-registered-credit-card-modal',
    templateUrl: './registered-credit-card-modal.component.html',
    styleUrls: ['./registered-credit-card-modal.component.scss']
})
export class RegisteredCreditCardModalComponent implements OnInit {
    @Input() public creditCards: factory.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    constructor(
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
    }

}
