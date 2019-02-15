import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as moment from 'moment';
import { map, mergeMap } from 'rxjs/operators';
import { CinerinoService } from '../../services/cinerino.service';
import * as master from '../actions/master.action';

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
     * GetTheaters
     */
    @Effect()
    public getTheaters = this.actions.pipe(
        ofType<master.GetTheaters>(master.ActionTypes.GetTheaters),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const searchMovieTheatersResult = await this.cinerino.seller.search(payload.params);
                const movieTheaters = searchMovieTheatersResult.data;
                return new master.GetTheatersSuccess({ movieTheaters });
            } catch (error) {
                return new master.GetTheatersFail({ error: error });
            }
        })
    );

    /**
     * GetSchedule
     */
    @Effect()
    public getSchedule = this.actions.pipe(
        ofType<master.GetSchedule>(master.ActionTypes.GetSchedule),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                if (payload.movieTheater.location === undefined) {
                    throw new Error('movieTheater.location is undefined');
                }
                await this.cinerino.getServices();
                const branchCode = payload.movieTheater.location.branchCode;
                const scheduleDate = payload.scheduleDate;
                const today = moment(moment().format('YYYY-MM-DD')).toDate();
                const screeningEventsResult = await this.cinerino.event.searchScreeningEvents({
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
                // TODO
                // branchCodeが重複しているため劇場名でフィルター
                const screeningEvents =
                    screeningEventsResult.data.filter(data => data.superEvent.location.name.ja === payload.movieTheater.name.ja);

                return new master.GetScheduleSuccess({ screeningEvents, scheduleDate });
            } catch (error) {
                return new master.GetScheduleFail({ error: error });
            }
        })
    );
}
