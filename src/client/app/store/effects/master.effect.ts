import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as moment from 'moment';
import { map, mergeMap } from 'rxjs/operators';
import { sleep } from '../../functions';
import { CinerinoService, UtilService } from '../../services';
import { masterAction } from '../actions';

/**
 * Master Effects
 */
@Injectable()
export class MasterEffects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService,
        private utilService: UtilService
    ) { }

    /**
     * GetSellers
     */
    @Effect()
    public getSellers = this.actions.pipe(
        ofType<masterAction.GetSellers>(masterAction.ActionTypes.GetSellers),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const searchMovieSellersResult =
                    await this.cinerino.seller.search((payload === undefined) ? {} : payload);
                const sellers = searchMovieSellersResult.data
                    .filter(s => (s.location !== undefined && s.location.branchCode !== undefined));
                return new masterAction.GetSellersSuccess({ sellers });
            } catch (error) {
                return new masterAction.GetSellersFail({ error: error });
            }
        })
    );

    /**
     * getTheaters
     */
    @Effect()
    public getTheaters = this.actions.pipe(
        ofType<masterAction.GetTheaters>(masterAction.ActionTypes.GetTheaters),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const searchResult = await this.cinerino.place.searchMovieTheaters((payload === undefined) ? {} : payload);
                return new masterAction.GetTheatersSuccess({ theaters: searchResult.data });
            } catch (error) {
                return new masterAction.GetTheatersFail({ error: error });
            }
        })
    );

    /**
     * GetSchedule
     */
    @Effect()
    public getSchedule = this.actions.pipe(
        ofType<masterAction.GetSchedule>(masterAction.ActionTypes.GetSchedule),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const now = moment((await this.utilService.getServerTime()).date).toDate();
                const limit = 100;
                let page = 1;
                let roop = true;
                let screeningEvents: factory.chevre.event.screeningEvent.IEvent[] = [];
                while (roop) {
                    const searchResult = await this.cinerino.event.search({
                        page,
                        limit,
                        typeOf: factory.chevre.eventType.ScreeningEvent,
                        eventStatuses: [factory.chevre.eventStatusType.EventScheduled],
                        superEvent: payload.superEvent,
                        startFrom: payload.startFrom,
                        startThrough: payload.startThrough,
                        offers: {
                            availableFrom: now,
                            availableThrough: now
                        }
                    });
                    screeningEvents = screeningEvents.concat(searchResult.data);
                    page++;
                    roop = searchResult.data.length > 0;
                    await sleep(500);
                }
                const scheduleDate = moment(payload.startFrom).format('YYYY-MM-DD');
                // 公開日順（降順）へソート
                screeningEvents = screeningEvents.sort((a, b) => {
                    if (a.workPerformed === undefined
                        || b.workPerformed === undefined
                        || a.workPerformed.datePublished === undefined
                        || b.workPerformed.datePublished === undefined) {
                        return 0;
                    }
                    const unixA = moment(a.workPerformed.datePublished).unix();
                    const unixB = moment(b.workPerformed.datePublished).unix();
                    if (unixA > unixB) { return -1; }
                    if (unixA < unixB) { return 1; }
                    return 0;
                });

                return new masterAction.GetScheduleSuccess({ screeningEvents, scheduleDate });
            } catch (error) {
                return new masterAction.GetScheduleFail({ error: error });
            }
        })
    );
}
