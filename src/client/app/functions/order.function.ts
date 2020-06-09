import { factory } from '@cinerino/api-javascript-client';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import * as qrcode from 'qrcode';
import * as Models from './../models';
import { getItemPrice } from './purchase.function';
import { getProject } from './util.function';

/**
 * 印刷イメージ作成
 */
export async function createPrintCanvas4Html(params: {
    view: string;
    order: factory.order.IOrder;
    pos?: factory.chevre.place.movieTheater.IPOS;
    qrcode?: string;
    index: number;
}) {
    // QR描画
    if (params.qrcode !== undefined) {
        params.qrcode = await qrcode.toDataURL(params.qrcode);
    }
    const template = await (<any>window).ejs.render(params.view, { moment, ...params, }, { async: true });
    const div = document.createElement('div');
    div.className = 'position-absolute';
    div.style.top = '-9999px';
    div.innerHTML = template;
    document.body.appendChild(div);
    const canvas = await html2canvas(div, { width: 560, scale: 1 });
    div.remove();
    return canvas;
}

/**
 * キャンバスへ描画
 */
async function drawCanvas(args: {
    printData: Models.Order.Print.ITicketPrintData,
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
        index: number;
        qrcode?: string;
    }
}) {
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
        const imageInstance = new Image();
        imageInstance.crossOrigin = 'anonymous';
        imageInstance.src = image.src.replace('/storage', getProject().storageUrl);
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
                case 'date':
                    value = `(${moment().format('YYYY/MM/DD HH:mm')} 発券)`;
                    break;
                case 'startDate':
                case 'endDate':
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
                            changePosition(text.fillText.y)
                        );
                        context.fillText(
                            (eventName.length - limit < limit)
                                ? eventName.slice(limit, eventName.length)
                                : eventName.slice(limit, limit * 2),
                            changePosition(text.fillText.x),
                            changePosition(text.fillText.y) + parseInt(text.font.size, 10) * 1.5
                        );
                    } else {
                        context.fillText(
                            eventName,
                            changePosition(text.fillText.x),
                            changePosition(text.fillText.y) + parseInt(text.font.size, 10) * 0.75
                        );
                    }
                    continue;
                default:
                    value = `${(text.value === undefined) ? '' : text.value}${(data[text.name] === undefined) ? '-' : data[text.name]}`;
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
            changePosition(text.fillText.y)
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
    printData: Models.Order.Print.ITicketPrintData;
    acceptedOffer: factory.order.IAcceptedOffer<factory.order.IItemOffered>;
    order: factory.order.IOrder;
    pos?: factory.chevre.place.movieTheater.IPOS;
    qrcode?: string;
    index: number;
}) {
    const acceptedOffer = args.acceptedOffer;
    const itemOffered = acceptedOffer.itemOffered;
    if (itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
        throw new Error('reservationType is not EventReservation');
    }
    const data = {
        sellerNameJa: (itemOffered.reservationFor.superEvent.location.name === undefined
            || itemOffered.reservationFor.superEvent.location.name.ja === undefined)
            ? '' : itemOffered.reservationFor.superEvent.location.name.ja,
        sellerNameEn: (itemOffered.reservationFor.superEvent.location.name === undefined
            || itemOffered.reservationFor.superEvent.location.name.en === undefined)
            ? '' : itemOffered.reservationFor.superEvent.location.name.en,
        eventNameJa: (itemOffered.reservationFor.name.ja === undefined) ? '' : itemOffered.reservationFor.name.ja,
        eventNameEn: (itemOffered.reservationFor.name.en === undefined) ? '' : itemOffered.reservationFor.name.en,
        screenNameJa: (itemOffered.reservationFor.location.address === undefined)
            ? (itemOffered.reservationFor.location.name === undefined || itemOffered.reservationFor.location.name.ja === undefined)
                ? '' : itemOffered.reservationFor.location.name.ja
            : `${itemOffered.reservationFor.location.address.ja} ${(itemOffered.reservationFor.location.name === undefined) ? '' : itemOffered.reservationFor.location.name.ja}`,
        screenNameEn: (itemOffered.reservationFor.location.address === undefined)
            ? (itemOffered.reservationFor.location.name === undefined || itemOffered.reservationFor.location.name.en === undefined)
                ? '' : itemOffered.reservationFor.location.name.en
            : `${itemOffered.reservationFor.location.address.en} ${(itemOffered.reservationFor.location.name === undefined) ? '' : itemOffered.reservationFor.location.name.en}`,
        startDate: moment(itemOffered.reservationFor.startDate).toISOString(),
        endDate: moment(itemOffered.reservationFor.endDate).toISOString(),
        seatNumber: (itemOffered.reservedTicket.ticketedSeat === undefined)
            ? undefined : itemOffered.reservedTicket.ticketedSeat.seatNumber,
        ticketNameJa: (itemOffered.reservedTicket.ticketType.name === undefined)
            ? '' : (typeof itemOffered.reservedTicket.ticketType.name === 'string')
                ? itemOffered.reservedTicket.ticketType.name : (itemOffered.reservedTicket.ticketType.name.ja === undefined)
                    ? '' : itemOffered.reservedTicket.ticketType.name.ja,
        ticketNameEn: (itemOffered.reservedTicket.ticketType.name === undefined)
            ? '' : (typeof itemOffered.reservedTicket.ticketType.name === 'string')
                ? itemOffered.reservedTicket.ticketType.name : (itemOffered.reservedTicket.ticketType.name.en === undefined)
                    ? '' : itemOffered.reservedTicket.ticketType.name.en,
        price: getItemPrice({ priceComponents: (<any>acceptedOffer.priceSpecification).priceComponent }),
        posName: (args.pos === undefined) ? '' : args.pos.name,
        confirmationNumber: String(args.order.confirmationNumber),
        orderNumber: args.order.orderNumber,
        ticketNumber: itemOffered.id,
        qrcode: args.qrcode,
        index: args.index
    };
    const printData = args.printData;
    const canvas = await drawCanvas({ data, printData });

    return canvas;
}

/**
 * テスト印刷用イメージ作成
 */
export async function createTestPrintCanvas(args: { printData: Models.Order.Print.ITicketPrintData }) {
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
        qrcode: 'TEST-123456-123456',
        index: 0
    };
    const canvas = await drawCanvas({ printData, data });

    return canvas;
}

/**
 * テスト印刷用イメージ作成
 */
export async function createTestPrintCanvas4Html() {
    const view = `<div style="width: 560px;">
    <div class="py-5 text-center" style="font-size: 30px;">
    <p class="mb-3"><img width="400" height="64" src="/default/images/print/logo.png"></p>
    <p class="mb-3">Test print</p>
    <p><%= moment().tz('Asia/Tokyo').locale('ja').format('YYYY/MM/DD HH:mm:ss') %></p>
    </div>
    </div>`;
    const template = await (<any>window).ejs.render(view, { moment }, { async: true });
    const div = document.createElement('div');
    div.className = 'position-absolute';
    div.style.top = '-9999px';
    div.innerHTML = template;
    document.body.appendChild(div);
    const canvas = await html2canvas(div, { width: 560, scale: 1 });
    div.remove();
    return canvas;
}

/**
 * QRコード表示判定
 */
export function isShowQRCode(event: factory.chevre.event.screeningEvent.IEvent) {
    return moment(event.startDate).add(-24, 'hours').toDate() < moment().toDate();
}

