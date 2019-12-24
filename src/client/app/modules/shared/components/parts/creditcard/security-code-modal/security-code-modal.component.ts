import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'app-creditcard-security-code-modal',
    templateUrl: './security-code-modal.component.html',
    styleUrls: ['./security-code-modal.component.scss']
})
export class CreditcardSecurityCodeModalComponent implements OnInit {

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
    }

}
