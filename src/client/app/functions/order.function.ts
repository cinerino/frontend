import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import * as qrcode from 'qrcode';
import { ITicketPrintData } from '../models';
import { getTicketPrice } from './purchase.function';

/**
 * キャンバスへ描画
 */
async function drawCanvas(args: {
    printData: ITicketPrintData,
    data: {
        confirmationNumber: number;
        theaterName: string;
        screenName: string;
        eventName: string;
        startDate: string;
        seatNumber?: string;
        ticketName: string;
        price: number;
        qrcode: string;
        posName: string
    }
}) {
    console.log('printData', args.printData);
    const printData = args.printData;
    const data = args.data;
    const canvas = document.createElement('canvas');
    const size = printData.size;
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext('2d');
    if (context === null) {
        throw new Error('context is null');
    }
    const drawImage = (drawImageArgs: {
        image: HTMLImageElement;
        x: number;
        y: number;
        width: number;
        height: number;
    }) => {
        return new Promise((resolve) => {
            drawImageArgs.image.onload = () => {
                context.drawImage(drawImageArgs.image, drawImageArgs.x, drawImageArgs.y, drawImageArgs.width, drawImageArgs.height);
                resolve();
            };
        });
    };
    const changePosition = ((value: number | 'center' | 'left' | 'right' | 'top' | 'bottom') => {
        const position = [
            { key: 'center', value: canvas.width / 2 },
            { key: 'left', value: 0 },
            { key: 'right', value: canvas.width },
            { key: 'top', value: 0 },
            { key: 'bottom', value: canvas.height }
        ];
        const findResult = position.find((p) => p.key === value);
        if (findResult === undefined) {
            return (<number>value);
        }
        return findResult.value;
    });
    const font = `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "游ゴシック  Medium", meiryo, sans-serif`;
    // 画像描画
    for (const image of printData.image) {
        const imageInstance = new Image();
        imageInstance.src = image.src;
        await drawImage({
            image: imageInstance,
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height
        });
    }
    // テキスト描画
    for (const text of printData.text) {
        context.fillStyle = text.fillStyle;
        context.font = `${text.font.weight} ${text.font.size} ${(text.font.family === undefined) ? font : text.font.family}`;
        context.textAlign = text.textAlign;
        let value = '';
        if (text.name !== undefined) {
            switch (text.name) {
                case 'price':
                    value = `￥${data.price.toLocaleString()}`;
                    break;
                case 'confirmationNumber':
                    value = `購入番号 ${data.confirmationNumber}`;
                    break;
                case 'ticketName':
                    value = data.ticketName.slice(0, 8);
                    break;
                case 'posName':
                    value = `端末 ${data.posName}`;
                    break;
                case 'date':
                    value = `(${moment().format('YYYY/MM/DD HH:mm')} 発券)`;
                    break;
                case 'eventName':
                    const eventName = data.eventName;
                    const limit = Math.floor(size.width / parseInt(text.font.size, 10));
                    if (eventName.length > limit) {
                        context.fillText(
                            eventName.slice(0, limit),
                            changePosition(text.fillText.x),
                            changePosition(text.fillText.y),
                            text.fillText.maxWidth
                        );
                        context.fillText(
                            (eventName.length - limit < limit)
                                ? eventName.slice(limit, eventName.length)
                                : eventName.slice(limit, limit * 2),
                            changePosition(text.fillText.x),
                            changePosition(text.fillText.y) + 10 + parseInt(text.font.size, 10),
                            text.fillText.maxWidth
                        );
                    } else {
                        context.fillText(
                            eventName,
                            changePosition(text.fillText.x),
                            changePosition(text.fillText.y),
                            text.fillText.maxWidth
                        );
                    }
                    continue;
                case 'seatNumber':
                    value = (data.seatNumber === undefined) ? 'なし' : data.seatNumber;
                    break;
                default:
                    value = data[text.name];
            }
        } else if (text.value !== undefined) {
            value = text.value;
        } else {
            continue;
        }
        context.fillText(
            value,
            changePosition(text.fillText.x),
            changePosition(text.fillText.y),
            text.fillText.maxWidth
        );
    }

    // QR描画
    for (const qrCode of printData.qrCode) {
        const qrcodeCanvas = document.createElement('canvas');
        await qrcode.toCanvas(qrcodeCanvas, data.qrcode);
        context.drawImage(qrcodeCanvas, qrCode.x, qrCode.y, qrCode.width, qrCode.height);
    }

    return canvas;
}

/**
 * 印刷イメージ作成
 */
export async function createPrintCanvas(args: {
    printData: ITicketPrintData;
    acceptedOffer: factory.order.IAcceptedOffer<factory.order.IItemOffered>;
    order: factory.order.IOrder;
    pos?: factory.seller.IPOS;
    qrcode?: string;
}) {
    const acceptedOffer = args.acceptedOffer;
    if (acceptedOffer.itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
        throw new Error('reservationType is not EventReservation');
    }
    const data = {
        confirmationNumber: args.order.confirmationNumber,
        theaterName: acceptedOffer.itemOffered.reservationFor.superEvent.location.name.ja,
        screenName: acceptedOffer.itemOffered.reservationFor.location.name.ja,
        eventName: acceptedOffer.itemOffered.reservationFor.name.ja,
        startDate: moment(acceptedOffer.itemOffered.reservationFor.startDate).format('YY/MM/DD (ddd) HH:mm'),
        seatNumber: (acceptedOffer.itemOffered.reservedTicket.ticketedSeat === undefined)
            ? undefined : acceptedOffer.itemOffered.reservedTicket.ticketedSeat.seatNumber,
        ticketName: acceptedOffer.itemOffered.reservedTicket.ticketType.name.ja,
        price: getTicketPrice(acceptedOffer).single,
        qrcode: (args.qrcode === undefined)
            ? <string>acceptedOffer.itemOffered.reservedTicket.ticketToken
            : args.qrcode,
        posName: (args.pos === undefined) ? '' : args.pos.name
    };
    const printData = args.printData;
    const canvas = await drawCanvas({ data, printData });

    return canvas;
}

/**
 * テスト印刷用イメージ作成
 */
export async function createTestPrintCanvas(args: { printData: ITicketPrintData }) {
    const printData = args.printData;
    const data = {
        confirmationNumber: 12345678,
        theaterName: 'テスト劇場',
        screenName: 'テストスクリーン',
        eventName: 'テスト-----------------------------作品',
        startDate: moment().format('YY/MM/DD (ddd) HH:mm'),
        seatNumber: 'TEST-1',
        ticketName: 'テスト1234567890券種',
        price: 1000,
        qrcode: 'TEST',
        posName: 'POS-000'
    };
    const canvas = await drawCanvas({ printData, data });

    return canvas;
}
