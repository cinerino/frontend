import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-transaction',
    templateUrl: './purchase-transaction.component.html',
    styleUrls: ['./purchase-transaction.component.scss'],
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
        private utilService: UtilService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
        const tmpPurchase = await this.actionService.purchase.getData();
        const external = Functions.Util.getExternalData();
        if (
            this.environment.VIEW_TYPE === Models.Common.ViewType.Cinema &&
            external !== undefined &&
            external.eventId !== undefined &&
            tmpPurchase.authorizeSeatReservation !== undefined
        ) {
            this.router.navigate(['/purchase/cinema/overlap']);
            return;
        }
        this.actionService.purchase.delete();
        if (
            this.environment.VIEW_TYPE !== Models.Common.ViewType.Cinema ||
            external.eventId === undefined
        ) {
            this.router.navigate(['/error']);
            return;
        }
        try {
            const serverTime = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            await this.actionService.purchase.externalData2PurchaseData({
                event: { id: external.eventId },
            });
            const { screeningEvent } =
                await this.actionService.purchase.getData();
            if (screeningEvent === undefined) {
                throw new Error('screeningEvent undefined');
            }
            const performance = new Models.Purchase.Performance({
                screeningEvent,
                now: serverTime,
            });
            if (!performance.isSales() || performance.isSeatStatus('danger')) {
                throw new Error('Not for sale');
            }
            await this.actionService.purchase.startTransaction();
            this.router.navigate(['/purchase/cinema/seat']);
        } catch (error) {
            console.error(error);
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
