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
        sellerNameJa: string;
        sellerNameEn: string;
        eventNameJa: string;
        eventNameEn: string;
        screenNameJa: string;
        screenNameEn: string;
        startDate: string;
        endDate: string;
        seatNumber?: string;
        ticketNameJa: string;
        ticketNameEn: string;
        price: number;
        posName: string
        confirmationNumber: string;
        orderNumber: string;
        ticketNumber: string;
        qrcode?: string;
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
        return new Promise((resolve, reject) => {
            drawImageArgs.image.onload = () => {
                context.drawImage(drawImageArgs.image, drawImageArgs.x, drawImageArgs.y, drawImageArgs.width, drawImageArgs.height);
                resolve();
            };
            drawImageArgs.image.onerror = (error) => {
                console.error(error);
                reject(error);
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
        const response = await fetch('/api/storage', { method: 'get' });
        const json = await response.json();
        const imageInstance = new Image();
        imageInstance.crossOrigin = 'anonymous';
        imageInstance.src = image.src.replace('/storage', json.storage);
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
                case 'posName':
                    value = `端末 ${data.posName}`;
                    break;
                case 'date':
                    value = `(${moment().format('YYYY/MM/DD HH:mm')} 発券)`;
                    break;
                case 'startDate' || 'endDate':
                    value = `${moment(data[text.name]).format(text.value)}`;
                    break;
                case 'eventNameJa':
                case 'eventNameEn':
                    const eventName = data[text.name];
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
                            changePosition(text.fillText.y) + parseInt(text.font.size, 10) * 1.5,
                            text.fillText.maxWidth
                        );
                    } else {
                        context.fillText(
                            eventName,
                            changePosition(text.fillText.x),
                            changePosition(text.fillText.y) + parseInt(text.font.size, 10) * 0.75,
                            text.fillText.maxWidth
                        );
                    }
                    continue;
                case 'seatNumber':
                    value = (data.seatNumber === undefined) ? 'なし' : data.seatNumber;
                    break;
                default:
                    value = `${(text.value === undefined) ? '' : text.value}${data[text.name]}`;
            }
        } else if (text.value !== undefined) {
            value = text.value;
        } else {
            continue;
        }
        if (text.slice !== undefined) {
            // 文字制限
            value = value.slice(text.slice[0], text.slice[1]);
        }
        context.fillText(
            value,
            changePosition(text.fillText.x),
            changePosition(text.fillText.y),
            text.fillText.maxWidth
        );
    }

    // QR描画
    if (data.qrcode !== undefined) {
        for (const qrCode of printData.qrCode) {
            const qrcodeCanvas = document.createElement('canvas');
            await qrcode.toCanvas(qrcodeCanvas, data.qrcode);
            context.drawImage(qrcodeCanvas, qrCode.x, qrCode.y, qrCode.width, qrCode.height);
        }
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
        sellerNameJa: acceptedOffer.itemOffered.reservationFor.superEvent.location.name.ja,
        sellerNameEn: acceptedOffer.itemOffered.reservationFor.superEvent.location.name.en,
        eventNameJa: acceptedOffer.itemOffered.reservationFor.name.ja,
        eventNameEn: acceptedOffer.itemOffered.reservationFor.name.en,
        screenNameJa: acceptedOffer.itemOffered.reservationFor.location.name.ja,
        screenNameEn: acceptedOffer.itemOffered.reservationFor.location.name.en,
        startDate: moment(acceptedOffer.itemOffered.reservationFor.startDate).toISOString(),
        endDate: moment(acceptedOffer.itemOffered.reservationFor.endDate).toISOString(),
        seatNumber: (acceptedOffer.itemOffered.reservedTicket.ticketedSeat === undefined)
            ? undefined : acceptedOffer.itemOffered.reservedTicket.ticketedSeat.seatNumber,
        ticketNameJa: acceptedOffer.itemOffered.reservedTicket.ticketType.name.ja,
        ticketNameEn: acceptedOffer.itemOffered.reservedTicket.ticketType.name.en,
        price: getTicketPrice(acceptedOffer).single,
        posName: (args.pos === undefined) ? '' : args.pos.name,
        confirmationNumber: String(args.order.confirmationNumber),
        orderNumber: args.order.orderNumber,
        ticketNumber: acceptedOffer.itemOffered.id,
        qrcode: args.qrcode
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
        sellerNameJa: 'テスト劇場',
        sellerNameEn: 'test theater',
        eventNameJa: (Math.floor(Math.random() * 11) < 5)
            ? 'テストイベント'
            : 'テスト1テスト2テスト3テスト4テスト5テスト6テスト7テスト8テスト9テスト10イベント',
        eventNameEn: (Math.floor(Math.random() * 11) < 5)
            ? 'test event'
            : 'test1 test2 test3 test4 test5 test6 test7 event',
        screenNameJa: 'テストスクリーン',
        screenNameEn: 'test screen',
        startDate: moment().toISOString(),
        endDate: moment().toISOString(),
        seatNumber: 'TEST-1',
        ticketNameJa: 'テストチケット123456',
        ticketNameEn: 'test ticket 123456',
        price: 1000,
        posName: 'test-01',
        confirmationNumber: '12345678',
        orderNumber: 'TEST-123456-123456',
        ticketNumber: 'TEST-123456-123456-00',
        qrcode: 'TEST-123456-123456'
    };
    const canvas = await drawCanvas({ printData, data });

    return canvas;
}
