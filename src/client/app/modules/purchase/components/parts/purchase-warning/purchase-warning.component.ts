import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { UtilService } from '../../../../../services';

@Component({
    selector: 'app-purchase-warning',
    templateUrl: './purchase-warning.component.html',
    styleUrls: ['./purchase-warning.component.scss']
})
export class PurchaseWarningComponent implements OnInit, OnChanges {
    @Input() public language: string;
    @Input() public screeningEvent?: factory.chevre.event.screeningEvent.IEvent;
    public environment = getEnvironment();
    public warning: string;

    constructor(
    private utilService: UtilService
    ) { }

    public ngOnInit() {
    }

    public async ngOnChanges() {
        try {
            const path = `/text/purchase/warning/${this.language}.txt`;
            const url = (await Functions.Util.isFile(`${Functions.Util.getProject().storageUrl}${path}`))
                ? `${Functions.Util.getProject().storageUrl}${path}`
                : `/default${path}`;
            const result = await this.utilService.getText(url);
            this.warning = result.replace(/\n/g, '<br>');
        } catch (error) {
            console.error(error);
        }
    }

}
