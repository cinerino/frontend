import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/api-javascript-client';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-charge-account-modal',
    templateUrl: './charge-account-modal.component.html',
    styleUrls: ['./charge-account-modal.component.scss']
})
export class ChargeAccountModalComponent implements OnInit {
    @Input() public creditCards: factory.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    @Input() public cb: (value: {
        amount: number;
        cregitCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard
    }) => void;
    public chargeAccountForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        this.createChargeForm();
    }

    public close() {
        this.modal.hide();
        this.cb({
            amount: this.chargeAccountForm.controls.amount.value,
            cregitCard: this.chargeAccountForm.controls.cregitCard.value
        });
    }

    public selectCreditCard(cregitCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.chargeAccountForm.controls.cregitCard.setValue(cregitCard);
    }

    private createChargeForm() {
        this.chargeAccountForm = this.formBuilder.group({
            amount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            cregitCard: [this.creditCards[0], [Validators.required]]
        });
    }

}
