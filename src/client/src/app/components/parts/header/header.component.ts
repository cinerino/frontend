import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public isMenuOpen: boolean;
    constructor() { }

    public ngOnInit() {
        this.isMenuOpen = false;
    }

    public menuOpen() {
        this.isMenuOpen = true;
    }

    public menuClose() {
        this.isMenuOpen = false;
    }

}
