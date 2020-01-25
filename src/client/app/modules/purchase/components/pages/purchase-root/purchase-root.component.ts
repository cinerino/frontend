import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { getExternalData } from '../../../../../functions';
import { ViewType } from '../../../../../models';
import { PurchaseService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-root',
    templateUrl: './purchase-root.component.html',
    styleUrls: ['./purchase-root.component.scss']
})
export class PurchaseRootComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public environment = environment;

    constructor(
        private store: Store<reducers.IState>,
        private purchaseService: PurchaseService,
        private router: Router
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        const tmpPurchase = await this.purchaseService.getData();
        const external = getExternalData();
        if (this.environment.VIEW_TYPE === ViewType.Cinema
            && external !== undefined
            && external.eventId !== undefined
            && tmpPurchase.authorizeSeatReservation !== undefined) {
            this.router.navigate([`/purchase/cinema/overlap`]);
            return;
        }
        this.purchaseService.delete();
        if (this.environment.VIEW_TYPE === ViewType.Cinema
            && external.eventId !== undefined) {
            this.router.navigate([`/purchase/transaction/${external.eventId}`]);
            return;
        }
        if (this.environment.VIEW_TYPE === ViewType.Cinema) {
            this.router.navigate(['/purchase/cinema/schedule']);
            return;
        }
        this.router.navigate(['/purchase/event/schedule']);
    }

}
