import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Pipe({
    name: 'formatDate',
    pure: false
})
export class FormatDatePipe implements PipeTransform {
    constructor(
        private translate: TranslateService
    ) { }

    public transform(value: string, format: string): any {
        const currentLang = this.translate.store.currentLang;
        const result = moment(value).locale(currentLang).format(format);

        return result;
    }

}
