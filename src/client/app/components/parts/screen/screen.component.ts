import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { ILabel, IReservationSeat, IScreen, ISeat, Reservation, SeatStatus } from '../../../models';

@Component({
    selector: 'app-screen',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit, OnChanges {
    public static ZOOM_SCALE = 1;
    @Input() public screenData: IScreen;
    @Input() public screeningEventOffers: factory.chevre.event.screeningEvent.IScreeningRoomSectionOffer[];
    @Input() public reservations: Reservation[];
    @Output() public select = new EventEmitter<{ seat: IReservationSeat; status: SeatStatus; }>();

    public seats: ISeat[];
    public screenType: string;
    public zoomState: boolean;
    public scale: number;
    public height: number;
    public origin: string;
    private isCreate = false;

    constructor(
        private elementRef: ElementRef
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {

    }

    public ngOnChanges() {
        if (this.screenData === undefined) {
            return;
        }
        if (this.height === 0) {
            this.scaleDown();
        }

        if (!this.isCreate) {
            this.zoomState = false;
            this.scale = 1;
            this.height = 0;
            this.origin = '0 0';
            this.createScreen();
            this.isCreate = true;
        }

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
    private changeStatus() {
        this.seats.forEach((seat) => {
            if (seat.status === SeatStatus.Active) {
                seat.status = SeatStatus.Default;
            }
            const findReservationSeatResult = this.reservations.find((reservation) => {
                return (reservation.seat.seatNumber === seat.code
                    && reservation.seat.seatSection === seat.section);
            });
            if (findReservationSeatResult !== undefined) {
                seat.status = SeatStatus.Active;
            }
        });
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
        const lineLabels: ILabel[] = [];
        // 列ラベル
        const columnLabels: ILabel[] = [];
        // 座席リスト
        const seats: ISeat[] = [];

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

            for (let x = 0; x < this.screenData.map[y].length; x++) {
                if (x === 0) {
                    pos.x = this.screenData.seatStart.x;
                }

                // 座席ラベルHTML生成
                if (x === 0) {
                    lineLabels.push({
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
                if (y === 0) {

                    const label = (this.screenData.seatNumberAlign === 'left')
                        ? String(x + 1)
                        : String(this.screenData.map[0].length - x);
                    columnLabels.push({
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
                    const code = (this.screenData.seatNumberAlign === 'left')
                        ? `${labels[labelCount]}-${String(x + 1)}`
                        : `${labels[labelCount]}-${String(this.screenData.map[y].length - x)}`;
                    const className = [`seat-${code}`];
                    let section = '';
                    let status = SeatStatus.Disabled;
                    // 席の状態変更
                    for (const screeningEventOffer of this.screeningEventOffers) {
                        section = screeningEventOffer.branchCode;
                        const findContainsPlaceResult = screeningEventOffer.containsPlace.find((containsPlace) => {
                            return (containsPlace.branchCode === code);
                        });
                        if (findContainsPlaceResult !== undefined
                            && findContainsPlaceResult.offers !== undefined) {
                            if (findContainsPlaceResult.offers[0].availability === 'InStock') {
                                // className.push('default');
                                status = SeatStatus.Default;
                            }
                            break;
                        }
                    }
                    // const findReservationSeatResult = this.reservations.find((reservation) => {
                    //     return (reservation.seat.seatNumber === code
                    //         && reservation.seat.seatSection === section);
                    // });
                    // if (findReservationSeatResult !== undefined) {
                    //     className.push('active');
                    //     status = SeatStatus.Active;
                    // }
                    // if (className.length === 1) {
                    //     className.push('disabled');
                    // }
                    if (this.screenData.hc.indexOf(code) !== -1) {
                        className.push('seat-hc');
                    }

                    const seat = {
                        className: className.join(' '),
                        w: this.screenData.seatSize.w,
                        h: this.screenData.seatSize.h,
                        y: pos.y,
                        x: pos.x,
                        code: code,
                        section: section,
                        status: status
                    };
                    seats.push(seat);
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
        // スクリーンタイプ
        const screenType = (this.screenData.type === 1)
            ? 'screen-imax' : (this.screenData.type === 2)
                ? 'screen-4dx' : '';

        this.seats = seats;
        this.screenType = screenType;
    }

    public seatSelect(seat: ISeat) {
        if (this.isMobile() && !this.zoomState) {
            return;
        }
        if (seat.status === SeatStatus.Disabled) {
            return;
        }
        this.select.emit({
            seat: {
                seatNumber: seat.code,
                seatSection: seat.section
            },
            status: seat.status
        });
    }
}
