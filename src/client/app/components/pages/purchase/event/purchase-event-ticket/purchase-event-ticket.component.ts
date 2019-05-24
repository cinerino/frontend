import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { getTicketPrice, IScreeningEventWork, screeningEventsToWorkEvents } from '../../../../../functions';
import { IReservationTicket } from '../../../../../models';
import { UtilService } from '../../../../../services';
import { masterAction, purchaseAction } from '../../../../../store/actions';
import * as reducers from '../../../../../store/reducers';
import { PurchaseEventTicketModalComponent } from '../../../../parts';

@Component({
    selector: 'app-purchase-event-ticket',
    templateUrl: './purchase-event-ticket.component.html',
    styleUrls: ['./purchase-event-ticket.component.scss']
})
export class PurchaseEventTicketComponent implements OnInit, OnDestroy {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    public screeningWorkEvents: IScreeningEventWork[];
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    private updateTimer: any;
    public environment = environment;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private util: UtilService,
        private translate: TranslateService,
        private modal: BsModalService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
        this.screeningWorkEvents = [];

        this.getSchedule();
    }

    /**
     * 破棄
     */
    public ngOnDestroy() {
        clearTimeout(this.updateTimer);
    }

    /**
     * 更新
     */
    private update() {
        if (this.updateTimer !== undefined) {
            clearTimeout(this.updateTimer);
        }
        const time = 600000; // 10 * 60 * 1000
        this.updateTimer = setTimeout(() => {
            this.getSchedule();
        }, time);
    }

    /**
     * スケジュール取得
     */
    public getSchedule() {
        this.purchase.subscribe((purchase) => {
            const seller = purchase.seller;
            const scheduleDate = purchase.scheduleDate;
            if (seller === undefined || scheduleDate === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new masterAction.GetSchedule({
                superEvent: {
                    ids:
                        (purchase.external === undefined || purchase.external.superEventId === undefined)
                            ? [] : [purchase.external.superEventId],
                    locationBranchCodes:
                        (seller.location === undefined || seller.location.branchCode === undefined)
                            ? [] : [seller.location.branchCode],
                    workPerformedIdentifiers: (purchase.external === undefined || purchase.external.workPerformedId === undefined)
                        ? [] : [purchase.external.workPerformedId],
                },
                startFrom: moment(scheduleDate).toDate(),
                startThrough: moment(scheduleDate).add(1, 'day').toDate()
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetScheduleSuccess),
            tap(() => {
                this.master.subscribe((master) => {
                    const screeningEvents = master.screeningEvents;
                    this.screeningWorkEvents = screeningEventsToWorkEvents({ screeningEvents });
                    this.update();
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetScheduleFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * パフォーマンス選択
     * @param screeningEvent
     */
    public selectSchedule(screeningEvent: factory.event.screeningEvent.IEvent) {
        this.purchase.subscribe((purchase) => {
            this.user.subscribe((user) => {
                if (purchase.authorizeSeatReservations.length > 0
                    && !user.isPurchaseCart) {
                    this.util.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('purchase.event.ticket.alert.cart')
                    });
                    return;
                }
                this.store.dispatch(new purchaseAction.SelectSchedule({ screeningEvent }));
                this.getTickets();
            }).unsubscribe();
        }).unsubscribe();
    }

    /**
     * 券種情報取得
     */
    private getTickets() {
        this.purchase.subscribe((purchase) => {
            const screeningEvent = purchase.screeningEvent;
            const seller = purchase.seller;
            if (screeningEvent === undefined || seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new purchaseAction.GetTicketList({ screeningEvent, seller }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetTicketListSuccess),
            tap(() => {
                this.openTicketList();
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetTicketListFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * 券種一覧表示
     */
    private openTicketList() {
        this.purchase.subscribe((purchase) => {
            const screeningEvent = purchase.screeningEvent;
            this.modal.show(PurchaseEventTicketModalComponent, {
                initialState: {
                    screeningEventTicketOffers: purchase.screeningEventTicketOffers,
                    screeningEvent,
                    cb: (reservationTickets: IReservationTicket[]) => {
                        const limit = (screeningEvent === undefined
                            || screeningEvent.offers === undefined
                            || screeningEvent.offers.eligibleQuantity.maxValue === undefined)
                            ? 0 : screeningEvent.offers.eligibleQuantity.maxValue;
                        if (reservationTickets.length > limit) {
                            this.util.openAlert({
                                title: this.translate.instant('common.error'),
                                body: this.translate.instant(
                                    'purchase.event.ticket.alert.limit',
                                    { value: limit }
                                )
                            });
                            return;
                        }
                        this.getScreeningEventOffers(reservationTickets);
                    }
                },
                class: 'modal-dialog-centered'
            });
        }).unsubscribe();
    }

    /**
     * 空席情報取得
     */
    public getScreeningEventOffers(reservationTickets: IReservationTicket[]) {
        this.purchase.subscribe((purchase) => {
            if (purchase.screeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const screeningEvent = purchase.screeningEvent;
            this.store.dispatch(new purchaseAction.GetScreeningEventOffers({ screeningEvent }));
        }).unsubscribe();
        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetScreeningEventOffersSuccess),
            tap(() => {
                this.temporaryReservation(reservationTickets);
            })
        );
        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetScreeningEventOffersFail),
            tap(() => {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.event.ticket.alert.getScreeningEventOffers')
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * 仮予約
     * @param reservationTickets
     */
    private temporaryReservation(reservationTickets: IReservationTicket[]) {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined
                || purchase.screeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const transaction = purchase.transaction;
            const screeningEvent = purchase.screeningEvent;
            const screeningEventOffers = purchase.screeningEventOffers;
            this.store.dispatch(new purchaseAction.TemporaryReservationFreeSeat({
                transaction,
                screeningEvent,
                screeningEventOffers,
                reservationTickets
            }));
        }).unsubscribe();
        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.TemporaryReservationFreeSeatSuccess),
            tap(() => {
                this.util.openAlert({
                    title: this.translate.instant('common.complete'),
                    body: this.translate.instant('purchase.event.ticket.success.temporaryReservation')
                });
            })
        );
        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.TemporaryReservationFreeSeatFail),
            tap(() => {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.event.ticket.alert.temporaryReservation')
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * 券種確定
     */
    public onSubmit() {
        this.purchase.subscribe((purchase) => {
            const authorizeSeatReservations = purchase.authorizeSeatReservations;
            // チケット未選択判定
            if (authorizeSeatReservations.length === 0) {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.event.ticket.alert.unselected')
                });
                return;
            }
            // 単独購入可能作品判定
            if (this.isSinglePurchase({ name: 'alert', authorizeSeatReservations })) {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.event.ticket.alert.single')
                });
                return;
            }
            if (this.isSinglePurchase({ name: 'confirm', authorizeSeatReservations })) {
                this.util.openConfirm({
                    title: this.translate.instant('common.confirm'),
                    body: this.translate.instant('purchase.event.ticket.confirm.single'),
                    cb: () => { this.router.navigate(['/purchase/input']); }
                });
                return;
            }
            // チケット枚数上限判定
            let itemCount = 0;
            authorizeSeatReservations.forEach(a => itemCount += a.object.acceptedOffer.length);
            if (itemCount > Number(environment.PURCHASE_ITEM_MAX_LENGTH)) {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant(
                        'purchase.event.ticket.alert.limit',
                        { value: Number(environment.PURCHASE_ITEM_MAX_LENGTH) }
                    )
                });
                return;
            }
            this.router.navigate(['/purchase/input']);
        }).unsubscribe();
    }

    /**
     * 単独購入可能判定（警告 or 確認）
     */
    private isSinglePurchase(params: {
        name: 'alert' | 'confirm',
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[]
    }) {
        const authorizeSeatReservations = params.authorizeSeatReservations;
        const findResult = authorizeSeatReservations.find((a) => {
            const workPerformed = a.object.event.workPerformed;
            if (workPerformed === undefined
                || workPerformed.additionalProperty === undefined) {
                return false;
            }
            const findPropertyResult = workPerformed.additionalProperty.find(p => p.name === params.name && p.value !== undefined);
            if (findPropertyResult === undefined) {
                return false;
            }
            const findWorkPerformedResult = authorizeSeatReservations.find((a2) => {
                return (a2.object.event.workPerformed !== undefined
                    && a2.object.event.workPerformed.identifier === findPropertyResult.value);
            });
            return (findWorkPerformedResult === undefined);
        });

        return findResult;
    }

    /**
     * 座席の仮予約削除
     * @param authorizeSeatReservations
     */
    public removeItemProcess(
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[]
    ) {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new purchaseAction.CancelTemporaryReservations({ authorizeSeatReservations }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * 座席の仮予約削除確認
     */
    public removeItem(authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>) {
        this.util.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('purchase.event.cart.confirm.cancel'),
            cb: () => {
                const authorizeSeatReservations = [authorizeSeatReservation];
                this.removeItemProcess(authorizeSeatReservations);
            }
        });
    }

}

