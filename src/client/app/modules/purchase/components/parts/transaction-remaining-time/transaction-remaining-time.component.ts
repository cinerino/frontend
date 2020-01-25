import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-transaction-remaining-time',
    templateUrl: './transaction-remaining-time.component.html',
    styleUrls: ['./transaction-remaining-time.component.scss']
})
export class TransactionRemainingTimeComponent implements OnInit, OnDestroy {
    @Input() public transaction: factory.transaction.placeOrder.ITransaction;
    public isExpired: boolean;
    public diff: { hours: string; minutes: string; seconds: string; };
    public timer: any;
    public width: number;
    public environment = environment;

    constructor(
        private router: Router
    ) { }

    public ngOnInit() {
        this.update();
    }

    public ngOnDestroy() {
        clearTimeout(this.timer);
    }

    private update() {
        this.updateProcess();
        const time = 1000;
        this.timer = setTimeout(() => { this.update(); }, time);
    }

    private updateProcess() {
        const now = moment();
        const expires = moment(this.transaction.expires);
        this.isExpired = expires.diff(now) < 0;
        this.diff = {
            hours: `00${expires.diff(now, 'hours')}`.slice(-2),
            minutes: `00${expires.diff(now, 'minutes') % 60}`.slice(-2),
            seconds: `00${expires.diff(now, 'seconds') % 60 % 60}`.slice(-2)
        };
        this.width = Math.floor(expires.diff(now, 'seconds') / (Number(this.environment.PURCHASE_TRANSACTION_TIME) * 60) * 100);
        if (this.isExpired) {
            this.router.navigate(['/expired']);
        }
    }

}
