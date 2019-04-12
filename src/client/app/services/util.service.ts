import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../components/parts/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../components/parts/confirm-modal/confirm-modal.component';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(
        private modal: NgbModal,
        private http: HttpClient
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

    public async getJson<T>(url: string, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }) {
        const result = await this.http.get<T>(url, options).toPromise();

        return result;
    }

}
