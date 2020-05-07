import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-creditcard-register-modal',
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.scss']
})
export class CreditcardRegisterModalComponent implements OnInit {
    @Input() public cb: (value: {
        creditCard: {
            cardno: string;
            expire: string;
            holderName: string;
            securityCode: string;
        },
        seller?: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>
    }) => void;
    @Input() public sellers: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>[];
    public creditCardForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };

    constructor(
        public formBuilder: FormBuilder,
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        this.createCreditCardForm();
    }

    public close() {
        Object.keys(this.creditCardForm.controls).forEach((key) => {
            this.creditCardForm.controls[key].markAsTouched();
        });
        this.creditCardForm.controls.cardNumber.setValue((<HTMLInputElement>document.getElementById('cardNumber')).value);
        this.creditCardForm.controls.securityCode.setValue((<HTMLInputElement>document.getElementById('securityCode')).value);
        this.creditCardForm.controls.holderName.setValue((<HTMLInputElement>document.getElementById('holderName')).value);
        if (this.creditCardForm.invalid) {
            return;
        }
        this.modal.hide();
        const cardExpiration = {
            year: this.creditCardForm.controls.cardExpirationYear.value,
            month: this.creditCardForm.controls.cardExpirationMonth.value
        };
        const creditCard = {
            cardno: this.creditCardForm.controls.cardNumber.value,
            expire: `${cardExpiration.year}${cardExpiration.month}`,
            holderName: this.creditCardForm.controls.holderName.value,
            securityCode: this.creditCardForm.controls.securityCode.value
        };
        const seller = this.sellers.find(s => s.id === this.creditCardForm.controls.sellerId.value);
        this.cb({ creditCard, seller });
    }

    /**
     * クレジットカードフォーム作成
     */
    private createCreditCardForm() {
        this.cardExpiration = { year: [], month: [] };
        for (let i = 0; i < 12; i++) {
            this.cardExpiration.month.push(`0${String(i + 1)}`.slice(-2));
        }
        for (let i = 0; i < 10; i++) {
            this.cardExpiration.year.push(moment().add(i, 'year').format('YYYY'));
        }
        this.creditCardForm = this.formBuilder.group({
            sellerId: ['', [Validators.required]],
            cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            cardExpirationMonth: [this.cardExpiration.month[0], [Validators.required]],
            cardExpirationYear: [this.cardExpiration.year[0], [Validators.required]],
            securityCode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            holderName: ['', [Validators.required]]
        });
    }

}
