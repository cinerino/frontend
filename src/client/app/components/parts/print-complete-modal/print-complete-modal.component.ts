import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-print-complete-modal',
    templateUrl: './print-complete-modal.component.html',
    styleUrls: ['./print-complete-modal.component.scss']
})
export class PrintCompleteModalComponent implements OnInit, OnDestroy {
    private timer: any;
    constructor(
        private modal: BsModalService,
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
            this.modal.hide(1);
        }, time);
    }

    /**
     * 閉じる
     */
    public close() {
        this.router.navigate(['/inquiry/input']);
        this.modal.hide(1);
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
