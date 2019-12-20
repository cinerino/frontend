import * as libphonenumber from 'libphonenumber-js';
import { BsDatepickerContainerComponent, BsDatepickerDirective } from 'ngx-bootstrap';
import { CellHoverEvent } from 'ngx-bootstrap/datepicker/models';

/**
 * 電話番号変換
 */
export function formatTelephone(telephone: string, format?: libphonenumber.NumberFormat) {
    if (telephone === undefined) {
        return '';
    }
    const parsedNumber = (new RegExp(/^\+/).test(telephone))
        ? libphonenumber.parse(telephone)
        : libphonenumber.parse(telephone, 'JP');
    format = (format === undefined) ? 'International' : format;

    return libphonenumber.format(parsedNumber, format).replace(/\s/g, '');
}

/**
 * 全角変換
 */
export function toFull(value: string) {
    return value.replace(/[A-Za-z0-9]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) + 65248);
    });
}

/**
 * 半角変換
 */
export function toHalf(value: string) {
    return value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
}

/**
 * リトライ
 * @param args
 */
export async function retry<T>(args: {
    process: Function;
    interval: number;
    limit: number;
}) {
    let count = 0;
    return new Promise<T>(async (resolve, reject) => {
        const timerProcess = () => {
            setTimeout(async () => {
                count++;
                try {
                    const result = await args.process();
                    resolve(result);
                } catch (error) {
                    if (count >= args.limit) {
                        reject(error);
                        return;
                    }
                    timerProcess();
                }
            }, args.interval);
        };
        try {
            const result = await args.process();
            resolve(result);
        } catch (error) {
            timerProcess();
        }
    });
}

/**
 * ミリ秒待つ
 * デフォルト値3000ms
 */
export async function sleep(time: number = 3000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

/**
 * iOS bugfix（2回タップしないと選択できない）
 */
export function iOSDatepickerTapBugFix(
    container: BsDatepickerContainerComponent,
    datepickerDirectives: BsDatepickerDirective[]
) {
    const dayHoverHandler = container.dayHoverHandler;
    const hoverWrapper = (event: CellHoverEvent) => {
        const { cell, isHovered } = event;
        if ((isHovered &&
            !!navigator.platform &&
            /iPad|iPhone|iPod/.test(navigator.platform)) &&
            'ontouchstart' in window
        ) {
            datepickerDirectives.forEach(d => (<any>d)._datepickerRef.instance.daySelectHandler(cell));
        }

        return dayHoverHandler(event);
    };
    container.dayHoverHandler = hoverWrapper;
}
