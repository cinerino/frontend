import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
    public async search(params?: {
        project?: {
            id?: { $eq?: string };
        };
        typeOf?: { $eq?: string };
    }) {
        try {
            this.utilService.loadStart({
                process: 'productAction.Search',
            });
            await this.cinerinoService.getServices();
            const searchResult = await this.cinerinoService.product.search(
                params === undefined ? {} : params
            );
            this.utilService.loadEnd();
            return searchResult.data;
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
