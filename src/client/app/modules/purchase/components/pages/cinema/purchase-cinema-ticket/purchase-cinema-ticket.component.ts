import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../../environments/environment';
import { IReservation, IReservationTicket } from '../../../../../../models/purchase/reservation';
import { PurchaseService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';
import { MvtkCheckModalComponent } from '../../../../../shared/components/parts/mvtk/check-modal/check-modal.component';
import {
    PurchaseCinemaTicketModalComponent
} from '../../../../../shared/components/parts/purchase/cinema/ticket-modal/ticket-modal.component';

@Component({
    selector: 'app-purchase-cinema-ticket',
    templateUrl: './purchase-cinema-ticket.component.html',
    styleUrls: ['./purchase-cinema-ticket.component.scss']
})
export class PurchaseCinemaTicketComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public additionalTicketText: string;
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private modal: BsModalService,
        private utilService: UtilService,
        private purchaseService: PurchaseService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.additionalTicketText = '';
    }

    /**
     * 券種決定
     */
    public async onSubmit() {
        try {
            const purchase = await this.purchaseService.getData();
            const reservations = purchase.reservations;
            const unselectedReservations = reservations.filter((reservation) => {
                return (reservation.ticket === undefined);
            });
            if (unselectedReservations.length > 0) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.cinema.ticket.alert.unselected')
                });
                return;
            }
            const validResult = reservations.filter((reservation) => {
                if (reservation.ticket === undefined) {
                    return false;
                }
                const priceComponent = reservation.ticket.ticketOffer.priceSpecification.priceComponent;
                const UnitPriceSpecification = factory.chevre.priceSpecificationType.UnitPriceSpecification;
                const unitPriceSpecifications = priceComponent.filter(p => p.typeOf === UnitPriceSpecification);
                const filterResult = reservations.filter((targetReservation) => {
                    return (reservation.ticket !== undefined
                        && targetReservation.ticket !== undefined
                        && reservation.ticket.ticketOffer.id === targetReservation.ticket.ticketOffer.id);
                });
                const findResult = unitPriceSpecifications.find((unitPriceSpecification) => {
                    const value = (unitPriceSpecification.typeOf === UnitPriceSpecification
                        && unitPriceSpecification.referenceQuantity.value !== undefined)
                        ? unitPriceSpecification.referenceQuantity.value : 1;

                    return (filterResult.length % value !== 0);
                });

                return (findResult !== undefined);
            });
            if (validResult.length > 0) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.cinema.ticket.alert.ticketCondition')
                });
                return;
            }
            const additionalTicketText = this.additionalTicketText;
            await this.purchaseService.temporaryReservation({ reservations, additionalTicketText });
            const authorizeSeatReservation = purchase.authorizeSeatReservation;
            if (authorizeSeatReservation === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            if (!this.environment.PURCHASE_CART) {
                this.router.navigate(['/purchase/input']);
                return;
            }
            this.router.navigate(['/purchase/cinema/cart']);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 券種一覧表示
     * @param reservation
     */
    public openTicketList(reservation: IReservation) {
        this.purchase.subscribe((purchase) => {
            this.modal.show(PurchaseCinemaTicketModalComponent, {
                initialState: {
                    screeningEventTicketOffers: purchase.screeningEventTicketOffers,
                    checkMovieTicketActions: purchase.checkMovieTicketActions,
                    reservations: purchase.reservations,
                    reservation: reservation,
                    pendingMovieTickets: purchase.pendingMovieTickets,
                    cb: (ticket: IReservationTicket) => {
                        reservation.ticket = ticket;
                        this.purchaseService.selectTickets([reservation]);
                    }
                },
                class: 'modal-dialog-centered'
            });
        }).unsubscribe();
    }

    public openMovieTicket() {
        this.modal.show(MvtkCheckModalComponent, {
            class: 'modal-dialog-centered modal-lg'
        });
    }

}
