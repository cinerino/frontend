import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-inquiry-print',
    templateUrl: './inquiry-print.component.html',
    styleUrls: ['./inquiry-print.component.scss']
})
export class InquiryPrintComponent implements OnInit, OnDestroy {
    private timer: any;
    constructor(
        private router: Router
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        if (environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME === '') {
            return;
        }
        const time = Number(environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME);
        this.timer = setTimeout(() => {
            this.router.navigate(['/inquiry/input']);
        }, time);
    }

    /**
     * 破棄
     */
    public ngOnDestroy() {
        if (this.timer === undefined) {
            return;
        }
        clearTimeout(this.timer);
    }

}
