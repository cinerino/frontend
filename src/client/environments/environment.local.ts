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
    PURCHASE_CART_MAX_LENGTH: '1',
    VIEW_TYPE: ViewType.Cinema,
    ANALYTICS_ID: '',
    TRANSACTION_TIME: '120',
    PRE_SCHEDULE_DATE: '3',
    STORAGE_NAME: 'CINERINO-FRONTEND-STATE',
    STORAGE_TYPE: 'sessionStorage',
    BASE_URL: '/purchase/root',
    HEADER_MENU: true,
    ROUTE_SCOPE: ['purchase', 'inquiry', 'order', 'mypage', 'setting', 'auth'],
    SCHEDULE_STATUS_THRESHOLD: { value: '30', unit: '%' },
    INQUIRY_CANCEL: true,
    INQUIRY_QRCODE: true,
    INQUIRY_PRINT: true
};
