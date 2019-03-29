import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as moment from 'moment';
import { map, mergeMap } from 'rxjs/operators';
import { CinerinoService } from '../../services/cinerino.service';
import { masterAction } from '../actions';

/**
 * Master Effects
 */
@Injectable()
export class MasterEffects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService
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
                const searchMovieSellersResult = await this.cinerino.seller.search(payload.params);
                const sellers = searchMovieSellersResult.data;
                return new masterAction.GetSellersSuccess({ sellers });
            } catch (error) {
                return new masterAction.GetSellersFail({ error: error });
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
                if (payload.seller.location === undefined) {
                    throw new Error('seller.location is undefined');
                }
                await this.cinerino.getServices();
                const branchCode = payload.seller.location.branchCode;
                const scheduleDate = payload.scheduleDate;
                const today = moment(moment().format('YYYY-MM-DD')).toDate();
                const limit = 100;
                let page = 1;
                let roop = true;
                let screeningEvents: factory.chevre.event.screeningEvent.IEvent[] = [];
                while (roop) {
                    const screeningEventsResult = await this.cinerino.event.searchScreeningEvents({
                        page,
                        limit,
                        typeOf: factory.chevre.eventType.ScreeningEvent,
                        eventStatuses: [factory.chevre.eventStatusType.EventScheduled],
                        superEvent: {
                            locationBranchCodes: (branchCode === undefined) ? [] : [branchCode]
                        },
                        startFrom: moment(scheduleDate).toDate(),
                        startThrough: moment(scheduleDate).add(1, 'day').toDate(),
                        offers: {
                            availableFrom: today,
                            availableThrough: today
                        }
                    });
                    screeningEvents = screeningEvents.concat(screeningEventsResult.data);
                    const lastPage = Math.ceil(screeningEventsResult.totalCount / limit);
                    page++;
                    roop = !(page > lastPage);
                }

                return new masterAction.GetScheduleSuccess({ screeningEvents, scheduleDate });
            } catch (error) {
                return new masterAction.GetScheduleFail({ error: error });
            }
        })
    );
}
