import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-payment',
    templateUrl: './purchase-payment.component.html',
    styleUrls: ['./purchase-payment.component.scss'],
})
export class PurchasePaymentComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public moment = moment;
    public amount: number;
    public environment = getEnvironment();
    public user: Observable<reducers.IUserState>;

    constructor(private actionService: ActionService, private router: Router) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        try {
            const { pendingMovieTickets, authorizeSeatReservations } =
                await this.actionService.purchase.getData();
            const { language } = await this.actionService.user.getData();
            this.amount = 0;
            this.amount = Functions.Purchase.getAmount(
                authorizeSeatReservations
            );
            if (this.amount > 0) {
                await this.actionService.purchase.payment.authorizeCreditCard({
                    amount: this.amount,
                });
            }
            if (pendingMovieTickets.length > 0) {
                await this.actionService.purchase.payment.authorizeMovieTicket();
            }
            await this.actionService.purchase.transaction.confirm({
                mailType: 'seatReservation',
                language,
            });
            this.router.navigate(['/purchase/complete']);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }
}
