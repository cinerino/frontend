import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'changeLanguage',
    pure: false
})
export class ChangeLanguagePipe implements PipeTransform {
    constructor(
        private translate: TranslateService
    ) { }

    public transform(lang: { [key: string]: string; }) {
        const currentLang = this.translate.store.currentLang;
        if (lang[currentLang] !== undefined) {
            return lang[currentLang];
        }
        if (lang.en !== undefined) {
            return lang.en;
        }
        return '';
    }

}
