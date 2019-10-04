(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-order-order-module"],{

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/order/components/pages/order-search/order-search.component.html":
/*!********************************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/order/components/pages/order-search/order-search.component.html ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'order.list.title' | translate }}</h2>\n    <p class=\"mb-4 text-md-center\" [innerHTML]=\"'order.list.read' | translate\"></p>\n    <div class=\"conditions p-3 bg-white mb-4\">\n        <form (submit)=\"orderSearch(true)\">\n            <div class=\"form-row\">\n                <div class=\"form-group col-md-3\">\n                    <label for=\"orderDateFrom\"\n                        class=\"mb-2\">{{ 'order.list.conditions.orderDateFrom' | translate }}</label>\n                    <input type=\"date\" class=\"form-control\" name=\"orderDateFrom\" id=\"orderDateFrom\"\n                        [(ngModel)]=\"conditions.orderDateFrom\" placeholder=\"{{ moment().format('YYYY-MM-DD') }}\">\n                </div>\n                <div class=\"form-group col-md-3\">\n                    <label for=\"orderDateThrough\"\n                        class=\"mb-2\">{{ 'order.list.conditions.orderDateThrough' | translate }}</label>\n                    <input type=\"date\" class=\"form-control\" name=\"orderDateThrough\" id=\"orderDateThrough\"\n                        [(ngModel)]=\"conditions.orderDateThrough\" placeholder=\"{{ moment().format('YYYY-MM-DD') }}\">\n                </div>\n                <div class=\"form-group col-md-3\">\n                    <label for=\"confirmationNumber\" class=\"mb-2\">{{ 'common.confirmationNumber' | translate }}</label>\n                    <input type=\"text\" class=\"form-control\" name=\"confirmationNumber\" id=\"confirmationNumber\"\n                        [(ngModel)]=\"conditions.confirmationNumber\"\n                        placeholder=\"{{ 'common.confirmationNumber' | translate }}\">\n                </div>\n                <div class=\"form-group col-md-3\">\n                    <label for=\"orderNumber\" class=\"mb-2\">{{ 'common.orderNumber' | translate }}</label>\n                    <input type=\"text\" class=\"form-control\" name=\"orderNumber\" id=\"orderNumber\"\n                        [(ngModel)]=\"conditions.orderNumber\" placeholder=\"{{ 'common.orderNumber' | translate }}\">\n                </div>\n            </div>\n            <!-- <div class=\"form-row\">\n                <div class=\"form-group col-md-6\">\n                    <label for=\"familyName\" class=\"mb-2\">セイ</label>\n                    <input type=\"text\" class=\"form-control\" name=\"familyName\" id=\"familyName\" [(ngModel)]=\"conditions.customer.familyName\"\n                        placeholder=\"セイ\">\n                </div>\n                <div class=\"form-group col-md-6\">\n                    <label for=\"givenName\" class=\"mb-2\">メイ</label>\n                    <input type=\"text\" class=\"form-control\" name=\"givenName\" id=\"givenName\" [(ngModel)]=\"conditions.customer.givenName\"\n                        placeholder=\"メイ\">\n                </div>\n            </div>\n            <div class=\"form-row\">\n                <div class=\"form-group col-md-6\">\n                    <label for=\"email\" class=\"mb-2\">メールアドレス</label>\n                    <input type=\"email\" class=\"form-control\" name=\"email\" id=\"email\" [(ngModel)]=\"conditions.customer.email\"\n                        placeholder=\"メールアドレス\">\n                </div>\n                <div class=\"form-group col-md-6\">\n                    <label for=\"telephone\" class=\"mb-2\">電話番号（下4桁）</label>\n                    <input type=\"telephone\" class=\"form-control\" name=\"telephone\" id=\"telephone\" [(ngModel)]=\"conditions.customer.telephone\"\n                        placeholder=\"電話番号\">\n                </div>\n            </div> -->\n            <div class=\"form-row\">\n                <div class=\"form-group col-md-3\">\n                    <label for=\"sellerId\" class=\"mb-2\">{{ 'common.theater' | translate }}</label>\n                    <select class=\"form-control\" name=\"sellerId\" id=\"sellerId\" [(ngModel)]=\"conditions.sellerId\">\n                        <option [value]=\"''\">{{ 'common.all' | translate }}</option>\n                        <option *ngFor=\"let theater of (master | async).sellers\" [value]=\"theater.id\">{{\n                            theater.name | changeLanguage }}</option>\n                    </select>\n                </div>\n                <div class=\"form-group col-md-3\">\n                    <label for=\"orderStatus\" class=\"mb-2\">{{ 'common.orderStatus' | translate }}</label>\n                    <select class=\"form-control\" name=\"orderStatus\" id=\"orderStatus\"\n                        [(ngModel)]=\"conditions.orderStatuses\">\n                        <option [value]=\"''\">{{ 'common.all' | translate }}</option>\n                        <!-- <option [value]=\"orderStatus.OrderCancelled\">{{ 'order.list.orderStatus.orderCancelled' | translate }}</option> -->\n                        <option [value]=\"orderStatus.OrderDelivered\">\n                            {{ 'order.list.orderStatus.orderDelivered' | translate }}</option>\n                        <!-- <option [value]=\"orderStatus.OrderPaymentDue\">{{ 'order.list.orderStatus.orderPaymentDue' | translate }}</option> -->\n                        <!-- <option [value]=\"orderStatus.OrderPickupAvailable\">{{ 'order.list.orderStatus.orderPickupAvailable' | translate }}</option> -->\n                        <!-- <option [value]=\"orderStatus.OrderProblem\">{{ 'order.list.orderStatus.orderProblem' | translate }}</option> -->\n                        <option [value]=\"orderStatus.OrderProcessing\">\n                            {{ 'order.list.orderStatus.orderProcessing' | translate }}</option>\n                        <option [value]=\"orderStatus.OrderReturned\">\n                            {{ 'order.list.orderStatus.orderReturned' | translate }}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"buttons mx-auto text-center\">\n                <button type=\"submit\" class=\"btn btn-primary btn-block py-3\"\n                    [disabled]=\"isLoading | async\">{{ 'order.list.search' | translate }}</button>\n            </div>\n        </form>\n    </div>\n    <p *ngIf=\"(order | async).orders.length === 0\">{{ 'order.list.notfound' | translate }}</p>\n\n    <div *ngIf=\"(order | async).orders.length > 0\">\n        <div class=\"d-md-flex align-items-center justify-content-between mb-4\">\n            <div class=\"text-md-right text-center mb-3 mb-md-0 order-2\">\n                <div class=\"d-inline-block\">\n                    <pagination [(ngModel)]=\"confirmedConditions.page\" [totalItems]=\"(order | async).pageCount * 10\"\n                        [maxSize]=\"5\" [boundaryLinks]=\"false\" (pageChanged)=\"orderSearch(false, $event)\"\n                        previousText=\"&lsaquo;\" nextText=\"&rsaquo;\" firstText=\"&laquo;\" lastText=\"&raquo;\"></pagination>\n                </div>\n            </div>\n            <div class=\"form-group text-center text-md-left mb-3 mb-md-0 order-1\">\n                <select class=\"form-control d-inline-block w-auto mr-2\" name=\"actionSelect\" id=\"actionSelect\"\n                    [(ngModel)]=\"actionSelect\">\n                    <option value=\"\">{{ 'order.list.unselected' | translate }}</option>\n                    <option [value]=\"OrderActions.Cancel\">{{ 'order.list.cancel' | translate }}</option>\n                </select>\n                <button type=\"button\" class=\"btn btn-primary py-2 px-4\"\n                    (click)=\"selecedtAction()\">{{ 'order.list.apply' | translate }}</button>\n            </div>\n        </div>\n\n        <div class=\"scroll-horizontal\">\n            <table class=\"table bg-white border text-small mb-0\">\n                <thead>\n                    <tr>\n                        <th scope=\"col\"></th>\n                        <th scope=\"col\">{{ 'common.orderDate' | translate }}</th>\n                        <th scope=\"col\">{{ 'common.confirmationNumber' | translate }}</th>\n                        <th scope=\"col\">{{ 'common.event' | translate }}</th>\n                        <th scope=\"col\">{{ 'common.customer' | translate }}</th>\n                        <!-- <th scope=\"col\">決済方法</th> -->\n                        <!-- <th scope=\"col\">注文ステータス</th> -->\n                        <th scope=\"col\"></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr *ngFor=\"let order of (order | async).orders let index = index\"\n                        [class.bg-light-gray]=\"index % 2 === 0\">\n                        <td class=\"align-middle text-large text-center\">\n                            <i *ngIf=\"!isSelected(order)\" class=\"far fa-square pointer\" (click)=\"addOrder(order)\"></i>\n                            <i *ngIf=\"isSelected(order)\" class=\"far fa-check-square pointer\"\n                                (click)=\"removeOrder(order)\"></i>\n                        </td>\n                        <td class=\"align-middle\">\n                            <p>{{ order.orderDate | formatDate: 'YYYY/MM/DD (ddd) HH:mm' }}</p>\n                        </td>\n                        <td class=\"align-middle\">{{ order.confirmationNumber }}</td>\n                        <td class=\"align-middle\">\n                            <div *ngFor=\"let acceptedOffer of order.acceptedOffers\">\n                                <p *ngIf=\"(acceptedOffer.itemOffered.reservationFor.name | changeLanguage).length > 10\">{{\n                                    acceptedOffer.itemOffered.reservationFor.name | changeLanguage | slice:0:10 }}</p>\n                                <p\n                                    *ngIf=\"!((acceptedOffer.itemOffered.reservationFor.name | changeLanguage).length > 10)\">{{\n                                    acceptedOffer.itemOffered.reservationFor.name | changeLanguage }}</p>\n                                <p>\n                                    <span class=\"theatre-name\">{{ acceptedOffer.itemOffered.reservationFor.superEvent.location.name | changeLanguage }}</span>\n                                    <span class=\"screen-name\">&nbsp;/&nbsp;{{ acceptedOffer.itemOffered.reservationFor.location.name | changeLanguage }}</span>\n                                </p>\n                                <p>{{ acceptedOffer.itemOffered.reservationFor.startDate | formatDate: 'YYYY/MM/DD (ddd) HH:mm' }}\n                                    -</p>\n                            </div>\n                        </td>\n                        <td class=\"align-middle\">{{ order.customer.familyName }} {{ order.customer.givenName }}</td>\n                        <!-- <td class=\"align-middle\">\n                            <div *ngFor=\"let paymentMethod of order.paymentMethods\">\n                                <p>{{ paymentMethod.name }}</p>\n                            </div>\n                        </td> -->\n                        <!-- <td class=\"align-middle\">\n                            {{ order.orderStatus }}\n                        </td> -->\n                        <td class=\"align-middle\">\n                            <button class=\"btn btn-primary mr-2\" (click)=\"openDetail(order)\"><i\n                                    class=\"fas fa-search-plus\"></i></button>\n                            <button [disabled]=\"order.orderStatus !== orderStatus.OrderDelivered\"\n                                class=\"btn btn-primary mr-2\" (click)=\"openQrCode(order)\"><i\n                                    class=\"fas fa-qrcode\"></i></button>\n                            <button\n                                [disabled]=\"order.orderStatus !== orderStatus.OrderDelivered && order.orderStatus === orderStatus.OrderReturned\"\n                                class=\"btn btn-primary\" (click)=\"cancelConfirm([order])\"><i\n                                    class=\"fas fa-trash-alt\"></i></button>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n\n\n    </div>\n</div>");

/***/ }),

/***/ "./app/modules/order/components/pages/order-search/order-search.component.scss":
/*!*************************************************************************************!*\
  !*** ./app/modules/order/components/pages/order-search/order-search.component.scss ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".scroll-horizontal .table {\n  min-width: 900px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvYXBwL21vZHVsZXMvb3JkZXIvY29tcG9uZW50cy9wYWdlcy9vcmRlci1zZWFyY2gvQzpcXFVzZXJzXFxoYXRhZ3VjaGlcXERlc2t0b3BcXHdvcmtzcGFjZVxcQ2luZXJpbm9cXGZyb250ZW5kL3NyY1xcY2xpZW50XFxhcHBcXG1vZHVsZXNcXG9yZGVyXFxjb21wb25lbnRzXFxwYWdlc1xcb3JkZXItc2VhcmNoXFxvcmRlci1zZWFyY2guY29tcG9uZW50LnNjc3MiLCJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL29yZGVyL2NvbXBvbmVudHMvcGFnZXMvb3JkZXItc2VhcmNoL29yZGVyLXNlYXJjaC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLSTtFQUNJLGdCQUFBO0FDSlIiLCJmaWxlIjoic3JjL2NsaWVudC9hcHAvbW9kdWxlcy9vcmRlci9jb21wb25lbnRzL3BhZ2VzL29yZGVyLXNlYXJjaC9vcmRlci1zZWFyY2guY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IFwibm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9zY3NzL2Z1bmN0aW9uc1wiO1xuQGltcG9ydCBcIm5vZGVfbW9kdWxlcy9ib290c3RyYXAvc2Nzcy92YXJpYWJsZXNcIjtcbkBpbXBvcnQgXCJub2RlX21vZHVsZXMvYm9vdHN0cmFwL3Njc3MvbWl4aW5zXCI7XG5cbi5zY3JvbGwtaG9yaXpvbnRhbCB7XG4gICAgLnRhYmxlIHtcbiAgICAgICAgbWluLXdpZHRoOiA5MDBweDtcbiAgICB9XG59XG5cbiIsIi5zY3JvbGwtaG9yaXpvbnRhbCAudGFibGUge1xuICBtaW4td2lkdGg6IDkwMHB4O1xufSJdfQ== */");

/***/ }),

/***/ "./app/modules/order/components/pages/order-search/order-search.component.ts":
/*!***********************************************************************************!*\
  !*** ./app/modules/order/components/pages/order-search/order-search.component.ts ***!
  \***********************************************************************************/
/*! exports provided: OrderSearchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderSearchComponent", function() { return OrderSearchComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cinerino/api-javascript-client */ "../../node_modules/@cinerino/api-javascript-client/lib/index.js");
/* harmony import */ var _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ "../../node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../models */ "./app/models/index.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../services */ "./app/services/index.ts");
/* harmony import */ var _store_reducers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../store/reducers */ "./app/store/reducers/index.ts");
/* harmony import */ var _shared_components_parts_order_detail_modal_order_detail_modal_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../shared/components/parts/order-detail-modal/order-detail-modal.component */ "./app/modules/shared/components/parts/order-detail-modal/order-detail-modal.component.ts");
/* harmony import */ var _shared_components_parts_qrcode_modal_qrcode_modal_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../shared/components/parts/qrcode-modal/qrcode-modal.component */ "./app/modules/shared/components/parts/qrcode-modal/qrcode-modal.component.ts");
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












var OrderSearchComponent = /** @class */ (function () {
    function OrderSearchComponent(store, modal, router, userService, utilService, orderService, translate) {
        this.store = store;
        this.modal = modal;
        this.router = router;
        this.userService = userService;
        this.utilService = utilService;
        this.orderService = orderService;
        this.translate = translate;
        this.moment = moment__WEBPACK_IMPORTED_MODULE_5__;
        this.orderStatus = _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__["factory"].orderStatus;
        this.OrderActions = _models__WEBPACK_IMPORTED_MODULE_7__["OrderActions"];
    }
    /**
     * 初期化
     */
    OrderSearchComponent.prototype.ngOnInit = function () {
        this.actionSelect = '';
        this.selectedOrders = [];
        this.isLoading = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_9__["getLoading"]));
        this.error = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_9__["getError"]));
        this.master = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_9__["getMaster"]));
        this.order = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_9__["getOrder"]));
        this.limit = 20;
        this.conditions = {
            sellerId: '',
            orderDateFrom: '',
            orderDateThrough: '',
            confirmationNumber: '',
            orderNumber: '',
            customer: {
                familyName: '',
                givenName: '',
                email: '',
                telephone: ''
            },
            orderStatuses: '',
            page: 1
        };
        this.orderService.delete();
    };
    /**
     * 注文選択判定
     * @param order
     */
    OrderSearchComponent.prototype.isSelected = function (order) {
        var findResult = this.selectedOrders.find(function (o) { return o.orderNumber === order.orderNumber; });
        return findResult !== undefined;
    };
    /**
     * 注文を選択へ変更
     * @param order
     */
    OrderSearchComponent.prototype.addOrder = function (order) {
        this.selectedOrders.push(order);
    };
    /**
     * 注文を未選択へ変更
     * @param order
     */
    OrderSearchComponent.prototype.removeOrder = function (order) {
        var findIndex = this.selectedOrders.findIndex(function (o) { return o.orderNumber === order.orderNumber; });
        this.selectedOrders.splice(findIndex, 1);
    };
    /**
     * 注文を検索
     * @param changeConditions
     */
    OrderSearchComponent.prototype.orderSearch = function (changeConditions, event) {
        return __awaiter(this, void 0, void 0, function () {
            var params, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.selectedOrders = [];
                        if (event !== undefined) {
                            this.confirmedConditions.page = event.page;
                        }
                        if (changeConditions) {
                            this.confirmedConditions = {
                                sellerId: this.conditions.sellerId,
                                orderDateFrom: this.conditions.orderDateFrom,
                                orderDateThrough: this.conditions.orderDateThrough,
                                confirmationNumber: this.conditions.confirmationNumber,
                                orderNumber: this.conditions.orderNumber,
                                customer: {
                                    familyName: this.conditions.customer.familyName,
                                    givenName: this.conditions.customer.givenName,
                                    email: this.conditions.customer.email,
                                    telephone: this.conditions.customer.telephone
                                },
                                orderStatuses: this.conditions.orderStatuses,
                                page: 1
                            };
                        }
                        params = {
                            seller: {
                                ids: (this.confirmedConditions.sellerId === '')
                                    ? undefined : [this.confirmedConditions.sellerId]
                            },
                            customer: {
                                email: (this.confirmedConditions.customer.email === '')
                                    ? undefined : this.confirmedConditions.customer.email,
                                telephone: (this.confirmedConditions.customer.telephone === '')
                                    ? undefined : this.confirmedConditions.customer.telephone,
                                familyName: (this.confirmedConditions.customer.familyName === '')
                                    ? undefined : this.confirmedConditions.customer.familyName,
                                givenName: (this.confirmedConditions.customer.givenName === '')
                                    ? undefined : this.confirmedConditions.customer.givenName,
                            },
                            orderStatuses: (this.confirmedConditions.orderStatuses === '')
                                ? undefined : [this.confirmedConditions.orderStatuses],
                            orderDateFrom: (this.confirmedConditions.orderDateFrom === '')
                                ? moment__WEBPACK_IMPORTED_MODULE_5__('1970-01-01').toDate() : moment__WEBPACK_IMPORTED_MODULE_5__(this.confirmedConditions.orderDateFrom).toDate(),
                            orderDateThrough: (this.confirmedConditions.orderDateThrough === '')
                                ? moment__WEBPACK_IMPORTED_MODULE_5__().add(1, 'day').toDate() : moment__WEBPACK_IMPORTED_MODULE_5__(this.confirmedConditions.orderDateThrough).add(1, 'day').toDate(),
                            confirmationNumbers: (this.confirmedConditions.confirmationNumber === '')
                                ? undefined : [this.confirmedConditions.confirmationNumber],
                            orderNumbers: (this.confirmedConditions.orderNumber === '')
                                ? undefined : [this.confirmedConditions.orderNumber],
                            limit: this.limit,
                            page: this.confirmedConditions.page,
                            sort: {
                                orderDate: _cinerino_api_javascript_client__WEBPACK_IMPORTED_MODULE_2__["factory"].sortType.Descending
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.orderService.search(params)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.router.navigate(['/error']);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * キャンセル確認
     */
    OrderSearchComponent.prototype.cancelConfirm = function (orders) {
        var _this = this;
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('order.list.confirm.cancel'),
            cb: function () { return __awaiter(_this, void 0, void 0, function () {
                var userData, language, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.userService.getData()];
                        case 1:
                            userData = _a.sent();
                            language = userData.language;
                            return [4 /*yield*/, this.orderService.cancel({ orders: orders, language: language })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error(error_2);
                            this.utilService.openAlert({
                                title: this.translate.instant('common.error'),
                                body: "\n                        <p class=\"mb-4\">" + this.translate.instant('order.list.alert.cancel') + "</p>\n                        <div class=\"p-3 bg-light-gray select-text error\">\n                            <code>" + error_2 + "</code>\n                        </div>"
                            });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }
        });
    };
    /**
     * 詳細を表示
     */
    OrderSearchComponent.prototype.openDetail = function (order) {
        this.modal.show(_shared_components_parts_order_detail_modal_order_detail_modal_component__WEBPACK_IMPORTED_MODULE_10__["OrderDetailModalComponent"], {
            initialState: { order: order },
            class: 'modal-dialog-centered'
        });
    };
    /**
     * 選択した注文へのアクション
     */
    OrderSearchComponent.prototype.selecedtAction = function () {
        var _this = this;
        if (this.selectedOrders.length === 0) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('order.list.alert.unselected')
            });
        }
        if (this.actionSelect === _models__WEBPACK_IMPORTED_MODULE_7__["OrderActions"].Cancel) {
            this.utilService.openConfirm({
                title: this.translate.instant('common.confirm'),
                body: this.translate.instant('order.list.confirm.cancel'),
                cb: function () { return __awaiter(_this, void 0, void 0, function () {
                    var userData, language, error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, this.userService.getData()];
                            case 1:
                                userData = _a.sent();
                                language = userData.language;
                                return [4 /*yield*/, this.orderService.cancel({
                                        orders: this.selectedOrders,
                                        language: language
                                    })];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                error_3 = _a.sent();
                                console.error(error_3);
                                this.utilService.openAlert({
                                    title: this.translate.instant('common.error'),
                                    body: "\n                            <p class=\"mb-4\">" + this.translate.instant('order.list.alert.cancel') + "</p>\n                            <div class=\"p-3 bg-light-gray select-text error\">\n                                <code>" + error_3 + "</code>\n                            </div>"
                                });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }
            });
        }
    };
    /**
     * QRコード表示
     */
    OrderSearchComponent.prototype.openQrCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderData, authorizeOrder, error_4;
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
                        this.modal.show(_shared_components_parts_qrcode_modal_qrcode_modal_component__WEBPACK_IMPORTED_MODULE_11__["QrCodeModalComponent"], {
                            initialState: { order: authorizeOrder },
                            class: 'modal-dialog-centered'
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.error(error_4);
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('order.list.alert.authorize')
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrderSearchComponent.ctorParameters = function () { return [
        { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"] },
        { type: ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["BsModalService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_8__["UserService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_8__["UtilService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_8__["OrderService"] },
        { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"] }
    ]; };
    OrderSearchComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-order-search',
            template: __importDefault(__webpack_require__(/*! raw-loader!./order-search.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/order/components/pages/order-search/order-search.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./order-search.component.scss */ "./app/modules/order/components/pages/order-search/order-search.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["BsModalService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _services__WEBPACK_IMPORTED_MODULE_8__["UserService"],
            _services__WEBPACK_IMPORTED_MODULE_8__["UtilService"],
            _services__WEBPACK_IMPORTED_MODULE_8__["OrderService"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"]])
    ], OrderSearchComponent);
    return OrderSearchComponent;
}());



/***/ }),

/***/ "./app/modules/order/order-routing.module.ts":
/*!***************************************************!*\
  !*** ./app/modules/order/order-routing.module.ts ***!
  \***************************************************/
/*! exports provided: OrderRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderRoutingModule", function() { return OrderRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_pages_base_base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/components/pages/base/base.component */ "./app/modules/shared/components/pages/base/base.component.ts");
/* harmony import */ var _components_pages_order_search_order_search_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/pages/order-search/order-search.component */ "./app/modules/order/components/pages/order-search/order-search.component.ts");
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
            { path: 'search', component: _components_pages_order_search_order_search_component__WEBPACK_IMPORTED_MODULE_3__["OrderSearchComponent"] }
        ]
    }
];
var OrderRoutingModule = /** @class */ (function () {
    function OrderRoutingModule() {
    }
    OrderRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], OrderRoutingModule);
    return OrderRoutingModule;
}());



/***/ }),

/***/ "./app/modules/order/order.module.ts":
/*!*******************************************!*\
  !*** ./app/modules/order/order.module.ts ***!
  \*******************************************/
/*! exports provided: OrderModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderModule", function() { return OrderModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/shared.module */ "./app/modules/shared/shared.module.ts");
/* harmony import */ var _components_pages_order_search_order_search_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/pages/order-search/order-search.component */ "./app/modules/order/components/pages/order-search/order-search.component.ts");
/* harmony import */ var _order_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./order-routing.module */ "./app/modules/order/order-routing.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};





var OrderModule = /** @class */ (function () {
    function OrderModule() {
    }
    OrderModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _components_pages_order_search_order_search_component__WEBPACK_IMPORTED_MODULE_3__["OrderSearchComponent"],
            ],
            entryComponents: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _order_routing_module__WEBPACK_IMPORTED_MODULE_4__["OrderRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"],
            ]
        })
    ], OrderModule);
    return OrderModule;
}());



/***/ })

}]);
//# sourceMappingURL=modules-order-order-module.js.map