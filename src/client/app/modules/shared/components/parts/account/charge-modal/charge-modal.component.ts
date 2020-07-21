import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/sdk';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-account-charge-modal',
    templateUrl: './charge-modal.component.html',
    styleUrls: ['./charge-modal.component.scss']
})
export class AccountChargeModalComponent implements OnInit {
    @Input() public sellers: factory.chevre.seller.ISeller[];
    @Input() public creditCards: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    @Input() public cb: (value: {
        seller?: factory.chevre.seller.ISeller;
        amount: number;
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
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

    public selectCreditCard(cregitCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard) {
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
