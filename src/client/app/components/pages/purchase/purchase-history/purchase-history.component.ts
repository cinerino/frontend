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
import { IPurchaseOrder } from '../../../../models/history/purchaseOrder';
import { ActionTypes, GetPurchaseHistory, OrderAuthorize } from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { PurchaseDetailModalComponent } from '../../../parts/purchase-detail-modal/purchase-detail-modal.component';

@Component({
    selector: 'app-purchase-history',
    templateUrl: './purchase-history.component.html',
    styleUrls: ['./purchase-history.component.scss']
})
export class PurchaseHistoryComponent implements OnInit {
    public history: Observable<reducers.IHistoryState>;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    constructor(
        private store: Store<reducers.IHistoryState>,
        private actions: Actions,
        private modal: NgbModal,
        private router: Router
    ) { }

    public ngOnInit() {
        this.history = this.store.pipe(select(reducers.getHistory));
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

    public detail(data: IPurchaseOrder) {
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
                this.history.subscribe((result) => {
                    const authorizeOrder = result.purchase.find(order => order.orderNumber === data.orderNumber);
                    if (authorizeOrder === undefined) {
                        return;
                    }
                    const modalRef = this.modal.open(PurchaseDetailModalComponent, {
                        centered: true
                    });
                    modalRef.componentInstance.data = authorizeOrder;
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
