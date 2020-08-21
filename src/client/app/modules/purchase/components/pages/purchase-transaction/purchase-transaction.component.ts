import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-transaction',
    templateUrl: './purchase-transaction.component.html',
    styleUrls: ['./purchase-transaction.component.scss']
})
export class PurchaseTransactionComponent implements OnInit, AfterViewInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private actionService: ActionService,
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
        const snapshot = this.activatedRoute.snapshot;
        const eventId = snapshot.params.eventId;
        const passportToken = snapshot.params.passportToken;
        sessionStorage.setItem('EXTERNAL', JSON.stringify({ eventId, passportToken }));
        const tmpPurchase = await this.actionService.purchase.getData();
        const external = Functions.Util.getExternalData();
        if (this.environment.VIEW_TYPE === Models.Common.ViewType.Cinema
            && external !== undefined
            && external.eventId !== undefined
            && tmpPurchase.authorizeSeatReservation !== undefined) {
            this.router.navigate(['/purchase/cinema/overlap']);
            return;
        }
        this.actionService.purchase.delete();
        if (this.environment.VIEW_TYPE !== Models.Common.ViewType.Cinema) {
            this.router.navigate(['/error']);
            return;
        }
        try {
            await this.actionService.purchase.convertExternalToPurchase(eventId);
            await this.actionService.purchase.startTransaction();
            this.router.navigate(['/purchase/cinema/seat']);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    public ngAfterViewInit() {
        const snapshot = this.activatedRoute.snapshot;
        const language = snapshot.params.language;
        if (language !== undefined) {
            this.actionService.user.updateLanguage(language);
        }
    }

}
