import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-charge-coin-modal',
    templateUrl: './charge-coin-modal.component.html',
    styleUrls: ['./charge-coin-modal.component.scss']
})
export class ChargeCoinModalComponent implements OnInit {
    @Input() public cb: (value: number) => void;
    public coinChargeForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        this.createChargeForm();
    }

    public close() {
        this.modal.hide();
        this.cb(this.coinChargeForm.controls.charge.value);
    }

    private createChargeForm() {
        this.coinChargeForm = this.formBuilder.group({
            charge: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
        });
    }

}
