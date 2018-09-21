import { Component, OnInit } from '@angular/core';
import { CinerinoService } from '../../../../services/cinerino.service';

@Component({
    selector: 'app-auth-index',
    templateUrl: './auth-index.component.html',
    styleUrls: ['./auth-index.component.scss']
})
export class AuthIndexComponent implements OnInit {

    constructor(
        private cinerino: CinerinoService
    ) { }

    public async ngOnInit() {
        await this.cinerino.signIn();
    }

}
