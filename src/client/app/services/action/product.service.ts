import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Functions } from '../..';
import * as reducers from '../../store/reducers';
import { CinerinoService } from '../cinerino.service';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root',
})
export class ActionProductService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 検索
     */
    public async search(params: factory.product.ISearchConditions) {
        try {
            this.utilService.loadStart({
                process: 'productAction.Search',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: (
                | factory.product.IProduct
                | factory.service.paymentService.IService
            )[] = [];
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult = await this.cinerinoService.product.search({
                    page,
                    limit,
                    ...params,
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
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * オファー検索
     */
    public async searchOffers(params: {
        itemOffered: { id: string };
        seller?: { id: string };
        availableAtOrFrom?: { id: string };
    }) {
        try {
            this.utilService.loadStart({
                process: 'productAction.SearchOffers',
            });
            await this.cinerinoService.getServices();
            const searchResult =
                await this.cinerinoService.product.searchOffers(params);
            this.utilService.loadEnd();
            return searchResult;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
