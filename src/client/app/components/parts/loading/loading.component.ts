import { Component, Input, OnInit } from '@angular/core';
import { ILanguage } from '../../../models';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
    @Input() public isLoading: boolean;
    @Input() public process: ILanguage;

    constructor() { }

    public ngOnInit() { }
}
