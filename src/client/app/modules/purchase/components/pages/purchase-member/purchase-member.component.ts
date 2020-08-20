import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-member',
    templateUrl: './purchase-member.component.html',
    styleUrls: ['./purchase-member.component.scss']
})
export class PurchaseMemberComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public moment = moment;
    public environment = getEnvironment();

    constructor() { }

    /**
     * 初期化
     */
    public ngOnInit() {
    }

}
