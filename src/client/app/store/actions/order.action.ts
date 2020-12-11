import { factory } from '@cinerino/sdk';
import { createAction, props } from '@ngrx/store';
import { Models } from '../..';
const LABEL = '[Order]';

export const remove = createAction(
    `${LABEL} remove`,
);

export const cancel = createAction(
    `${LABEL} cancel`,
    props<{
        orders: factory.order.IOrder[];
        language: string;
        agent?: {
            identifier?: factory.person.IIdentifier;
        };
    }>()
);

export const cancelSuccess = createAction(
    `${LABEL} cancelSuccess`,
);

export const cancelFail = createAction(
    `${LABEL} cancelFail`,
    props<{ error: Error }>()
);

export const inquiry = createAction(
    `${LABEL} inquiry`,
    props<{
        theaterCode?: string;
        confirmationNumber: string;
        customer: {
            email?: string;
            telephone?: string;
        };
    }>()
);

export const inquirySuccess = createAction(
    `${LABEL} inquirySuccess`,
    props<{ order: factory.order.IOrder }>()
);

export const inquiryFail = createAction(
    `${LABEL} inquiryFail`,
    props<{ error: Error }>()
);

export const print = createAction(
    `${LABEL} print`,
    props<{
        orders: factory.order.IOrder[];
        printer: Models.Common.Printer.IPrinter;
        pos?: factory.chevre.place.movieTheater.IPOS;
        timeout?: number;
    }>()
);

export const printSuccess = createAction(
    `${LABEL} printSuccess`,
);

export const printFail = createAction(
    `${LABEL} printFail`,
    props<{ error: Error }>()
);

