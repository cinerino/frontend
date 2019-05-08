import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { AlertModalComponent } from '../components/parts/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../components/parts/confirm-modal/confirm-modal.component';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(
        private modal: BsModalService,
        private http: HttpClient
    ) { }

    /**
     * 警告モーダル表示
     */
    public openAlert(args: {
        title: string;
        body: string;
    }) {
        const title = args.title;
        const body = args.body;
        const modalRef = this.modal.show(AlertModalComponent, {
            initialState: { title, body },
            class: 'modal-dialog-centered'
        });
        modalRef.content.modal = modalRef;
    }

    /**
     * 確認モーダル表示
     */
    public openConfirm(args: {
        title: string;
        body: string;
        cb: Function
    }) {
        const title = args.title;
        const body = args.body;
        const cb = args.cb;
        this.modal.show(ConfirmModalComponent, {
            initialState: { title, body, cb },
            class: 'modal-dialog-centered'
        });
    }

    /**
     * json取得
     */
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

    /**
     * text取得
     */
    public async getText<T>(url: string, options?: {
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
        const result = await this.http.get<T>(url, {...options, responseType: (<any>'text')}).toPromise();

        return result;
    }

    /**
     * 暗号化
     */
    public async encryptionEncode(encyptText: string) {
        const encryptedResult = await this.http.post<{ salt: string; iv: string; encrypted: string; }>(
            '/api/encryption/encode', { encyptText }
        ).toPromise();
        return encryptedResult;
    }

    /**
     * 復号化
     */
    public async encryptionDecode(encryptedResult: {
        salt: string;
        iv: string;
        encrypted: string;
    }) {
        const decryptedResult = await this.http.post<{ decrypted: string; }>(
            '/api/encryption/decode', {
                salt: encryptedResult.salt,
                iv: encryptedResult.iv,
                encrypted: encryptedResult.encrypted
            }
        ).toPromise();
        return decryptedResult;
    }

}
