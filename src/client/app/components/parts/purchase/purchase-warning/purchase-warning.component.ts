import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { environment } from '../../../../../environments/environment';
import { UtilService } from '../../../../services';

@Component({
    selector: 'app-purchase-warning',
    templateUrl: './purchase-warning.component.html',
    styleUrls: ['./purchase-warning.component.scss']
})
export class PurchaseWarningComponent implements OnInit, OnChanges {
    @Input() public language: string;
    @Input() public screeningEvent?: factory.chevre.event.screeningEvent.IEvent;
    public environment = environment;
    public warning: string;

    constructor(
    private util: UtilService
    ) { }

    public ngOnInit() {
    }

    public async ngOnChanges() {
        try {
            const url = `/storage/text/purchase/warning/${this.language}.txt`;
            const result = await this.util.getText<string>(url);
            this.warning = result.replace(/\n/g, '<br>');
        } catch (error) {
            console.error(error);
        }
    }

}
