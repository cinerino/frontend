import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-security-code-modal',
    templateUrl: './security-code-modal.component.html',
    styleUrls: ['./security-code-modal.component.scss']
})
export class SecurityCodeModalComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
    }

}
