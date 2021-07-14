import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { BAD_REQUEST, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-membership',
    templateUrl: './membership.component.html',
    styleUrls: ['./membership.component.scss'],
})
export class MembershipComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public products: Models.Purchase.Product[];
    public ticketOffers: factory.event.screeningEvent.ITicketOffer[];
    public environment = getEnvironment();
    public unitCode = factory.unitCode;
    public selectProduct?: factory.product.IProduct;
    public selectTicketOffer?: factory.event.screeningEvent.ITicketOffer;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private actionService: ActionService,
        private utilService: UtilService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        try {
            this.purchase = this.store.pipe(select(reducers.getPurchase));
            this.user = this.store.pipe(select(reducers.getUser));
            this.isLoading = this.store.pipe(select(reducers.getLoading));
            this.products = [];
            this.ticketOffers = [];
            const { transaction } = await this.actionService.purchase.getData();
            if (transaction !== undefined) {
                await this.actionService.purchase.transaction.cancel();
            }
            const now = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            const searchResult = await this.actionService.product.search({
                typeOf: { $eq: factory.product.ProductType.MembershipService },
                offers: {
                    $elemMatch: {
                        availabilityStarts: {
                            $lte: now,
                            // $gte: now,
                        },
                        availabilityEnds: {
                            // $lte: now,
                            $gte: now,
                        },
                    },
                },
            });
            searchResult.forEach((product) => {
                if (
                    product.typeOf !==
                    factory.product.ProductType.MembershipService
                ) {
                    return;
                }
                this.products.push(
                    new Models.Purchase.Product({ product, now })
                );
            });
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    public async changeProduct(product: factory.product.IProduct) {
        try {
            this.selectProduct = product;
            if (
                product.id === undefined ||
                product.offers === undefined ||
                product.offers[0].seller === undefined ||
                product.offers[0].seller.id === undefined
            ) {
                throw new Error(
                    'product.id or product.offers[0].seller.id undefined'
                );
            }
            this.ticketOffers = await this.actionService.product.searchOffers({
                itemOffered: { id: product.id },
                seller: { id: product.offers[0].seller.id },
            });
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    public async changeTicketOffer(
        ticketOffer: factory.event.screeningEvent.ITicketOffer
    ) {
        this.selectTicketOffer = ticketOffer;
    }

    /**
     * 確定
     */
    public async onSubmit() {
        try {
            const product = this.selectProduct;
            const ticketOffer = this.selectTicketOffer;
            if (
                product === undefined ||
                product.offers === undefined ||
                product.offers[0].seller === undefined ||
                product.offers[0].seller.id === undefined ||
                ticketOffer === undefined
            ) {
                throw new Error('product or ticketOffer undefined');
            }
            this.actionService.purchase.setProduct({ product });
            this.actionService.purchase.setTicketOffer({ ticketOffer });
            await this.actionService.purchase.getSeller({
                id: product.offers[0].seller.id,
            });
            await this.actionService.purchase.transaction.start();

            this.router.navigate(['/product/membership/input']);
        } catch (error) {
            console.error(error);
            try {
                const errorObject = JSON.parse(error);
                if (errorObject.status === TOO_MANY_REQUESTS) {
                    this.router.navigate(['/congestion']);
                    return;
                }
                if (errorObject.status === BAD_REQUEST) {
                    this.router.navigate(['/maintenance']);
                    return;
                }
                this.router.navigate(['/error']);
            } catch (error2) {
                console.error(error2);
                this.router.navigate(['/error']);
            }
        }
    }
}
