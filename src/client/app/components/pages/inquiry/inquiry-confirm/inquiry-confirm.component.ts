import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { getTicketPrice, IEventOrder, orderToEventOrders } from '../../../../functions';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-inquiry-confirm',
    templateUrl: './inquiry-confirm.component.html',
    styleUrls: ['./inquiry-confirm.component.scss']
})
export class InquiryConfirmComponent implements OnInit {
    public inquiry: Observable<reducers.IInquiryState>;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    public eventOrders: IEventOrder[];

    constructor(
        private store: Store<reducers.IState>,
        private router: Router
    ) { }

    public ngOnInit() {
        this.eventOrders = [];
        this.inquiry = this.store.pipe(select(reducers.getInquiry));
        this.inquiry.subscribe((inquiry) => {
            if (inquiry.order === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const order = inquiry.order;
            this.eventOrders = orderToEventOrders({ order });
        });
    }

}
