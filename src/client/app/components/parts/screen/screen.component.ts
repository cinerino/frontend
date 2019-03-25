import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toFull } from '../../../functions';
import { ILabel, IReservationSeat, IRow, IScreen, ISeat, SeatStatus } from '../../../models';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-screen',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit, AfterViewInit, AfterViewChecked {
    public static ZOOM_SCALE = 1;
    @Input() public screenData: IScreen;
    @Output() public select = new EventEmitter<{ seat: IReservationSeat; status: SeatStatus; }>();
    public screeningEventOffers: factory.chevre.event.screeningEvent.IScreeningRoomSectionOffer[];
    public authorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    public purchase: Observable<reducers.IPurchaseState>;
    public seats: IRow[];
    public lineLabels: ILabel[];
    public columnLabels: ILabel[];
    public screenType: string;
    public zoomState: boolean;
    public scale: number;
    public height: number;
    public origin: string;

    constructor(
        private store: Store<reducers.IState>,
        private elementRef: ElementRef
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.purchase.subscribe((purchase) => {
            this.screeningEventOffers = purchase.screeningEventOffers;
            this.authorizeSeatReservation = purchase.authorizeSeatReservation;
            this.zoomState = false;
            this.scale = 1;
            this.height = 0;
            this.origin = '0 0';
            this.createScreen();
            this.scaleDown();
        }).unsubscribe();
    }

    /**
     * レンダリング後処理
     */
    public ngAfterViewInit() {
        const time = 300;
        const timer = setInterval(() => {
            if (this.screenData !== undefined) {
                clearInterval(timer);
                const screenElement = document.querySelector('.screen-style');
                if (screenElement !== null && this.screenData.style !== undefined) {
                    screenElement.innerHTML = this.screenData.style;
                }
            }
        }, time);
    }

    public ngAfterViewChecked() {
        this.changeStatus();
    }

    /**
     * モバイル判定
     * @method isMobile
     * @returns {boolean}
     */
    public isMobile(): boolean {
        if (window.innerWidth > 768) {
            return false;
        }

        return true;
    }

    /**
     * status変更
     */
    public changeStatus() {
        this.purchase.subscribe((purchase) => {
            const reservations = purchase.reservations;
            this.seats.forEach((row) => {
                row.data.forEach((seat) => {
                    if (seat.status === SeatStatus.Active) {
                        seat.status = SeatStatus.Default;
                    }
                    const findReservationSeatResult = reservations.find((reservation) => {
                        return (reservation.seat.seatNumber === seat.code
                            && reservation.seat.seatSection === seat.section);
                    });
                    if (findReservationSeatResult !== undefined) {
                        seat.status = SeatStatus.Active;
                    }
                });
            });
        }).unsubscribe();
    }

    /**
     * 拡大
     * @method scaleUp
     * @param {Event} event
     * @returns {void}
     */
    public scaleUp(event: MouseEvent) {
        if (this.zoomState) {
            return;
        }
        if (!this.isMobile()) {
            return;
        }
        this.zoomState = true;
        const element: HTMLElement = this.elementRef.nativeElement;
        const screen = <HTMLDivElement>element.querySelector('.screen');
        const scroll = <HTMLDivElement>element.querySelector('.screen-scroll');
        const rect = scroll.getBoundingClientRect();
        const scrollTop = window.pageYOffset || (<HTMLElement>document.documentElement).scrollTop;
        const scrollLeft = window.pageXOffset || (<HTMLElement>document.documentElement).scrollLeft;
        const offset = {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft
        };
        const pos = {
            x: event.pageX - offset.left,
            y: event.pageY - offset.top
        };
        const scrollPos = {
            x: pos.x / this.scale - screen.offsetWidth / 2,
            y: pos.y / this.scale - screen.offsetHeight / 2,
        };
        this.scale = ScreenComponent.ZOOM_SCALE;
        this.origin = '50% 50%';

        setTimeout(() => {
            scroll.scrollLeft = scrollPos.x;
            scroll.scrollTop = scrollPos.y;
        }, 0);
    }

    /**
     * 縮小
     * @method scaleDown
     * @returns {void}
     */
    public scaleDown(): void {
        const element: HTMLElement = this.elementRef.nativeElement;
        const screen = <HTMLDivElement>element.querySelector('.screen');
        this.zoomState = false;
        const scale = screen.offsetWidth / this.screenData.size.w;
        this.scale = (scale > ScreenComponent.ZOOM_SCALE) ? ScreenComponent.ZOOM_SCALE : scale;
        this.height = this.screenData.size.h * this.scale;
        this.origin = '0 0';
    }

    /**
     * リサイズ処理
     * @method resize
     */
    public resize(): void {
        this.scaleDown();
    }

    /**
     * スクリーン作成
     */
    public createScreen() {
        // y軸ラベル
        const labels: string[] = [];
        const startLabelNo = 65;
        const endLabelNo = 91;
        for (let i = startLabelNo; i < endLabelNo; i++) {
            labels.push(String.fromCharCode(i));
        }
        // 行ラベル
        this.lineLabels = [];
        // 列ラベル
        this.columnLabels = [];
        // 座席リスト
        const seats: IRow[] = [];

        const pos = { x: 0, y: 0 };
        let labelCount = 0;
        for (let y = 0; y < this.screenData.map.length; y++) {
            if (y === 0) {
                pos.y = 0;
            }
            // ポジション設定
            if (y === 0) {
                pos.y += this.screenData.seatStart.y;
            } else if (this.screenData.map[y].length === 0) {
                pos.y += this.screenData.aisle.middle.h - this.screenData.seatMargin.h;
            } else {
                labelCount++;
                pos.y += this.screenData.seatSize.h + this.screenData.seatMargin.h;
            }
            if (this.screenData.map[y].length > 0) {
                seats.push({
                    className: `seat-${labels[labelCount]}`,
                    code: labels[labelCount],
                    x: 0,
                    y: pos.y,
                    data: []
                });

                for (let x = 0; x < this.screenData.map[y].length; x++) {
                    if (x === 0) {
                        pos.x = this.screenData.seatStart.x;
                    }

                    // 座席ラベルHTML生成
                    if (x === 0 && this.screenData.lineLabel) {
                        this.lineLabels.push({
                            id: labelCount,
                            w: this.screenData.seatSize.w,
                            h: this.screenData.seatSize.h,
                            y: pos.y,
                            x: pos.x - this.screenData.seatLabelPos,
                            label: labels[labelCount]
                        });
                    }

                    if (this.screenData.map[y][x] === 8) {
                        pos.x += this.screenData.aisle.middle.w;
                    } else if (this.screenData.map[y][x] === 9) {
                        pos.x += this.screenData.aisle.middle.w;
                    } else if (this.screenData.map[y][x] === 10) {
                        pos.x += (this.screenData.seatSize.w / 2) + this.screenData.seatMargin.w;
                    } else if (this.screenData.map[y][x] === 11) {
                        pos.x += (this.screenData.seatSize.w / 2) + this.screenData.seatMargin.w;
                    }

                    // 座席番号HTML生成
                    if (y === 0 && this.screenData.columnLabel) {

                        const label = (this.screenData.seatNumberAlign === 'left')
                            ? String(x + 1)
                            : String(this.screenData.map[0].length - x);
                        this.columnLabels.push({
                            id: x,
                            w: this.screenData.seatSize.w,
                            h: this.screenData.seatSize.h,
                            y: pos.y - this.screenData.seatNumberPos,
                            x: pos.x,
                            label: label
                        });

                    }
                    if (this.screenData.map[y][x] === 1
                        || this.screenData.map[y][x] === 4
                        || this.screenData.map[y][x] === 5
                        || this.screenData.map[y][x] === 8
                        || this.screenData.map[y][x] === 10) {
                        // 座席HTML生成
                        const code = (() => {
                            if (this.screenData.codeType === 'coa') {
                                return (this.screenData.seatNumberAlign === 'left')
                                    ? `${toFull(labels[labelCount])}－${toFull(String(x + 1))}`
                                    : `${toFull(labels[labelCount])}－${toFull(String(this.screenData.map[y].length - x))}`;
                            }
                            return (this.screenData.seatNumberAlign === 'left')
                                ? `${labels[labelCount]}-${String(x + 1)}`
                                : `${labels[labelCount]}-${String(this.screenData.map[y].length - x)}`;
                        })();
                        const className = [`seat-${code}`];
                        let section = '';
                        let status = SeatStatus.Disabled;
                        let acceptedOffer;
                        // 席の状態変更
                        for (const screeningEventOffer of this.screeningEventOffers) {
                            section = screeningEventOffer.branchCode;
                            const findContainsPlaceResult = screeningEventOffer.containsPlace.find((containsPlace) => {
                                return (containsPlace.branchCode === code);
                            });
                            if (findContainsPlaceResult !== undefined
                                && findContainsPlaceResult.offers !== undefined) {
                                if (findContainsPlaceResult.offers[0].availability === factory.chevre.itemAvailability.InStock) {
                                    status = SeatStatus.Default;
                                }
                                acceptedOffer = {
                                    ticketedSeat: <factory.chevre.reservation.ISeat>{
                                        typeOf: findContainsPlaceResult.typeOf,
                                        seatingType: findContainsPlaceResult.seatingType,
                                        seatNumber: findContainsPlaceResult.branchCode,
                                        seatRow: '',
                                        seatSection: section
                                    }
                                };
                                break;
                            }
                        }
                        if (this.authorizeSeatReservation !== undefined
                            && this.authorizeSeatReservation.instrument !== undefined) {
                            if (this.authorizeSeatReservation.instrument.identifier === factory.service.webAPI.Identifier.Chevre) {
                                // chevre
                                const findResult = this.authorizeSeatReservation.object.acceptedOffer.find((offer) => {
                                    const chevreOffer = <factory.action.authorize.offer.seatReservation.IAcceptedOffer4chevre>offer;
                                    return (chevreOffer.ticketedSeat !== undefined
                                        && chevreOffer.ticketedSeat.seatNumber === code
                                        && chevreOffer.ticketedSeat.seatSection === section);
                                });
                                if (findResult !== undefined) {
                                    status = SeatStatus.Default;
                                }
                            }
                        }
                        if (this.screenData.hc.indexOf(code) !== -1) {
                            className.push('seat-hc');
                        }

                        const seat = {
                            className: className.join(' '),
                            w: this.screenData.seatSize.w,
                            h: this.screenData.seatSize.h,
                            y: 0,
                            x: pos.x,
                            code,
                            section,
                            status,
                            ticketedSeat: (acceptedOffer !== undefined) ? acceptedOffer.ticketedSeat : undefined
                        };
                        seats[labelCount].data.push(seat);
                    }
                    // ポジション設定
                    if (this.screenData.map[y][x] === 2) {
                        pos.x += this.screenData.aisle.middle.w + this.screenData.seatMargin.w;
                    } else if (this.screenData.map[y][x] === 3) {
                        pos.x += this.screenData.aisle.small.w + this.screenData.seatMargin.w;
                    } else if (this.screenData.map[y][x] === 4) {
                        pos.x += this.screenData.aisle.middle.w + this.screenData.seatSize.w + this.screenData.seatMargin.w;
                    } else if (this.screenData.map[y][x] === 5) {
                        pos.x += this.screenData.aisle.small.w + this.screenData.seatSize.w + this.screenData.seatMargin.w;
                    } else if (this.screenData.map[y][x] === 6) {
                        pos.x += this.screenData.aisle.middle.w + this.screenData.seatSize.w + this.screenData.seatMargin.w;
                    } else if (this.screenData.map[y][x] === 7) {
                        pos.x += this.screenData.aisle.small.w + this.screenData.seatSize.w + this.screenData.seatMargin.w;
                    } else {
                        pos.x += this.screenData.seatSize.w + this.screenData.seatMargin.w;
                    }
                }
            }
        }
        // スクリーンタイプ
        const screenType = (this.screenData.type === 1)
            ? 'screen-imax' : (this.screenData.type === 2)
                ? 'screen-4dx' : '';

        this.seats = seats;
        this.screenType = screenType;
        // console.log(this.seats);
    }

    public selectSeat(seat: ISeat) {
        if (this.isMobile() && !this.zoomState) {
            return;
        }
        if (seat.ticketedSeat === undefined
            || seat.status === SeatStatus.Disabled) {
            return;
        }
        if (this.screenData.hc.indexOf(seat.code) !== -1) {
            return;
        }
        this.select.emit({
            seat: seat.ticketedSeat,
            status: seat.status
        });
    }
}
