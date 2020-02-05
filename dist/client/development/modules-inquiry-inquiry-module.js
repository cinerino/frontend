(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-inquiry-inquiry-module"],{

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.html":
/*!****************************************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.html ***!
  \****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'inquiry.confirm.title' | translate }}</h2>\n    <div *ngIf=\"(order | async).order.orderStatus === orderStatus.OrderReturned\">\n        <p class=\"mb-4 text-md-center\" [innerHTML]=\"'inquiry.confirm.canceled' | translate\"></p>\n    </div>\n    <div *ngIf=\"(order | async).order.orderStatus !== orderStatus.OrderReturned\">\n        <p class=\"mb-4 text-md-center\" [innerHTML]=\"'inquiry.confirm.read' | translate\"></p>\n        <div class=\"mb-4 px-3 py-2 bg-white\">\n            <div class=\"row align-items-center\">\n                <p class=\"col-4\">\n                    {{ 'common.confirmationNumber' | translate }}</p>\n                <p class=\"col-8 text-large text-info font-weight-bold\">\n                    {{ (order | async).order.confirmationNumber }}\n                </p>\n            </div>\n        </div>\n        <div *ngFor=\"let eventOrder of eventOrders\" class=\"mb-4 bg-white p-3\">\n            <div class=\"mb-3\">\n                <div class=\"mb-1\">\n                    <p class=\"font-weight-bold text-large\">{{ eventOrder.event.name | changeLanguage }}</p>\n                    <p class=\"text-small\"\n                        *ngIf=\"eventOrder.event.superEvent.headline && (eventOrder.event.superEvent.headline | changeLanguage)\">\n                        {{ eventOrder.event.superEvent.headline | changeLanguage }}</p>\n                    <p class=\"text-small\"\n                        *ngIf=\"eventOrder.event.superEvent.description && (eventOrder.event.superEvent.description | changeLanguage)\">{{\n                        eventOrder.event.superEvent.description | changeLanguage }}</p>\n                </div>\n                <p class=\"mb-1\">\n                    {{ eventOrder.event.startDate | formatDate: 'MM/DD(ddd) HH:mm' }}-{{ eventOrder.event.endDate | formatDate: 'HH:mm' }}\n                </p>\n                <p class=\"text-small mb-1\">\n                    <span class=\"theatre-name\">{{ eventOrder.event.superEvent.location.name | changeLanguage }}</span>\n                    <span class=\"screen-name\">&nbsp;/&nbsp;{{ eventOrder.event.location.name | changeLanguage }}</span>\n                    <span\n                        *ngIf=\"eventOrder.event.workPerformed?.duration && moment.duration(eventOrder.event.workPerformed?.duration).asMinutes() > 0\">\n                        &nbsp;/&nbsp;<span\n                            class=\"mr-1\">{{ 'common.duration' | translate }}</span>{{ moment.duration(eventOrder.event.workPerformed?.duration).asMinutes() }}{{ 'common.date.minute' | translate }}\n                    </span>\n                </p>\n            </div>\n            <hr class=\"mb-3\">\n            <div *ngIf=\"environment.DISPLAY_TICKETED_SEAT\">\n                <div *ngFor=\"let acceptedOffer of eventOrder.data\">\n                    <p>\n                        <span\n                            *ngIf=\"acceptedOffer.itemOffered.reservedTicket.ticketedSeat && environment.DISPLAY_TICKETED_SEAT\">\n                            {{ acceptedOffer.itemOffered.reservedTicket.ticketedSeat.seatNumber }}&nbsp;/&nbsp;</span>{{ acceptedOffer.itemOffered.reservedTicket.ticketType.name | changeLanguage }}&nbsp;/&nbsp;{{\n                            getItemPrice({ priceComponents: acceptedOffer.priceSpecification.priceComponent }) | currency : 'JPY' }}\n                    </p>\n                    <button *ngIf=\"environment.INQUIRY_QRCODE\"\n                        [disabled]=\"(order | async).order.orderStatus !== orderStatus.OrderDelivered\" type=\"button\"\n                        class=\"btn btn-primary btn-sm mt-2 mb-3\"\n                        (click)=\"openQRCodeViewer(acceptedOffer.itemOffered.id)\">{{ 'inquiry.confirm.next' | translate }}</button>\n                </div>\n            </div>\n\n            <div *ngIf=\"!environment.DISPLAY_TICKETED_SEAT\">\n                <div *ngFor=\"let ticket of changeTicketCountByOrder(eventOrder.data)\">\n                    <p>\n                        {{ ticket.acceptedOffer.itemOffered.reservedTicket.ticketType.name | changeLanguage }}&nbsp;/&nbsp;{{\n                            getItemPrice({ priceComponents: ticket.acceptedOffer.priceSpecification.priceComponent }) | currency : 'JPY' }}&nbsp;×&nbsp;{{ ticket.count }}\n                    </p>\n                </div>\n            </div>\n        </div>\n\n\n        <div class=\"mb-4 px-3 bg-white\">\n            <div class=\"py-3 border-bottom border-gray customer-name\">\n                <div class=\"row align-items-center\">\n                    <p class=\"mb-2 mb-md-0 col-md-4\">{{ 'common.customerName' | translate }}</p>\n                    <p class=\"col-md-8\">{{ (order | async).order.customer.familyName }}\n                        {{ (order | async).order.customer.givenName }}</p>\n                </div>\n            </div>\n            <div class=\"py-3 border-bottom border-gray email\">\n                <div class=\"row align-items-center\">\n                    <p class=\"mb-2 mb-md-0 col-md-4\">{{ 'common.email' | translate }}</p>\n                    <p class=\"col-md-8\">{{ (order | async).order.customer.email }}</p>\n                </div>\n            </div>\n            <div class=\"py-3 telephone\">\n                <div class=\"row align-items-center\">\n                    <p class=\"mb-2 mb-md-0 col-md-4\">{{ 'common.telephone' | translate }}</p>\n                    <p class=\"col-md-8\">{{ (order | async).order.customer.telephone | libphonenumberFormat }}</p>\n                </div>\n            </div>\n            <!-- <div class=\"py-3\" *ngIf=\"(order | async).order.price > 0\">\n                <div class=\"row align-items-center\">\n                    <p class=\"mb-2 mb-md-0 col-md-4\">{{ 'common.paymentMethod' | translate }}</p>\n                    <p class=\"col-md-8\">クレジットカード</p>\n                </div>\n            </div> -->\n        </div>\n    </div>\n\n\n    <div class=\"buttons mx-auto text-center\">\n        <div *ngIf=\"(order | async).order.orderStatus !== orderStatus.OrderReturned\">\n            <button *ngIf=\"environment.INQUIRY_PRINT\"\n                [disabled]=\"(order | async).order.orderStatus !== orderStatus.OrderDelivered\" type=\"button\"\n                class=\"btn btn-primary btn-block py-3 mb-3\" (click)=\"print()\"\n                [disabled]=\"isLoading | async\">{{ 'inquiry.confirm.print' | translate }}</button>\n            <button *ngIf=\"environment.INQUIRY_CANCEL\"\n                [disabled]=\"(order | async).order.orderStatus !== orderStatus.OrderDelivered\" type=\"button\"\n                class=\"btn btn-danger btn-block py-3 mb-3\"\n                (click)=\"cancelConfirm()\">{{ 'inquiry.confirm.cancel' | translate }}</button>\n        </div>\n        <button type=\"button\" class=\"btn btn-link\"\n            routerLink=\"/inquiry/input\">{{ 'inquiry.confirm.prev' | translate }}</button>\n    </div>\n</div>");

/***/ }),

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.html":
/*!************************************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.html ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <form [formGroup]=\"inquiryForm\">\n        <div class=\"mb-4\">\n            <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'inquiry.input.title' | translate }}</h2>\n            <p class=\"mb-4 text-md-center\" [innerHTML]=\"'inquiry.input.read' | translate\"></p>\n\n            <div class=\"inquiry-form mx-auto p-3 bg-white\">\n\n                <div class=\"form-group\">\n                    <label class=\"mb-2\" for=\"\">{{ 'common.confirmationNumber' | translate }}</label>\n                    <app-numeric-keypad *ngIf=\"environment.INQUIRY_INPUT_KEYPAD\" inputType=\"number\"\n                        [inputValue]=\"inquiryForm.controls.confirmationNumber.value\"\n                        (change)=\"changeConfirmationNumber($event)\">\n                        <input type=\"text\" class=\"form-control\" formControlName=\"confirmationNumber\"\n                            id=\"confirmationNumber\" [placeholder]=\"'form.placeholder.confirmationNumber' | translate\"\n                            readonly>\n                    </app-numeric-keypad>\n                    <input *ngIf=\"!environment.INQUIRY_INPUT_KEYPAD\" type=\"text\" class=\"form-control\"\n                        formControlName=\"confirmationNumber\" id=\"confirmationNumber\"\n                        [placeholder]=\"'form.placeholder.confirmationNumber' | translate\">\n                    <div *ngIf=\"inquiryForm.controls.confirmationNumber.invalid && inquiryForm.controls.confirmationNumber.touched\"\n                        class=\"mt-2\">\n                        <p *ngIf=\"inquiryForm.controls.confirmationNumber.errors.required\" class=\"text-danger\">\n                            {{ 'form.validation.required' | translate }}</p>\n                        <p *ngIf=\"inquiryForm.controls.confirmationNumber.errors.pattern\" class=\"text-danger\">\n                            {{ 'form.validation.number' | translate }}</p>\n                    </div>\n                </div>\n                <div class=\"form-group mb-0\">\n                    <label class=\"mb-2\" for=\"\">{{ 'common.telephone' | translate }}</label>\n                    <app-numeric-keypad *ngIf=\"environment.INQUIRY_INPUT_KEYPAD\" inputType=\"telephone\"\n                        [inputValue]=\"inquiryForm.controls.telephone.value\" (change)=\"changeTelephone($event)\">\n                        <input type=\"password\" class=\"form-control\" formControlName=\"telephone\" id=\"telephone\"\n                            [placeholder]=\"'form.placeholder.telephone' | translate\" readonly>\n                    </app-numeric-keypad>\n                    <input *ngIf=\"!environment.INQUIRY_INPUT_KEYPAD\" type=\"password\" class=\"form-control\"\n                        formControlName=\"telephone\" id=\"telephone\"\n                        [placeholder]=\"'form.placeholder.telephone' | translate\">\n                    <div *ngIf=\"inquiryForm.controls.telephone.invalid && inquiryForm.controls.telephone.touched\"\n                        class=\"mt-2\">\n                        <p *ngIf=\"inquiryForm.controls.telephone.errors.required\" class=\"text-danger\">\n                            {{ 'form.validation.required' | translate }}</p>\n                        <p *ngIf=\"inquiryForm.controls.telephone.errors.minlength\" class=\"text-danger\">\n                            {{ 'form.validation.minlength' | translate: { value: inquiryForm.controls.telephone.errors.minlength.requiredLength } }}\n                        </p>\n                        <p *ngIf=\"inquiryForm.controls.telephone.errors.maxlength\" class=\"text-danger\">\n                            {{ 'form.validation.maxlength' | translate: { value: inquiryForm.controls.telephone.errors.maxlength.requiredLength } }}\n                        </p>\n                        <p *ngIf=\"inquiryForm.controls.telephone.errors.pattern\" class=\"text-danger\">\n                            {{ 'form.validation.number' | translate }}</p>\n                        <p *ngIf=\"inquiryForm.controls.telephone.errors.telephone\" class=\"text-danger\">\n                            {{ 'form.validation.telephone' | translate }}</p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n\n        <div class=\"buttons mx-auto text-center\">\n            <button type=\"submit\" [disabled]=\"isLoading | async\" class=\"btn btn-primary btn-block py-3 mb-3\"\n                (click)=\"onSubmit()\">{{ 'inquiry.input.next' | translate }}</button>\n            <a *ngIf=\"environment.PORTAL_SITE_URL\" class=\"btn btn-link portal-link\"\n                [href]=\"environment.PORTAL_SITE_URL\">{{ 'inquiry.input.prev' | translate }}</a>\n            <button *ngIf=\"!environment.PORTAL_SITE_URL\" type=\"button\" class=\"btn btn-link\"\n                routerLink=\"/\">{{ 'inquiry.input.prev' | translate }}</button>\n        </div>\n    </form>\n</div>");

/***/ }),

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.html":
/*!************************************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.html ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <div class=\"mb-4\">\n        <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'inquiry.print.title' | translate }}</h2>\n        <p class=\"mb-4 text-md-center\" [innerHTML]=\"'inquiry.print.read' | translate\"></p>\n    </div>\n\n    <div class=\"buttons mx-auto text-center\">\n        <button type=\"button\" class=\"btn btn-primary btn-block py-3\" routerLink=\"/inquiry/input\">\n            {{ 'inquiry.print.prev' | translate }}\n        </button>\n    </div>\n</div>");

/***/ }),

/***/ "./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.scss":
/*!*********************************************************************************************!*\
  !*** ./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.scss ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL2lucXVpcnkvY29tcG9uZW50cy9wYWdlcy9pbnF1aXJ5LWNvbmZpcm0vaW5xdWlyeS1jb25maXJtLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.ts":
/*!*******************************************************************************************!*\
  !*** ./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: InquiryConfirmComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InquiryConfirmComponent", function() { return InquiryConfirmComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cinerino/api-javascript-client */ "../../node_modules/@cinerino/api-javascript-client/lib/index.js");
/* harmony import */ var _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ "../../node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./environments/environment.ts");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../functions */ "./app/functions/index.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../services */ "./app/services/index.ts");
/* harmony import */ var _store_reducers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../store/reducers */ "./app/store/reducers/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};










var InquiryConfirmComponent = /** @class */ (function () {
    function InquiryConfirmComponent(store, router, utilService, orderService, userService, translate, qrcodeService) {
        this.store = store;
        this.router = router;
        this.utilService = utilService;
        this.orderService = orderService;
        this.userService = userService;
        this.translate = translate;
        this.qrcodeService = qrcodeService;
        this.moment = moment__WEBPACK_IMPORTED_MODULE_5__;
        this.getItemPrice = _functions__WEBPACK_IMPORTED_MODULE_7__["getItemPrice"];
        this.changeTicketCountByOrder = _functions__WEBPACK_IMPORTED_MODULE_7__["changeTicketCountByOrder"];
        this.orderStatus = _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__["factory"].orderStatus;
        this.environment = Object(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["getEnvironment"])();
    }
    /**
     * 初期化
     */
    InquiryConfirmComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.eventOrders = [];
        this.error = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_9__["getError"]));
        this.order = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_9__["getOrder"]));
        this.user = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_9__["getUser"]));
        this.order.subscribe(function (value) {
            if (value.order === undefined) {
                _this.router.navigate(['/error']);
                return;
            }
            var order = value.order;
            _this.eventOrders = Object(_functions__WEBPACK_IMPORTED_MODULE_7__["order2EventOrders"])({ order: order });
        }).unsubscribe();
        if (this.environment.INQUIRY_PRINT_WAIT_TIME !== '') {
            var time = Number(this.environment.INQUIRY_PRINT_WAIT_TIME);
            this.timer = setTimeout(function () {
                _this.router.navigate(['/inquiry/input']);
            }, time);
        }
    };
    /**
     * 破棄
     */
    InquiryConfirmComponent.prototype.ngOnDestroy = function () {
        if (this.timer === undefined) {
            return;
        }
        clearTimeout(this.timer);
    };
    /**
     * QRコード表示
     */
    InquiryConfirmComponent.prototype.openQRCodeViewer = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var orderData, authorizeOrder, findResult, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.orderService.getData()];
                    case 1:
                        orderData = _a.sent();
                        if (orderData.order === undefined) {
                            throw new Error('order undefined');
                        }
                        return [4 /*yield*/, this.orderService.authorize(orderData.order)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.orderService.getData()];
                    case 3:
                        orderData = _a.sent();
                        authorizeOrder = orderData.order;
                        if (authorizeOrder === undefined) {
                            throw new Error('authorizeOrder undefined');
                        }
                        findResult = authorizeOrder.acceptedOffers.find(function (a) {
                            return (a.itemOffered.typeOf === _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__["factory"].chevre.reservationType.EventReservation
                                && a.itemOffered.id === id);
                        });
                        if (findResult === undefined) {
                            throw new Error('itemOffered notfound');
                        }
                        if (findResult.itemOffered.typeOf !== _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__["factory"].chevre.reservationType.EventReservation) {
                            throw new Error('itemOffered typeOf missmatch');
                        }
                        this.qrcodeService.openQRCodeViewer({
                            title: this.translate.instant('inquiry.confirm.qrcode.title'),
                            code: (findResult.itemOffered.reservedTicket.ticketToken)
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error(error_1);
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('inquiry.confirm.alert.authorize')
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * キャンセル確認
     */
    InquiryConfirmComponent.prototype.cancelConfirm = function () {
        var _this = this;
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('inquiry.confirm.confirm.cancel'),
            cb: function () { return __awaiter(_this, void 0, void 0, function () {
                var userData, orderData, orders, language, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, this.userService.getData()];
                        case 1:
                            userData = _a.sent();
                            return [4 /*yield*/, this.orderService.getData()];
                        case 2:
                            orderData = _a.sent();
                            if (orderData.order === undefined) {
                                throw new Error('order undefined');
                            }
                            orders = [orderData.order];
                            language = userData.language;
                            return [4 /*yield*/, this.orderService.cancel({ orders: orders, language: language })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.orderService.getData()];
                        case 4:
                            orderData = _a.sent();
                            if (orderData.order === undefined) {
                                throw new Error('order undefined');
                            }
                            return [4 /*yield*/, this.orderService.inquiry({
                                    confirmationNumber: orderData.order.confirmationNumber,
                                    customer: { telephone: orderData.order.customer.telephone }
                                })];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            error_2 = _a.sent();
                            this.utilService.openAlert({
                                title: this.translate.instant('common.error'),
                                body: "\n                        <p class=\"mb-4\">" + this.translate.instant('inquiry.confirm.alert.cancel') + "</p>\n                        <div class=\"p-3 bg-light-gray select-text error\">\n                            <code>" + error_2 + "</code>\n                        </div>"
                            });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); }
        });
    };
    /**
     * 印刷
     */
    InquiryConfirmComponent.prototype.print = function () {
        return __awaiter(this, void 0, void 0, function () {
            var today, limit, findResult, orderData, user, orders, pos, printer, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = moment__WEBPACK_IMPORTED_MODULE_5__().format('YYYYMMDD');
                        limit = moment__WEBPACK_IMPORTED_MODULE_5__(today)
                            .add(this.environment.INQUIRY_PRINT_EXPIRED_VALUE, this.environment.INQUIRY_PRINT_EXPIRED_UNIT)
                            .format('YYYYMMDD');
                        findResult = this.eventOrders.find(function (o) { return moment__WEBPACK_IMPORTED_MODULE_5__(o.event.startDate).format('YYYYMMDD') < limit; });
                        if (findResult !== undefined) {
                            this.utilService.openAlert({
                                title: this.translate.instant('common.error'),
                                body: this.translate.instant('inquiry.confirm.alert.printExpired')
                            });
                            return [2 /*return*/];
                        }
                        if (this.timer !== undefined) {
                            clearTimeout(this.timer);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.orderService.getData()];
                    case 2:
                        orderData = _a.sent();
                        return [4 /*yield*/, this.userService.getData()];
                    case 3:
                        user = _a.sent();
                        if (orderData.order === undefined
                            || user.pos === undefined
                            || user.printer === undefined) {
                            this.router.navigate(['/error']);
                            return [2 /*return*/];
                        }
                        orders = [orderData.order];
                        pos = user.pos;
                        printer = user.printer;
                        return [4 /*yield*/, this.orderService.print({ orders: orders, pos: pos, printer: printer })];
                    case 4:
                        _a.sent();
                        this.router.navigate(['/inquiry/print']);
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.error(error_3);
                        this.router.navigate(['/error']);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    InquiryConfirmComponent.ctorParameters = function () { return [
        { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_8__["UtilService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_8__["OrderService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_8__["UserService"] },
        { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_8__["QRCodeService"] }
    ]; };
    InquiryConfirmComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-inquiry-confirm',
            template: __importDefault(__webpack_require__(/*! raw-loader!./inquiry-confirm.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./inquiry-confirm.component.scss */ "./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _services__WEBPACK_IMPORTED_MODULE_8__["UtilService"],
            _services__WEBPACK_IMPORTED_MODULE_8__["OrderService"],
            _services__WEBPACK_IMPORTED_MODULE_8__["UserService"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"],
            _services__WEBPACK_IMPORTED_MODULE_8__["QRCodeService"]])
    ], InquiryConfirmComponent);
    return InquiryConfirmComponent;
}());



/***/ }),

/***/ "./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.scss":
/*!*****************************************************************************************!*\
  !*** ./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.scss ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".inquiry-form {\n  max-width: 500px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvYXBwL21vZHVsZXMvaW5xdWlyeS9jb21wb25lbnRzL3BhZ2VzL2lucXVpcnktaW5wdXQvQzpcXFVzZXJzXFxoYXRhZ3VjaGlcXERlc2t0b3BcXHdvcmtzcGFjZVxcQ2luZXJpbm9cXGZyb250ZW5kL3NyY1xcY2xpZW50XFxhcHBcXG1vZHVsZXNcXGlucXVpcnlcXGNvbXBvbmVudHNcXHBhZ2VzXFxpbnF1aXJ5LWlucHV0XFxpbnF1aXJ5LWlucHV0LmNvbXBvbmVudC5zY3NzIiwic3JjL2NsaWVudC9hcHAvbW9kdWxlcy9pbnF1aXJ5L2NvbXBvbmVudHMvcGFnZXMvaW5xdWlyeS1pbnB1dC9pbnF1aXJ5LWlucHV0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksZ0JBQUE7QUNDSiIsImZpbGUiOiJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL2lucXVpcnkvY29tcG9uZW50cy9wYWdlcy9pbnF1aXJ5LWlucHV0L2lucXVpcnktaW5wdXQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaW5xdWlyeS1mb3JtICB7XG4gICAgbWF4LXdpZHRoOiA1MDBweDtcbn0iLCIuaW5xdWlyeS1mb3JtIHtcbiAgbWF4LXdpZHRoOiA1MDBweDtcbn0iXX0= */");

/***/ }),

/***/ "./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.ts":
/*!***************************************************************************************!*\
  !*** ./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.ts ***!
  \***************************************************************************************/
/*! exports provided: InquiryInputComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InquiryInputComponent", function() { return InquiryInputComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ "../../node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var libphonenumber_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! libphonenumber-js */ "../../node_modules/libphonenumber-js/index.es6.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./environments/environment.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../services */ "./app/services/index.ts");
/* harmony import */ var _store_reducers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../store/reducers */ "./app/store/reducers/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};









var InquiryInputComponent = /** @class */ (function () {
    function InquiryInputComponent(store, formBuilder, utilService, orderService, router, translate) {
        this.store = store;
        this.formBuilder = formBuilder;
        this.utilService = utilService;
        this.orderService = orderService;
        this.router = router;
        this.translate = translate;
        this.environment = Object(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["getEnvironment"])();
    }
    /**
     * 初期化
     */
    InquiryInputComponent.prototype.ngOnInit = function () {
        this.isLoading = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_8__["getLoading"]));
        this.createInquiryForm();
    };
    /**
     * 照会フォーム作成
     */
    InquiryInputComponent.prototype.createInquiryForm = function () {
        var TEL_MAX_LENGTH = 15;
        var TEL_MIN_LENGTH = 9;
        this.inquiryForm = this.formBuilder.group({
            confirmationNumber: ['', [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(/^[0-9]+$/)
                ]],
            telephone: ['', [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(TEL_MAX_LENGTH),
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(TEL_MIN_LENGTH),
                    function (control) {
                        var field = control.root.get('telephone');
                        if (field !== null) {
                            if (field.value === '') {
                                return null;
                            }
                            var parsedNumber = (new RegExp(/^\+/).test(field.value))
                                ? libphonenumber_js__WEBPACK_IMPORTED_MODULE_5__["parse"](field.value)
                                : libphonenumber_js__WEBPACK_IMPORTED_MODULE_5__["parse"](field.value, 'JP');
                            if (parsedNumber.phone === undefined) {
                                return { telephone: true };
                            }
                            var isValid = libphonenumber_js__WEBPACK_IMPORTED_MODULE_5__["isValidNumber"](parsedNumber);
                            if (!isValid) {
                                return { telephone: true };
                            }
                        }
                        return null;
                    }
                ]]
        });
    };
    /**
     * 照会
     */
    InquiryInputComponent.prototype.onSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var confirmationNumber, telephone, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Object.keys(this.inquiryForm.controls).forEach(function (key) {
                            _this.inquiryForm.controls[key].markAsTouched();
                        });
                        this.inquiryForm.controls.confirmationNumber.setValue(document.getElementById('confirmationNumber').value);
                        this.inquiryForm.controls.telephone.setValue(document.getElementById('telephone').value);
                        if (this.inquiryForm.invalid) {
                            return [2 /*return*/];
                        }
                        confirmationNumber = this.inquiryForm.controls.confirmationNumber.value;
                        telephone = this.inquiryForm.controls.telephone.value;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.orderService.inquiry({
                                confirmationNumber: confirmationNumber,
                                customer: { telephone: telephone }
                            })];
                    case 2:
                        _a.sent();
                        this.router.navigate(['/inquiry/confirm']);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('inquiry.input.validation')
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 確認番号変更
     */
    InquiryInputComponent.prototype.changeConfirmationNumber = function (value) {
        this.inquiryForm.controls.confirmationNumber.setValue(value);
    };
    /**
     * 電話番号変更
     */
    InquiryInputComponent.prototype.changeTelephone = function (value) {
        this.inquiryForm.controls.telephone.setValue(value);
    };
    InquiryInputComponent.ctorParameters = function () { return [
        { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"] },
        { type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_7__["UtilService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_7__["OrderService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"] }
    ]; };
    InquiryInputComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-inquiry-input',
            template: __importDefault(__webpack_require__(/*! raw-loader!./inquiry-input.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./inquiry-input.component.scss */ "./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _services__WEBPACK_IMPORTED_MODULE_7__["UtilService"],
            _services__WEBPACK_IMPORTED_MODULE_7__["OrderService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"]])
    ], InquiryInputComponent);
    return InquiryInputComponent;
}());



/***/ }),

/***/ "./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.scss":
/*!*****************************************************************************************!*\
  !*** ./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.scss ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL2lucXVpcnkvY29tcG9uZW50cy9wYWdlcy9pbnF1aXJ5LXByaW50L2lucXVpcnktcHJpbnQuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.ts":
/*!***************************************************************************************!*\
  !*** ./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.ts ***!
  \***************************************************************************************/
/*! exports provided: InquiryPrintComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InquiryPrintComponent", function() { return InquiryPrintComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../environments/environment */ "./environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};



var InquiryPrintComponent = /** @class */ (function () {
    function InquiryPrintComponent(router) {
        this.router = router;
        this.environment = Object(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["getEnvironment"])();
    }
    /**
     * 初期化
     */
    InquiryPrintComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME === '') {
            return;
        }
        var time = Number(this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME);
        this.timer = setTimeout(function () {
            _this.router.navigate(['/inquiry/input']);
        }, time);
    };
    /**
     * 破棄
     */
    InquiryPrintComponent.prototype.ngOnDestroy = function () {
        if (this.timer === undefined) {
            return;
        }
        clearTimeout(this.timer);
    };
    InquiryPrintComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }
    ]; };
    InquiryPrintComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-inquiry-print',
            template: __importDefault(__webpack_require__(/*! raw-loader!./inquiry-print.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./inquiry-print.component.scss */ "./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], InquiryPrintComponent);
    return InquiryPrintComponent;
}());



/***/ }),

/***/ "./app/modules/inquiry/inquiry-routing.module.ts":
/*!*******************************************************!*\
  !*** ./app/modules/inquiry/inquiry-routing.module.ts ***!
  \*******************************************************/
/*! exports provided: InquiryRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InquiryRoutingModule", function() { return InquiryRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_pages_base_base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/components/pages/base/base.component */ "./app/modules/shared/components/pages/base/base.component.ts");
/* harmony import */ var _components_pages_inquiry_confirm_inquiry_confirm_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/pages/inquiry-confirm/inquiry-confirm.component */ "./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.ts");
/* harmony import */ var _components_pages_inquiry_input_inquiry_input_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/pages/inquiry-input/inquiry-input.component */ "./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.ts");
/* harmony import */ var _components_pages_inquiry_print_inquiry_print_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/pages/inquiry-print/inquiry-print.component */ "./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};






var routes = [
    {
        path: '',
        component: _shared_components_pages_base_base_component__WEBPACK_IMPORTED_MODULE_2__["BaseComponent"],
        children: [
            { path: 'input', component: _components_pages_inquiry_input_inquiry_input_component__WEBPACK_IMPORTED_MODULE_4__["InquiryInputComponent"] },
            { path: 'confirm', component: _components_pages_inquiry_confirm_inquiry_confirm_component__WEBPACK_IMPORTED_MODULE_3__["InquiryConfirmComponent"] },
            { path: 'print', component: _components_pages_inquiry_print_inquiry_print_component__WEBPACK_IMPORTED_MODULE_5__["InquiryPrintComponent"] }
        ]
    }
];
var InquiryRoutingModule = /** @class */ (function () {
    function InquiryRoutingModule() {
    }
    InquiryRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], InquiryRoutingModule);
    return InquiryRoutingModule;
}());



/***/ }),

/***/ "./app/modules/inquiry/inquiry.module.ts":
/*!***********************************************!*\
  !*** ./app/modules/inquiry/inquiry.module.ts ***!
  \***********************************************/
/*! exports provided: InquiryModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InquiryModule", function() { return InquiryModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/shared.module */ "./app/modules/shared/shared.module.ts");
/* harmony import */ var _components_pages_inquiry_confirm_inquiry_confirm_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/pages/inquiry-confirm/inquiry-confirm.component */ "./app/modules/inquiry/components/pages/inquiry-confirm/inquiry-confirm.component.ts");
/* harmony import */ var _components_pages_inquiry_input_inquiry_input_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/pages/inquiry-input/inquiry-input.component */ "./app/modules/inquiry/components/pages/inquiry-input/inquiry-input.component.ts");
/* harmony import */ var _components_pages_inquiry_print_inquiry_print_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/pages/inquiry-print/inquiry-print.component */ "./app/modules/inquiry/components/pages/inquiry-print/inquiry-print.component.ts");
/* harmony import */ var _inquiry_routing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./inquiry-routing.module */ "./app/modules/inquiry/inquiry-routing.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};







var InquiryModule = /** @class */ (function () {
    function InquiryModule() {
    }
    InquiryModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _components_pages_inquiry_input_inquiry_input_component__WEBPACK_IMPORTED_MODULE_4__["InquiryInputComponent"],
                _components_pages_inquiry_confirm_inquiry_confirm_component__WEBPACK_IMPORTED_MODULE_3__["InquiryConfirmComponent"],
                _components_pages_inquiry_print_inquiry_print_component__WEBPACK_IMPORTED_MODULE_5__["InquiryPrintComponent"],
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _inquiry_routing_module__WEBPACK_IMPORTED_MODULE_6__["InquiryRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"],
            ]
        })
    ], InquiryModule);
    return InquiryModule;
}());



/***/ })

}]);
//# sourceMappingURL=modules-inquiry-inquiry-module.js.map