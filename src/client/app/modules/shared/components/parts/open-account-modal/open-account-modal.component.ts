import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/api-javascript-client';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-open-account-modal',
    templateUrl: './open-account-modal.component.html',
    styleUrls: ['./open-account-modal.component.scss']
})
export class OpenAccountModalComponent implements OnInit {
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
            accountType: [this.accountType.Coin, [Validators.required]]
        });
    }

}
