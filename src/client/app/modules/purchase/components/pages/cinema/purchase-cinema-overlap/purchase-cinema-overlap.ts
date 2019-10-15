import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client/lib/abstract';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Reservation } from '../../../../../../models';
import { CinerinoService, PurchaseService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-purchase-cinema-overlap',
    templateUrl: './purchase-cinema-overlap.component.html',
    styleUrls: ['./purchase-cinema-overlap.component.scss']
})
export class PurchaseCinemaOverlapComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public tmpPurchaseData: {
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        reservations: Reservation[];
    };
    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private purchaseService: PurchaseService,
        private cinerino: CinerinoService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        try {
            const purchaseData = await this.purchaseService.getData();
            if (purchaseData.external === undefined
                || purchaseData.external.eventId === undefined) {
                throw new Error('eventId is undefined');
            }
            await this.cinerino.getServices();
            const screeningEvent = await this.cinerino.event.findScreeningEventById({ id: purchaseData.external.eventId });
            this.tmpPurchaseData = {
                screeningEvent: screeningEvent,
                reservations: []
            };
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    public async onSubmit() {
        this.purchaseService.delete();
        await this.purchaseService.cancelTransaction();
        const purchase = await this.purchaseService.getData();
        if (purchase.external !== undefined
            && purchase.external.eventId !== undefined) {
            this.router.navigate([`/purchase/transaction/${purchase.external.eventId}`]);
            return;
        }
    }

}
