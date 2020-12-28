import { Component, OnInit } from '@angular/core';
import { Functions } from '../../../../..';
import { CinerinoService } from '../../../../../services';

@Component({
    selector: 'app-auth-index',
    templateUrl: './auth-index.component.html',
    styleUrls: ['./auth-index.component.scss']
})
export class AuthIndexComponent implements OnInit {

    constructor(
        private cinerino: CinerinoService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        const params = Functions.Util.getExternalData();
        sessionStorage.setItem('EXTERNAL', JSON.stringify({ ...params, redirectUrl: undefined }));
        const redirectUrl = (params.redirectUrl === undefined) ? undefined : atob(params.redirectUrl);
        await this.cinerino.signIn({ redirectUrl });
    }
}
