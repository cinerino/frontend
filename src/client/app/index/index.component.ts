/**
 * AppComponent
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getEnvironment } from '../../environments/environment';

declare const ga: Function;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        const environment = getEnvironment();
        const navigate = environment.BASE_URL;
        setTimeout(() => {
            this.router.navigate([navigate]);
        }, 0);
    }
}
