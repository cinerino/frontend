import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getTicketPrice } from '../../../../functions';
import { ActionTypes, GetPurchaseHistory, OrderAuthorize } from '../../../../store/actions/inquiry.action';
import * as reducers from '../../../../store/reducers';
import { QrCodeModalComponent } from '../../../parts/qrcode-modal/qrcode-modal.component';

@Component({
    selector: 'app-purchase-history',
    templateUrl: './purchase-history.component.html',
    styleUrls: ['./purchase-history.component.scss']
})
export class PurchaseHistoryComponent implements OnInit {
    public inquiry: Observable<reducers.IInquiryState>;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    constructor(
        private store: Store<reducers.IInquiryState>,
        private actions: Actions,
        private modal: NgbModal,
        private router: Router
    ) { }

    public ngOnInit() {
        this.inquiry = this.store.pipe(select(reducers.getInquiry));
        this.getPurchaseHistory();
    }

    /**
     * getPurchaseHistory
     */
    public getPurchaseHistory() {
        this.store.dispatch(new GetPurchaseHistory({
            params: {
                orderDateFrom: moment().add(-1, 'month').toDate(),
                orderDateThrough: moment().toDate(),
                limit: 20,
                page: 1,
                sort: {
                    orderDate: factory.sortType.Descending
                }
            }
        }));

        const success = this.actions.pipe(
            ofType(ActionTypes.GetPurchaseHistorySuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.GetPurchaseHistoryFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    public showQrCode(data: factory.order.IOrder) {
        this.store.dispatch(new OrderAuthorize({
            params: {
                orderNumber: data.orderNumber,
                customer: {
                    telephone: data.customer.telephone
                }
            }
        }));

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
