import {
    BaseComponent,
    PurchaseBaseComponent,
    PurchaseCinemaCartComponent,
    PurchaseCinemaScheduleComponent,
    PurchaseCinemaSeatComponent,
    PurchaseCinemaTicketComponent,
    PurchaseCompleteComponent,
    PurchaseConfirmComponent,
    PurchaseEventScheduleComponent,
    PurchaseEventTicketComponent,
    PurchaseInputComponent,
    PurchaseRootComponent,
    PurchaseTransactionComponent
} from '../components/pages';


/**
 * 購入ルーティング
 */
export const route = {
    path: 'purchase',
    component: PurchaseBaseComponent,
    children: [
        {
            path: 'cinema',
            children: [
                { path: 'seat', component: PurchaseCinemaSeatComponent },
                { path: 'ticket', component: PurchaseCinemaTicketComponent },
                { path: 'cart', component: PurchaseCinemaCartComponent }
            ]
        },
        {
            path: 'event',
            children: [
                { path: 'ticket', component: PurchaseEventTicketComponent }
            ]
        },
        { path: 'input', component: PurchaseInputComponent },
        { path: 'confirm', component: PurchaseConfirmComponent },
        { path: 'complete', component: PurchaseCompleteComponent }
    ]
};

/**
 * 購入スケジュールルーティング
 */
export const schedule = {
    path: 'purchase',
    component: BaseComponent,
    children: [
        { path: 'root', component: PurchaseRootComponent },
        { path: 'transaction/:eventId', component: PurchaseTransactionComponent },
        {
            path: 'cinema',
            children: [
                { path: 'schedule', component: PurchaseCinemaScheduleComponent }
            ]
        },
        {
            path: 'event',
            children: [
                { path: 'schedule', component: PurchaseEventScheduleComponent }
            ]
        }
    ]
};
