import { Component, OnInit } from '@angular/core';
import { getEnvironment } from '../../../../../environments/environment';
import { ActionService } from '../../../../services';

@Component({
    selector: 'app-expired',
    templateUrl: './expired.component.html',
    styleUrls: ['./expired.component.scss']
})
export class ExpiredComponent implements OnInit {
    public environment = getEnvironment();
    constructor(
        private actionService: ActionService,
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.actionService.purchase.delete();
        this.actionService.user.delete();
    }

}
