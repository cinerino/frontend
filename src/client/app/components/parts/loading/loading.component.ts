import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
    @Input() public isLoading: boolean;
    @Input() public process: string;

    constructor() { }

    public ngOnInit() {
    }
}
