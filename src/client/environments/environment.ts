/**
 * 環境変数
 */
export const environment: {
    production: boolean;
    APP_TITLE: string;
    APP_PREFIX: string;
    PROJECT_ID: string;
    ENV: string;
    ENTRANCE_SERVER_URL: string;
    WAITER_SERVER_URL: string;
    VIEW_TYPE: string;
    GTM_ID: string;
    ANALYTICS_ID: string;
    STORAGE_NAME: string;
    STORAGE_TYPE: string;
    BASE_URL: string;
    LANGUAGE: string[];
    PORTAL_SITE_URL: string;
    DISPLAY_TICKETED_SEAT: true,
    HEADER_MENU: true,
    HEADER_MENU_SCOPE: string[];
    FOOTER_COMPANY_URL: string;
    FOOTER_LAW_URL: string;
    FOOTER_PRIVACY_POLICY_URL: string;
    PURCHASE_REQUIRED_ALERT: boolean;
    PURCHASE_CART_MAX_LENGTH: string;
    PURCHASE_TRANSACTION_TIME: string;
    PURCHASE_PRE_SCHEDULE_DATE: string;
    PURCHASE_SCHEDULE_DISPLAY_LENGTH: string;
    PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE: string;
    PURCHASE_SCHEDULE_STATUS_WINDOW_TIME_MINUTES: string;
    PURCHASE_SCHEDULE_STATUS_THRESHOLD_VALUE: string;
    PURCHASE_SCHEDULE_STATUS_THRESHOLD_UNIT: string;
    PURCHASE_COMPLETE_MAIL_CUSTOM: boolean;
    INQUIRY_CANCEL: boolean;
    INQUIRY_QRCODE: boolean;
    INQUIRY_PRINT: boolean;
    PRINT_QR_CODE_TYPE: string;
} = (<any>window).environment;
