!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"+X77":function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.confirm.title\' | translate }}</h2>\n    <div *ngIf="(order | async)?.order.orderStatus === orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.canceled\' | translate"></p>\n    </div>\n    <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.read\' | translate"></p>\n        <div class="mb-4 px-3 py-2 bg-white">\n            <div class="row align-items-center">\n                <p class="col-4">\n                    {{ \'common.confirmationNumber\' | translate }}</p>\n                <p class="col-8 text-large text-info font-weight-bold">\n                    {{ (order | async)?.order.confirmationNumber }}\n                </p>\n            </div>\n        </div>\n        <div *ngFor="let eventOrder of eventOrders" class="mb-4 bg-white p-3">\n            <div class="mb-3">\n                <div class="mb-1">\n                    <p class="font-weight-bold text-large">{{ eventOrder.event.name | changeLanguage }}</p>\n                    <p class="text-small"\n                        *ngIf="eventOrder.event.superEvent.headline && (eventOrder.event.superEvent.headline | changeLanguage)">\n                        {{ eventOrder.event.superEvent.headline | changeLanguage }}</p>\n                    <p class="text-small"\n                        *ngIf="eventOrder.event.superEvent.description && (eventOrder.event.superEvent.description | changeLanguage)">{{\n                        eventOrder.event.superEvent.description | changeLanguage }}</p>\n                </div>\n                <p class="mb-1">\n                    {{ eventOrder.event.startDate | formatDate: \'MM/DD(ddd) HH:mm\' }}-{{ eventOrder.event.endDate | formatDate: \'HH:mm\' }}\n                </p>\n                <p class="text-small mb-1">\n                    <span class="theater-name">{{ eventOrder.event.superEvent.location.name | changeLanguage }}</span>\n                    <span class="screen-name">&nbsp;/&nbsp;<span *ngIf="eventOrder.event.location.address | changeLanguage" class="mr-2">{{ eventOrder.event.location.address | changeLanguage }}</span>{{ eventOrder.event.location.name | changeLanguage }}</span>\n                    <span\n                        *ngIf="eventOrder.event.workPerformed?.duration && moment.duration(eventOrder.event.workPerformed?.duration).asMinutes() > 0">\n                        &nbsp;/&nbsp;<span\n                            class="mr-1">{{ \'common.duration\' | translate }}</span>{{ moment.duration(eventOrder.event.workPerformed?.duration).asMinutes() }}{{ \'common.date.minute\' | translate }}\n                    </span>\n                </p>\n            </div>\n            <hr class="mb-3">\n            <app-item-list [acceptedOffers]="eventOrder.data" [qrcode]="environment.INQUIRY_QRCODE"></app-item-list>\n        </div>\n\n\n        <div class="mb-4 px-3 bg-white">\n            <div class="py-3 border-bottom border-gray customer-name">\n                <div class="row align-items-center">\n                    <p class="mb-2 mb-md-0 col-md-4">{{ \'common.customerName\' | translate }}</p>\n                    <p class="col-md-8">{{ (order | async)?.order.customer.familyName }}\n                        {{ (order | async)?.order.customer.givenName }}</p>\n                </div>\n            </div>\n            <div class="py-3 border-bottom border-gray email">\n                <div class="row align-items-center">\n                    <p class="mb-2 mb-md-0 col-md-4">{{ \'form.label.email\' | translate }}</p>\n                    <p class="col-md-8">{{ (order | async)?.order.customer.email }}</p>\n                </div>\n            </div>\n            <div class="py-3 telephone">\n                <div class="row align-items-center">\n                    <p class="mb-2 mb-md-0 col-md-4">{{ \'form.label.telephone\' | translate }}</p>\n                    <p class="col-md-8">{{ (order | async)?.order.customer.telephone | libphonenumberFormat }}</p>\n                </div>\n            </div>\n            \x3c!-- <div class="py-3" *ngIf="(order | async)?.order.price > 0">\n                <div class="row align-items-center">\n                    <p class="mb-2 mb-md-0 col-md-4">{{ \'common.paymentMethod\' | translate }}</p>\n                    <p class="col-md-8">\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9</p>\n                </div>\n            </div> --\x3e\n        </div>\n    </div>\n\n\n    <div class="buttons mx-auto text-center">\n        <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n            <button *ngIf="environment.INQUIRY_PRINT"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-primary btn-block py-3 mb-3" (click)="print()"\n                [disabled]="isLoading | async">{{ \'inquiry.confirm.print\' | translate }}</button>\n            <button *ngIf="environment.INQUIRY_CANCEL"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-danger btn-block py-3 mb-3"\n                (click)="cancelConfirm()">{{ \'inquiry.confirm.cancel\' | translate }}</button>\n        </div>\n        <button type="button" class="btn btn-link"\n            routerLink="/inquiry/input">{{ \'inquiry.confirm.prev\' | translate }}</button>\n    </div>\n</div>'},"2+OO":function(e,t,n){"use strict";n.r(t),t.default=""},"2ISw":function(t,r,i){"use strict";i.r(r),i.d(r,"InquiryModule",(function(){return T}));var o=i("2kYt"),a=i("EM62"),s=i("DSWM"),c=i("sEIs"),l=i("icHh"),u=i("sN6X"),d=i("s2Ay"),m=i("wgY5"),p=i("x8Mb"),f=i("PIN6"),v=i("cHUu"),h=i("mOXJ"),b=function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{c(r.next(e))}catch(t){o(t)}}function s(e){try{c(r.throw(e))}catch(t){o(t)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}))},y=function(e){return e&&e.__esModule?e:{default:e}},g=function(){function t(n,r,i,o,a,s,c){e(this,t),this.store=n,this.router=r,this.utilService=i,this.orderService=o,this.userService=a,this.translate=s,this.qrcodeService=c,this.moment=m,this.orderStatus=l.factory.orderStatus,this.environment=Object(f.a)()}return n(t,[{key:"ngOnInit",value:function(){return b(this,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r,i=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.eventOrders=[],this.isLoading=this.store.pipe(Object(u.m)(h.b)),this.error=this.store.pipe(Object(u.m)(h.a)),this.order=this.store.pipe(Object(u.m)(h.d)),this.user=this.store.pipe(Object(u.m)(h.g)),e.prev=1,e.next=4,this.orderService.getData();case 4:if(void 0!==(t=e.sent.order)){e.next=7;break}throw new Error("order undefined");case 7:if(this.eventOrders=p.a.Purchase.order2EventOrders({order:t}),n=this.eventOrders.find((function(e){return p.a.Order.isShowQRCode(e.event)})),!this.environment.INQUIRY_QRCODE||void 0===n){e.next=18;break}return e.next=12,this.orderService.authorize(t);case 12:return e.next=14,this.orderService.getData();case 14:if(void 0!==(t=e.sent.order)){e.next=17;break}throw new Error("order undefined");case 17:this.eventOrders=p.a.Purchase.order2EventOrders({order:t});case 18:""!==this.environment.INQUIRY_PRINT_WAIT_TIME&&(r=Number(this.environment.INQUIRY_PRINT_WAIT_TIME),this.timer=setTimeout((function(){i.router.navigate(["/inquiry/input"])}),r)),e.next=24;break;case 21:e.prev=21,e.t0=e.catch(1),console.error(e.t0),this.router.navigate(["/error"]);case 24:case"end":return e.stop()}}),e,this,[[1,21]])})))}},{key:"ngOnDestroy",value:function(){void 0!==this.timer&&clearTimeout(this.timer)}},{key:"openQRCodeViewer",value:function(e){return b(this,void 0,void 0,regeneratorRuntime.mark((function t(){var n,r,i,o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.orderService.getData();case 3:if(void 0!==(n=t.sent.order)){t.next=6;break}throw new Error("order undefined");case 6:return t.next=8,this.orderService.authorize(n);case 8:return t.next=10,this.orderService.getData();case 10:if(n=t.sent.order,void 0!==(r=n)){t.next=14;break}throw new Error("authorizeOrder undefined");case 14:if(void 0!==(i=r.acceptedOffers.find((function(t){return t.itemOffered.typeOf===l.factory.chevre.reservationType.EventReservation&&t.itemOffered.id===e.id})))){t.next=17;break}throw new Error("itemOffered notfound");case 17:if(i.itemOffered.typeOf===l.factory.chevre.reservationType.EventReservation){t.next=19;break}throw new Error("itemOffered typeOf missmatch");case 19:o=i.itemOffered,this.qrcodeService.openQRCodeViewer({title:this.translate.instant("inquiry.confirm.qrcode.title"),code:o.reservedTicket.ticketToken}),t.next=26;break;case 23:t.prev=23,t.t0=t.catch(0),console.error(t.t0),this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.confirm.alert.authorize")});case 26:case"end":return t.stop()}}),t,this,[[0,23]])})))}},{key:"cancelConfirm",value:function(){var e=this;this.utilService.openConfirm({title:this.translate.instant("common.confirm"),body:this.translate.instant("inquiry.confirm.confirm.cancel"),cb:function(){return b(e,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.userService.getData();case 3:return t=e.sent,e.next=6,this.orderService.getData();case 6:if(void 0!==(n=e.sent).order){e.next=9;break}throw new Error("order undefined");case 9:return r=[n.order],i=t.language,e.next=12,this.orderService.cancel({orders:r,language:i});case 12:return e.next=14,this.orderService.getData();case 14:if(void 0!==(n=e.sent).order){e.next=17;break}throw new Error("order undefined");case 17:return e.next=19,this.orderService.inquiry({confirmationNumber:n.order.confirmationNumber,customer:{telephone:n.order.customer.telephone}});case 19:e.next=24;break;case 21:e.prev=21,e.t0=e.catch(0),this.utilService.openAlert({title:this.translate.instant("common.error"),body:'\n                        <p class="mb-4">'.concat(this.translate.instant("inquiry.confirm.alert.cancel"),'</p>\n                        <div class="p-3 bg-light-gray select-text error">\n                            <code>').concat(e.t0,"</code>\n                        </div>")});case 24:case"end":return e.stop()}}),e,this,[[0,21]])})))}})}},{key:"print",value:function(){return b(this,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r,i,o,a,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=m().format("YYYYMMDD"),n=m(t).add(this.environment.INQUIRY_PRINT_EXPIRED_VALUE,this.environment.INQUIRY_PRINT_EXPIRED_UNIT).format("YYYYMMDD"),void 0!==this.eventOrders.find((function(e){return m(e.event.startDate).format("YYYYMMDD")<n}))){e.next=23;break}return void 0!==this.timer&&clearTimeout(this.timer),e.prev=3,e.next=6,this.orderService.getData();case 6:return r=e.sent,e.next=9,this.userService.getData();case 9:if(i=e.sent,void 0!==r.order&&void 0!==i.pos&&void 0!==i.printer){e.next=12;break}return e.abrupt("return",void this.router.navigate(["/error"]));case 12:return o=[r.order],a=i.pos,s=i.printer,e.next=15,this.orderService.print({orders:o,pos:a,printer:s});case 15:this.router.navigate(["/inquiry/print"]),e.next=21;break;case 18:e.prev=18,e.t0=e.catch(3),console.error(e.t0),this.router.navigate(["/error"]);case 21:e.next=24;break;case 23:this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.confirm.alert.printExpired")});case 24:case"end":return e.stop()}}),e,this,[[3,18]])})))}}]),t}();g.ctorParameters=function(){return[{type:u.b},{type:c.c},{type:v.i},{type:v.d},{type:v.h},{type:d.c},{type:v.f}]},g=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-confirm",template:y(i("+X77")).default,styles:[y(i("2+OO")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[u.b,c.c,v.i,v.d,v.h,d.c,v.f])],g);var I=i("nIj0"),x=i("WxsR"),O=i("ddJ1"),R=function(e){return e&&e.__esModule?e:{default:e}},q=function(){function t(n,r,i,o,a,s){e(this,t),this.store=n,this.formBuilder=r,this.utilService=i,this.orderService=o,this.router=a,this.translate=s,this.environment=Object(f.a)(),this.SearchCountryField=O.c,this.TooltipLabel=O.d,this.CountryISO=O.a}return n(t,[{key:"ngOnInit",value:function(){var e=this;this.isLoading=this.store.pipe(Object(u.m)(h.b)),this.createInquiryForm(),setTimeout((function(){if(void 0!==e.intlTelInput){var t=e.intlTelInput.allCountries.find((function(e){return e.iso2===O.a.Japan}));void 0!==t&&(t.placeHolder=e.translate.instant("form.placeholder.telephone"))}}),0)}},{key:"createInquiryForm",value:function(){this.inquiryForm=this.formBuilder.group({confirmationNumber:["",[I.k.required,I.k.pattern(/^[0-9]+$/)]],telephone:["",this.environment.INQUIRY_INPUT_KEYPAD?[I.k.required,I.k.maxLength(15),I.k.minLength(9),function(e){var t=e.root.get("telephone");if(null!==t){if(""===t.value)return null;var n=new RegExp(/^\+/).test(t.value)?x.c(t.value):x.c(t.value,"JP");if(void 0===n.phone)return{telephone:!0};if(!x.b(n))return{telephone:!0}}return null}]:[I.k.required]]})}},{key:"onSubmit",value:function(){return e=this,t=void 0,n=void 0,r=regeneratorRuntime.mark((function e(){var t,n,r=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object.keys(this.inquiryForm.controls).forEach((function(e){r.inquiryForm.controls[e].markAsTouched()})),this.inquiryForm.controls.confirmationNumber.setValue(document.getElementById("confirmationNumber").value),this.environment.INQUIRY_INPUT_KEYPAD&&this.inquiryForm.controls.telephone.setValue(document.getElementById("telephone").value),!this.inquiryForm.invalid){e.next=2;break}return e.abrupt("return");case 2:return t=this.inquiryForm.controls.confirmationNumber.value,n=this.environment.INQUIRY_INPUT_KEYPAD?this.inquiryForm.controls.telephone.value:this.inquiryForm.controls.telephone.value.e164Number,e.prev=3,e.next=6,this.orderService.inquiry({confirmationNumber:t,customer:{telephone:n}});case 6:this.router.navigate(["/inquiry/confirm"]),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(3),console.error(e.t0),this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.input.validation")});case 12:case"end":return e.stop()}}),e,this,[[3,9]])})),new(n||(n=Promise))((function(i,o){function a(e){try{c(r.next(e))}catch(t){o(t)}}function s(e){try{c(r.throw(e))}catch(t){o(t)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}));var e,t,n,r}},{key:"changeConfirmationNumber",value:function(e){this.inquiryForm.controls.confirmationNumber.setValue(e)}},{key:"changeTelephone",value:function(e){this.inquiryForm.controls.telephone.setValue(e)}}]),t}();q.ctorParameters=function(){return[{type:u.b},{type:I.b},{type:v.i},{type:v.d},{type:c.c},{type:d.c}]},q.propDecorators={intlTelInput:[{type:a.lb,args:["intlTelInput"]}]},q=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-input",template:R(i("uWiq")).default,styles:[R(i("vcNb")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[u.b,I.b,v.i,v.d,c.c,d.c])],q);var w=function(e){return e&&e.__esModule?e:{default:e}},N=function(){function t(n){e(this,t),this.router=n,this.environment=Object(f.a)()}return n(t,[{key:"ngOnInit",value:function(){var e=this;if(""!==this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME){var t=Number(this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME);this.timer=setTimeout((function(){e.router.navigate(["/inquiry/input"])}),t)}}},{key:"ngOnDestroy",value:function(){void 0!==this.timer&&clearTimeout(this.timer)}}]),t}();N.ctorParameters=function(){return[{type:c.c}]},N=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-print",template:w(i("w++k")).default,styles:[w(i("LlIr")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[c.c])],N);var k=[{path:"",component:i("RRjC").a,children:[{path:"input",component:q},{path:"confirm",component:g},{path:"print",component:N}]}],S=function t(){e(this,t)};S=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.K)({imports:[c.d.forChild(k)],exports:[c.d]})],S);var T=function t(){e(this,t)};T=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.K)({declarations:[q,g,N],imports:[o.c,S,s.a]})],T)},LlIr:function(e,t,n){"use strict";n.r(t),t.default=""},uWiq:function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <form [formGroup]="inquiryForm">\n        <div class="mb-4">\n            <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.input.title\' | translate }}</h2>\n            <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.input.read\' | translate"></p>\n\n            <div class="inquiry-form mx-auto p-3 bg-white">\n\n                <div class="form-group">\n                    <label class="mb-2" for="">{{ \'common.confirmationNumber\' | translate }}</label>\n                    <app-numeric-keypad *ngIf="environment.INQUIRY_INPUT_KEYPAD" inputType="string"\n                        [inputValue]="inquiryForm.controls.confirmationNumber.value"\n                        (change)="changeConfirmationNumber($event)">\n                        <input type="text" class="form-control" formControlName="confirmationNumber"\n                            id="confirmationNumber" [placeholder]="\'form.placeholder.confirmationNumber\' | translate"\n                            readonly>\n                    </app-numeric-keypad>\n                    <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="text" class="form-control"\n                        formControlName="confirmationNumber" id="confirmationNumber"\n                        [placeholder]="\'form.placeholder.confirmationNumber\' | translate">\n                    <div *ngIf="inquiryForm.controls.confirmationNumber.invalid && inquiryForm.controls.confirmationNumber.touched"\n                        class="mt-2">\n                        <p *ngIf="inquiryForm.controls.confirmationNumber.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inquiryForm.controls.confirmationNumber.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                    </div>\n                </div>\n                <div class="form-group mb-0">\n                    <label class="mb-2" for="">{{ \'form.label.telephone\' | translate }}</label>\n                    <app-numeric-keypad *ngIf="environment.INQUIRY_INPUT_KEYPAD" inputType="telephone"\n                        [inputValue]="inquiryForm.controls.telephone.value" (change)="changeTelephone($event)">\n                        <input type="password" class="form-control" formControlName="telephone" id="telephone"\n                            [placeholder]="\'form.placeholder.telephone\' | translate" readonly>\n                    </app-numeric-keypad>\n                    <ngx-intl-tel-input *ngIf="!environment.INQUIRY_INPUT_KEYPAD"\n                        #intlTelInput\n                        [cssClass]="\'form-control text-security-disc\'"\n                        [preferredCountries]="[CountryISO.Japan]"\n                        [enableAutoCountrySelect]="false"\n                        [enablePlaceholder]="true"\n                        [searchCountryFlag]="true"\n                        [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"\n                        [selectFirstCountry]="false"\n                        [selectedCountryISO]="CountryISO.Japan"\n                        [maxLength]="15"\n                        [tooltipField]="TooltipLabel.Name"\n                        [phoneValidation]="true"\n                        [separateDialCode]="false"\n                        name="telephone"\n                        formControlName="telephone"\n                        type="password"></ngx-intl-tel-input>\n                    \x3c!-- <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="password" class="form-control"\n                        formControlName="telephone" id="telephone"\n                        [placeholder]="\'form.placeholder.telephone\' | translate"> --\x3e\n                    <div *ngIf="inquiryForm.controls.telephone.invalid && inquiryForm.controls.telephone.touched"\n                        class="mt-2">\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.minlength" class="text-danger">\n                            {{ \'form.validation.minlength\' | translate: { value: inquiryForm.controls.telephone.errors?.minlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.maxlength" class="text-danger">\n                            {{ \'form.validation.maxlength\' | translate: { value: inquiryForm.controls.telephone.errors?.maxlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.telephone" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}</p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.validatePhoneNumber" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}\n                        </p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n\n        <div class="buttons mx-auto text-center">\n            <button type="submit" [disabled]="isLoading | async" class="btn btn-primary btn-block py-3 mb-3"\n                (click)="onSubmit()">{{ \'inquiry.input.next\' | translate }}</button>\n            <a *ngIf="environment.PORTAL_SITE_URL" class="btn btn-link portal-link"\n                [href]="environment.PORTAL_SITE_URL">{{ \'inquiry.input.prev\' | translate }}</a>\n            <button *ngIf="!environment.PORTAL_SITE_URL" type="button" class="btn btn-link"\n                routerLink="/">{{ \'inquiry.input.prev\' | translate }}</button>\n        </div>\n    </form>\n</div>'},vcNb:function(e,t,n){"use strict";n.r(t),t.default=".inquiry-form {\n  max-width: 500px;\n}"},"w++k":function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <div class="mb-4">\n        <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.print.title\' | translate }}</h2>\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.print.read\' | translate"></p>\n    </div>\n\n    <div class="buttons mx-auto text-center">\n        <button type="button" class="btn btn-primary btn-block py-3" routerLink="/inquiry/input">\n            {{ \'inquiry.print.prev\' | translate }}\n        </button>\n    </div>\n</div>'}}])}();