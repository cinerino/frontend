import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { OrderActions } from '../../../../models';
import { UtilService } from '../../../../services';
import { ActionTypes, Cancel, Delete, OrderAuthorize, Search } from '../../../../store/actions/order.action';
import * as reducers from '../../../../store/reducers';
import { OrderDetailModalComponent } from '../../../parts/order-detail-modal/order-detail-modal.component';
import { QrCodeModalComponent } from '../../../parts/qrcode-modal/qrcode-modal.component';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
    public isLoading: Observable<boolean>;
    public error: Observable<string | null>;
    public order: Observable<reducers.IOrderState>;
    public master: Observable<reducers.IMasterState>;
    public moment: typeof moment = moment;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public limit: number;
    public conditions: {
        movieTheaterId: string;
        orderDateFrom: string;
        orderDateThrough: string;
        confirmationNumber: string;
        customer: {
            familyName: string;
            givenName: string;
            email: string;
            telephone: string;
        },
        orderStatuses: '' | factory.orderStatus;
    };
    public selectedOrders: factory.order.IOrder[];
    public OrderActions: typeof OrderActions = OrderActions;
    public actionSelect: OrderActions | '';

    constructor(
        private store: Store<reducers.IOrderState>,
        private actions: Actions,
        private modal: NgbModal,
        private router: Router,
        private util: UtilService
    ) { }

    public ngOnInit() {
        this.actionSelect = '';
        this.selectedOrders = [];
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.order = this.store.pipe(select(reducers.getOrder));
        this.limit = 20;
        this.conditions = {
            movieTheaterId: '',
            orderDateFrom: '',
            orderDateThrough: '',
            confirmationNumber: '',
            customer: {
                familyName: '',
                givenName: '',
                email: '',
                telephone: ''
            },
            orderStatuses: ''
        };
        this.store.dispatch(new Delete());
    }

    public isSelected(order: factory.order.IOrder) {
        const findResult = this.selectedOrders.find(o => o.orderNumber === order.orderNumber);
        return findResult !== undefined;
    }

    public addOrder(order: factory.order.IOrder) {
        this.selectedOrders.push(order);
    }

    public removeOrder(order: factory.order.IOrder) {
        const findIndex = this.selectedOrders.findIndex(o => o.orderNumber === order.orderNumber);
        this.selectedOrders.splice(findIndex, 1);
    }

    public orderSearch(page: number) {
        this.selectedOrders = [];
        const params = {
            seller: {
                ids: (this.conditions.movieTheaterId === '')
                    ? undefined : [this.conditions.movieTheaterId]
            },
            customer: {
                email: (this.conditions.customer.email === '')
                    ? undefined : this.conditions.customer.email,
                telephone: (this.conditions.customer.telephone === '')
                    ? undefined : this.conditions.customer.telephone,
                familyName: (this.conditions.customer.familyName === '')
                    ? undefined : this.conditions.customer.familyName,
                givenName: (this.conditions.customer.givenName === '')
                    ? undefined : this.conditions.customer.givenName,
            },
            orderStatuses: (this.conditions.orderStatuses === '')
                ? undefined : [this.conditions.orderStatuses],
            orderDateFrom: (this.conditions.orderDateFrom === '')
                ? moment('1970-01-01').toDate() : moment(this.conditions.orderDateFrom).toDate(),
            orderDateThrough: (this.conditions.orderDateThrough === '')
                ? moment().add(1, 'day').toDate() : moment(this.conditions.orderDateThrough).add(1, 'day').toDate(),
            confirmationNumbers: (this.conditions.confirmationNumber === '')
                ? undefined : [this.conditions.confirmationNumber],
            limit: this.limit,
            page,
            sort: {
                orderDate: factory.sortType.Descending
            }
        };
        this.store.dispatch(new Search({ params }));

        const success = this.actions.pipe(
            ofType(ActionTypes.SearchSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.SearchFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * キャンセル確認
     */
    public cancelConfirm(orders: factory.order.IOrder[]) {
        this.util.openConfirm({
            title: '確認',
            body: 'キャンセルしてよろしいですか。',
            cb: () => {
                this.cancel(orders);
            }
        });
    }

    /**
     * 詳細を表示
     */
    public openDetail(order: factory.order.IOrder) {
        const modalRef = this.modal.open(OrderDetailModalComponent, {
            centered: true
        });
        modalRef.componentInstance.order = order;
    }

    /**
     * キャンセル処理
     */
    public cancel(orders: factory.order.IOrder[]) {
        this.store.dispatch(new Cancel({ orders }));

        const success = this.actions.pipe(
            ofType(ActionTypes.SearchSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.SearchFail),
            tap(() => {
                this.error.subscribe((error) => {
                    this.util.openAlert({
                        title: 'エラー',
                        body: `
                        <p class="mb-4">キャンセルに失敗しました</p>
                            <div class="p-3 bg-light-gray select-text">
                            <code>${error}</code>
                        </div>`
                    });
                }).unsubscribe();
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }


    /**
     * 選択した注文へのアクション
     */
    public selecedtAction() {
        if (this.selectedOrders.length === 0) {
            this.util.openAlert({
                title: 'エラー',
                body: `注文が選択されていません。`
            });
        }
        if (this.actionSelect === OrderActions.Cancel) {
            this.util.openConfirm({
                title: '確認',
                body: 'キャンセルしてよろしいですか。',
                cb: () => {
                    this.cancel(this.selectedOrders);
                }
            });
        }
    }

    /**
     * QRコード表示
     */
    public openQrCode(order: factory.order.IOrder) {
        this.store.dispatch(new OrderAuthorize({
            params: {
                orderNumber: order.orderNumber,
                customer: {
                    telephone: order.customer.telephone
                }
            }
        }));

        const success = this.actions.pipe(
            ofType(ActionTypes.OrderAuthorizeSuccess),
            tap(() => {
                this.order.subscribe((inquiry) => {
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
                this.util.openAlert({
                    title: 'エラー',
                    body: 'QRコード表示を表示できません。'
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
