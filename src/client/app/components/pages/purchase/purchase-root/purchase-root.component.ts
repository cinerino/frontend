import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ViewType } from '../../../../models';
import { purchaseAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';

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
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.store.dispatch(new purchaseAction.Delete());
        this.user.subscribe((user) => {
            const snapshot = this.activatedRoute.snapshot;
            const sellerId = snapshot.params.sellerId;
            const eventId = snapshot.params.eventId;
            const language = snapshot.params.language;
            this.store.dispatch(new purchaseAction.SetExternal({ sellerId, eventId }));
            if (language !== undefined) {
                (<HTMLSelectElement>document.querySelector('#language')).value = language;
            }
            if (user.viewType === ViewType.Cinema) {
                this.router.navigate(['/purchase/cinema/schedule']);
                return;
            }
            this.router.navigate(['/purchase/event/schedule']);
        }).unsubscribe();
    }

}
