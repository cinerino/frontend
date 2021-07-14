import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../..';
import * as reducers from '../../store/reducers';
import { CinerinoService } from '../cinerino.service';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root',
})
export class ActionOwnershipInfoService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * マイメンバーシップ検索
     */
    public async searchMyMemberships() {
        try {
            this.utilService.loadStart({
                process: 'ownershipInfoAction.SearchMyMemberships',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.ownershipInfo.IOwnershipInfo<factory.chevre.permit.IPermit>[] =
                [];
            const now = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.ownershipInfo.searchMyMemberships(
                        {
                            page,
                            limit,
                            ownedFrom: now,
                            ownedThrough: now,
                        }
                    );
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
}
