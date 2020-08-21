import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-member-process',
    templateUrl: './purchase-member-process.component.html',
    styleUrls: ['./purchase-member-process.component.scss']
})
export class PurchaseMemberProcessComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public moment = moment;
    public environment = getEnvironment();
    public viewType = Models.Common.ViewType;

    constructor(
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
    }

}
