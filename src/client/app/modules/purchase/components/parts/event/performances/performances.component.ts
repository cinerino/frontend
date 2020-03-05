import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { IScreeningEventWork } from '../../../../../../functions';

@Component({
    selector: 'app-purchase-event-performances',
    templateUrl: './performances.component.html',
    styleUrls: ['./performances.component.scss']
})
export class PurchaseEventPerformancesComponent implements OnInit {
    @ViewChild(SwiperComponent, { static: false }) public componentRef: SwiperComponent;
    @ViewChild(SwiperDirective, { static: false }) public directiveRef: SwiperDirective;
    @Input() public screeningWorkEvent: IScreeningEventWork;
    @Input() public isSlider: boolean;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment = moment;
    public swiperConfig: SwiperConfigInterface;
    constructor() { }

    public ngOnInit() {
        this.swiperConfig = {
            spaceBetween: 0,
            slidesPerView: 6.5,
            freeMode: true,
            breakpoints: {
                320: { slidesPerView: 2.5 },
                767: { slidesPerView: 2.5 },
                1024: { slidesPerView: 5.5 }
            }
        };
    }

    /**
     * リサイズ
     */
    public resize() {
        this.directiveRef.update();
    }

}
