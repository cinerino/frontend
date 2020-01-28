import { Component, OnInit } from '@angular/core';
import { getEnvironment } from '../../../../../environments/environment';
import { PurchaseService, UserService } from '../../../../services';

@Component({
    selector: 'app-expired',
    templateUrl: './expired.component.html',
    styleUrls: ['./expired.component.scss']
})
export class ExpiredComponent implements OnInit {
    public environment = getEnvironment();
    constructor(
        private purchaseService: PurchaseService,
        private userService: UserService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.purchaseService.delete();
        this.userService.delete();
    }

}
