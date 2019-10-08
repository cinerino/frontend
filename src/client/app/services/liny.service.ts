import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LinyService {
    constructor(
        private http: HttpClient
    ) { }

    /**
     * メッセージ送信
     */
    public async sendMessage(params: {
        uid: string;
        message: string;
    }) {
        const url = `/api/liny/sendMessage`;
        const body = params;
        const result = await this.http.post<{ result: string }>(url, body).toPromise();

        return result;
    }
}
