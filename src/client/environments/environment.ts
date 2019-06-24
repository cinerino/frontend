/**
 * 環境変数
 */
interface IEnvironment {
    /**
     * 本番判定
     */
    production: boolean;
    /**
     * アプリケーションタイトル
     */
    APP_TITLE: string;
    /**
     * アプリケーションプレフィックス
     */
    APP_PREFIX: string;
    /**
     * プロジェクトID
     */
    PROJECT_ID: string;
    /**
     * 入り口URL（非推奨）
     */
    ENTRANCE_SERVER_URL: string;
    /**
     * 表示タイプ
     */
    VIEW_TYPE: string;
    /**
     * タグマネージャーID
     */
    GTM_ID: string;
    /**
     * アナリティクスID
     */
    ANALYTICS_ID: string;
    /**
     * ストレージの名前
     */
    STORAGE_NAME: string;
    /**
     * ストレージの種類
     */
    STORAGE_TYPE: string;
    /**
     * ベースURL
     */
    BASE_URL: string;
    /**
     * 対応言語
     */
    LANGUAGE: string[];
    /**
     * ポータルサイトURL
     */
    PORTAL_SITE_URL: string;
    /**
     * 座席表示
     */
    DISPLAY_TICKETED_SEAT: boolean;
    /**
     * ヘッダーメニュー表示
     */
    HEADER_MENU: boolean;
    /**
     * ヘッダーメニューの中身
     */
    HEADER_MENU_SCOPE: string[];
    /**
     * フッター会社概要URL
     */
    FOOTER_COMPANY_URL: string;
    /**
     * フッター特定商取引法に基づく表記URL
     */
    FOOTER_LAW_URL: string;
    /**
     * フッタープライバシーポリシーURL
     */
    FOOTER_PRIVACY_POLICY_URL: string;
    /**
     * カート機能有無
     */
    PURCHASE_CART: boolean;
    /**
     * 購入アイテム上限数
     */
    PURCHASE_ITEM_MAX_LENGTH: string;
    /**
     * 取引時間
     */
    PURCHASE_TRANSACTION_TIME: string;
    /**
     * 取引時間表示
     */
    PURCHASE_TRANSACTION_TIME_DISPLAY: boolean;
    /**
     * 先行販売期間指定
     */
    PURCHASE_PRE_SCHEDULE_DATE: string;
    /**
     * スケジュール表示期間
     */
    PURCHASE_SCHEDULE_DISPLAY_LENGTH: string;
    /**
     * スケジュール公開日
     */
    PURCHASE_SCHEDULE_OPEN_DATE: string;
    /**
     * スケジュール売止相対指定値
     * 当日24：00から相対的に指定
     */
    PURCHASE_SCHEDULE_SALES_DATE_VALUE: string;
    /**
     * スケジュール売止相対指定単位
     * 当日24：00から相対的に指定
     */
    PURCHASE_SCHEDULE_SALES_DATE_UNIT: 'year' | 'years' | 'y' |
    'month' | 'months' | 'M' |
    'week' | 'weeks' | 'w' |
    'day' | 'days' | 'd' |
    'hour' | 'hours' | 'h' |
    'minute' | 'minutes' | 'm' |
    'second' | 'seconds' | 's' |
    'millisecond' | 'milliseconds' | 'ms';
    /**
     * 売止時間(HHmmss)
     * 設定しない場合は空文字('')
     */
    PURCHASE_SCHEDULE_SALES_STOP_TIME: string;
    /**
     * スケジュール初期選択日（相対的）
     */
    PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE: string;
    /**
     * スケジュール窓口ステータス（相対的）
     */
    PURCHASE_SCHEDULE_STATUS_WINDOW_TIME_MINUTES: string;
    /**
     * スケジュールステータス閾値
     */
    PURCHASE_SCHEDULE_STATUS_THRESHOLD_VALUE: string;
    /**
     * スケジュールステータス閾値単位（%）
     */
    PURCHASE_SCHEDULE_STATUS_THRESHOLD_UNIT: string;
    /**
     * 購入完了メールカスタム
     */
    PURCHASE_COMPLETE_MAIL_CUSTOM: boolean;
    /**
     * 購入利用規約
     */
    PURCHASE_TERMS: boolean;
    /**
     * 購入注意事項
     */
    PURCHASE_WARNING: boolean;
    /**
     * 照会キャンセル
     */
    INQUIRY_CANCEL: boolean;
    /**
     * 照会QR
     */
    INQUIRY_QRCODE: boolean;
    /**
     * 照会印刷
     */
    INQUIRY_PRINT: boolean;
    /**
     * 照会印刷待機時間
     */
    INQUIRY_PRINT_WAIT_TIME: string;
    /**
     * 照会印刷完了待機時間
     */
    INQUIRY_PRINT_SUCCESS_WAIT_TIME: string;
    /**
     * 照会入力キーパッド
     */
    INQUIRY_INPUT_KEYPAD: boolean;
    /**
     * 印刷QRコードタイプ
     */
    PRINT_QRCODE_TYPE: string;
    /**
     * 印刷QRコードカスタム
     */
    PRINT_QRCODE_CUSTOM: string;
    /**
     * 印刷時ローディング
     */
    PRINT_LOADING: boolean;
    /**
     * 設定開発用オプション
     */
    SETTING_DEVELOP_OPTION: boolean;
}

const defaultEnvironment: IEnvironment = {
    production: false,
    APP_TITLE: '',
    APP_PREFIX: '',
    PROJECT_ID: '',
    ENTRANCE_SERVER_URL: '',
    VIEW_TYPE: 'cinema',
    GTM_ID: '',
    ANALYTICS_ID: '',
    STORAGE_NAME: '',
    STORAGE_TYPE: 'sessionStorage',
    BASE_URL: '/purchase/root',
    LANGUAGE: ['ja'],
    PORTAL_SITE_URL: '',
    DISPLAY_TICKETED_SEAT: false,
    HEADER_MENU: false,
    HEADER_MENU_SCOPE: [],
    FOOTER_COMPANY_URL: '',
    FOOTER_LAW_URL: '',
    FOOTER_PRIVACY_POLICY_URL: '',
    PURCHASE_CART: false,
    PURCHASE_ITEM_MAX_LENGTH: '50',
    PURCHASE_TRANSACTION_TIME: '15',
    PURCHASE_TRANSACTION_TIME_DISPLAY: false,
    PURCHASE_PRE_SCHEDULE_DATE: '3',
    PURCHASE_SCHEDULE_DISPLAY_LENGTH: '10',
    PURCHASE_SCHEDULE_OPEN_DATE: '2019-05-01',
    PURCHASE_SCHEDULE_SALES_DATE_VALUE: '0',
    PURCHASE_SCHEDULE_SALES_DATE_UNIT: 'hour',
    PURCHASE_SCHEDULE_SALES_STOP_TIME: '',
    PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE: '0',
    PURCHASE_SCHEDULE_STATUS_WINDOW_TIME_MINUTES: '-20',
    PURCHASE_SCHEDULE_STATUS_THRESHOLD_VALUE: '30',
    PURCHASE_SCHEDULE_STATUS_THRESHOLD_UNIT: '%',
    PURCHASE_COMPLETE_MAIL_CUSTOM: false,
    PURCHASE_TERMS: false,
    PURCHASE_WARNING: false,
    INQUIRY_CANCEL: false,
    INQUIRY_QRCODE: false,
    INQUIRY_PRINT: false,
    INQUIRY_PRINT_WAIT_TIME: '',
    INQUIRY_PRINT_SUCCESS_WAIT_TIME: '',
    INQUIRY_INPUT_KEYPAD: false,
    PRINT_QRCODE_TYPE: 'token',
    PRINT_QRCODE_CUSTOM: 'token',
    PRINT_LOADING: true,
    SETTING_DEVELOP_OPTION: false
};

export const environment: IEnvironment = Object.assign(defaultEnvironment, (<any>window).environment);
