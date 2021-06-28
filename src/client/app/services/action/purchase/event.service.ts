import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../..';
import { purchaseAction } from '../../../store/actions';
import * as reducers from '../../../store/reducers';
import { CinerinoService } from '../../cinerino.service';
import { UtilService } from '../../util.service';
import { ActionStoreService } from '../store.service';

@Injectable({
    providedIn: 'root',
})
export class ActionEventService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService,
        private storeService: ActionStoreService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * イベント取得
     */
    public async getScreeningEvent(params: { id: string }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetScreeningEvent',
            });
            const { id } = params;
            await this.cinerinoService.getServices();
            const screeningEvent =
                await this.cinerinoService.event.findById<factory.chevre.eventType.ScreeningEvent>(
                    { id }
                );
            const workPerformed = (
                await this.cinerinoService.creativeWork.searchMovies({
                    identifier:
                        screeningEvent.workPerformed === undefined
                            ? undefined
                            : screeningEvent.workPerformed.identifier,
                })
            ).data[0];
            if (
                workPerformed !== undefined &&
                screeningEvent.workPerformed !== undefined
            ) {
                screeningEvent.workPerformed.additionalProperty =
                    workPerformed.additionalProperty;
            }
            this.store.dispatch(
                purchaseAction.setScreeningEvent({ screeningEvent })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 先行販売日取得
     */
    public async getPreScheduleDates() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetPreScheduleDates',
            });
            const external = Functions.Util.getExternalData();
            const { theater } = await this.storeService.getPurchaseData();
            if (
                theater === undefined ||
                theater.offers === undefined ||
                theater.offers.availabilityStartsGraceTime === undefined ||
                theater.offers.availabilityStartsGraceTime.value ===
                    undefined ||
                theater.offers.availabilityStartsGraceTime.unitCode ===
                    undefined ||
                theater.offers.availabilityStartsGraceTime.unitCode ===
                    undefined
            ) {
                this.utilService.loadEnd();
                return [];
            }
            const { value, unitCode } =
                theater.offers.availabilityStartsGraceTime;
            const availabilityStartsGraceTime: {
                value: number;
                unit: 'day' | 'year' | 'second';
            } = {
                value: value * -1 + 1,
                unit:
                    unitCode === factory.chevre.unitCode.Day
                        ? 'day'
                        : unitCode === factory.chevre.unitCode.Ann
                        ? 'year'
                        : unitCode === factory.chevre.unitCode.Sec
                        ? 'second'
                        : 'second',
            };
            const superEvent = {
                ids:
                    external.superEventId === undefined
                        ? []
                        : [external.superEventId],
                locationBranchCodes:
                    theater.branchCode === undefined
                        ? []
                        : [theater.branchCode],
                workPerformedIdentifiers:
                    external.workPerformedId === undefined
                        ? []
                        : [external.workPerformedId],
            };
            await this.cinerinoService.getServices();
            const now = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            const today = moment(moment().format('YYYYMMDD')).toDate();
            const limit = 100;
            let page = 1;
            let roop = true;
            let screeningEvents: factory.chevre.event.screeningEvent.IEvent[] =
                [];
            while (roop) {
                const searchResult = await this.cinerinoService.event.search({
                    page,
                    limit,
                    typeOf: factory.chevre.eventType.ScreeningEvent,
                    eventStatuses: [
                        factory.chevre.eventStatusType.EventScheduled,
                    ],
                    superEvent: superEvent,
                    startFrom: moment(today, 'YYYYMMDD')
                        .add(
                            availabilityStartsGraceTime.value,
                            availabilityStartsGraceTime.unit
                        )
                        .toDate(),
                    offers: {
                        validFrom: now,
                        validThrough: now,
                        availableFrom: now,
                        availableThrough: now,
                    },
                });
                screeningEvents = screeningEvents.concat(searchResult.data);
                page++;
                roop = searchResult.data.length === limit;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            const sheduleDates: string[] = [];
            screeningEvents.forEach((screeningEvent) => {
                const date = moment(screeningEvent.startDate).format(
                    'YYYYMMDD'
                );
                const findResult = sheduleDates.find((s) => s === date);
                if (findResult === undefined) {
                    sheduleDates.push(date);
                }
            });
            this.utilService.loadEnd();
            return sheduleDates;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 空席情報取得
     */
    public async getScreeningEventSeats() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetScreeningEventSeats',
            });
            const { screeningEvent } =
                await this.storeService.getPurchaseData();
            if (screeningEvent === undefined) {
                throw new Error('purchase.screeningEvent === undefined');
            }
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.place.seat.IPlaceWithOffer[] = [];
            if (
                !new Models.Purchase.Performance({
                    screeningEvent,
                }).isTicketedSeat()
            ) {
                this.utilService.loadEnd();
                return result;
            }
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.event.searchSeats({
                        event: { id: screeningEvent.id },
                        page,
                        limit,
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
     * チケットオファー検索
     */
    public async searchTicketOffers() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.SearchTicketOffers',
            });
            const { screeningEvent, seller } =
                await this.storeService.getPurchaseData();
            const clientId = this.cinerinoService.auth.options.clientId;
            if (
                screeningEvent === undefined ||
                seller === undefined ||
                seller.id === undefined ||
                clientId === undefined
            ) {
                throw new Error(
                    'screeningEvent or seller or clientId undefined'
                );
            }
            await this.cinerinoService.getServices();
            const ticketOffers =
                await this.cinerinoService.event.searchTicketOffers({
                    event: { id: screeningEvent.id },
                    seller: {
                        typeOf: seller.typeOf,
                        id: seller.id,
                    },
                    store: {
                        id: clientId,
                    },
                });
            this.store.dispatch(
                purchaseAction.setTicketOffers({
                    ticketOffers,
                })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
