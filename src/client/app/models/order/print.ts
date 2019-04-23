/**
 * QRコード文字列
 */
export enum PrintQrCodeType {
    token = 'token',
    encryption = 'encryption'
}

/**
 * 券面印刷データ
 */
export interface ITicketPrintData {
    size: {
        width: number;
        height: number;
    };
    font: string;
    text: {
        name?: 'sellerNameJa'
        | 'sellerNameEn'
        | 'eventNameJa'
        | 'eventNameEn'
        | 'screenNameJa'
        | 'screenNameEn'
        | 'startDate'
        | 'endDate'
        | 'seatNumber'
        | 'ticketNameJa'
        | 'ticketNameEn'
        | 'price'
        | 'posName'
        | 'date'
        | 'confirmationNumber'
        | 'orderNumber'
        | 'ticketNumber';
        value?: string;
        fillStyle: string;
        font: { weight: 'normal' | 'bold'; size: string; family?: string; };
        textAlign: CanvasTextAlign;
        fillText: {
            x: number | 'center' | 'left' | 'right';
            y: number | 'center' | 'top' | 'bottom';
            maxWidth?: number;
        },
        slice?: number[];
    }[];
    image: {
        src: string;
        width: number;
        height: number;
        x: number;
        y: number;
    }[];
    qrCode: {
        width: number;
        height: number;
        x: number;
        y: number;
    }[];
}
