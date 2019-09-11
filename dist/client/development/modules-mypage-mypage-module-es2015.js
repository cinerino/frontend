(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-mypage-mypage-module"],{

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.html":
/*!*******************************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.html ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'mypage.coin.title' | translate }}</h2>\n    <p class=\"mb-4 text-md-center\" [innerHTML]=\"'mypage.coin.read' | translate\"></p>\n\n    <div class=\"mb-4 px-3 py-2 bg-white\">\n        <div class=\"row align-items-center\">\n            <p class=\"col-6 col-md-4\">{{ 'common.coin.balance' | translate }}</p>\n            <p class=\"col-6 col-md-8 text-right text-md-left font-weight-bold\">{{ (user | async).coin?.account.typeOfGood.balance }}</p>\n        </div>\n    </div>\n\n    <div class=\"creditCards d-grid mb-4\">\n        <div *ngFor=\"let creditCard of (user | async).creditCards\" class=\"p-3 bg-white position-relative\">\n            <div class=\"mb-3\">\n                <p>{{ 'common.credit.cardNumber' | translate }}</p>\n                <p>{{ creditCard.cardNo }}</p>\n            </div>\n            <div class=\"mb-3\">\n                <p>{{ 'common.credit.cardExpiration' | translate }}</p>\n                <p>{{ creditCard.expire | slice:2:4 }} / {{ creditCard.expire | slice:0:2 }}</p>\n            </div>\n            <!-- <div class=\"buttons mx-auto text-center\">\n                <button type=\"button\" class=\"btn btn-primary btn-block py-3\" (click)=\"openCharge(creditCard)\">{{ 'mypage.coin.charge' | translate }}</button>\n            </div> -->\n        </div>\n    </div>\n\n    <p *ngIf=\"(user | async).creditCards.length === 0\" class=\"mb-4\">{{ 'mypage.credit.notFound' | translate }}</p>\n\n    <div class=\"buttons mx-auto text-center\">\n        <button type=\"button\" class=\"btn btn-link\"\n            routerLink=\"/mypage\">{{ 'mypage.credit.prev' | translate }}</button>\n    </div>\n\n</div>");

/***/ }),

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.html":
/*!***********************************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.html ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'mypage.credit.title' | translate }}</h2>\n    <p class=\"mb-4 text-md-center\" [innerHTML]=\"'mypage.credit.read' | translate\"></p>\n    <div class=\"creditCards d-grid mb-4\">\n        <div *ngFor=\"let creditCard of (user | async).creditCards\" class=\"p-3 bg-white\">\n            <div class=\"mb-3\">\n                <p>{{ 'common.credit.cardNumber' | translate }}</p>\n                <p>{{ creditCard.cardNo }}</p>\n            </div>\n            <div>\n                <p>{{ 'common.credit.cardExpiration' | translate }}</p>\n                <p>{{ creditCard.expire | slice:2:4 }} / {{ creditCard.expire | slice:0:2 }}</p>\n            </div>\n            <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"confirmRemoveCreditCard(creditCard)\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n    </div>\n\n    <p *ngIf=\"(user | async).creditCards.length === 0\" class=\"mb-4\">{{ 'mypage.credit.notFound' | translate }}</p>\n\n    <div class=\"mb-4 p-3 bg-white\">\n\n        <form *ngIf=\"creditCardForm\" [formGroup]=\"creditCardForm\">\n            <div class=\"form-group row\">\n                <p class=\"col-md-4 py-2 text-md-right\">{{ 'common.theater' | translate }}</p>\n                <div class=\"col-md-8\">\n                    <select class=\"form-control\" id=\"sellerId\" formControlName=\"sellerId\">\n                        <option value=\"\">{{ 'form.unselected' | translate }}</option>\n                        <option *ngFor=\"let seller of (master | async)?.sellers\" [value]=\"seller.id\">\n                            {{ seller.name | changeLanguage }}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"form-group row\">\n                <p class=\"col-md-4 py-2 text-md-right\">{{ 'common.credit.cardNumber' | translate }}</p>\n                <div class=\"col-md-8\">\n                    <input type=\"text\" class=\"form-control\" id=\"cardNumber\" formControlName=\"cardNumber\" placeholder=\"\"\n                        maxlength=\"16\">\n                    <div *ngIf=\"creditCardForm.controls.cardNumber.invalid && creditCardForm.controls.cardNumber.touched\"\n                        class=\"mt-2\">\n                        <p *ngIf=\"creditCardForm.controls.cardNumber.errors.required\" class=\"text-danger\">\n                            {{ 'form.validation.required' | translate }}</p>\n                        <p *ngIf=\"creditCardForm.controls.cardNumber.errors.pattern\" class=\"text-danger\">\n                            {{ 'form.validation.number' | translate }}\n                        </p>\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group row\">\n                <p class=\"col-md-4 py-2 text-md-right\">{{ 'common.credit.cardExpiration' | translate }}</p>\n                <div class=\"col-md-8\">\n                    <div class=\"form-inline\">\n                        <select class=\"form-control d-inline-block w-auto\" id=\"cardExpirationMonth\"\n                            formControlName=\"cardExpirationMonth\">\n                            <option *ngFor=\"let month of cardExpiration.month\" [value]=\"month\">{{ month }}\n                            </option>\n                        </select>\n                        <span class=\"mx-2\">{{ 'common.date.month' | translate }}</span>\n                        <select class=\"form-control d-inline-block w-auto\" id=\"cardExpirationYear\"\n                            formControlName=\"cardExpirationYear\">\n                            <option *ngFor=\"let year of cardExpiration.year\" [value]=\"year\">{{ year }}</option>\n                        </select>\n                        <span class=\"mx-2\">{{ 'common.date.year' | translate }}</span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group row\">\n                <p class=\"col-md-4 py-2 text-md-right\">{{ 'common.credit.securityCode' | translate }}</p>\n                <div class=\"col-md-8\">\n                    <input type=\"text\" class=\"form-control\" id=\"securityCode\" placeholder=\"\"\n                        formControlName=\"securityCode\">\n                    <div *ngIf=\"creditCardForm.controls.securityCode.invalid && creditCardForm.controls.securityCode.touched\"\n                        class=\"mt-2\">\n                        <p *ngIf=\"creditCardForm.controls.securityCode.errors.required\" class=\"text-danger\">\n                            {{ 'form.validation.required' | translate }}</p>\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group row\">\n                <p class=\"col-md-4 py-2 text-md-right\">{{ 'common.credit.holderName' | translate }}</p>\n                <div class=\"col-md-8\">\n                    <input type=\"text\" class=\"form-control\" id=\"holderName\" placeholder=\"\" formControlName=\"holderName\">\n                    <div *ngIf=\"creditCardForm.controls.holderName.invalid && creditCardForm.controls.holderName.touched\"\n                        class=\"mt-2\">\n                        <p *ngIf=\"creditCardForm.controls.holderName.errors.required\" class=\"text-danger\">\n                            {{ 'form.validation.required' | translate }}</p>\n                    </div>\n                </div>\n            </div>\n        </form>\n        <div class=\"buttons mx-auto text-center\">\n            <button type=\"button\" class=\"btn btn-primary btn-block py-3\"  (click)=\"addCreditCard()\">{{ 'mypage.credit.add' | translate }}</button>\n        </div>\n    </div>\n    <div class=\"buttons mx-auto text-center\">\n        <button type=\"button\" class=\"btn btn-link\"\n            routerLink=\"/mypage\">{{ 'mypage.credit.prev' | translate }}</button>\n    </div>\n\n</div>");

/***/ }),

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-index/mypage-index.component.html":
/*!*********************************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-index/mypage-index.component.html ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'mypage.index.title' | translate }}</h2>\n    <p class=\"mb-4 text-md-center\" [innerHTML]=\"'mypage.index.read' | translate\"></p>\n\n    <div class=\"buttons mx-auto text-center\">\n        <button type=\"button\" class=\"btn btn-primary btn-block py-3 mb-3\" routerLink=\"/mypage/profile\">{{ 'mypage.index.profile' | translate }}</button>\n        <button type=\"button\" class=\"btn btn-primary btn-block py-3 mb-3\" routerLink=\"/mypage/credit\">{{ 'mypage.index.credit' | translate }}</button>\n        <button type=\"button\" class=\"btn btn-primary btn-block py-3 mb-3\" routerLink=\"/mypage/coin\">{{ 'mypage.index.coin' | translate }}</button>\n    </div>\n\n</div>");

/***/ }),

/***/ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.html":
/*!*************************************************************************************************************************************************************************************!*\
  !*** C:/Users/hataguchi/Desktop/workspace/Cinerino/frontend/node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.html ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"contents-width mx-auto px-3 py-5\">\n    <h2 class=\"text-large mb-4 text-center font-weight-bold\">{{ 'mypage.profile.title' | translate }}</h2>\n    <p class=\"mb-4 text-md-center\" [innerHTML]=\"'mypage.profile.read' | translate\"></p>\n\n    <div class=\"mb-4 p-3 bg-white\">\n\n        <form [formGroup]=\"profileForm\">\n            <div class=\"form-group\">\n                <div class=\"row align-items-center\">\n                    <p class=\"col-md-4 py-2 text-md-right\"> {{ 'common.familyName' | translate }}</p>\n                    <div class=\"col-md-8\">\n                        <input type=\"text\" class=\"form-control\" formControlName=\"familyName\" id=\"familyName\"\n                            placeholder=\"モーション\">\n                        <div *ngIf=\"profileForm.controls.familyName.invalid && profileForm.controls.familyName.touched\"\n                            class=\"mt-2\">\n                            <p *ngIf=\"profileForm.controls.familyName.errors.required\" class=\"text-danger\">\n                                {{ 'form.validation.required' | translate }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.familyName.errors.maxlength\" class=\"text-danger\">\n                                {{ 'form.validation.maxlength' | translate:{ value: profileForm.controls.familyName.errors.maxlength.requiredLength } }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.familyName.errors.pattern\" class=\"text-danger\">\n                                {{ 'form.validation.fullKana' | translate }}</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <div class=\"row align-items-center\">\n                    <p class=\"col-md-4 py-2 text-md-right\"> {{ 'common.givenName' | translate }}</p>\n                    <div class=\"col-md-8\">\n                        <input type=\"text\" class=\"form-control\" formControlName=\"givenName\" id=\"givenName\"\n                            placeholder=\"ピクチャー\">\n                        <div *ngIf=\"profileForm.controls.givenName.invalid && profileForm.controls.givenName.touched\"\n                            class=\"mt-2\">\n                            <p *ngIf=\"profileForm.controls.givenName.errors.required\" class=\"text-danger\">\n                                {{ 'form.validation.required' | translate }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.givenName.errors.maxlength\" class=\"text-danger\">\n                                {{ 'form.validation.maxlength' | translate:{ value: profileForm.controls.givenName.errors.maxlength.requiredLength } }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.givenName.errors.pattern\" class=\"text-danger\">\n                                {{ 'form.validation.fullKana' | translate }}\n                            </p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group\">\n                <div class=\"row align-items-center\">\n                    <p class=\"col-md-4 py-2 text-md-right\"> {{ 'common.email' | translate }}</p>\n                    <div class=\"col-md-8\">\n                        <input type=\"email\" class=\"form-control\" formControlName=\"email\" id=\"email\"\n                            placeholder=\"motionpicture@example.jp\">\n                        <div *ngIf=\"profileForm.controls.email.invalid && profileForm.controls.email.touched\"\n                            class=\"mt-2\">\n                            <p *ngIf=\"profileForm.controls.email.errors.required\" class=\"text-danger\">\n                                {{ 'form.validation.required' | translate }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.email.errors.maxlength\" class=\"text-danger\">\n                                {{ 'form.validation.maxlength' | translate:{ value: profileForm.controls.email.errors.maxlength.requiredLength } }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.email.errors.email\" class=\"text-danger\">\n                                {{ 'form.validation.email' | translate }}\n                            </p>\n                        </div>\n                        <p class=\"mt-2 text-small\" [innerHTML]=\"'common.emailDescription' | translate\"></p>\n                    </div>\n                </div>\n            </div>\n            <div class=\"form-group mb-0\">\n                <div class=\"row align-items-center\">\n                    <p class=\"col-md-4 py-2 text-md-right\"> {{ 'common.telephone' | translate }}</p>\n                    <div class=\"col-md-8\">\n                        <input type=\"tel\" class=\"form-control\" formControlName=\"telephone\" id=\"telephone\"\n                            placeholder=\"0362778824\">\n                        <div *ngIf=\"profileForm.controls.telephone.invalid && profileForm.controls.telephone.touched\"\n                            class=\"mt-2\">\n                            <p *ngIf=\"profileForm.controls.telephone.errors.required\" class=\"text-danger\">\n                                {{ 'form.validation.required' | translate }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.telephone.errors.minlength\" class=\"text-danger\">\n                                {{ 'form.validation.minlength' | translate:{ value: profileForm.controls.telephone.errors.minlength.requiredLength } }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.telephone.errors.maxlength\" class=\"text-danger\">\n                                {{ 'form.validation.maxlength' | translate:{ value: profileForm.controls.telephone.errors.maxlength.requiredLength } }}\n                            </p>\n                            <p *ngIf=\"profileForm.controls.telephone.errors.pattern\" class=\"text-danger\">\n                                {{ 'form.validation.number' | translate }}</p>\n                            <p *ngIf=\"profileForm.controls.telephone.errors.telephone\" class=\"text-danger\">\n                                {{ 'form.validation.telephone' | translate }}</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </form>\n    </div>\n    <div class=\"buttons mx-auto text-center\">\n        <button type=\"button\" class=\"btn btn-primary btn-block py-3 mb-3\" [disabled]=\"isLoading | async\"\n            (click)=\"updateProfile()\">{{ 'mypage.profile.next' | translate }}</button>\n        <button type=\"button\" class=\"btn btn-link\"\n            routerLink=\"/mypage\">{{ 'mypage.profile.prev' | translate }}</button>\n    </div>\n\n</div>");

/***/ }),

/***/ "./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.scss":
/*!************************************************************************************!*\
  !*** ./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.scss ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".close {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n\n.creditCards {\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-gap: 1rem;\n}\n\n@media (max-width: 767.98px) {\n  .creditCards {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvYXBwL21vZHVsZXMvbXlwYWdlL2NvbXBvbmVudHMvcGFnZXMvbXlwYWdlLWNvaW4vQzpcXFVzZXJzXFxoYXRhZ3VjaGlcXERlc2t0b3BcXHdvcmtzcGFjZVxcQ2luZXJpbm9cXGZyb250ZW5kL3NyY1xcY2xpZW50XFxhcHBcXG1vZHVsZXNcXG15cGFnZVxcY29tcG9uZW50c1xccGFnZXNcXG15cGFnZS1jb2luXFxteXBhZ2UtY29pbi5jb21wb25lbnQuc2NzcyIsInNyYy9jbGllbnQvYXBwL21vZHVsZXMvbXlwYWdlL2NvbXBvbmVudHMvcGFnZXMvbXlwYWdlLWNvaW4vbXlwYWdlLWNvaW4uY29tcG9uZW50LnNjc3MiLCJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL215cGFnZS9jb21wb25lbnRzL3BhZ2VzL215cGFnZS1jb2luL0M6XFxVc2Vyc1xcaGF0YWd1Y2hpXFxEZXNrdG9wXFx3b3Jrc3BhY2VcXENpbmVyaW5vXFxmcm9udGVuZC9ub2RlX21vZHVsZXNcXGJvb3RzdHJhcFxcc2Nzc1xcbWl4aW5zXFxfYnJlYWtwb2ludHMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtFQUNJLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7QUNISjs7QURNQTtFQUNJLGtDQUFBO0VBQ0EsY0FBQTtBQ0hKOztBQ2dFSTtFRi9ESjtJQUlRLDBCQUFBO0VDRE47QUFDRiIsImZpbGUiOiJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL215cGFnZS9jb21wb25lbnRzL3BhZ2VzL215cGFnZS1jb2luL215cGFnZS1jb2luLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIm5vZGVfbW9kdWxlcy9ib290c3RyYXAvc2Nzcy9mdW5jdGlvbnNcIjtcbkBpbXBvcnQgXCJub2RlX21vZHVsZXMvYm9vdHN0cmFwL3Njc3MvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwibm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9zY3NzL21peGluc1wiO1xuXG4uY2xvc2Uge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDEwcHg7XG4gICAgcmlnaHQ6IDEwcHg7XG59XG5cbi5jcmVkaXRDYXJkcyB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcbiAgICBncmlkLWdhcDogMXJlbTtcbiAgICBAaW5jbHVkZSBtZWRpYS1icmVha3BvaW50LWRvd24oc20pIHtcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gICAgfVxufSIsIi5jbG9zZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxMHB4O1xuICByaWdodDogMTBweDtcbn1cblxuLmNyZWRpdENhcmRzIHtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcbiAgZ3JpZC1nYXA6IDFyZW07XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY3Ljk4cHgpIHtcbiAgLmNyZWRpdENhcmRzIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcbiAgfVxufSIsIi8vIEJyZWFrcG9pbnQgdmlld3BvcnQgc2l6ZXMgYW5kIG1lZGlhIHF1ZXJpZXMuXG4vL1xuLy8gQnJlYWtwb2ludHMgYXJlIGRlZmluZWQgYXMgYSBtYXAgb2YgKG5hbWU6IG1pbmltdW0gd2lkdGgpLCBvcmRlciBmcm9tIHNtYWxsIHRvIGxhcmdlOlxuLy9cbi8vICAgICh4czogMCwgc206IDU3NnB4LCBtZDogNzY4cHgsIGxnOiA5OTJweCwgeGw6IDEyMDBweClcbi8vXG4vLyBUaGUgbWFwIGRlZmluZWQgaW4gdGhlIGAkZ3JpZC1icmVha3BvaW50c2AgZ2xvYmFsIHZhcmlhYmxlIGlzIHVzZWQgYXMgdGhlIGAkYnJlYWtwb2ludHNgIGFyZ3VtZW50IGJ5IGRlZmF1bHQuXG5cbi8vIE5hbWUgb2YgdGhlIG5leHQgYnJlYWtwb2ludCwgb3IgbnVsbCBmb3IgdGhlIGxhc3QgYnJlYWtwb2ludC5cbi8vXG4vLyAgICA+PiBicmVha3BvaW50LW5leHQoc20pXG4vLyAgICBtZFxuLy8gICAgPj4gYnJlYWtwb2ludC1uZXh0KHNtLCAoeHM6IDAsIHNtOiA1NzZweCwgbWQ6IDc2OHB4LCBsZzogOTkycHgsIHhsOiAxMjAwcHgpKVxuLy8gICAgbWRcbi8vICAgID4+IGJyZWFrcG9pbnQtbmV4dChzbSwgJGJyZWFrcG9pbnQtbmFtZXM6ICh4cyBzbSBtZCBsZyB4bCkpXG4vLyAgICBtZFxuQGZ1bmN0aW9uIGJyZWFrcG9pbnQtbmV4dCgkbmFtZSwgJGJyZWFrcG9pbnRzOiAkZ3JpZC1icmVha3BvaW50cywgJGJyZWFrcG9pbnQtbmFtZXM6IG1hcC1rZXlzKCRicmVha3BvaW50cykpIHtcbiAgJG46IGluZGV4KCRicmVha3BvaW50LW5hbWVzLCAkbmFtZSk7XG4gIEByZXR1cm4gaWYoJG4gIT0gbnVsbCBhbmQgJG4gPCBsZW5ndGgoJGJyZWFrcG9pbnQtbmFtZXMpLCBudGgoJGJyZWFrcG9pbnQtbmFtZXMsICRuICsgMSksIG51bGwpO1xufVxuXG4vLyBNaW5pbXVtIGJyZWFrcG9pbnQgd2lkdGguIE51bGwgZm9yIHRoZSBzbWFsbGVzdCAoZmlyc3QpIGJyZWFrcG9pbnQuXG4vL1xuLy8gICAgPj4gYnJlYWtwb2ludC1taW4oc20sICh4czogMCwgc206IDU3NnB4LCBtZDogNzY4cHgsIGxnOiA5OTJweCwgeGw6IDEyMDBweCkpXG4vLyAgICA1NzZweFxuQGZ1bmN0aW9uIGJyZWFrcG9pbnQtbWluKCRuYW1lLCAkYnJlYWtwb2ludHM6ICRncmlkLWJyZWFrcG9pbnRzKSB7XG4gICRtaW46IG1hcC1nZXQoJGJyZWFrcG9pbnRzLCAkbmFtZSk7XG4gIEByZXR1cm4gaWYoJG1pbiAhPSAwLCAkbWluLCBudWxsKTtcbn1cblxuLy8gTWF4aW11bSBicmVha3BvaW50IHdpZHRoLiBOdWxsIGZvciB0aGUgbGFyZ2VzdCAobGFzdCkgYnJlYWtwb2ludC5cbi8vIFRoZSBtYXhpbXVtIHZhbHVlIGlzIGNhbGN1bGF0ZWQgYXMgdGhlIG1pbmltdW0gb2YgdGhlIG5leHQgb25lIGxlc3MgMC4wMnB4XG4vLyB0byB3b3JrIGFyb3VuZCB0aGUgbGltaXRhdGlvbnMgb2YgYG1pbi1gIGFuZCBgbWF4LWAgcHJlZml4ZXMgYW5kIHZpZXdwb3J0cyB3aXRoIGZyYWN0aW9uYWwgd2lkdGhzLlxuLy8gU2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9tZWRpYXF1ZXJpZXMtNC8jbXEtbWluLW1heFxuLy8gVXNlcyAwLjAycHggcmF0aGVyIHRoYW4gMC4wMXB4IHRvIHdvcmsgYXJvdW5kIGEgY3VycmVudCByb3VuZGluZyBidWcgaW4gU2FmYXJpLlxuLy8gU2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNzgyNjFcbi8vXG4vLyAgICA+PiBicmVha3BvaW50LW1heChzbSwgKHhzOiAwLCBzbTogNTc2cHgsIG1kOiA3NjhweCwgbGc6IDk5MnB4LCB4bDogMTIwMHB4KSlcbi8vICAgIDc2Ny45OHB4XG5AZnVuY3Rpb24gYnJlYWtwb2ludC1tYXgoJG5hbWUsICRicmVha3BvaW50czogJGdyaWQtYnJlYWtwb2ludHMpIHtcbiAgJG5leHQ6IGJyZWFrcG9pbnQtbmV4dCgkbmFtZSwgJGJyZWFrcG9pbnRzKTtcbiAgQHJldHVybiBpZigkbmV4dCwgYnJlYWtwb2ludC1taW4oJG5leHQsICRicmVha3BvaW50cykgLSAuMDIsIG51bGwpO1xufVxuXG4vLyBSZXR1cm5zIGEgYmxhbmsgc3RyaW5nIGlmIHNtYWxsZXN0IGJyZWFrcG9pbnQsIG90aGVyd2lzZSByZXR1cm5zIHRoZSBuYW1lIHdpdGggYSBkYXNoIGluIGZyb250LlxuLy8gVXNlZnVsIGZvciBtYWtpbmcgcmVzcG9uc2l2ZSB1dGlsaXRpZXMuXG4vL1xuLy8gICAgPj4gYnJlYWtwb2ludC1pbmZpeCh4cywgKHhzOiAwLCBzbTogNTc2cHgsIG1kOiA3NjhweCwgbGc6IDk5MnB4LCB4bDogMTIwMHB4KSlcbi8vICAgIFwiXCIgIChSZXR1cm5zIGEgYmxhbmsgc3RyaW5nKVxuLy8gICAgPj4gYnJlYWtwb2ludC1pbmZpeChzbSwgKHhzOiAwLCBzbTogNTc2cHgsIG1kOiA3NjhweCwgbGc6IDk5MnB4LCB4bDogMTIwMHB4KSlcbi8vICAgIFwiLXNtXCJcbkBmdW5jdGlvbiBicmVha3BvaW50LWluZml4KCRuYW1lLCAkYnJlYWtwb2ludHM6ICRncmlkLWJyZWFrcG9pbnRzKSB7XG4gIEByZXR1cm4gaWYoYnJlYWtwb2ludC1taW4oJG5hbWUsICRicmVha3BvaW50cykgPT0gbnVsbCwgXCJcIiwgXCItI3skbmFtZX1cIik7XG59XG5cbi8vIE1lZGlhIG9mIGF0IGxlYXN0IHRoZSBtaW5pbXVtIGJyZWFrcG9pbnQgd2lkdGguIE5vIHF1ZXJ5IGZvciB0aGUgc21hbGxlc3QgYnJlYWtwb2ludC5cbi8vIE1ha2VzIHRoZSBAY29udGVudCBhcHBseSB0byB0aGUgZ2l2ZW4gYnJlYWtwb2ludCBhbmQgd2lkZXIuXG5AbWl4aW4gbWVkaWEtYnJlYWtwb2ludC11cCgkbmFtZSwgJGJyZWFrcG9pbnRzOiAkZ3JpZC1icmVha3BvaW50cykge1xuICAkbWluOiBicmVha3BvaW50LW1pbigkbmFtZSwgJGJyZWFrcG9pbnRzKTtcbiAgQGlmICRtaW4ge1xuICAgIEBtZWRpYSAobWluLXdpZHRoOiAkbWluKSB7XG4gICAgICBAY29udGVudDtcbiAgICB9XG4gIH0gQGVsc2Uge1xuICAgIEBjb250ZW50O1xuICB9XG59XG5cbi8vIE1lZGlhIG9mIGF0IG1vc3QgdGhlIG1heGltdW0gYnJlYWtwb2ludCB3aWR0aC4gTm8gcXVlcnkgZm9yIHRoZSBsYXJnZXN0IGJyZWFrcG9pbnQuXG4vLyBNYWtlcyB0aGUgQGNvbnRlbnQgYXBwbHkgdG8gdGhlIGdpdmVuIGJyZWFrcG9pbnQgYW5kIG5hcnJvd2VyLlxuQG1peGluIG1lZGlhLWJyZWFrcG9pbnQtZG93bigkbmFtZSwgJGJyZWFrcG9pbnRzOiAkZ3JpZC1icmVha3BvaW50cykge1xuICAkbWF4OiBicmVha3BvaW50LW1heCgkbmFtZSwgJGJyZWFrcG9pbnRzKTtcbiAgQGlmICRtYXgge1xuICAgIEBtZWRpYSAobWF4LXdpZHRoOiAkbWF4KSB7XG4gICAgICBAY29udGVudDtcbiAgICB9XG4gIH0gQGVsc2Uge1xuICAgIEBjb250ZW50O1xuICB9XG59XG5cbi8vIE1lZGlhIHRoYXQgc3BhbnMgbXVsdGlwbGUgYnJlYWtwb2ludCB3aWR0aHMuXG4vLyBNYWtlcyB0aGUgQGNvbnRlbnQgYXBwbHkgYmV0d2VlbiB0aGUgbWluIGFuZCBtYXggYnJlYWtwb2ludHNcbkBtaXhpbiBtZWRpYS1icmVha3BvaW50LWJldHdlZW4oJGxvd2VyLCAkdXBwZXIsICRicmVha3BvaW50czogJGdyaWQtYnJlYWtwb2ludHMpIHtcbiAgJG1pbjogYnJlYWtwb2ludC1taW4oJGxvd2VyLCAkYnJlYWtwb2ludHMpO1xuICAkbWF4OiBicmVha3BvaW50LW1heCgkdXBwZXIsICRicmVha3BvaW50cyk7XG5cbiAgQGlmICRtaW4gIT0gbnVsbCBhbmQgJG1heCAhPSBudWxsIHtcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogJG1pbikgYW5kIChtYXgtd2lkdGg6ICRtYXgpIHtcbiAgICAgIEBjb250ZW50O1xuICAgIH1cbiAgfSBAZWxzZSBpZiAkbWF4ID09IG51bGwge1xuICAgIEBpbmNsdWRlIG1lZGlhLWJyZWFrcG9pbnQtdXAoJGxvd2VyLCAkYnJlYWtwb2ludHMpIHtcbiAgICAgIEBjb250ZW50O1xuICAgIH1cbiAgfSBAZWxzZSBpZiAkbWluID09IG51bGwge1xuICAgIEBpbmNsdWRlIG1lZGlhLWJyZWFrcG9pbnQtZG93bigkdXBwZXIsICRicmVha3BvaW50cykge1xuICAgICAgQGNvbnRlbnQ7XG4gICAgfVxuICB9XG59XG5cbi8vIE1lZGlhIGJldHdlZW4gdGhlIGJyZWFrcG9pbnQncyBtaW5pbXVtIGFuZCBtYXhpbXVtIHdpZHRocy5cbi8vIE5vIG1pbmltdW0gZm9yIHRoZSBzbWFsbGVzdCBicmVha3BvaW50LCBhbmQgbm8gbWF4aW11bSBmb3IgdGhlIGxhcmdlc3Qgb25lLlxuLy8gTWFrZXMgdGhlIEBjb250ZW50IGFwcGx5IG9ubHkgdG8gdGhlIGdpdmVuIGJyZWFrcG9pbnQsIG5vdCB2aWV3cG9ydHMgYW55IHdpZGVyIG9yIG5hcnJvd2VyLlxuQG1peGluIG1lZGlhLWJyZWFrcG9pbnQtb25seSgkbmFtZSwgJGJyZWFrcG9pbnRzOiAkZ3JpZC1icmVha3BvaW50cykge1xuICAkbWluOiBicmVha3BvaW50LW1pbigkbmFtZSwgJGJyZWFrcG9pbnRzKTtcbiAgJG1heDogYnJlYWtwb2ludC1tYXgoJG5hbWUsICRicmVha3BvaW50cyk7XG5cbiAgQGlmICRtaW4gIT0gbnVsbCBhbmQgJG1heCAhPSBudWxsIHtcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogJG1pbikgYW5kIChtYXgtd2lkdGg6ICRtYXgpIHtcbiAgICAgIEBjb250ZW50O1xuICAgIH1cbiAgfSBAZWxzZSBpZiAkbWF4ID09IG51bGwge1xuICAgIEBpbmNsdWRlIG1lZGlhLWJyZWFrcG9pbnQtdXAoJG5hbWUsICRicmVha3BvaW50cykge1xuICAgICAgQGNvbnRlbnQ7XG4gICAgfVxuICB9IEBlbHNlIGlmICRtaW4gPT0gbnVsbCB7XG4gICAgQGluY2x1ZGUgbWVkaWEtYnJlYWtwb2ludC1kb3duKCRuYW1lLCAkYnJlYWtwb2ludHMpIHtcbiAgICAgIEBjb250ZW50O1xuICAgIH1cbiAgfVxufVxuIl19 */");

/***/ }),

/***/ "./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.ts":
/*!**********************************************************************************!*\
  !*** ./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.ts ***!
  \**********************************************************************************/
/*! exports provided: MypageCoinComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MypageCoinComponent", function() { return MypageCoinComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm2015/store.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ "../../node_modules/@ngx-translate/core/fesm2015/ngx-translate-core.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../services */ "./app/services/index.ts");
/* harmony import */ var _store_reducers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../store/reducers */ "./app/store/reducers/index.ts");
/* harmony import */ var _shared_components_parts_charge_coin_modal_charge_coin_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../shared/components/parts/charge-coin-modal/charge-coin-modal.component */ "./app/modules/shared/components/parts/charge-coin-modal/charge-coin-modal.component.ts");
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
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};







let MypageCoinComponent = class MypageCoinComponent {
    constructor(store, modal, translate, utilService, userService) {
        this.store = store;
        this.modal = modal;
        this.translate = translate;
        this.utilService = utilService;
        this.userService = userService;
    }
    /**
     * 初期化
     */
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_5__["getUser"]));
        });
    }
    /**
     * チャージ確認
     * @param creditCard
     */
    openCharge(creditCard) {
        this.modal.show(_shared_components_parts_charge_coin_modal_charge_coin_modal_component__WEBPACK_IMPORTED_MODULE_6__["ChargeCoinModalComponent"], {
            initialState: {
                cb: (charge) => __awaiter(this, void 0, void 0, function* () {
                    console.log({ charge, creditCard });
                    try {
                        yield this.userService.chargeCoin();
                    }
                    catch (error) {
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('mypage.coin.alert.charge')
                        });
                    }
                })
            }
        });
    }
};
MypageCoinComponent.ctorParameters = () => [
    { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"] },
    { type: ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["BsModalService"] },
    { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateService"] },
    { type: _services__WEBPACK_IMPORTED_MODULE_4__["UtilService"] },
    { type: _services__WEBPACK_IMPORTED_MODULE_4__["UserService"] }
];
MypageCoinComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-mypage-coin',
        template: __importDefault(__webpack_require__(/*! raw-loader!./mypage-coin.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.html")).default,
        styles: [__importDefault(__webpack_require__(/*! ./mypage-coin.component.scss */ "./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.scss")).default]
    }),
    __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"],
        ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["BsModalService"],
        _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateService"],
        _services__WEBPACK_IMPORTED_MODULE_4__["UtilService"],
        _services__WEBPACK_IMPORTED_MODULE_4__["UserService"]])
], MypageCoinComponent);



/***/ }),

/***/ "./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.scss":
/*!****************************************************************************************!*\
  !*** ./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.scss ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".close {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n\n.creditCards {\n  grid-template-columns: 1fr 1fr;\n  grid-gap: 1rem;\n}\n\n@media (max-width: 767.98px) {\n  .creditCards {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvYXBwL21vZHVsZXMvbXlwYWdlL2NvbXBvbmVudHMvcGFnZXMvbXlwYWdlLWNyZWRpdC9DOlxcVXNlcnNcXGhhdGFndWNoaVxcRGVza3RvcFxcd29ya3NwYWNlXFxDaW5lcmlub1xcZnJvbnRlbmQvc3JjXFxjbGllbnRcXGFwcFxcbW9kdWxlc1xcbXlwYWdlXFxjb21wb25lbnRzXFxwYWdlc1xcbXlwYWdlLWNyZWRpdFxcbXlwYWdlLWNyZWRpdC5jb21wb25lbnQuc2NzcyIsInNyYy9jbGllbnQvYXBwL21vZHVsZXMvbXlwYWdlL2NvbXBvbmVudHMvcGFnZXMvbXlwYWdlLWNyZWRpdC9teXBhZ2UtY3JlZGl0LmNvbXBvbmVudC5zY3NzIiwic3JjL2NsaWVudC9hcHAvbW9kdWxlcy9teXBhZ2UvY29tcG9uZW50cy9wYWdlcy9teXBhZ2UtY3JlZGl0L0M6XFxVc2Vyc1xcaGF0YWd1Y2hpXFxEZXNrdG9wXFx3b3Jrc3BhY2VcXENpbmVyaW5vXFxmcm9udGVuZC9ub2RlX21vZHVsZXNcXGJvb3RzdHJhcFxcc2Nzc1xcbWl4aW5zXFxfYnJlYWtwb2ludHMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtFQUNJLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7QUNISjs7QURNQTtFQUNJLDhCQUFBO0VBQ0EsY0FBQTtBQ0hKOztBQ2dFSTtFRi9ESjtJQUlRLDBCQUFBO0VDRE47QUFDRiIsImZpbGUiOiJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL215cGFnZS9jb21wb25lbnRzL3BhZ2VzL215cGFnZS1jcmVkaXQvbXlwYWdlLWNyZWRpdC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCJub2RlX21vZHVsZXMvYm9vdHN0cmFwL3Njc3MvZnVuY3Rpb25zXCI7XG5AaW1wb3J0IFwibm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9zY3NzL3ZhcmlhYmxlc1wiO1xuQGltcG9ydCBcIm5vZGVfbW9kdWxlcy9ib290c3RyYXAvc2Nzcy9taXhpbnNcIjtcblxuLmNsb3NlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAxMHB4O1xuICAgIHJpZ2h0OiAxMHB4O1xufVxuXG4uY3JlZGl0Q2FyZHMge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcbiAgICBncmlkLWdhcDogMXJlbTtcbiAgICBAaW5jbHVkZSBtZWRpYS1icmVha3BvaW50LWRvd24oc20pIHtcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gICAgfVxufSIsIi5jbG9zZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxMHB4O1xuICByaWdodDogMTBweDtcbn1cblxuLmNyZWRpdENhcmRzIHtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xuICBncmlkLWdhcDogMXJlbTtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjcuOThweCkge1xuICAuY3JlZGl0Q2FyZHMge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICB9XG59IiwiLy8gQnJlYWtwb2ludCB2aWV3cG9ydCBzaXplcyBhbmQgbWVkaWEgcXVlcmllcy5cbi8vXG4vLyBCcmVha3BvaW50cyBhcmUgZGVmaW5lZCBhcyBhIG1hcCBvZiAobmFtZTogbWluaW11bSB3aWR0aCksIG9yZGVyIGZyb20gc21hbGwgdG8gbGFyZ2U6XG4vL1xuLy8gICAgKHhzOiAwLCBzbTogNTc2cHgsIG1kOiA3NjhweCwgbGc6IDk5MnB4LCB4bDogMTIwMHB4KVxuLy9cbi8vIFRoZSBtYXAgZGVmaW5lZCBpbiB0aGUgYCRncmlkLWJyZWFrcG9pbnRzYCBnbG9iYWwgdmFyaWFibGUgaXMgdXNlZCBhcyB0aGUgYCRicmVha3BvaW50c2AgYXJndW1lbnQgYnkgZGVmYXVsdC5cblxuLy8gTmFtZSBvZiB0aGUgbmV4dCBicmVha3BvaW50LCBvciBudWxsIGZvciB0aGUgbGFzdCBicmVha3BvaW50LlxuLy9cbi8vICAgID4+IGJyZWFrcG9pbnQtbmV4dChzbSlcbi8vICAgIG1kXG4vLyAgICA+PiBicmVha3BvaW50LW5leHQoc20sICh4czogMCwgc206IDU3NnB4LCBtZDogNzY4cHgsIGxnOiA5OTJweCwgeGw6IDEyMDBweCkpXG4vLyAgICBtZFxuLy8gICAgPj4gYnJlYWtwb2ludC1uZXh0KHNtLCAkYnJlYWtwb2ludC1uYW1lczogKHhzIHNtIG1kIGxnIHhsKSlcbi8vICAgIG1kXG5AZnVuY3Rpb24gYnJlYWtwb2ludC1uZXh0KCRuYW1lLCAkYnJlYWtwb2ludHM6ICRncmlkLWJyZWFrcG9pbnRzLCAkYnJlYWtwb2ludC1uYW1lczogbWFwLWtleXMoJGJyZWFrcG9pbnRzKSkge1xuICAkbjogaW5kZXgoJGJyZWFrcG9pbnQtbmFtZXMsICRuYW1lKTtcbiAgQHJldHVybiBpZigkbiAhPSBudWxsIGFuZCAkbiA8IGxlbmd0aCgkYnJlYWtwb2ludC1uYW1lcyksIG50aCgkYnJlYWtwb2ludC1uYW1lcywgJG4gKyAxKSwgbnVsbCk7XG59XG5cbi8vIE1pbmltdW0gYnJlYWtwb2ludCB3aWR0aC4gTnVsbCBmb3IgdGhlIHNtYWxsZXN0IChmaXJzdCkgYnJlYWtwb2ludC5cbi8vXG4vLyAgICA+PiBicmVha3BvaW50LW1pbihzbSwgKHhzOiAwLCBzbTogNTc2cHgsIG1kOiA3NjhweCwgbGc6IDk5MnB4LCB4bDogMTIwMHB4KSlcbi8vICAgIDU3NnB4XG5AZnVuY3Rpb24gYnJlYWtwb2ludC1taW4oJG5hbWUsICRicmVha3BvaW50czogJGdyaWQtYnJlYWtwb2ludHMpIHtcbiAgJG1pbjogbWFwLWdldCgkYnJlYWtwb2ludHMsICRuYW1lKTtcbiAgQHJldHVybiBpZigkbWluICE9IDAsICRtaW4sIG51bGwpO1xufVxuXG4vLyBNYXhpbXVtIGJyZWFrcG9pbnQgd2lkdGguIE51bGwgZm9yIHRoZSBsYXJnZXN0IChsYXN0KSBicmVha3BvaW50LlxuLy8gVGhlIG1heGltdW0gdmFsdWUgaXMgY2FsY3VsYXRlZCBhcyB0aGUgbWluaW11bSBvZiB0aGUgbmV4dCBvbmUgbGVzcyAwLjAycHhcbi8vIHRvIHdvcmsgYXJvdW5kIHRoZSBsaW1pdGF0aW9ucyBvZiBgbWluLWAgYW5kIGBtYXgtYCBwcmVmaXhlcyBhbmQgdmlld3BvcnRzIHdpdGggZnJhY3Rpb25hbCB3aWR0aHMuXG4vLyBTZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL21lZGlhcXVlcmllcy00LyNtcS1taW4tbWF4XG4vLyBVc2VzIDAuMDJweCByYXRoZXIgdGhhbiAwLjAxcHggdG8gd29yayBhcm91bmQgYSBjdXJyZW50IHJvdW5kaW5nIGJ1ZyBpbiBTYWZhcmkuXG4vLyBTZWUgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE3ODI2MVxuLy9cbi8vICAgID4+IGJyZWFrcG9pbnQtbWF4KHNtLCAoeHM6IDAsIHNtOiA1NzZweCwgbWQ6IDc2OHB4LCBsZzogOTkycHgsIHhsOiAxMjAwcHgpKVxuLy8gICAgNzY3Ljk4cHhcbkBmdW5jdGlvbiBicmVha3BvaW50LW1heCgkbmFtZSwgJGJyZWFrcG9pbnRzOiAkZ3JpZC1icmVha3BvaW50cykge1xuICAkbmV4dDogYnJlYWtwb2ludC1uZXh0KCRuYW1lLCAkYnJlYWtwb2ludHMpO1xuICBAcmV0dXJuIGlmKCRuZXh0LCBicmVha3BvaW50LW1pbigkbmV4dCwgJGJyZWFrcG9pbnRzKSAtIC4wMiwgbnVsbCk7XG59XG5cbi8vIFJldHVybnMgYSBibGFuayBzdHJpbmcgaWYgc21hbGxlc3QgYnJlYWtwb2ludCwgb3RoZXJ3aXNlIHJldHVybnMgdGhlIG5hbWUgd2l0aCBhIGRhc2ggaW4gZnJvbnQuXG4vLyBVc2VmdWwgZm9yIG1ha2luZyByZXNwb25zaXZlIHV0aWxpdGllcy5cbi8vXG4vLyAgICA+PiBicmVha3BvaW50LWluZml4KHhzLCAoeHM6IDAsIHNtOiA1NzZweCwgbWQ6IDc2OHB4LCBsZzogOTkycHgsIHhsOiAxMjAwcHgpKVxuLy8gICAgXCJcIiAgKFJldHVybnMgYSBibGFuayBzdHJpbmcpXG4vLyAgICA+PiBicmVha3BvaW50LWluZml4KHNtLCAoeHM6IDAsIHNtOiA1NzZweCwgbWQ6IDc2OHB4LCBsZzogOTkycHgsIHhsOiAxMjAwcHgpKVxuLy8gICAgXCItc21cIlxuQGZ1bmN0aW9uIGJyZWFrcG9pbnQtaW5maXgoJG5hbWUsICRicmVha3BvaW50czogJGdyaWQtYnJlYWtwb2ludHMpIHtcbiAgQHJldHVybiBpZihicmVha3BvaW50LW1pbigkbmFtZSwgJGJyZWFrcG9pbnRzKSA9PSBudWxsLCBcIlwiLCBcIi0jeyRuYW1lfVwiKTtcbn1cblxuLy8gTWVkaWEgb2YgYXQgbGVhc3QgdGhlIG1pbmltdW0gYnJlYWtwb2ludCB3aWR0aC4gTm8gcXVlcnkgZm9yIHRoZSBzbWFsbGVzdCBicmVha3BvaW50LlxuLy8gTWFrZXMgdGhlIEBjb250ZW50IGFwcGx5IHRvIHRoZSBnaXZlbiBicmVha3BvaW50IGFuZCB3aWRlci5cbkBtaXhpbiBtZWRpYS1icmVha3BvaW50LXVwKCRuYW1lLCAkYnJlYWtwb2ludHM6ICRncmlkLWJyZWFrcG9pbnRzKSB7XG4gICRtaW46IGJyZWFrcG9pbnQtbWluKCRuYW1lLCAkYnJlYWtwb2ludHMpO1xuICBAaWYgJG1pbiB7XG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICRtaW4pIHtcbiAgICAgIEBjb250ZW50O1xuICAgIH1cbiAgfSBAZWxzZSB7XG4gICAgQGNvbnRlbnQ7XG4gIH1cbn1cblxuLy8gTWVkaWEgb2YgYXQgbW9zdCB0aGUgbWF4aW11bSBicmVha3BvaW50IHdpZHRoLiBObyBxdWVyeSBmb3IgdGhlIGxhcmdlc3QgYnJlYWtwb2ludC5cbi8vIE1ha2VzIHRoZSBAY29udGVudCBhcHBseSB0byB0aGUgZ2l2ZW4gYnJlYWtwb2ludCBhbmQgbmFycm93ZXIuXG5AbWl4aW4gbWVkaWEtYnJlYWtwb2ludC1kb3duKCRuYW1lLCAkYnJlYWtwb2ludHM6ICRncmlkLWJyZWFrcG9pbnRzKSB7XG4gICRtYXg6IGJyZWFrcG9pbnQtbWF4KCRuYW1lLCAkYnJlYWtwb2ludHMpO1xuICBAaWYgJG1heCB7XG4gICAgQG1lZGlhIChtYXgtd2lkdGg6ICRtYXgpIHtcbiAgICAgIEBjb250ZW50O1xuICAgIH1cbiAgfSBAZWxzZSB7XG4gICAgQGNvbnRlbnQ7XG4gIH1cbn1cblxuLy8gTWVkaWEgdGhhdCBzcGFucyBtdWx0aXBsZSBicmVha3BvaW50IHdpZHRocy5cbi8vIE1ha2VzIHRoZSBAY29udGVudCBhcHBseSBiZXR3ZWVuIHRoZSBtaW4gYW5kIG1heCBicmVha3BvaW50c1xuQG1peGluIG1lZGlhLWJyZWFrcG9pbnQtYmV0d2VlbigkbG93ZXIsICR1cHBlciwgJGJyZWFrcG9pbnRzOiAkZ3JpZC1icmVha3BvaW50cykge1xuICAkbWluOiBicmVha3BvaW50LW1pbigkbG93ZXIsICRicmVha3BvaW50cyk7XG4gICRtYXg6IGJyZWFrcG9pbnQtbWF4KCR1cHBlciwgJGJyZWFrcG9pbnRzKTtcblxuICBAaWYgJG1pbiAhPSBudWxsIGFuZCAkbWF4ICE9IG51bGwge1xuICAgIEBtZWRpYSAobWluLXdpZHRoOiAkbWluKSBhbmQgKG1heC13aWR0aDogJG1heCkge1xuICAgICAgQGNvbnRlbnQ7XG4gICAgfVxuICB9IEBlbHNlIGlmICRtYXggPT0gbnVsbCB7XG4gICAgQGluY2x1ZGUgbWVkaWEtYnJlYWtwb2ludC11cCgkbG93ZXIsICRicmVha3BvaW50cykge1xuICAgICAgQGNvbnRlbnQ7XG4gICAgfVxuICB9IEBlbHNlIGlmICRtaW4gPT0gbnVsbCB7XG4gICAgQGluY2x1ZGUgbWVkaWEtYnJlYWtwb2ludC1kb3duKCR1cHBlciwgJGJyZWFrcG9pbnRzKSB7XG4gICAgICBAY29udGVudDtcbiAgICB9XG4gIH1cbn1cblxuLy8gTWVkaWEgYmV0d2VlbiB0aGUgYnJlYWtwb2ludCdzIG1pbmltdW0gYW5kIG1heGltdW0gd2lkdGhzLlxuLy8gTm8gbWluaW11bSBmb3IgdGhlIHNtYWxsZXN0IGJyZWFrcG9pbnQsIGFuZCBubyBtYXhpbXVtIGZvciB0aGUgbGFyZ2VzdCBvbmUuXG4vLyBNYWtlcyB0aGUgQGNvbnRlbnQgYXBwbHkgb25seSB0byB0aGUgZ2l2ZW4gYnJlYWtwb2ludCwgbm90IHZpZXdwb3J0cyBhbnkgd2lkZXIgb3IgbmFycm93ZXIuXG5AbWl4aW4gbWVkaWEtYnJlYWtwb2ludC1vbmx5KCRuYW1lLCAkYnJlYWtwb2ludHM6ICRncmlkLWJyZWFrcG9pbnRzKSB7XG4gICRtaW46IGJyZWFrcG9pbnQtbWluKCRuYW1lLCAkYnJlYWtwb2ludHMpO1xuICAkbWF4OiBicmVha3BvaW50LW1heCgkbmFtZSwgJGJyZWFrcG9pbnRzKTtcblxuICBAaWYgJG1pbiAhPSBudWxsIGFuZCAkbWF4ICE9IG51bGwge1xuICAgIEBtZWRpYSAobWluLXdpZHRoOiAkbWluKSBhbmQgKG1heC13aWR0aDogJG1heCkge1xuICAgICAgQGNvbnRlbnQ7XG4gICAgfVxuICB9IEBlbHNlIGlmICRtYXggPT0gbnVsbCB7XG4gICAgQGluY2x1ZGUgbWVkaWEtYnJlYWtwb2ludC11cCgkbmFtZSwgJGJyZWFrcG9pbnRzKSB7XG4gICAgICBAY29udGVudDtcbiAgICB9XG4gIH0gQGVsc2UgaWYgJG1pbiA9PSBudWxsIHtcbiAgICBAaW5jbHVkZSBtZWRpYS1icmVha3BvaW50LWRvd24oJG5hbWUsICRicmVha3BvaW50cykge1xuICAgICAgQGNvbnRlbnQ7XG4gICAgfVxuICB9XG59XG4iXX0= */");

/***/ }),

/***/ "./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.ts":
/*!**************************************************************************************!*\
  !*** ./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.ts ***!
  \**************************************************************************************/
/*! exports provided: MypageCreditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MypageCreditComponent", function() { return MypageCreditComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm2015/store.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ "../../node_modules/@ngx-translate/core/fesm2015/ngx-translate-core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../services */ "./app/services/index.ts");
/* harmony import */ var _store_reducers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../store/reducers */ "./app/store/reducers/index.ts");
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
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};








let MypageCreditComponent = class MypageCreditComponent {
    constructor(store, utilService, masterService, userService, formBuilder, translate, router) {
        this.store = store;
        this.utilService = utilService;
        this.masterService = masterService;
        this.userService = userService;
        this.formBuilder = formBuilder;
        this.translate = translate;
        this.router = router;
    }
    /**
     * 初期化
     */
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_7__["getUser"]));
            this.master = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_7__["getMaster"]));
            try {
                yield this.masterService.getSellers();
                yield this.userService.getCreditCards();
                this.createCreditCardForm();
            }
            catch (error) {
                console.error(error);
                this.router.navigate(['/error']);
            }
        });
    }
    /**
     * クレジットカードフォーム作成
     */
    createCreditCardForm() {
        this.cardExpiration = {
            year: [],
            month: []
        };
        for (let i = 0; i < 12; i++) {
            this.cardExpiration.month.push(`0${String(i + 1)}`.slice(-2));
        }
        for (let i = 0; i < 10; i++) {
            this.cardExpiration.year.push(moment__WEBPACK_IMPORTED_MODULE_5__().add(i, 'year').format('YYYY'));
        }
        this.creditCardForm = this.formBuilder.group({
            sellerId: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
            cardNumber: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(/^[0-9]+$/)]],
            cardExpirationMonth: [this.cardExpiration.month[0], [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
            cardExpirationYear: [this.cardExpiration.year[0], [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
            securityCode: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
            holderName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]]
        });
    }
    /**
     * クレジットカード情報登録
     */
    addCreditCard() {
        return __awaiter(this, void 0, void 0, function* () {
            Object.keys(this.creditCardForm.controls).forEach((key) => {
                this.creditCardForm.controls[key].markAsTouched();
            });
            this.creditCardForm.controls.cardNumber.setValue(document.getElementById('cardNumber').value);
            this.creditCardForm.controls.securityCode.setValue(document.getElementById('securityCode').value);
            this.creditCardForm.controls.holderName.setValue(document.getElementById('holderName').value);
            if (this.creditCardForm.invalid) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('mypage.credit.alert.addCredit')
                });
                return;
            }
            const cardExpiration = {
                year: this.creditCardForm.controls.cardExpirationYear.value,
                month: this.creditCardForm.controls.cardExpirationMonth.value
            };
            const creditCard = {
                cardno: this.creditCardForm.controls.cardNumber.value,
                expire: `${cardExpiration.year}${cardExpiration.month}`,
                holderName: this.creditCardForm.controls.holderName.value,
                securityCode: this.creditCardForm.controls.securityCode.value
            };
            try {
                const master = yield this.masterService.getData();
                const seller = master.sellers.find(s => s.id === this.creditCardForm.controls.sellerId.value);
                if (seller === undefined) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('mypage.credit.alert.add')
                    });
                    return;
                }
                yield this.userService.addCreditCard({ creditCard, seller });
                this.createCreditCardForm();
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * クレジットカード情報削除確認
     * @param creditCard
     */
    confirmRemoveCreditCard(creditCard) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('mypage.credit.confirm.remove'),
            cb: () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.userService.removeCreditCard(creditCard);
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('mypage.credit.alert.remove')
                    });
                }
                catch (error) {
                    console.error(error);
                }
            })
        });
    }
};
MypageCreditComponent.ctorParameters = () => [
    { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"] },
    { type: _services__WEBPACK_IMPORTED_MODULE_6__["UtilService"] },
    { type: _services__WEBPACK_IMPORTED_MODULE_6__["MasterService"] },
    { type: _services__WEBPACK_IMPORTED_MODULE_6__["UserService"] },
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] },
    { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
];
MypageCreditComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-mypage-credit',
        template: __importDefault(__webpack_require__(/*! raw-loader!./mypage-credit.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.html")).default,
        styles: [__importDefault(__webpack_require__(/*! ./mypage-credit.component.scss */ "./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.scss")).default]
    }),
    __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
        _services__WEBPACK_IMPORTED_MODULE_6__["UtilService"],
        _services__WEBPACK_IMPORTED_MODULE_6__["MasterService"],
        _services__WEBPACK_IMPORTED_MODULE_6__["UserService"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
        _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"],
        _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], MypageCreditComponent);



/***/ }),

/***/ "./app/modules/mypage/components/pages/mypage-index/mypage-index.component.scss":
/*!**************************************************************************************!*\
  !*** ./app/modules/mypage/components/pages/mypage-index/mypage-index.component.scss ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL215cGFnZS9jb21wb25lbnRzL3BhZ2VzL215cGFnZS1pbmRleC9teXBhZ2UtaW5kZXguY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./app/modules/mypage/components/pages/mypage-index/mypage-index.component.ts":
/*!************************************************************************************!*\
  !*** ./app/modules/mypage/components/pages/mypage-index/mypage-index.component.ts ***!
  \************************************************************************************/
/*! exports provided: MypageIndexComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MypageIndexComponent", function() { return MypageIndexComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm2015/core.js");
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

let MypageIndexComponent = class MypageIndexComponent {
    constructor() { }
    /**
     * 初期化
     */
    ngOnInit() {
    }
};
MypageIndexComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-mypage-index',
        template: __importDefault(__webpack_require__(/*! raw-loader!./mypage-index.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-index/mypage-index.component.html")).default,
        styles: [__importDefault(__webpack_require__(/*! ./mypage-index.component.scss */ "./app/modules/mypage/components/pages/mypage-index/mypage-index.component.scss")).default]
    }),
    __metadata("design:paramtypes", [])
], MypageIndexComponent);



/***/ }),

/***/ "./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.scss":
/*!******************************************************************************************!*\
  !*** ./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.scss ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvY2xpZW50L2FwcC9tb2R1bGVzL215cGFnZS9jb21wb25lbnRzL3BhZ2VzL215cGFnZS1wcm9maWxlL215cGFnZS1wcm9maWxlLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.ts":
/*!****************************************************************************************!*\
  !*** ./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.ts ***!
  \****************************************************************************************/
/*! exports provided: MypageProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MypageProfileComponent", function() { return MypageProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm2015/store.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ "../../node_modules/@ngx-translate/core/fesm2015/ngx-translate-core.js");
/* harmony import */ var libphonenumber_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! libphonenumber-js */ "../../node_modules/libphonenumber-js/index.es6.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../services */ "./app/services/index.ts");
/* harmony import */ var _store_reducers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../store/reducers */ "./app/store/reducers/index.ts");
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
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};







let MypageProfileComponent = class MypageProfileComponent {
    constructor(store, utilService, formBuilder, translate, userService) {
        this.store = store;
        this.utilService = utilService;
        this.formBuilder = formBuilder;
        this.translate = translate;
        this.userService = userService;
    }
    /**
     * 初期化
     */
    ngOnInit() {
        this.isLoading = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_6__["getLoading"]));
        this.user = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_6__["getUser"]));
        this.createProfileForm();
    }
    /**
     * プロフィールフォーム作成
     */
    createProfileForm() {
        const NAME_MAX_LENGTH = 12;
        const MAIL_MAX_LENGTH = 50;
        const TEL_MAX_LENGTH = 11;
        const TEL_MIN_LENGTH = 9;
        this.profileForm = this.formBuilder.group({
            familyName: ['', [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(NAME_MAX_LENGTH),
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(/^[ァ-ヶー]+$/)
                ]],
            givenName: ['', [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(NAME_MAX_LENGTH),
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(/^[ァ-ヶー]+$/)
                ]],
            email: ['', [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(MAIL_MAX_LENGTH),
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].email
                ]],
            telephone: ['', [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(TEL_MAX_LENGTH),
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(TEL_MIN_LENGTH),
                    _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(/^[0-9]+$/),
                    (control) => {
                        const field = control.root.get('telephone');
                        if (field !== null) {
                            if (field.value === '') {
                                return null;
                            }
                            const parsedNumber = (new RegExp(/^\+/).test(field.value))
                                ? libphonenumber_js__WEBPACK_IMPORTED_MODULE_4__["parse"](field.value)
                                : libphonenumber_js__WEBPACK_IMPORTED_MODULE_4__["parse"](field.value, 'JP');
                            if (parsedNumber.phone === undefined) {
                                return { telephone: true };
                            }
                            const isValid = libphonenumber_js__WEBPACK_IMPORTED_MODULE_4__["isValidNumber"](parsedNumber);
                            if (!isValid) {
                                return { telephone: true };
                            }
                        }
                        return null;
                    }
                ]]
        });
        this.user.subscribe((user) => {
            if (user.profile === undefined) {
                return;
            }
            this.profileForm.controls.familyName.setValue(user.profile.familyName);
            this.profileForm.controls.givenName.setValue(user.profile.givenName);
            this.profileForm.controls.email.setValue(user.profile.email);
            this.profileForm.controls.telephone.setValue(user.profile.telephone);
        }).unsubscribe();
    }
    /**
     * プロフィール更新
     */
    updateProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            Object.keys(this.profileForm.controls).forEach((key) => {
                this.profileForm.controls[key].markAsTouched();
            });
            this.profileForm.controls.familyName.setValue(document.getElementById('familyName').value);
            this.profileForm.controls.givenName.setValue(document.getElementById('givenName').value);
            this.profileForm.controls.email.setValue(document.getElementById('email').value);
            this.profileForm.controls.telephone.setValue(document.getElementById('telephone').value);
            if (this.profileForm.invalid) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('setting.alert.customer')
                });
                return;
            }
            try {
                const profile = {
                    givenName: this.profileForm.controls.givenName.value,
                    familyName: this.profileForm.controls.familyName.value,
                    telephone: this.profileForm.controls.telephone.value,
                    email: this.profileForm.controls.email.value,
                };
                yield this.userService.updateProfile(profile);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
};
MypageProfileComponent.ctorParameters = () => [
    { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"] },
    { type: _services__WEBPACK_IMPORTED_MODULE_5__["UtilService"] },
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] },
    { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateService"] },
    { type: _services__WEBPACK_IMPORTED_MODULE_5__["UserService"] }
];
MypageProfileComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-mypage-profile',
        template: __importDefault(__webpack_require__(/*! raw-loader!./mypage-profile.component.html */ "../../node_modules/raw-loader/dist/cjs.js!./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.html")).default,
        styles: [__importDefault(__webpack_require__(/*! ./mypage-profile.component.scss */ "./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.scss")).default]
    }),
    __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
        _services__WEBPACK_IMPORTED_MODULE_5__["UtilService"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
        _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateService"],
        _services__WEBPACK_IMPORTED_MODULE_5__["UserService"]])
], MypageProfileComponent);



/***/ }),

/***/ "./app/modules/mypage/mypage-routing.module.ts":
/*!*****************************************************!*\
  !*** ./app/modules/mypage/mypage-routing.module.ts ***!
  \*****************************************************/
/*! exports provided: MypageRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MypageRoutingModule", function() { return MypageRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _shared_components_pages_base_base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/components/pages/base/base.component */ "./app/modules/shared/components/pages/base/base.component.ts");
/* harmony import */ var _components_pages_mypage_coin_mypage_coin_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/pages/mypage-coin/mypage-coin.component */ "./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.ts");
/* harmony import */ var _components_pages_mypage_credit_mypage_credit_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/pages/mypage-credit/mypage-credit.component */ "./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.ts");
/* harmony import */ var _components_pages_mypage_index_mypage_index_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/pages/mypage-index/mypage-index.component */ "./app/modules/mypage/components/pages/mypage-index/mypage-index.component.ts");
/* harmony import */ var _components_pages_mypage_profile_mypage_profile_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/pages/mypage-profile/mypage-profile.component */ "./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};







const routes = [
    {
        path: '',
        component: _shared_components_pages_base_base_component__WEBPACK_IMPORTED_MODULE_2__["BaseComponent"],
        children: [
            { path: '', component: _components_pages_mypage_index_mypage_index_component__WEBPACK_IMPORTED_MODULE_5__["MypageIndexComponent"] },
            { path: 'profile', component: _components_pages_mypage_profile_mypage_profile_component__WEBPACK_IMPORTED_MODULE_6__["MypageProfileComponent"] },
            { path: 'credit', component: _components_pages_mypage_credit_mypage_credit_component__WEBPACK_IMPORTED_MODULE_4__["MypageCreditComponent"] },
            { path: 'coin', component: _components_pages_mypage_coin_mypage_coin_component__WEBPACK_IMPORTED_MODULE_3__["MypageCoinComponent"] }
        ]
    }
];
let MypageRoutingModule = class MypageRoutingModule {
};
MypageRoutingModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    })
], MypageRoutingModule);



/***/ }),

/***/ "./app/modules/mypage/mypage.module.ts":
/*!*********************************************!*\
  !*** ./app/modules/mypage/mypage.module.ts ***!
  \*********************************************/
/*! exports provided: MypageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MypageModule", function() { return MypageModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/shared.module */ "./app/modules/shared/shared.module.ts");
/* harmony import */ var _components_pages_mypage_coin_mypage_coin_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/pages/mypage-coin/mypage-coin.component */ "./app/modules/mypage/components/pages/mypage-coin/mypage-coin.component.ts");
/* harmony import */ var _components_pages_mypage_credit_mypage_credit_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/pages/mypage-credit/mypage-credit.component */ "./app/modules/mypage/components/pages/mypage-credit/mypage-credit.component.ts");
/* harmony import */ var _components_pages_mypage_index_mypage_index_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/pages/mypage-index/mypage-index.component */ "./app/modules/mypage/components/pages/mypage-index/mypage-index.component.ts");
/* harmony import */ var _components_pages_mypage_profile_mypage_profile_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/pages/mypage-profile/mypage-profile.component */ "./app/modules/mypage/components/pages/mypage-profile/mypage-profile.component.ts");
/* harmony import */ var _mypage_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mypage-routing.module */ "./app/modules/mypage/mypage-routing.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};








let MypageModule = class MypageModule {
};
MypageModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [
            _components_pages_mypage_index_mypage_index_component__WEBPACK_IMPORTED_MODULE_5__["MypageIndexComponent"],
            _components_pages_mypage_profile_mypage_profile_component__WEBPACK_IMPORTED_MODULE_6__["MypageProfileComponent"],
            _components_pages_mypage_credit_mypage_credit_component__WEBPACK_IMPORTED_MODULE_4__["MypageCreditComponent"],
            _components_pages_mypage_coin_mypage_coin_component__WEBPACK_IMPORTED_MODULE_3__["MypageCoinComponent"],
        ],
        entryComponents: [],
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
            _mypage_routing_module__WEBPACK_IMPORTED_MODULE_7__["MypageRoutingModule"],
            _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"],
        ]
    })
], MypageModule);



/***/ })

}]);
//# sourceMappingURL=modules-mypage-mypage-module-es2015.js.map