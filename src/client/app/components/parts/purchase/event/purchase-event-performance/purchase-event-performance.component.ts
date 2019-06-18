import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { IScreeningEventWork, isSales, isScheduleStatusThreshold, isTicketedSeatScreeningEvent } from '../../../../../functions';

@Component({
    selector: 'app-purchase-event-performance',
    templateUrl: './purchase-event-performance.component.html',
    styleUrls: ['./purchase-event-performance.component.scss']
})
export class PurchaseEventPerformanceComponent implements OnInit {
    @ViewChild(SwiperComponent, { static: false }) public componentRef: SwiperComponent;
    @ViewChild(SwiperDirective, { static: true }) public directiveRef: SwiperDirective;
    @Input() public screeningWorkEvent: IScreeningEventWork;
    @Input() public readonly: boolean;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment: typeof moment = moment;
    public isScheduleStatusThreshold = isScheduleStatusThreshold;
    public isSales = isSales;
    public isTicketedSeatScreeningEvent = isTicketedSeatScreeningEvent;
    public swiperConfig: SwiperConfigInterface;
    constructor() { }

    public ngOnInit() {
        this.swiperConfig = {
            spaceBetween: 0,
            slidesPerView: 7.5,
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
