import * as libphonenumber from 'libphonenumber-js';
/**
 * 電話番号変換
 */
export function formatTelephone(telephone: string) {
    const parseNumber = libphonenumber.parse(telephone, 'JP');

    return libphonenumber.format(parseNumber, 'International').replace(/\s/g, '');
}
