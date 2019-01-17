import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getTicketPrice, IEventOrder, orderToEventOrders } from '../../../../functions';
import { ActionTypes, OrderAuthorize } from '../../../../store/actions/inquiry.action';
import * as reducers from '../../../../store/reducers';
import { QrCodeModalComponent } from '../../../parts/qrcode-modal/qrcode-modal.component';

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
        private router: Router,
        private actions: Actions,
        private modal: NgbModal
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

    public showQrCode() {
        this.inquiry.subscribe((inquiry) => {
            const order = inquiry.order;
            if (order === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new OrderAuthorize({
                params: {
                    orderNumber: order.orderNumber,
                    customer: {
                        telephone: order.customer.telephone
                    }
                }
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.OrderAuthorizeSuccess),
            tap(() => {
                this.inquiry.subscribe((inquiry) => {
                    const authorizeOrder = inquiry.order;
                    if (authorizeOrder === undefined) {
                        return;
                    }
                    const modalRef = this.modal.open(QrCodeModalComponent, {
                        centered: true
                    });
                    modalRef.componentInstance.order = authorizeOrder;
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.OrderAuthorizeFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
