import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

const I18N_VALUES = {
    'fr': {
        weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
        months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
    },
    'en': {
        weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    'ja': {
        weekdays: ['日', '月', '火', '水', '木', '金', '土'],
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    }
    // other languages you would support
};

// Define custom service providing the months and weekdays translations
@Injectable({
    providedIn: 'root'
})
export class DatepickerI18n extends NgbDatepickerI18n {
    constructor(private translate: TranslateService) {
        super();
    }

    public getLanguage() {
        return this.translate.currentLang || this.translate.defaultLang;
    }

    public getWeekdayShortName(weekday: number): string {
        return (<any>I18N_VALUES)[this.getLanguage()].weekdays[weekday - 1];
    }
    public getMonthShortName(month: number): string {
        return (<any>I18N_VALUES)[this.getLanguage()].months[month - 1];
    }
    public getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }

    public getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}
