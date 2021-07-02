import { factory } from '@cinerino/sdk';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import * as qrcode from 'qrcode';
import { getEnvironment } from '../../environments/environment';
import { Order } from '../models';
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
    const template = await (<any>window).ejs.render(
        params.view,
        {
            moment,
            ...params,
            storageUrl: getProject().storageUrl,
        },
        { async: true }
    );
    const div = document.createElement('div');
    div.className = 'position-absolute';
    div.style.top = '-9999px';
    div.innerHTML = template;
    document.body.appendChild(div);
    const canvas = await html2canvas(div, { width: div.clientWidth, scale: 1 });
    div.remove();
    return canvas;
}

/**
 * テスト印刷用イメージ作成
 */
export async function createTestPrintCanvas4Html(params: { view: string }) {
    const view = params.view;
    const template = await (<any>window).ejs.render(
        view,
        { moment },
        { async: true }
    );
    const div = document.createElement('div');
    div.className = 'position-absolute';
    div.style.top = '-9999px';
    div.innerHTML = template;
    document.body.appendChild(div);
    const canvas = await html2canvas(div, { width: div.clientWidth, scale: 1 });
    div.remove();
    return canvas;
}

/**
 * カスタムQR作成
 */
export function createCustomQRCode(params: {
    qrcode: string;
    order: factory.order.IOrder;
    itemOffered: factory.chevre.reservation.IReservation<factory.chevre.reservationType.EventReservation>;
    index: number;
}) {
    let result = params.qrcode;
    const order = params.order;
    const itemOffered = params.itemOffered;
    const index = params.index;
    result = result.replace(
        /\{\{ orderDate \| YYMMDD \}\}/g,
        moment(order.orderDate).format('YYMMDD')
    );
    result = result.replace(
        /\{\{ confirmationNumber \}\}/g,
        order.confirmationNumber
    );
    result = result.replace(
        /\{\{ confirmationNumber \| [0-9] \}\}/g,
        (match) => {
            const digit = Number(
                match.replace(/\{\{ confirmationNumber \| ([0-9]) \}\}/, '$1')
            );
            return `000000000${order.confirmationNumber}`.slice(-1 * digit);
        }
    );
    result = result.replace(/\{\{ index \}\}/g, String(index));
    result = result.replace(/\{\{ index \| [0-9] \}\}/g, (match) => {
        const digit = Number(match.replace(/\{\{ index \| ([0-9]) \}\}/, '$1'));
        return `000000000${String(index)}`.slice(-1 * digit);
    });
    result = result.replace(/\{\{ orderNumber \}\}/g, order.orderNumber);
    result = result.replace(
        /\{\{ startDate \| YYMMDD \}\}/g,
        moment(itemOffered.reservationFor.startDate).format('YYMMDD')
    );
    return result;
}

/**
 * QR作成
 */
export function createQRCode(params: {
    acceptedOffer: factory.order.IAcceptedOffer<factory.order.IItemOffered>;
    order: factory.order.IOrder;
    index: number;
    code?: string;
}) {
    const { acceptedOffer, order, index, code } = params;
    if (
        acceptedOffer.itemOffered.typeOf !==
        factory.chevre.reservationType.EventReservation
    ) {
        return undefined;
    }
    let result;
    const itemOffered = <
        factory.chevre.reservation.IReservation<factory.chevre.reservationType.EventReservation>
    >acceptedOffer.itemOffered;
    const environment = getEnvironment();
    if (environment.PRINT_QRCODE_TYPE === Order.Print.PrintQrcodeType.None) {
        // なし
        result = undefined;
    } else if (
        environment.PRINT_QRCODE_TYPE === Order.Print.PrintQrcodeType.Token
    ) {
        // トークン
        result = `${itemOffered.id}@${code}`;
    } else if (
        environment.PRINT_QRCODE_TYPE === Order.Print.PrintQrcodeType.Custom
    ) {
        // カスタム文字列
        result = createCustomQRCode({
            qrcode: environment.PRINT_QRCODE_CUSTOM,
            order,
            itemOffered,
            index,
        });
    }
    const additionalProperty =
        itemOffered.reservationFor.workPerformed !== undefined &&
        itemOffered.reservationFor.workPerformed.additionalProperty !==
            undefined &&
        itemOffered.reservationFor.workPerformed.additionalProperty.length > 0
            ? itemOffered.reservationFor.workPerformed.additionalProperty
            : itemOffered.additionalProperty !== undefined &&
              itemOffered.additionalProperty.length > 0
            ? itemOffered.additionalProperty
            : undefined;
    if (additionalProperty !== undefined) {
        // 追加特性のqrcodeがfalseの場合QR非表示
        const isDisplayQrcode = additionalProperty.find(
            (a) => a.name === 'qrcode'
        );
        if (
            isDisplayQrcode !== undefined &&
            isDisplayQrcode.value === 'false'
        ) {
            result = undefined;
        }
    }
    return result;
}
