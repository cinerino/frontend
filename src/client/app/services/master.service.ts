import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Functions } from '..';
import { masterAction } from '../store/actions';
import * as reducers from '../store/reducers';
import { CinerinoService } from './cinerino.service';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root',
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
            this.master
                .subscribe((master) => {
                    resolve(master);
                })
                .unsubscribe();
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
    public async searchSellers(params?: factory.seller.ISearchConditions) {
        try {
            this.utilService.loadStart({
                process: 'masterAction.SearchSellers',
            });
            await this.cinerinoService.getServices();
            const searchResult = await this.cinerinoService.seller.search(
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
     * 劇場一覧取得
     */
    public async searchMovieTheaters(
        params?: factory.chevre.place.movieTheater.ISearchConditions
    ) {
        try {
            this.utilService.loadStart({
                process: 'masterAction.SearchMovieTheaters',
            });
            await this.cinerinoService.getServices();
            const searchResult =
                await this.cinerinoService.place.searchMovieTheaters(
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
     * スケジュール一覧取得
     */
    public async searchScreeningEvent(params: {
        superEvent: {
            ids?: string[];
            locationBranchCodes?: string[];
            workPerformedIdentifiers?: string[];
        };
        startFrom: Date;
        startThrough: Date;
        pageing?: boolean;
        screeningEventSeries?: factory.chevre.event.screeningEventSeries.IEvent[];
        screeningRooms?: factory.chevre.place.screeningRoom.IPlace[];
    }) {
        try {
            const {
                superEvent,
                startFrom,
                startThrough,
                screeningEventSeries,
                screeningRooms,
                // creativeWorks
            } = params;
            const pageing =
                params.pageing === undefined ? true : params.pageing;
            this.utilService.loadStart({
                process: 'masterAction.SearchScreeningEvent',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.event.screeningEvent.IEvent[] = [];
            await this.cinerinoService.getServices();
            const now = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            const today = moment(
                moment(now).format('YYYYMMDD'),
                'YYYYMMDD'
            ).toDate();
            while (roop) {
                const searchResult = await this.cinerinoService.event.search({
                    page,
                    limit,
                    typeOf: factory.chevre.eventType.ScreeningEvent,
                    eventStatuses: [
                        factory.chevre.eventStatusType.EventScheduled,
                    ],
                    superEvent,
                    startFrom,
                    startThrough,
                    offers: {
                        availableFrom: today,
                        availableThrough: moment(today)
                            .add(1, 'day')
                            .add(-1, 'millisecond')
                            .toDate(),
                    },
                });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit && pageing;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            result = result.filter((r) => {
                return (
                    r.offers !== undefined &&
                    moment(r.offers.availabilityStarts).toDate() < now
                );
            });
            if (screeningEventSeries !== undefined) {
                result = result.sort((a, b) => {
                    const KEY_NAME = 'sortNumber';
                    const sortNumberA = screeningEventSeries
                        .find((s) => s.id === a.superEvent.id)
                        ?.additionalProperty?.find(
                            (p) => p.name === KEY_NAME
                        )?.value;
                    const sortNumberB = screeningEventSeries
                        .find((s) => s.id === b.superEvent.id)
                        ?.additionalProperty?.find(
                            (p) => p.name === KEY_NAME
                        )?.value;
                    if (sortNumberA === undefined) {
                        return 1;
                    }
                    if (sortNumberB === undefined) {
                        return -1;
                    }
                    if (Number(sortNumberA) > Number(sortNumberB)) {
                        return -1;
                    }
                    if (Number(sortNumberA) < Number(sortNumberB)) {
                        return 1;
                    }
                    return 0;
                });
            } else if (screeningRooms !== undefined) {
                result = result.sort((a, b) => {
                    const KEY_NAME = 'sortNumber';
                    const sortNumberA = screeningRooms
                        .find((s) => s.id === a.superEvent.id)
                        ?.additionalProperty?.find(
                            (p) => p.name === KEY_NAME
                        )?.value;
                    const sortNumberB = screeningRooms
                        .find((s) => s.id === b.superEvent.id)
                        ?.additionalProperty?.find(
                            (p) => p.name === KEY_NAME
                        )?.value;
                    if (sortNumberA === undefined) {
                        return 1;
                    }
                    if (sortNumberB === undefined) {
                        return -1;
                    }
                    if (Number(sortNumberA) > Number(sortNumberB)) {
                        return -1;
                    }
                    if (Number(sortNumberA) < Number(sortNumberB)) {
                        return 1;
                    }
                    return 0;
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
     * 作品一覧検索
     */
    public async searchMovies(params: {
        identifier?:
            | string
            | {
                  $eq?: string;
              };
        name?: string;
        datePublishedFrom?: Date;
        datePublishedThrough?: Date;
        offers?: {
            availableFrom?: Date;
            availableThrough?: Date;
        };
    }) {
        try {
            this.utilService.loadStart({
                process: 'masterAction.SearchMovies',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.creativeWork.movie.ICreativeWork[] = [];
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.creativeWork.searchMovies({
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
            const sortResult = result.sort((a, b) => {
                const KEY_NAME = 'sortNumber';
                const sortNumberA = result
                    .find((s) => s.id === a.id)
                    ?.additionalProperty?.find(
                        (p) => p.name === KEY_NAME
                    )?.value;
                const sortNumberB = result
                    .find((s) => s.id === b.id)
                    ?.additionalProperty?.find(
                        (p) => p.name === KEY_NAME
                    )?.value;
                if (sortNumberA === undefined) {
                    return 1;
                }
                if (sortNumberB === undefined) {
                    return -1;
                }
                if (Number(sortNumberA) > Number(sortNumberB)) {
                    return -1;
                }
                if (Number(sortNumberA) < Number(sortNumberB)) {
                    return 1;
                }
                return 0;
            });
            this.utilService.loadEnd();
            return sortResult;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 施設コンテンツ検索
     */
    public async searchScreeningEventSeries(params: {
        location?: {
            branchCode?: {
                $eq?: string;
            };
            branchCodes?: string[];
        };
        workPerformed: {
            identifiers: string[];
        };
    }) {
        try {
            this.utilService.loadStart({
                process: 'masterAction.SearchScreeningEventSeries',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.event.screeningEventSeries.IEvent[] = [];
            const workPerformedIdentifiers: string[][] = [];
            const splitNumber = 50;
            let splitCount = 0;
            params.workPerformed.identifiers.forEach((identifier, index) => {
                if (workPerformedIdentifiers[splitCount] === undefined) {
                    workPerformedIdentifiers[splitCount] = <string[]>[];
                }
                workPerformedIdentifiers[splitCount].push(identifier);
                index++;
                if (index % splitNumber === 0) {
                    splitCount++;
                }
            });
            await this.cinerinoService.getServices();
            if (workPerformedIdentifiers.length === 0) {
                while (roop) {
                    const searchResult =
                        await this.cinerinoService.event.search({
                            ...params,
                            page,
                            limit,
                            typeOf: factory.chevre.eventType
                                .ScreeningEventSeries,
                        });
                    result = [...result, ...searchResult.data];
                    page++;
                    roop = searchResult.data.length === limit;
                    if (roop) {
                        await Functions.Util.sleep();
                    }
                }
            } else {
                for (let i = 0; i < workPerformedIdentifiers.length; i++) {
                    page = 1;
                    roop = true;
                    while (roop) {
                        const searchResult =
                            await this.cinerinoService.event.search({
                                ...params,
                                workPerformed: {
                                    identifiers: workPerformedIdentifiers[i],
                                },
                                page,
                                limit,
                                typeOf: factory.chevre.eventType
                                    .ScreeningEventSeries,
                            });
                        result = [...result, ...searchResult.data];
                        page++;
                        roop = searchResult.data.length === limit;
                        if (roop) {
                            await Functions.Util.sleep();
                        }
                    }
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
     * スクリーン検索
     */
    public async searchScreeningRooms(params: {
        branchCode?: {
            $eq?: string;
        };
        containedInPlace?: {
            branchCode?: {
                $eq?: string;
            };
        };
    }) {
        try {
            this.utilService.loadStart({
                process: 'masterAction.SearchScreeningRooms',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.place.screeningRoom.IPlace[] = [];
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.place.searchScreeningRooms({
                        ...params,
                        page,
                        limit,
                    });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit;
                await Functions.Util.sleep();
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
     * プロジェクト一覧取得
     */
    public async getProjects() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(masterAction.getProjects());
            const success = this.actions.pipe(
                ofType(masterAction.getProjectsSuccess.type),
                tap(() => {
                    resolve();
                })
            );
            const fail = this.actions.pipe(
                ofType(masterAction.getProjectsFail.type),
                tap(() => {
                    this.error
                        .subscribe((error) => {
                            reject(error);
                        })
                        .unsubscribe();
                })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 区分情報取得
     */
    public async searchCategoryCode(params: {
        categorySetIdentifier: factory.chevre.categoryCode.CategorySetIdentifier;
    }) {
        try {
            this.utilService.loadStart({
                process: 'masterAction.SearchCategoryCode',
            });
            const { categorySetIdentifier } = params;
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.categoryCode.ICategoryCode[] = [];
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.categoryCode.search({
                        limit,
                        page,
                        inCodeSet: {
                            identifier: {
                                $eq: categorySetIdentifier,
                            },
                        },
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
}
