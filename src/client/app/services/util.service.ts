import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../components/parts/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../components/parts/confirm-modal/confirm-modal.component';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(
        private modal: NgbModal
    ) { }

    public openAlert(args: {
        title: string;
        body: string;
    }) {
        const modalRef = this.modal.open(AlertModalComponent, {
            centered: true
        });
        modalRef.componentInstance.title = args.title;
        modalRef.componentInstance.body = args.body;
    }

    public openConfirm(args: {
        title: string;
        body: string;
        cb: Function
    }) {
        const modalRef = this.modal.open(ConfirmModalComponent, {
            centered: true
        });
        modalRef.result.then(async () => {
            args.cb();
            modalRef.dismiss();
        }).catch(() => { });

        modalRef.componentInstance.title = args.title;
        modalRef.componentInstance.body = args.body;
    }

}
