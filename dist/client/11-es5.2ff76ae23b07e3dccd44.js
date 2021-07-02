!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"+X77":function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.confirm.title\' | translate }}</h2>\n    <div *ngIf="(order | async)?.order.orderStatus === orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.canceled\' | translate"></p>\n    </div>\n    <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.read\' | translate"></p>\n\n        <div *ngIf="(order | async)?.order.confirmationNumber" class="mb-4 px-3 py-2 bg-white">\n            <div class="row align-items-center">\n                <p class="col-4">\n                    {{ \'common.confirmationNumber\' | translate }}\n                </p>\n                <p class="col-8 text-large text-info font-weight-bold">\n                    {{ (order | async)?.order.confirmationNumber }}\n                </p>\n            </div>\n        </div>\n\n        <div *ngFor="let eventOrder of eventOrders" class="mb-4">\n            <app-item-event [screeningEvent]="eventOrder.event"></app-item-event>\n            <div class="bg-white p-3">\n                <app-item-list [acceptedOffers]="eventOrder.data" [order]="(order | async)?.order" [code]="code">\n                </app-item-list>\n            </div>\n        </div>\n\n        <div *ngIf="eventOrders && eventOrders.length === 0" class="mb-4 p-3 bg-white">\n            <app-item-product [order]="(order | async)?.order"></app-item-product>\n        </div>\n\n\n        <div class="mb-4 p-3 bg-white">\n            <app-item-profile [profile]="(order | async)?.order.customer"></app-item-profile>\n        </div>\n    </div>\n\n\n    <div class="buttons mx-auto text-center">\n        <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n            <button *ngIf="environment.INQUIRY_PRINT && eventOrders?.length > 0"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-primary btn-block py-3 mb-3" (click)="print()" [disabled]="isLoading | async">\n                {{ \'inquiry.confirm.print\' | translate }}\n            </button>\n            <button *ngIf="environment.INQUIRY_CANCEL"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-danger btn-block py-3 mb-3" (click)="cancelConfirm()">\n                {{ \'inquiry.confirm.cancel\' | translate }}\n            </button>\n        </div>\n        <button type="button" class="btn btn-outline-primary btn-block py-3" routerLink="/inquiry/input">{{\n            \'inquiry.confirm.prev\' | translate }}</button>\n    </div>\n</div>'},"2+OO":function(e,t,n){"use strict";n.r(t),t.default=""},"2ISw":function(t,r,i){"use strict";i.r(r),i.d(r,"InquiryModule",(function(){return T}));var o=i("2kYt"),a=i("EM62"),s=i("DSWM"),c=i("sEIs"),u=i("icHh"),l=i("sN6X"),p=i("s2Ay"),d=i("wgY5"),f=i("x8Mb"),m=i("PIN6"),h=i("cHUu"),v=i("mOXJ"),b=function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{c(r.next(e))}catch(t){o(t)}}function s(e){try{c(r.throw(e))}catch(t){o(t)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}))},y=function(e){return e&&e.__esModule?e:{default:e}},g=function(){function t(n,r,i,o,a){e(this,t),this.store=n,this.router=r,this.utilService=i,this.actionService=o,this.translate=a,this.moment=d,this.orderStatus=u.factory.orderStatus,this.environment=Object(m.a)()}return n(t,[{key:"ngOnInit",value:function(){return b(this,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r,i=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.isLoading=this.store.pipe(Object(l.m)(v.b)),this.error=this.store.pipe(Object(l.m)(v.a)),this.order=this.store.pipe(Object(l.m)(v.d)),this.user=this.store.pipe(Object(l.m)(v.g)),e.prev=1,e.next=4,this.actionService.order.getData();case 4:if(t=e.sent,void 0!==(n=t.order)){e.next=8;break}throw new Error("order undefined");case 8:return e.next=10,this.isShowQRCode({order:n});case 10:if(e.t0=e.sent,!e.t0){e.next=15;break}return e.next=14,this.actionService.order.authorizeOrder({order:n});case 14:this.code=e.sent;case 15:this.eventOrders=f.a.Purchase.order2EventOrders({order:n}),e.next=21;break;case 18:e.prev=18,e.t1=e.catch(1),console.error(e.t1),this.router.navigate(["/error"]);case 21:""!==this.environment.INQUIRY_PRINT_WAIT_TIME&&(r=Number(this.environment.INQUIRY_PRINT_WAIT_TIME),this.timer=setTimeout((function(){i.router.navigate(["/inquiry/input"])}),r));case 22:case"end":return e.stop()}}),e,this,[[1,18]])})))}},{key:"ngOnDestroy",value:function(){void 0!==this.timer&&clearTimeout(this.timer)}},{key:"cancelConfirm",value:function(){var e=this;this.utilService.openConfirm({title:this.translate.instant("common.confirm"),body:this.translate.instant("inquiry.confirm.confirm.cancel"),cb:function(){return b(e,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.actionService.user.getData();case 3:return t=e.sent,e.next=6,this.actionService.order.getData();case 6:if(void 0!==(n=e.sent).order){e.next=9;break}throw new Error("order undefined");case 9:return r=[n.order],i=t.language,e.next=12,this.actionService.order.cancel({orders:r,language:i});case 12:return e.next=14,this.actionService.order.getData();case 14:if(void 0!==(n=e.sent).order){e.next=17;break}throw new Error("order undefined");case 17:return e.next=19,this.actionService.order.inquiry({confirmationNumber:n.order.confirmationNumber,customer:{telephone:n.order.customer.telephone}});case 19:e.next=24;break;case 21:e.prev=21,e.t0=e.catch(0),this.utilService.openAlert({title:this.translate.instant("common.error"),body:'\n                        <p class="mb-4">'.concat(this.translate.instant("inquiry.confirm.alert.cancel"),'</p>\n                        <div class="p-3 bg-light-gray select-text error">\n                            <code>').concat(e.t0,"</code>\n                        </div>")});case 24:case"end":return e.stop()}}),e,this,[[0,21]])})))}})}},{key:"print",value:function(){return b(this,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r,i,o,a,s,c,u,l=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.actionService.order.getData();case 3:return t=e.sent,n=t.order,e.next=7,this.actionService.user.getData();case 7:if(r=e.sent,i=r.pos,o=r.printer,void 0!==n&&void 0!==i&&void 0!==o){e.next=12;break}throw new Error("order or pos or printer undefined");case 12:return e.next=14,this.utilService.getServerTime();case 14:if(a=e.sent.date,s=d(a).format("YYYYMMDD"),c=f.a.Purchase.order2EventOrders({order:n}).find((function(e){return d(e.event.startDate).format("YYYYMMDD")!==s})),u=function(){return b(l,void 0,void 0,regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return void 0!==this.timer&&clearTimeout(this.timer),t=[n],e.next=4,this.actionService.order.print({orders:t,pos:i,printer:o});case 4:this.router.navigate(["/inquiry/print"]);case 5:case"end":return e.stop()}}),e,this)})))},void 0===c){e.next=20;break}return e.abrupt("return",void this.utilService.openConfirm({title:this.translate.instant("common.confirm"),body:this.translate.instant("inquiry.confirm.confirm.printExpired"),cb:function(){return b(l,void 0,void 0,regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u();case 2:case"end":return e.stop()}}),e)})))}}));case 20:return e.next=22,u();case 22:e.next=27;break;case 24:e.prev=24,e.t0=e.catch(0),console.error(e.t0),this.router.navigate(["/error"]);case 27:case"end":return e.stop()}}),e,this,[[0,24]])})))}},{key:"isShowQRCode",value:function(e){return b(this,void 0,void 0,regeneratorRuntime.mark((function t(){var n,r=this;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.order,t.abrupt("return",n.acceptedOffers.filter((function(e){var t=e.itemOffered,n=Number(r.environment.INQUIRY_SHOW_QRCODE_FROM_VALUE),i=r.environment.INQUIRY_SHOW_QRCODE_FROM_UNIT;return t.typeOf===u.factory.reservationType.EventReservation&&d(t.reservationFor.startDate).add(n,i).toDate()<d().toDate()})).length>0&&this.environment.INQUIRY_QRCODE);case 2:case"end":return t.stop()}}),t,this)})))}}]),t}();g.ctorParameters=function(){return[{type:l.b},{type:c.c},{type:h.f},{type:h.a},{type:p.c}]},g=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-confirm",template:y(i("+X77")).default,styles:[y(i("2+OO")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[l.b,c.c,h.f,h.a,p.c])],g);var I=i("nIj0"),x=i("WxsR"),R=i("ddJ1"),k=function(e){return e&&e.__esModule?e:{default:e}},N=function(){function t(n,r,i,o,a,s,c){e(this,t),this.store=n,this.formBuilder=r,this.utilService=i,this.actionService=o,this.activatedRoute=a,this.router=s,this.translate=c,this.environment=Object(m.a)(),this.SearchCountryField=R.c,this.TooltipLabel=R.d,this.CountryISO=R.a}return n(t,[{key:"ngOnInit",value:function(){var e=this;this.isLoading=this.store.pipe(Object(l.m)(v.b)),this.isPasswordMask=!0,this.createInputForm(),setTimeout((function(){if(void 0!==e.intlTelInput){var t=e.intlTelInput.allCountries.find((function(e){return e.iso2===R.a.Japan}));void 0!==t&&(t.placeHolder=e.translate.instant("form.placeholder.telephone"))}}),0)}},{key:"createInputForm",value:function(){this.inputForm=this.formBuilder.group({confirmationNumber:["",[I.k.required,I.k.pattern(/^[0-9]+$/)]],telephone:["",this.environment.INQUIRY_INPUT_KEYPAD?[I.k.required,I.k.maxLength(15),I.k.minLength(9),function(e){var t=e.root.get("telephone");if(null!==t){if(""===t.value)return null;var n=new RegExp(/^\+/).test(t.value)?x.c(t.value):x.c(t.value,"JP");if(void 0===n.phone)return{telephone:!0};if(!x.b(n))return{telephone:!0}}return null}]:[I.k.required]]});var e=this.activatedRoute.snapshot.params.confirmationNumber;void 0!==e&&this.inputForm.controls.confirmationNumber.setValue(e)}},{key:"onSubmit",value:function(){return e=this,t=void 0,n=void 0,r=regeneratorRuntime.mark((function e(){var t,n,r=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object.keys(this.inputForm.controls).forEach((function(e){r.inputForm.controls[e].markAsTouched()})),this.inputForm.controls.confirmationNumber.setValue(document.getElementById("confirmationNumber").value),this.environment.INQUIRY_INPUT_KEYPAD&&this.inputForm.controls.telephone.setValue(document.getElementById("telephone").value),!this.inputForm.invalid){e.next=2;break}return e.abrupt("return");case 2:return t=this.inputForm.controls.confirmationNumber.value,n=this.environment.INQUIRY_INPUT_KEYPAD?this.inputForm.controls.telephone.value:this.inputForm.controls.telephone.value.e164Number,e.prev=3,e.next=6,this.actionService.order.inquiry({confirmationNumber:t,customer:{telephone:n}});case 6:this.router.navigate(["/inquiry/confirm"]),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(3),console.error(e.t0),this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.input.validation")});case 12:case"end":return e.stop()}}),e,this,[[3,9]])})),new(n||(n=Promise))((function(i,o){function a(e){try{c(r.next(e))}catch(t){o(t)}}function s(e){try{c(r.throw(e))}catch(t){o(t)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}));var e,t,n,r}},{key:"changeConfirmationNumber",value:function(e){this.inputForm.controls.confirmationNumber.setValue(e)}},{key:"changeTelephone",value:function(e){this.inputForm.controls.telephone.setValue(e)}},{key:"changePassWordMask",value:function(){this.isPasswordMask=!this.isPasswordMask,void 0!==this.intlTelInput&&(this.intlTelInput.cssClass=this.isPasswordMask?"form-control text-security-disc":"form-control")}}]),t}();N.ctorParameters=function(){return[{type:l.b},{type:I.b},{type:h.f},{type:h.a},{type:c.a},{type:c.c},{type:p.c}]},N.propDecorators={intlTelInput:[{type:a.lb,args:["intlTelInput"]}]},N=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-input",template:k(i("uWiq")).default,styles:[k(i("vcNb")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[l.b,I.b,h.f,h.a,c.a,c.c,p.c])],N);var w=function(e){return e&&e.__esModule?e:{default:e}},O=function(){function t(n){e(this,t),this.router=n,this.environment=Object(m.a)()}return n(t,[{key:"ngOnInit",value:function(){var e=this;if(""!==this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME){var t=Number(this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME);this.timer=setTimeout((function(){e.router.navigate(["/inquiry/input"])}),t)}}},{key:"ngOnDestroy",value:function(){void 0!==this.timer&&clearTimeout(this.timer)}}]),t}();O.ctorParameters=function(){return[{type:c.c}]},O=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-print",template:w(i("w++k")).default,styles:[w(i("LlIr")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[c.c])],O);var P=[{path:"",component:i("RRjC").a,children:[{path:"input",component:N},{path:"input/:confirmationNumber",component:N},{path:"confirm",component:g},{path:"print",component:O}]}],S=function t(){e(this,t)};S=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.K)({imports:[c.d.forChild(P)],exports:[c.d]})],S);var T=function t(){e(this,t)};T=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.K)({declarations:[N,g,O],imports:[o.c,S,s.a]})],T)},LlIr:function(e,t,n){"use strict";n.r(t),t.default=""},uWiq:function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <form [formGroup]="inputForm">\n        <div class="mb-4">\n            <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.input.title\' | translate }}</h2>\n            <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.input.read\' | translate"></p>\n\n            <div class="inquiry-form mx-auto p-3 bg-white">\n\n                <div class="form-group">\n                    <label class="mb-2" for="">{{ \'common.confirmationNumber\' | translate }}</label>\n                    <app-numeric-keypad *ngIf="environment.INQUIRY_INPUT_KEYPAD" inputType="string"\n                        [inputValue]="inputForm.controls.confirmationNumber.value"\n                        (change)="changeConfirmationNumber($event)">\n                        <input type="text" class="form-control" formControlName="confirmationNumber"\n                            id="confirmationNumber" [placeholder]="\'form.placeholder.confirmationNumber\' | translate"\n                            readonly>\n                    </app-numeric-keypad>\n                    <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="text" class="form-control"\n                        formControlName="confirmationNumber" id="confirmationNumber"\n                        [placeholder]="\'form.placeholder.confirmationNumber\' | translate">\n                    <div *ngIf="inputForm.controls.confirmationNumber.invalid && inputForm.controls.confirmationNumber.touched"\n                        class="mt-2">\n                        <p *ngIf="inputForm.controls.confirmationNumber.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.confirmationNumber.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                    </div>\n                </div>\n                <div class="form-group mb-0">\n                    <label class="mb-2" for="">{{ \'form.label.telephone\' | translate }}</label>\n                    <div class="position-relative" *ngIf="environment.INQUIRY_INPUT_KEYPAD">\n                        <app-numeric-keypad inputType="telephone" [inputValue]="inputForm.controls.telephone.value"\n                            (change)="changeTelephone($event)">\n                            <input [type]="(isPasswordMask) ? \'password\' : \'text\'" class="form-control"\n                                formControlName="telephone" id="telephone"\n                                [placeholder]="\'form.placeholder.telephone\' | translate" readonly>\n                        </app-numeric-keypad>\n                        <button type="button" class="btn position-absolute" style="top: 0; right: 0;"\n                            (click)="changePassWordMask()">\n                            <i *ngIf="isPasswordMask" class="bi bi-eye-fill"></i>\n                            <i *ngIf="!isPasswordMask" class="bi bi-eye-slash-fill"></i>\n                        </button>\n                    </div>\n                    <div class="position-relative" *ngIf="!environment.INQUIRY_INPUT_KEYPAD">\n                        <ngx-intl-tel-input #intlTelInput [cssClass]="\'form-control text-security-disc\'"\n                            [preferredCountries]="[CountryISO.Japan]" [enableAutoCountrySelect]="false"\n                            [enablePlaceholder]="true" [searchCountryFlag]="true"\n                            [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"\n                            [selectFirstCountry]="false" [selectedCountryISO]="CountryISO.Japan" [maxLength]="15"\n                            [tooltipField]="TooltipLabel.Name" [phoneValidation]="true" [separateDialCode]="false"\n                            name="telephone" formControlName="telephone" type="password"></ngx-intl-tel-input>\n                        <button type="button" class="btn position-absolute" style="top: 0; right: 0;"\n                            (click)="changePassWordMask()">\n                            <i *ngIf="isPasswordMask" class="bi bi-eye-fill"></i>\n                            <i *ngIf="!isPasswordMask" class="bi bi-eye-slash-fill"></i>\n                        </button>\n                    </div>\n\n                    \x3c!-- <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="password" class="form-control"\n                        formControlName="telephone" id="telephone"\n                        [placeholder]="\'form.placeholder.telephone\' | translate"> --\x3e\n                    <div *ngIf="inputForm.controls.telephone.invalid && inputForm.controls.telephone.touched"\n                        class="mt-2">\n                        <p *ngIf="inputForm.controls.telephone.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.minlength" class="text-danger">\n                            {{ \'form.validation.minlength\' | translate: { value:\n                            inputForm.controls.telephone.errors?.minlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.maxlength" class="text-danger">\n                            {{ \'form.validation.maxlength\' | translate: { value:\n                            inputForm.controls.telephone.errors?.maxlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.telephone" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.validatePhoneNumber" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}\n                        </p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n\n        <div class="buttons mx-auto text-center">\n            <button type="submit" [disabled]="isLoading | async" class="btn btn-primary btn-block py-3 mb-3"\n                (click)="onSubmit()">{{ \'inquiry.input.next\' | translate }}</button>\n            <a *ngIf="environment.PORTAL_SITE_URL" class="btn btn-outline-primary btn-block py-3 portal-link"\n                [href]="environment.PORTAL_SITE_URL">{{ \'inquiry.input.prev\' | translate }}</a>\n            <button *ngIf="!environment.PORTAL_SITE_URL" type="button" class="btn btn-outline-primary btn-block py-3"\n                routerLink="/">{{ \'inquiry.input.prev\' | translate }}</button>\n        </div>\n    </form>\n</div>'},vcNb:function(e,t,n){"use strict";n.r(t),t.default=".inquiry-form {\n  max-width: 500px;\n}"},"w++k":function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <div class="mb-4">\n        <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.print.title\' | translate }}</h2>\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.print.read\' | translate"></p>\n    </div>\n\n    <div class="buttons mx-auto text-center">\n        <button type="button" class="btn btn-primary btn-block py-3" routerLink="/inquiry/input">\n            {{ \'inquiry.print.prev\' | translate }}\n        </button>\n    </div>\n</div>'}}])}();