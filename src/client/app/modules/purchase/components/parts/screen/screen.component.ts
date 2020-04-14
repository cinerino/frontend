import {
    AfterContentChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { getProject, isFile } from '../../../../../functions';
import { IReservation, IReservationSeat } from '../../../../../models';
import { ILabel, IObject, IRow, IScreen, ISeat, SeatStatus } from '../../../../../models/purchase/screen';
import { UtilService } from '../../../../../services';

@Component({
    selector: 'app-screen',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit, AfterViewInit, AfterContentChecked {
    public static ZOOM_SCALE = 1;
    @Input() public openSeatingAllowed = false;
    @Input() public theaterCode: string;
    @Input() public screenCode: string;
    @Input() public screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
    @Input() public reservations: IReservation[];
    @Input() public authorizeSeatReservation?:
        factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>;
    @Output() public select = new EventEmitter<{ seat: IReservationSeat; status: SeatStatus; }>();
    public seats: IRow[];
    public lineLabels: ILabel[];
    public columnLabels: ILabel[];
    public screenType: string;
    public zoomState: boolean;
    public scale: number;
    public height: number;
    public origin: string;
    public screenData: IScreen;

    constructor(
        private utilService: UtilService,
        private elementRef: ElementRef
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        try {
            this.zoomState = false;
            this.scale = 1;
            this.height = 0;
            this.origin = '0 0';
            this.screenData = await this.getScreenData();
            this.createScreen();
            this.scaleDown();
        } catch (error) {
            console.error(error);
        }
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

    /**
     * 変更監視
     */
    public async ngAfterContentChecked() {
        if (this.screenData === undefined) {
            return;
        }
        this.changeStatus();
    }

    /**
     * 拡大許可判定
     */
    public isZoomAllowed(): boolean {
        const minWidth = 1346;
        const mobileWidth = 1024;
        return (window.innerWidth < mobileWidth || this.screenData.size.w > minWidth);
    }

    /**
     * スクリーン情報取得
     */
    public async getScreenData() {
        const now = moment().toISOString();
        const settingPath = 'json/theater/setting.json';
        const setting = (await isFile(`${getProject().storageUrl}/${settingPath}`))
            ? await this.utilService.getJson<IScreen>(`${getProject().storageUrl}/${settingPath}`)
            : await this.utilService.getJson<IScreen>(`/default/${settingPath}`);
        const screenPath = `json/theater/${this.theaterCode}/${this.screenCode}.json?date=${now}`;
        const screen = (await isFile(`${getProject().storageUrl}/${screenPath}`))
            ? await this.utilService.getJson<IScreen>(`${getProject().storageUrl}/${screenPath}`)
            : this.generateScreenMap(setting);
        const objects = screen.objects.map((o) => {
            return { ...o, image: o.image.replace('/storage', getProject().storageUrl) };
        });
        screen.objects = objects;
        return { ...setting, ...screen };
    }

    /**
     * 座席自動生成
     */
    public generateScreenMap(setting: IScreen) {
        if (this.screeningEventSeats.length === 0) {
            return {
                type: 0,
                size: { w: 0, h: 0 },
                objects: <IObject[]>[],
                seatStart: { x: 0, y: 0 },
                map: []
            };
        }
        const array: { branchCode: string; line: string; column: string; }[][] = [];
        this.screeningEventSeats.forEach((s) => {
            const branchCode = s.branchCode;
            const line = s.branchCode.split('-')[0];
            const column = s.branchCode.split('-')[1];
            const findResult = array.find(a => a.length > 0 && a[0].line === line);
            if (findResult === undefined) {
                array.push([{ branchCode, line, column }]);
                return;
            }
            findResult.push({ branchCode, line, column });
        });
        const lineMaxArray = array.reduce((a, b) => a[a.length - 1].line > b[a.length - 1].line ? a : b);
        const lineMax = lineMaxArray[lineMaxArray.length - 1].line;
        const columnMaxArray = array.reduce((a, b) => a[a.length - 1].column > b[a.length - 1].column ? a : b);
        const columnMax = Number(columnMaxArray[columnMaxArray.length - 1].column);
        const map: number[][] = [];
        const lineLabels = this.createLineLabel();
        for (const lineLabel of lineLabels) {
            if (lineLabel > lineMax) {
                break;
            }
            const findResult = array.find(a => a[0].line === lineLabel);
            const lineMap = [];
            for (let i = 0; i < columnMax; i++) {
                const column = String(i + 1);
                const result = (findResult === undefined || findResult.find(f => f.column === column) === undefined) ? 0 : 1;
                lineMap.push(result);
            }
            map.push(lineMap);
        }
        const space = 90;
        const screenSpace = space * 2 + 50;
        const minWidth = 1346;
        const size = {
            w: map[0].length * setting.seatSize.w + (map[0].length - 1) * setting.seatMargin.w + space * 2,
            h: map.length * setting.seatSize.h + (map.length - 1) * setting.seatMargin.h + space + screenSpace
        };

        return {
            type: 0,
            size: {
                w: (size.w < minWidth) ? minWidth : size.w,
                h: size.h
            },
            objects: <IObject[]>[],
            seatStart: {
                x: (size.w < minWidth) ? (minWidth - size.w) / 2 + space : space,
                y: screenSpace
            },
            map,
            style: '<style>.screen-object { display: block !important }</style>'
        };
    }

    /**
     * status変更
     */
    public changeStatus() {
        const reservations = this.reservations;
        this.seats.forEach((row) => {
            row.data.forEach((seat) => {
                if (seat.status === SeatStatus.Active) {
                    seat.status = SeatStatus.Default;
                }
                const findReservationSeatResult = reservations.find((reservation) => {
                    return (reservation.seat !== undefined
                        && reservation.seat.seatNumber === seat.code
                        && reservation.seat.seatSection === seat.section);
                });
                if (findReservationSeatResult !== undefined) {
                    seat.status = SeatStatus.Active;
                }
            });
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
        if (!this.isZoomAllowed()) {
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
     * 行ラベル作成
     */
    public createLineLabel() {
        const labels: string[] = [];
        const startLabelNo = 65;
        const endLabelNo = 91;
        for (let i = startLabelNo; i < endLabelNo; i++) {
            labels.push(String.fromCharCode(i));
        }
        return labels;
    }

    /**
     * スクリーン作成
     */
    public createScreen() {
        // y軸ラベル
        const labels = this.createLineLabel();
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
                            return (this.screenData.seatNumberAlign === 'left')
                                ? `${labels[labelCount]}-${String(x + 1)}`
                                : `${labels[labelCount]}-${String(this.screenData.map[y].length - x)}`;
                        })();
                        const className = [`seat-${code}`];
                        let section = '';
                        const row = '';
                        let status = SeatStatus.Disabled;
                        let acceptedOffer;
                        // 席の状態変更
                        this.screeningEventSeats.forEach((s) => {
                            if (s.containedInPlace !== undefined
                                && s.containedInPlace.branchCode !== undefined) {
                                section = s.containedInPlace.branchCode;
                            }
                            if (s.branchCode !== code || s.offers === undefined) {
                                return;
                            }
                            if (s.offers[0].availability === factory.chevre.itemAvailability.InStock) {
                                status = SeatStatus.Default;
                            }
                            acceptedOffer = {
                                ticketedSeat: <IReservationSeat>{
                                    typeOf: s.typeOf,
                                    seatingType: s.seatingType,
                                    seatNumber: s.branchCode,
                                    seatRow: row,
                                    seatSection: section,
                                    offers: s.offers
                                }
                            };
                        });
                        if (this.authorizeSeatReservation !== undefined
                            && this.authorizeSeatReservation.result !== undefined
                            && this.authorizeSeatReservation.result.responseBody.object.reservations !== undefined) {
                            // chevre
                            const findResult = this.authorizeSeatReservation.result.responseBody.object.reservations.find((r) => {
                                const ticketedSeat = r.reservedTicket.ticketedSeat;
                                return (ticketedSeat !== undefined
                                    && ticketedSeat.seatNumber === code
                                    && ticketedSeat.seatSection === section
                                    && ticketedSeat.seatRow === row);
                            });
                            if (findResult !== undefined) {
                                status = SeatStatus.Default;
                            }
                        }
                        if (this.screenData.hc !== undefined
                            && this.screenData.hc.indexOf(code) !== -1) {
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
        if (this.isZoomAllowed() && !this.zoomState) {
            return;
        }
        if (seat.ticketedSeat === undefined
            || seat.status === SeatStatus.Disabled) {
            return;
        }
        if (this.screenData.hc !== undefined
            && this.screenData.hc.indexOf(seat.code) !== -1) {
            return;
        }
        this.select.emit({
            seat: seat.ticketedSeat,
            status: seat.status
        });
    }
}
