import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
    public environment = environment;
    constructor() { }

    /**
     * 初期化
     */
    public ngOnInit() {
    }

}
