export interface ITicketPrintData {
    size: {
        width: number;
        height: number;
    };
    font: string;
    text: {
        name?: 'theaterName'
        | 'startDate'
        | 'eventName'
        | 'screenName'
        | 'seatNumber'
        | 'ticketName'
        | 'price'
        | 'posName'
        | 'date'
        | 'confirmationNumber';
        value?: string;
        fillStyle: string;
        font: { weight: 'normal' | 'bold'; size: string; family?: string; };
        textAlign: CanvasTextAlign;
        fillText: {
            x: number | 'center' | 'left' | 'right';
            y: number | 'center' | 'top' | 'bottom';
            maxWidth?: number;
        }
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
