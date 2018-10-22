import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-purchase-contents',
    templateUrl: './purchase-contents.component.html',
    styleUrls: ['./purchase-contents.component.scss']
})
export class PurchaseContentsComponent implements OnInit {

    @Input() public touch?: boolean;

    constructor(private router: Router) {}

    public ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const purchaseContents = document.getElementById('purchaseContents');
                if (purchaseContents == null) {
                    return;
                }
                purchaseContents.scrollTop = 0;
            }
        });
        if (this.touch === undefined) {
            this.touch = true;
        }
    }

}
