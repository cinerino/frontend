import { ViewType } from '../app/models';

/**
 * 環境変数dev
 */
export const environment = {
    production: false,

    APP_PREFIX: 'CI',
    PROJECT_ID: 'cinerino',
    ENV: 'development',

    ENTRANCE_SERVER_URL: '',
    WAITER_SERVER_URL: 'https://waiter-development.appspot.com',

    ANALYTICS_ID: '',

    LIMITED_PURCHASE_COUNT: '1',

    VIEW_TYPE: ViewType.Cinema,

    TRANSACTION_TIME: '30',
    PRE_SCHEDULE_DATE: '3',

    STORAGE_NAME: 'CINERINO-FRONTEND-STATE'

};
