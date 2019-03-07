import { ViewType } from '../app/models';

/**
 * 環境変数local
 */
export const environment = {
    production: false,

    APP_PREFIX: 'CI',
    PROJECT_ID: 'cinerino',
    ENV: 'local',

    ENTRANCE_SERVER_URL: '',
    WAITER_SERVER_URL: 'https://waiter-development.appspot.com',

    LIMITED_PURCHASE_COUNT: '1',

    VIEW_TYPE: ViewType.Cinema,

    ANALYTICS_ID: '',

    TRANSACTION_TIME: '120',
    PRE_SCHEDULE_DATE: '3',

    STORAGE_NAME: 'CINERINO-FRONTEND-STATE',

    BASE_URL: '/purchase/root'

};
