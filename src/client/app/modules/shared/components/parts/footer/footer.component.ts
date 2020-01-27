import { Component, OnInit } from '@angular/core';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    public environment = getEnvironment();
    constructor() { }

    public ngOnInit() {
    }

}
