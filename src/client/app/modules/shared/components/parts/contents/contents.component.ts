import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-contents',
    templateUrl: './contents.component.html',
    styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {
    @Input() public touch?: boolean;

    constructor(
        private router: Router,
        private elementRef: ElementRef
    ) { }

    public ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const element: HTMLElement = this.elementRef.nativeElement.querySelector('.scroll');
                setTimeout(() => {
                    element.scrollTop = 0;
                }, 0);
            }
        });
        if (this.touch === undefined) {
            this.touch = true;
        }
    }

}
