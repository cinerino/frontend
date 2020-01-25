import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { getExternalData } from '../../../../../../functions';
import { IReservationSeat, SeatStatus } from '../../../../../../models';
import { PurchaseService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-purchase-cinema-seat',
    templateUrl: './purchase-cinema-seat.component.html',
    styleUrls: ['./purchase-cinema-seat.component.scss']
})
export class PurchaseCinemaSeatComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public environment = environment;
    public external = getExternalData();

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private translate: TranslateService,
        private purchaseService: PurchaseService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        try {
            await this.purchaseService.getScreen();
            await this.purchaseService.getTicketList();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 座席選択
     */
    public selectSeat(data: {
        seat: IReservationSeat,
        status: SeatStatus
    }) {
        this.purchase.subscribe((purchase) => {
            if (data.status === SeatStatus.Default) {
                if (purchase.screeningEvent !== undefined
                    && purchase.screeningEvent.offers !== undefined
                    && purchase.screeningEvent.offers.eligibleQuantity.maxValue !== undefined
                    && purchase.reservations.length >= purchase.screeningEvent.offers.eligibleQuantity.maxValue) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant(
                            'purchase.cinema.seat.alert.limit',
                            { value: purchase.screeningEvent.offers.eligibleQuantity.maxValue }
                        )
                    });
                    return;
                }
                this.purchaseService.selectSeats([data.seat]);
            } else {
                this.purchaseService.cancelSeats([data.seat]);
            }
        }).unsubscribe();
    }

    /**
     * 座席決定
     */
    public async onSubmit() {
        try {
            const purchase = await this.purchaseService.getData();
            if (purchase.reservations.length === 0) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.cinema.seat.alert.unselected')
                });
                return;
            }
            await this.purchaseService.temporaryReservation();
            this.router.navigate(['/purchase/cinema/ticket']);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }
}
