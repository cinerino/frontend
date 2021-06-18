import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CreditcardSecurityCodeModalComponent } from '../creditcard/security-code-modal/security-code-modal.component';

@Component({
    selector: 'app-input-creditcard',
    templateUrl: './input-creditcard.component.html',
    styleUrls: ['./input-creditcard.component.scss'],
})
export class InputCreditcardComponent implements OnInit, OnDestroy {
    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public formGroup: FormGroup;
    public subscription?: Subscription;
    @Input() public amount: number;
    @Output() public valueChanges = new EventEmitter<FormGroup>();

    constructor(
        private modal: BsModalService,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit() {
        this.formGroup = this.createForm();
        this.subscription = this.formGroup.valueChanges.subscribe(() => {
            this.valueChanges.emit(this.formGroup);
        });
    }

    public ngOnDestroy() {
        if (this.subscription === undefined) {
            return;
        }
        this.subscription.unsubscribe();
    }

    /**
     * フォーム作成
     */
    private createForm() {
        this.cardExpiration = {
            year: [],
            month: [],
        };
        for (let i = 0; i < 12; i++) {
            this.cardExpiration.month.push(`0${String(i + 1)}`.slice(-2));
        }
        for (let i = 0; i < 10; i++) {
            this.cardExpiration.year.push(
                moment().add(i, 'year').format('YYYY')
            );
        }
        const formGroup = this.formBuilder.group({
            cardNumber: [
                '',
                [Validators.required, Validators.pattern(/^[0-9]+$/)],
            ],
            cardExpirationMonth: [
                this.cardExpiration.month[0],
                [Validators.required],
            ],
            cardExpirationYear: [
                this.cardExpiration.year[0],
                [Validators.required],
            ],
            securityCode: ['', [Validators.required]],
            holderName: ['', [Validators.required]],
        });

        return formGroup;
    }

    /**
     * セキュリティコード詳細表示
     */
    public openSecurityCode() {
        this.modal.show(CreditcardSecurityCodeModalComponent, {
            class: 'modal-dialog-centered',
        });
    }
}
