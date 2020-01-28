import { Component, OnInit } from '@angular/core';
import { getEnvironment } from '../../../../../environments/environment';

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
    public environment = getEnvironment();
    constructor() { }

    /**
     * 初期化
     */
    public ngOnInit() {
    }

}
