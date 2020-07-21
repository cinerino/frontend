import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/sdk';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-account-open-modal',
    templateUrl: './open-modal.component.html',
    styleUrls: ['./open-modal.component.scss']
})
export class AccountOpenModalComponent implements OnInit {
    @Input() public sellers: factory.chevre.seller.ISeller[];
    @Input() public cb: (value: {
        name: string;
        accountType: factory.accountType;
    }) => void;
    public accountType = factory.accountType;
    public openAccountForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        this.createOpenForm();
    }

    public close() {
        this.modal.hide();
        this.cb({
            name: this.openAccountForm.controls.name.value,
            accountType: this.openAccountForm.controls.accountType.value
        });
    }

    private createOpenForm() {
        this.openAccountForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            accountType: ['Coin', [Validators.required]]
        });
    }

}
