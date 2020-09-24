import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Functions } from '..';
import { CinerinoService } from './cinerino.service';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private cinerinoService: CinerinoService,
        private utilService: UtilService
    ) { }

    public async getReservations() {
        this.utilService.loadStart({ process: 'userAction.GetReservations' });
        const limit = 100;
        let page = 1;
        let roop = true;
        let result: factory.ownershipInfo.IOwnershipInfo<factory.ownershipInfo.IGoodWithDetail>[] = [];
        await this.cinerinoService.getServices();
        while (roop) {
            const searchResult = await this.cinerinoService.ownershipInfo.search({
                typeOfGood: {
                    typeOf: factory.chevre.reservationType.EventReservation
                },
                page,
                limit
            });
            result = [...result, ...searchResult.data];
            page++;
            roop = searchResult.data.length === limit;
            if (roop) {
                await Functions.Util.sleep();
            }
        }
        this.utilService.loadEnd();
        return result;
    }

    public async getOrders(params: factory.order.ISearchConditions & {
        id?: string | undefined;
    }) {
        this.utilService.loadStart({ process: 'userAction.GetOrders' });
        const limit = 100;
        let page = 1;
        let roop = true;
        let result: factory.order.IOrder[] = [];
        await this.cinerinoService.getServices();
        while (roop) {
            const searchResult = await this.cinerinoService.person.searchOrders({
                ...params,
                page,
                limit
            });
            result = [...result, ...searchResult.data];
            page++;
            roop = searchResult.data.length === limit;
            if (roop) {
                await Functions.Util.sleep();
            }
        }
        this.utilService.loadEnd();
        return result;
    }

    public async orderAuthorize(params: {
        orderNumber: string;
        customer: {
            email?: string | undefined;
            telephone?: string | undefined;
        };
    }) {
        this.utilService.loadStart({ process: 'orderAction.OrderAuthorize' });
        const order = await this.cinerinoService.order.authorizeOwnershipInfos(params);
        this.utilService.loadEnd();
        return order;
    }

}
