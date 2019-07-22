import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ViewType } from '../../../../models';
import { PurchaseService, UserService } from '../../../../services';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-transaction',
    templateUrl: './purchase-transaction.component.html',
    styleUrls: ['./purchase-transaction.component.scss']
})
export class PurchaseTransactionComponent implements OnInit, AfterViewInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private purchaseService: PurchaseService,
        private userService: UserService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
        this.purchaseService.delete();
        this.user.subscribe(async (user) => {
            if (user.viewType !== ViewType.Cinema) {
                this.router.navigate(['/error']);
                return;
            }
            const snapshot = this.activatedRoute.snapshot;
            const eventId = snapshot.params.eventId;
            const passportToken = snapshot.params.passportToken;
            this.purchaseService.setExternal({eventId, passportToken});
            try {
                await this.purchaseService.convertExternalToPurchase(eventId);
                await this.purchaseService.startTransaction();
                this.router.navigate(['/purchase/cinema/seat']);
            } catch (error) {
                this.router.navigate(['/error']);
            }
        }).unsubscribe();
    }

    public ngAfterViewInit() {
        const snapshot = this.activatedRoute.snapshot;
        const language = snapshot.params.language;
        if (language !== undefined) {
            this.userService.updateLanguage(language);
        }
    }

}
