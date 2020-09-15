import * as libphonenumber from 'libphonenumber-js';
import { BsDatepickerContainerComponent, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
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
 * デフォルト値500ms
 */
export async function sleep(time: number = 500) {
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

/**
 * ストリーミングダウンロード
 */
// export async function streamingDownload<T>(stream: ReadableStream<T>) {
//     const reader = stream.getReader();
//     const decoder = new TextDecoder();
//     let streamText = '';
//     return new Promise<string>(async (resolve, reject) => {
//         try {
//             const readChunk = async (chunk: { done: boolean; value: any; }) => {
//                 if (chunk.done) {
//                     resolve(streamText);
//                     return;
//                 }
//                 streamText += decoder.decode(chunk.value);
//                 await readChunk(await reader.read());
//             };
//             await readChunk(await reader.read());
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

/**
 * 文字列をBLOB変換
 */
export function string2blob(value: string, options?: BlobPropertyBag) {
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    return new Blob([bom, value], options);
}

/**
 * パラメータ取得
 */
export function getParameter(): {
    theaterBranchCode?: string;
    superEventId?: string;
    eventId?: string;
    passportToken?: string;
    workPerformedId?: string;
    scheduleDate?: string;
    linyId?: string;
    language?: string;
    projectId?: string;
    projectName?: string;
} {
    const result: any = {};
    const params = location.search.replace('?', '').split('&');
    for (let i = 0; i < params.length; i++) {
        const param = params[i].split('=');
        const key = param[0];
        const value = param[1];
        if (key && value) {
            result[key] = value;
        }
    }
    if (result.performanceId !== undefined
        && result.eventId === undefined) {
        result.eventId = result.performanceId;
        result.performanceId = undefined;
    }
    return result;
}

/**
 * プロジェクト情報取得
 */
export function getProject() {
    const project = sessionStorage.getItem('PROJECT');
    const defaultProject = { projectId: '', projectName: '', storageUrl: '' };
    if (project === null || project === '') {
        return defaultProject;
    }
    return {
        ...defaultProject,
        ...<{
            projectId: string;
            projectName: string;
            storageUrl: string;
        }>JSON.parse(project)
    };
}

/**
 * 外部データ取得
 */
export function getExternalData(): {
    theaterBranchCode?: string;
    superEventId?: string;
    eventId?: string;
    passportToken?: string;
    workPerformedId?: string;
    scheduleDate?: string;
    linyId?: string;
    language?: string;
} {
    const external = sessionStorage.getItem('EXTERNAL');
    if (external === null || external === '') {
        return {};
    }
    return JSON.parse(external);
}

/**
 * ファイル存在判定
 */
export async function isFile(url: string) {
    const fetchResult = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'charset=utf-8'
        },
    });
    return (fetchResult.ok);
}

/**
 * オブジェクトディープコピー
 */
export function deepCopy<T>(obj: any) {
    return <T>JSON.parse(JSON.stringify(obj));
}
