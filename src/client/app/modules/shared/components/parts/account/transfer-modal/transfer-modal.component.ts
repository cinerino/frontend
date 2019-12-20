import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/api-javascript-client';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-account-transfer-modal',
    templateUrl: './transfer-modal.component.html',
    styleUrls: ['./transfer-modal.component.scss']
})
export class AccountTransferModalComponent implements OnInit {
    @Input() public sellers: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>[];
    @Input() public creditCards: factory.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    @Input() public cb: (value: {
        seller?: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
        amount: number;
        creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard
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
        const seller = this.sellers.find(s => s.id === this.chargeAccountForm.controls.sellerId.value);
        this.cb({
            seller,
            amount: this.chargeAccountForm.controls.amount.value,
            creditCard: this.chargeAccountForm.controls.cregitCard.value
        });
    }

    public selectCreditCard(cregitCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.chargeAccountForm.controls.cregitCard.setValue(cregitCard);
    }

    private createChargeForm() {
        this.chargeAccountForm = this.formBuilder.group({
            sellerId: ['', [Validators.required]],
            amount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            cregitCard: [this.creditCards[0], [Validators.required]]
        });
    }

}
