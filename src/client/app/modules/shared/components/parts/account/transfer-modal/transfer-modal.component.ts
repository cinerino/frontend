import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/api-javascript-client';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { QRCodeService } from '../../../../../../services';

@Component({
    selector: 'app-account-transfer-modal',
    templateUrl: './transfer-modal.component.html',
    styleUrls: ['./transfer-modal.component.scss']
})
export class AccountTransferModalComponent implements OnInit {
    @Input() public sellers: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>[];
    @Input() public cb: (value: {
        seller?: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
        amount: number;
        description: string;
        accountNumber: string
    }) => void;
    public TransferAccountForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public modal: BsModalRef,
        private qrcodeService: QRCodeService
    ) { }

    public ngOnInit() {
        this.createTransferForm();
    }

    public close() {
        this.modal.hide();
        const seller = this.sellers.find(s => s.id === this.TransferAccountForm.controls.sellerId.value);
        this.cb({
            seller,
            amount: this.TransferAccountForm.controls.amount.value,
            description: this.TransferAccountForm.controls.description.value,
            accountNumber: this.TransferAccountForm.controls.accountNumber.value
        });
    }

    private createTransferForm() {
        this.TransferAccountForm = this.formBuilder.group({
            sellerId: ['', [Validators.required]],
            amount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            description: [''],
            accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        });
    }

    public openQRReader() {
        this.qrcodeService.openQRCodeReader({
            cb: (data: string) => {
                this.TransferAccountForm.controls.accountNumber.setValue(data);
            }
        });
    }

}
