import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-charge-coin-modal',
    templateUrl: './charge-coin-modal.component.html',
    styleUrls: ['./charge-coin-modal.component.scss']
})
export class ChargeCoinModalComponent implements OnInit {
    public coinChargeForm: FormGroup;

    constructor(
        public formBuilder: FormBuilder,
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
        this.createChargeForm();
    }

    private createChargeForm() {
        this.coinChargeForm = this.formBuilder.group({
            charge: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
        });
    }

}
