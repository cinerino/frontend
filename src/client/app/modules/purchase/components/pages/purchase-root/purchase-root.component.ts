import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ViewType } from '../../../../../models';
import { PurchaseService, UserService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-root',
    templateUrl: './purchase-root.component.html',
    styleUrls: ['./purchase-root.component.scss']
})
export class PurchaseRootComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    constructor(
        private store: Store<reducers.IState>,
        private purchaseService: PurchaseService,
        private userService: UserService,
        private router: Router
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        const user = await this.userService.getData();
        const tmpPurchase = await this.purchaseService.getData();
        if (user.viewType === ViewType.Cinema
            && tmpPurchase.external !== undefined
            && tmpPurchase.external.eventId !== undefined
            && tmpPurchase.authorizeSeatReservation !== undefined) {
            this.router.navigate([`/purchase/cinema/overlap`]);
            return;
        }
        this.purchaseService.delete();
        const purchase = await this.purchaseService.getData();
        if (user.viewType === ViewType.Cinema
            && purchase.external !== undefined
            && purchase.external.eventId !== undefined) {
            this.router.navigate([`/purchase/transaction/${purchase.external.eventId}`]);
            return;
        }
        if (user.viewType === ViewType.Cinema) {
            this.router.navigate(['/purchase/cinema/schedule']);
            return;
        }
        this.router.navigate(['/purchase/event/schedule']);
    }

}
