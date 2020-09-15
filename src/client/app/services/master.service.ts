import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Functions } from '..';
import { getEnvironment } from '../../environments/environment';
import { masterAction } from '../store/actions';
import * as reducers from '../store/reducers';
import { CinerinoService } from './cinerino.service';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root'
})
export class MasterService {
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private cinerinoService: CinerinoService,
        private utilService: UtilService
    ) {
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * マスタデータ取得
     */
    public async getData() {
        return new Promise<reducers.IMasterState>((resolve) => {
            this.master.subscribe((master) => {
                resolve(master);
            }).unsubscribe();
        });
    }

    /**
     * データ削除
     */
    public delete() {
        this.store.dispatch(masterAction.remove());
    }

    /**
     * 販売者一覧取得
     */
    public async getSellers(params?: factory.seller.ISearchConditions) {
        try {
            this.utilService.loadStart({ process: 'masterAction.GetSellers' });
            await this.cinerinoService.getServices();
            const searchResult = await this.cinerinoService.seller.search((params === undefined) ? {} : params);
            this.utilService.loadEnd();
            return searchResult.data;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 劇場一覧取得
     */
    public async getTheaters(params?: factory.chevre.place.movieTheater.ISearchConditions) {
        try {
            this.utilService.loadStart({ process: 'masterAction.GetTheaters' });
            await this.cinerinoService.getServices();
            const searchResult = await this.cinerinoService.place.searchMovieTheaters((params === undefined) ? {} : params);
            this.utilService.loadEnd();
            return searchResult.data;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * スケジュール一覧取得
     */
    public async getSchedule(params: {
        superEvent: {
            ids?: string[];
            locationBranchCodes?: string[];
            workPerformedIdentifiers?: string[];
        };
        startFrom: Date;
        startThrough: Date;
    }) {
        try {
            this.utilService.loadStart({ process: 'masterAction.GetSchedule' });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.event.screeningEvent.IEvent[] = [];
            await this.cinerinoService.getServices();
            const now = moment((await this.utilService.getServerTime()).date).toDate();
            while (roop) {
                const searchResult = await this.cinerinoService.event.search({
                    page,
                    limit,
                    typeOf: factory.chevre.eventType.ScreeningEvent,
                    eventStatuses: [factory.chevre.eventStatusType.EventScheduled],
                    superEvent: params.superEvent,
                    startFrom: params.startFrom,
                    startThrough: params.startThrough,
                    offers: {
                        availableFrom: now,
                        availableThrough: now
                    }
                });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            const environment = getEnvironment();
            if (environment.PURCHASE_SCHEDULE_SORT === 'screeningEventSeries') {
                result = await this.sortScreeningEventSeries({
                    screeningEvents: result,
                    superEvent: params.superEvent
                });
            } else if (environment.PURCHASE_SCHEDULE_SORT === 'screen') {
                result = await this.sortScreen({
                    screeningEvents: result
                });
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
     * 施設コンテンツsortNumberでのソート
     */
    public async sortScreeningEventSeries(params: {
        screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
        superEvent: {
            ids?: string[];
            locationBranchCodes?: string[];
            workPerformedIdentifiers?: string[];
        };
    }) {
        const workPerformedIdentifiers: string[] = [];
        const screeningEvents = params.screeningEvents;
        screeningEvents.forEach(s => {
            if (s.workPerformed?.identifier === undefined
                || workPerformedIdentifiers.find(id => id === s.workPerformed?.identifier) !== undefined) {
                return;
            }
            workPerformedIdentifiers.push(s.workPerformed.identifier);
        });
        const limit = 100;
        let page = 1;
        let roop = true;
        let result: factory.chevre.event.screeningEventSeries.IEvent[] = [];
        await this.cinerinoService.getServices();
        while (roop) {
            const searchResult = await this.cinerinoService.event.search({
                page,
                limit,
                typeOf: factory.chevre.eventType.ScreeningEventSeries,
                location: {
                    branchCodes: params.superEvent.locationBranchCodes
                },
                workPerformed: {
                    identifiers: workPerformedIdentifiers
                }
            });
            result = [...result, ...searchResult.data];
            page++;
            roop = searchResult.data.length === limit;
            if (roop) {
                await Functions.Util.sleep();
            }
        }
        const sortResult = screeningEvents.sort((a, b) => {
            const KEY_NAME = 'sortNumber';
            const sortNumberA = result
                .find(s => s.id === a.superEvent.id)?.additionalProperty
                ?.find(p => p.name === KEY_NAME)?.value;
            const sortNumberB = result
                .find(s => s.id === b.superEvent.id)?.additionalProperty
                ?.find(p => p.name === KEY_NAME)?.value;
            if (sortNumberA === undefined) {
                return 1;
            }
            if (sortNumberB === undefined) {
                return -1;
            }
            if (Number(sortNumberA) > Number(sortNumberB)) { return -1; }
            if (Number(sortNumberA) < Number(sortNumberB)) { return 1; }
            return 0;
        });
        return sortResult;
    }

    /**
     * スクリーンsortNumberでのソート
     */
    public async sortScreen(params: {
        screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
    }) {
        const workPerformedIdentifiers: string[] = [];
        const screeningEvents = params.screeningEvents;
        screeningEvents.forEach(s => {
            if (s.workPerformed?.identifier === undefined
                || workPerformedIdentifiers.find(id => id === s.workPerformed?.identifier) !== undefined) {
                return;
            }
            workPerformedIdentifiers.push(s.workPerformed.identifier);
        });
        const limit = 100;
        let page = 1;
        let roop = true;
        let result: factory.chevre.place.screeningRoom.IPlace[] = [];
        await this.cinerinoService.getServices();
        while (roop) {
            const searchResult = await this.cinerinoService.place.searchScreeningRooms({
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
        const sortResult = screeningEvents.sort((a, b) => {
            const KEY_NAME = 'sortNumber';
            const sortNumberA = result
                .find(s => s.id === a.superEvent.id)?.additionalProperty
                ?.find(p => p.name === KEY_NAME)?.value;
            const sortNumberB = result
                .find(s => s.id === b.superEvent.id)?.additionalProperty
                ?.find(p => p.name === KEY_NAME)?.value;
            if (sortNumberA === undefined) {
                return 1;
            }
            if (sortNumberB === undefined) {
                return -1;
            }
            if (Number(sortNumberA) > Number(sortNumberB)) { return -1; }
            if (Number(sortNumberA) < Number(sortNumberB)) { return 1; }
            return 0;
        });
        return sortResult;
    }

    /**
     * プロジェクト一覧取得
     */
    public async getProjects() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(masterAction.getProjects());
            const success = this.actions.pipe(
                ofType(masterAction.getProjectsSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(masterAction.getProjectsFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }
}
