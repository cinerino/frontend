(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-setting-setting-module"],{

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/setting/pages/setting/setting.component.html":
/*!*************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/setting/pages/setting/setting.component.html ***!
  \*************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'setting.title' | translate }}</h2>\n    <p class=\"mb-4 text-md-center\" [innerHTML]=\"'setting.read' | translate\"></p>\n\n    <div class=\"mb-4 p-3 bg-white\">\n        <form *ngIf=\"baseForm\" [formGroup]=\"baseForm\">\n            <div class=\"form-group\">\n                <div class=\"row align-items-center\">\n                    <p class=\"col-md-4 py-2 text-md-right\">{{ 'common.theater' | translate }}</p>\n                    <div class=\"col-md-8\">\n                        <select class=\"form-control\" formControlName=\"sellerBranchCode\" (change)=\"changePosList()\">\n                            <option value=\"\">{{ 'setting.unselected' | translate }}</option>\n                            <option *ngFor=\"let seller of (master | async).sellers\"\n                                [value]=\"seller.location.branchCode\">{{ seller.name.ja }}</option>\n                        </select>\n                        <!-- <div *ngIf=\"baseForm.controls.sellerBranchCode.invalid && baseForm.controls.sellerBranchCode.touched\"\n                            class=\"mt-2\">\n                            <p *ngIf=\"baseForm.controls.sellerBranchCode.errors.required\" class=\"text-danger\">\n                                {{ 'form.validation.unselected' | translate }}</p>\n                        </div> -->\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <div class=\"row align-items-center\">\n                    <p class=\"col-md-4 py-2 text-md-right\">{{ 'setting.pos' | translate }}</p>\n                    <div class=\"col-md-8\">\n                        <select class=\"form-control\" formControlName=\"posId\">\n                            <option value=\"\">{{ 'setting.unselected' | translate }}</option>\n                            <option *ngFor=\"let pos of posList\" [value]=\"pos.id\">{{ pos.name }}</option>\n                        </select>\n                        <!-- <div *ngIf=\"baseForm.controls.posId.invalid && baseForm.controls.posId.touched\"\n                            class=\"mt-2\">\n                            <p *ngIf=\"baseForm.controls.posId.errors.required\" class=\"text-danger\">\n                                {{ 'form.validation.unselected' | translate }}</p>\n                        </div> -->\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <div class=\"row align-items-center\">\n                    <p class=\"col-md-4 py-2 text-md-right\">{{ 'setting.printer' | translate }}</p>\n                    <div class=\"col-md-8\">\n                        <select class=\"form-control\" formControlName=\"printerType\">\n                            <option value=\"\">{{ 'setting.unselected' | translate }}</option>\n                            <option *ngFor=\"let printer of printers\" [value]=\"printer.connectionType\">\n                                {{ printer.name | translate }}</option>\n                        </select>\n                        <button\n                            *ngIf=\"this.baseForm.controls.printerType.value && this.baseForm.controls.printerType.value !== connectionType.None\"\n                            type=\"button\" class=\"btn btn-sm btn-primary py-2 mt-2\"\n                            (click)=\"print()\">{{ 'setting.testPrinting' | translate }}</button>\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <div class=\"row align-items-center\">\n                    <p class=\"col-md-4 py-2 text-md-right\">{{ 'setting.printerIpAddress' | translate }}</p>\n                    <div class=\"col-md-8\">\n                        <input type=\"text\" class=\"form-control\" formControlName=\"printerIpAddress\"\n                            placeholder=\"0.0.0.0\">\n                        <div *ngIf=\"baseForm.controls.printerIpAddress.invalid && baseForm.controls.printerIpAddress.touched\"\n                            class=\"mt-2\">\n                            <p *ngIf=\"baseForm.controls.printerIpAddress.errors.required\" class=\"text-danger\">\n                                {{ 'form.validation.required' | translate }}</p>\n                        </div>\n                        <p class=\"text-small mt-2\">\n                            {{ 'setting.printerIpAddressDescription' | translate }}\n                        </p>\n                    </div>\n                </div>\n            </div>\n            <div *ngIf=\"environment.SETTING_DEVELOP_OPTION\">\n                <div class=\"form-group\">\n                    <div class=\"row align-items-center\">\n                        <p class=\"col-md-4 py-2 text-md-right\"> {{ 'setting.isPurchaseCart' | translate }}\n                        </p>\n                        <div class=\"col-md-8\">\n                            <select type=\"text\" class=\"form-control\" formControlName=\"isPurchaseCart\"\n                                id=\"isPurchaseCart\" placeholder=\"\">\n                                <option value=\"0\">{{ 'common.off' | translate }}</option>\n                                <option value=\"1\">{{ 'common.on' | translate }}</option>\n                            </select>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"form-group mb-0\">\n                    <div class=\"row align-items-center\">\n                        <p class=\"col-md-4 py-2 text-md-right\"> {{ 'setting.viewType' | translate }}</p>\n                        <div class=\"col-md-8\">\n                            <select class=\"form-control\" id=\"viewType\" formControlName=\"viewType\">\n                                <option [value]=\"viewType.Cinema\">{{ viewType.Cinema }}</option>\n                                <option [value]=\"viewType.Event\">{{ viewType.Event }}</option>\n                            </select>\n                            <div *ngIf=\"baseForm.controls.viewType.invalid && baseForm.controls.viewType.touched\"\n                                class=\"mt-2\">\n                                <p *ngIf=\"baseForm.controls.viewType.errors.required\" class=\"text-danger\">\n                                    {{ 'form.validation.required' | translate }}\n                                </p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n        </form>\n    </div>\n    <div class=\"buttons mx-auto text-center\">\n        <button type=\"button\" class=\"btn btn-primary btn-block py-3 mb-3\" [disabled]=\"isLoading | async\"\n            (click)=\"updateBase()\">{{ 'setting.next' | translate }}</button>\n        <button type=\"button\" class=\"btn btn-link\"\n            [routerLink]=\"environment.BASE_URL\">{{ 'setting.prev' | translate }}</button>\n    </div>\n\n</div>");

/***/ }),

/***/ "./app/modules/setting/pages/setting/setting.component.scss":
/*!******************************************************************!*\
  !*** ./app/modules/setting/pages/setting/setting.component.scss ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL3NldHRpbmcvcGFnZXMvc2V0dGluZy9zZXR0aW5nLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./app/modules/setting/pages/setting/setting.component.ts":
/*!****************************************************************!*\
  !*** ./app/modules/setting/pages/setting/setting.component.ts ***!
  \****************************************************************/
/*! exports provided: SettingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingComponent", function() { return SettingComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ "../../node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../environments/environment */ "./environments/environment.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../models */ "./app/models/index.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services */ "./app/services/index.ts");
/* harmony import */ var _store_reducers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../store/reducers */ "./app/store/reducers/index.ts");
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









var SettingComponent = /** @class */ (function () {
    function SettingComponent(store, utilService, masterService, userService, formBuilder, translate, orderService, router) {
        this.store = store;
        this.utilService = utilService;
        this.masterService = masterService;
        this.userService = userService;
        this.formBuilder = formBuilder;
        this.translate = translate;
        this.orderService = orderService;
        this.router = router;
        this.viewType = _models__WEBPACK_IMPORTED_MODULE_6__["ViewType"];
        this.printers = _models__WEBPACK_IMPORTED_MODULE_6__["printers"];
        this.connectionType = _models__WEBPACK_IMPORTED_MODULE_6__["connectionType"];
        this.environment = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"];
    }
    SettingComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isLoading = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_8__["getLoading"]));
                        this.user = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_8__["getUser"]));
                        this.master = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_8__["getMaster"]));
                        this.error = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_8__["getError"]));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.masterService.getSellers()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.createBaseForm()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error(error_1);
                        this.router.navigate(['/error']);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SettingComponent.prototype.createBaseForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.baseForm = this.formBuilder.group({
                            sellerBranchCode: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                            posId: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                            printerType: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                            printerIpAddress: [''],
                            isPurchaseCart: ['0', [
                                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(/^[0-9]+$/)
                                ]],
                            viewType: ['', [
                                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required
                                ]]
                        });
                        return [4 /*yield*/, this.userService.getData()];
                    case 1:
                        user = _a.sent();
                        if (user.seller !== undefined
                            && user.seller.location !== undefined) {
                            this.baseForm.controls.sellerBranchCode.setValue(user.seller.location.branchCode);
                        }
                        if (user.pos !== undefined) {
                            this.changePosList();
                            this.baseForm.controls.posId.setValue(user.pos.id);
                        }
                        if (user.printer !== undefined) {
                            this.baseForm.controls.printerType.setValue(user.printer.connectionType);
                            this.baseForm.controls.printerIpAddress.setValue(user.printer.ipAddress);
                        }
                        this.baseForm.controls.isPurchaseCart.setValue((user.isPurchaseCart) ? '1' : '0');
                        this.baseForm.controls.viewType.setValue(user.viewType);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 端末情報変更
     */
    SettingComponent.prototype.changePosList = function () {
        var _this = this;
        this.baseForm.controls.posId.setValue('');
        var sellerBranchCode = this.baseForm.controls.sellerBranchCode.value;
        if (sellerBranchCode === '') {
            this.posList = [];
            return;
        }
        this.master.subscribe(function (master) {
            var findTheater = master.sellers.find(function (theater) {
                return (theater.location !== undefined && theater.location.branchCode === sellerBranchCode);
            });
            if (findTheater === undefined) {
                _this.posList = [];
                return;
            }
            _this.posList = (findTheater.hasPOS === undefined) ? [] : findTheater.hasPOS;
        }).unsubscribe();
    };
    /**
     * 更新
     */
    SettingComponent.prototype.updateBase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var master, findSeller, findPos, isPurchaseCart, viewType;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Object.keys(this.baseForm.controls).forEach(function (key) {
                            _this.baseForm.controls[key].markAsTouched();
                        });
                        if (this.baseForm.invalid) {
                            this.utilService.openAlert({
                                title: this.translate.instant('common.error'),
                                body: this.translate.instant('setting.alert.validation')
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.masterService.getData()];
                    case 1:
                        master = _a.sent();
                        findSeller = master.sellers.find(function (s) {
                            return (s.location !== undefined && s.location.branchCode === _this.baseForm.controls.sellerBranchCode.value);
                        });
                        if (findSeller !== undefined && findSeller.hasPOS !== undefined) {
                            findPos = findSeller.hasPOS.find(function (pos) {
                                return pos.id === _this.baseForm.controls.posId.value;
                            });
                            if (findPos === undefined) {
                                return [2 /*return*/];
                            }
                        }
                        isPurchaseCart = (this.baseForm.controls.isPurchaseCart.value === '1') ? true : false;
                        viewType = this.baseForm.controls.viewType.value;
                        this.userService.updateBaseSetting({
                            seller: findSeller,
                            pos: findPos,
                            printer: {
                                ipAddress: this.baseForm.controls.printerIpAddress.value,
                                connectionType: this.baseForm.controls.printerType.value
                            },
                            isPurchaseCart: isPurchaseCart,
                            viewType: viewType
                        });
                        this.utilService.openAlert({
                            title: this.translate.instant('common.complete'),
                            body: this.translate.instant('setting.alert.success')
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingComponent.prototype.print = function () {
        return __awaiter(this, void 0, void 0, function () {
            var printer, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        printer = {
                            connectionType: this.baseForm.controls.printerType.value,
                            ipAddress: this.baseForm.controls.printerIpAddress.value
                        };
                        return [4 /*yield*/, this.orderService.print({ orders: [], printer: printer })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error(error_2);
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: "\n                <p class=\"mb-4\">" + this.translate.instant('setting.alert.print') + "</p>\n                <div class=\"p-3 bg-light-gray select-text error\">\n                    <code>" + error_2 + "</code>\n                </div>"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * プリンター変更
     */
    SettingComponent.prototype.changePrinterType = function () {
        if (this.baseForm.controls.printerType.value === _models__WEBPACK_IMPORTED_MODULE_6__["connectionType"].StarBluetooth) {
            this.baseForm.controls.printerIpAddress.setValue(this.translate.instant('setting.starBluetoothAddress'));
        }
    };
    SettingComponent.ctorParameters = function () { return [
        { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_7__["UtilService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_7__["MasterService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_7__["UserService"] },
        { type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] },
        { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"] },
        { type: _services__WEBPACK_IMPORTED_MODULE_7__["OrderService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
    ]; };
    SettingComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-setting',
            template: __importDefault(__webpack_require__(/*! raw-loader!./setting.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/setting/pages/setting/setting.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./setting.component.scss */ "./app/modules/setting/pages/setting/setting.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _services__WEBPACK_IMPORTED_MODULE_7__["UtilService"],
            _services__WEBPACK_IMPORTED_MODULE_7__["MasterService"],
            _services__WEBPACK_IMPORTED_MODULE_7__["UserService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"],
            _services__WEBPACK_IMPORTED_MODULE_7__["OrderService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], SettingComponent);
    return SettingComponent;
}());



/***/ }),

/***/ "./app/modules/setting/setting-routing.module.ts":
/*!*******************************************************!*\
  !*** ./app/modules/setting/setting-routing.module.ts ***!
  \*******************************************************/
/*! exports provided: SettingRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingRoutingModule", function() { return SettingRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_pages_base_base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/components/pages/base/base.component */ "./app/modules/shared/components/pages/base/base.component.ts");
/* harmony import */ var _pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/setting/setting.component */ "./app/modules/setting/pages/setting/setting.component.ts");
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
            { path: '', component: _pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__["SettingComponent"] }
        ]
    }
];
var SettingRoutingModule = /** @class */ (function () {
    function SettingRoutingModule() {
    }
    SettingRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], SettingRoutingModule);
    return SettingRoutingModule;
}());



/***/ }),

/***/ "./app/modules/setting/setting.module.ts":
/*!***********************************************!*\
  !*** ./app/modules/setting/setting.module.ts ***!
  \***********************************************/
/*! exports provided: SettingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingModule", function() { return SettingModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/shared.module */ "./app/modules/shared/shared.module.ts");
/* harmony import */ var _pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/setting/setting.component */ "./app/modules/setting/pages/setting/setting.component.ts");
/* harmony import */ var _setting_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./setting-routing.module */ "./app/modules/setting/setting-routing.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};





var SettingModule = /** @class */ (function () {
    function SettingModule() {
    }
    SettingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__["SettingComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _setting_routing_module__WEBPACK_IMPORTED_MODULE_4__["SettingRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"],
            ]
        })
    ], SettingModule);
    return SettingModule;
}());



/***/ })

}]);
//# sourceMappingURL=modules-setting-setting-module.js.map