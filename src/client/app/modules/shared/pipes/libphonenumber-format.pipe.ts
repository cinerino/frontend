import { Pipe, PipeTransform } from '@angular/core';
import * as libphonenumber from 'libphonenumber-js';

@Pipe({
    name: 'libphonenumberFormat'
})
export class LibphonenumberFormatPipe implements PipeTransform {

    /**
     * 電話番号変換
     * @method transform
     * @param {string} phoneNumber
     * @param {string} countryCode
     */
    public transform(
        phoneNumber: string,
        countryCode?: libphonenumber.CountryCode,
        format?: IFormat
    ): string {
        countryCode = (countryCode === undefined) ? 'JP' : countryCode;
        format = (format === undefined) ? 'National' : format;
        const parsedNumber = libphonenumber.parse(phoneNumber);
        return (parsedNumber.country !== 'JP')
            ? phoneNumber : libphonenumber.format(parsedNumber, format).replace(/\-/g, '');
    }
}

type IFormat = 'International' | 'E.164' | 'National' | 'RFC3966';
