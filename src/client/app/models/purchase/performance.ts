import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { getEnvironment } from '../../../environments/environment';

/**
 * Performance
 */
export class Performance {
    public screeningEvent: factory.chevre.event.screeningEvent.IEvent;

    constructor(screeningEvent: factory.chevre.event.screeningEvent.IEvent) {
        this.screeningEvent = screeningEvent;
    }

    /**
     * 販売判定
     */
    public isSales(params?: {
        status?: 'start' | 'end';
        criteria?: Date;
    }) {
        const screeningEvent = this.screeningEvent;
        const offers = screeningEvent.offers;
        if (offers === undefined) {
            return false;
        }
        let result = false;
        const status = params?.status;
        const criteria = (params === undefined || params.criteria === undefined)
            ? moment().unix() : moment(params.criteria).unix();
        switch (status) {
            case 'start':
                result = !(moment(offers.validFrom).unix() < criteria);
                break;
            case 'end':
                result = !(moment(offers.validThrough).unix() > criteria);
                break;
            default:
                result = (moment(offers.validFrom).unix() < criteria
                    && moment(offers.validThrough).unix() > criteria);
                break;
        }
        return result;
    }

    /**
     * 座席ステータス判定
     */
    public isSeatStatus(status?: 'success' | 'warning' | 'danger') {
        const screeningEvent = this.screeningEvent;
        const environment = getEnvironment();
        const limitSeatNumber = (screeningEvent.workPerformed === undefined
            || screeningEvent.workPerformed.additionalProperty === undefined)
            ? undefined : screeningEvent.workPerformed.additionalProperty.find(a => a.name === 'limitSeatNumber');
        let remainingAttendeeCapacity = screeningEvent.remainingAttendeeCapacity;
        let maximumAttendeeCapacity = screeningEvent.maximumAttendeeCapacity;
        if (remainingAttendeeCapacity === undefined || maximumAttendeeCapacity === undefined) {
            return status === undefined;
        }
        if (limitSeatNumber !== undefined && maximumAttendeeCapacity > Number(limitSeatNumber.value)) {
            // 作品追加特性（limitSeatNumber）で座席数制御
            remainingAttendeeCapacity = (remainingAttendeeCapacity < (maximumAttendeeCapacity - Number(limitSeatNumber.value)))
                ? 0 : remainingAttendeeCapacity - (maximumAttendeeCapacity - Number(limitSeatNumber.value));
            maximumAttendeeCapacity = Number(limitSeatNumber.value);
        }
        let result = false;
        const unit = environment.PURCHASE_SCHEDULE_STATUS_THRESHOLD_UNIT;
        const value = Number(environment.PURCHASE_SCHEDULE_STATUS_THRESHOLD_VALUE);
        if (unit === '%') {
            // 割合指定
            switch (status) {
                case 'success':
                    result = (remainingAttendeeCapacity !== 0
                        && Math.floor(remainingAttendeeCapacity / maximumAttendeeCapacity * 100) >= value);
                    break;
                case 'warning':
                    result = (remainingAttendeeCapacity !== 0
                        && Math.floor(remainingAttendeeCapacity / maximumAttendeeCapacity * 100) < value
                        && remainingAttendeeCapacity > 0);
                    break;
                case 'danger':
                    result = (remainingAttendeeCapacity === 0 || remainingAttendeeCapacity > maximumAttendeeCapacity);
                    break;
                default:
                    break;
            }
            return result;
        } else if (unit === 'count') {
            // 数指定
            switch (status) {
                case 'success':
                    result = (remainingAttendeeCapacity !== 0
                        && remainingAttendeeCapacity >= value);
                    break;
                case 'warning':
                    result = (remainingAttendeeCapacity !== 0
                        && remainingAttendeeCapacity < value
                        && remainingAttendeeCapacity > 0);
                    break;
                case 'danger':
                    result = remainingAttendeeCapacity === 0;
                    break;
                default:
                    break;
            }
            return result;
        } else {
            return false;
        }
    }

    /**
     * 座席あり判定
     */
    public isTicketedSeat() {
        const screeningEvent = this.screeningEvent;
        return (screeningEvent.offers !== undefined
            && screeningEvent.offers.itemOffered.serviceOutput !== undefined
            && screeningEvent.offers.itemOffered.serviceOutput.reservedTicket !== undefined
            && screeningEvent.offers.itemOffered.serviceOutput.reservedTicket.ticketedSeat !== undefined);
    }

    /**
     * 在庫無限判定
     */
    public isInfinitetock() {
        const screeningEvent = this.screeningEvent;
        return (screeningEvent.maximumAttendeeCapacity === undefined);
    }
}
