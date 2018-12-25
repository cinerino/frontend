import * as libphonenumber from 'libphonenumber-js';
/**
 * 電話番号変換
 */
export function formatTelephone(telephone: string) {
    const parseNumber = libphonenumber.parse(telephone, 'JP');

    return libphonenumber.format(parseNumber, 'International').replace(/\s/g, '');
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
    return value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
}
