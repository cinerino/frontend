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
    VIEW_TYPE: 'cinema',
    ANALYTICS_ID: '',
    STORAGE_NAME: 'CINERINO-FRONTEND-STATE',
    STORAGE_TYPE: 'sessionStorage',
    BASE_URL: '/purchase/root',
    HEADER_MENU: true,
    HEADER_MENU_SCOPE: ['purchase', 'inquiry', 'order', 'mypage', 'setting', 'auth'],
    PURCHASE_CART_MAX_LENGTH: '1',
    PURCHASE_TRANSACTION_TIME: '120',
    PURCHASE_PRE_SCHEDULE_DATE: '3',
    PURCHASE_SCHEDULE_STATUS_THRESHOLD_VALUE: '30',
    PURCHASE_SCHEDULE_STATUS_THRESHOLD_UNIT: '%',
    INQUIRY_CANCEL: true,
    INQUIRY_QRCODE: true,
    INQUIRY_PRINT: true
};
