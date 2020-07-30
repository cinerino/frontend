import { factory } from '@cinerino/sdk';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import * as qrcode from 'qrcode';
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
    const template = await (<any>window).ejs.render(params.view, {
        moment,
        ...params,
        storageUrl: getProject().storageUrl
    }, { async: true });
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
export async function createTestPrintCanvas4Html(params: { view: string; }) {
    const view = params.view;
    const template = await (<any>window).ejs.render(view, { moment }, { async: true });
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
 * QRコード表示判定
 */
export function isShowQRCode(event: factory.chevre.event.screeningEvent.IEvent) {
    return moment(event.startDate).add(-24, 'hours').toDate() < moment().toDate();
}

