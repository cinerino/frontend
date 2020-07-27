(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"+X77":function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.confirm.title\' | translate }}</h2>\n    <div *ngIf="(order | async)?.order.orderStatus === orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.canceled\' | translate"></p>\n    </div>\n    <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.read\' | translate"></p>\n        <div class="mb-4 px-3 py-2 bg-white">\n            <div class="row align-items-center">\n                <p class="col-4">\n                    {{ \'common.confirmationNumber\' | translate }}</p>\n                <p class="col-8 text-large text-info font-weight-bold">\n                    {{ (order | async)?.order.confirmationNumber }}\n                </p>\n            </div>\n        </div>\n        <div *ngFor="let eventOrder of eventOrders" class="mb-4 bg-white p-3">\n            <div class="mb-3">\n                <div class="mb-1">\n                    <p class="font-weight-bold text-large">{{ eventOrder.event.name | changeLanguage }}</p>\n                    <p class="text-small"\n                        *ngIf="eventOrder.event.superEvent.headline && (eventOrder.event.superEvent.headline | changeLanguage)">\n                        {{ eventOrder.event.superEvent.headline | changeLanguage }}</p>\n                    <p class="text-small"\n                        *ngIf="eventOrder.event.superEvent.description && (eventOrder.event.superEvent.description | changeLanguage)">{{\n                        eventOrder.event.superEvent.description | changeLanguage }}</p>\n                </div>\n                <p class="mb-1">\n                    {{ eventOrder.event.startDate | formatDate: \'MM/DD(ddd) HH:mm\' }}-{{ eventOrder.event.endDate | formatDate: \'HH:mm\' }}\n                </p>\n                <p class="text-small mb-1">\n                    <span class="theater-name">{{ eventOrder.event.superEvent.location.name | changeLanguage }}</span>\n                    <span class="screen-name">&nbsp;/&nbsp;<span *ngIf="eventOrder.event.location.address | changeLanguage" class="mr-2">{{ eventOrder.event.location.address | changeLanguage }}</span>{{ eventOrder.event.location.name | changeLanguage }}</span>\n                    <span\n                        *ngIf="eventOrder.event.workPerformed?.duration && moment.duration(eventOrder.event.workPerformed?.duration).asMinutes() > 0">\n                        &nbsp;/&nbsp;<span\n                            class="mr-1">{{ \'common.duration\' | translate }}</span>{{ moment.duration(eventOrder.event.workPerformed?.duration).asMinutes() }}{{ \'common.date.minute\' | translate }}\n                    </span>\n                </p>\n            </div>\n            <hr class="mb-3">\n            <app-item-list [acceptedOffers]="eventOrder.data" [qrcode]="environment.INQUIRY_QRCODE"></app-item-list>\n        </div>\n\n\n        <div class="mb-4 px-3 bg-white">\n            <div class="py-3 border-bottom border-gray customer-name">\n                <div class="row align-items-center">\n                    <p class="mb-2 mb-md-0 col-md-4">{{ \'common.customerName\' | translate }}</p>\n                    <p class="col-md-8">{{ (order | async)?.order.customer.familyName }}\n                        {{ (order | async)?.order.customer.givenName }}</p>\n                </div>\n            </div>\n            <div class="py-3 border-bottom border-gray email">\n                <div class="row align-items-center">\n                    <p class="mb-2 mb-md-0 col-md-4">{{ \'form.label.email\' | translate }}</p>\n                    <p class="col-md-8">{{ (order | async)?.order.customer.email }}</p>\n                </div>\n            </div>\n            <div class="py-3 telephone">\n                <div class="row align-items-center">\n                    <p class="mb-2 mb-md-0 col-md-4">{{ \'form.label.telephone\' | translate }}</p>\n                    <p class="col-md-8">{{ (order | async)?.order.customer.telephone | libphonenumberFormat }}</p>\n                </div>\n            </div>\n            \x3c!-- <div class="py-3" *ngIf="(order | async)?.order.price > 0">\n                <div class="row align-items-center">\n                    <p class="mb-2 mb-md-0 col-md-4">{{ \'common.paymentMethod\' | translate }}</p>\n                    <p class="col-md-8">\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9</p>\n                </div>\n            </div> --\x3e\n        </div>\n    </div>\n\n\n    <div class="buttons mx-auto text-center">\n        <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n            <button *ngIf="environment.INQUIRY_PRINT"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-primary btn-block py-3 mb-3" (click)="print()"\n                [disabled]="isLoading | async">{{ \'inquiry.confirm.print\' | translate }}</button>\n            <button *ngIf="environment.INQUIRY_CANCEL"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-danger btn-block py-3 mb-3"\n                (click)="cancelConfirm()">{{ \'inquiry.confirm.cancel\' | translate }}</button>\n        </div>\n        <button type="button" class="btn btn-link"\n            routerLink="/inquiry/input">{{ \'inquiry.confirm.prev\' | translate }}</button>\n    </div>\n</div>'},"2+OO":function(e,t,n){"use strict";n.r(t),t.default=""},"2ISw":function(e,t,n){"use strict";n.r(t),n.d(t,"InquiryModule",(function(){return C}));var r=n("2kYt"),i=n("EM62"),o=n("DSWM"),a=n("sEIs"),s=n("icHh"),l=n("sN6X"),c=n("s2Ay"),d=n("wgY5"),u=n("x8Mb"),m=n("PIN6"),p=n("cHUu"),f=n("mOXJ"),h=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a},v=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},y=function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(t){o(t)}}function s(e){try{l(r.throw(e))}catch(t){o(t)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}l((r=r.apply(e,t||[])).next())}))},b=function(e){return e&&e.__esModule?e:{default:e}};let g=class{constructor(e,t,n,r,i,o,a){this.store=e,this.router=t,this.utilService=n,this.orderService=r,this.userService=i,this.translate=o,this.qrcodeService=a,this.moment=d,this.orderStatus=s.factory.orderStatus,this.environment=Object(m.a)()}ngOnInit(){return y(this,void 0,void 0,(function*(){this.eventOrders=[],this.isLoading=this.store.pipe(Object(l.m)(f.b)),this.error=this.store.pipe(Object(l.m)(f.a)),this.order=this.store.pipe(Object(l.m)(f.d)),this.user=this.store.pipe(Object(l.m)(f.g));try{let e=(yield this.orderService.getData()).order;if(void 0===e)throw new Error("order undefined");this.eventOrders=u.a.Purchase.order2EventOrders({order:e});const t=this.eventOrders.find(e=>u.a.Order.isShowQRCode(e.event));if(this.environment.INQUIRY_QRCODE&&void 0!==t){if(yield this.orderService.authorize(e),e=(yield this.orderService.getData()).order,void 0===e)throw new Error("order undefined");this.eventOrders=u.a.Purchase.order2EventOrders({order:e})}if(""!==this.environment.INQUIRY_PRINT_WAIT_TIME){const e=Number(this.environment.INQUIRY_PRINT_WAIT_TIME);this.timer=setTimeout(()=>{this.router.navigate(["/inquiry/input"])},e)}}catch(e){console.error(e),this.router.navigate(["/error"])}}))}ngOnDestroy(){void 0!==this.timer&&clearTimeout(this.timer)}openQRCodeViewer(e){return y(this,void 0,void 0,(function*(){try{let t=(yield this.orderService.getData()).order;if(void 0===t)throw new Error("order undefined");yield this.orderService.authorize(t),t=(yield this.orderService.getData()).order;const n=t;if(void 0===n)throw new Error("authorizeOrder undefined");const r=n.acceptedOffers.find(t=>t.itemOffered.typeOf===s.factory.chevre.reservationType.EventReservation&&t.itemOffered.id===e.id);if(void 0===r)throw new Error("itemOffered notfound");if(r.itemOffered.typeOf!==s.factory.chevre.reservationType.EventReservation)throw new Error("itemOffered typeOf missmatch");const i=r.itemOffered;this.qrcodeService.openQRCodeViewer({title:this.translate.instant("inquiry.confirm.qrcode.title"),code:i.reservedTicket.ticketToken})}catch(t){console.error(t),this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.confirm.alert.authorize")})}}))}cancelConfirm(){this.utilService.openConfirm({title:this.translate.instant("common.confirm"),body:this.translate.instant("inquiry.confirm.confirm.cancel"),cb:()=>y(this,void 0,void 0,(function*(){try{const e=yield this.userService.getData();let t=yield this.orderService.getData();if(void 0===t.order)throw new Error("order undefined");const n=[t.order],r=e.language;if(yield this.orderService.cancel({orders:n,language:r}),t=yield this.orderService.getData(),void 0===t.order)throw new Error("order undefined");yield this.orderService.inquiry({confirmationNumber:t.order.confirmationNumber,customer:{telephone:t.order.customer.telephone}})}catch(e){this.utilService.openAlert({title:this.translate.instant("common.error"),body:`\n                        <p class="mb-4">${this.translate.instant("inquiry.confirm.alert.cancel")}</p>\n                        <div class="p-3 bg-light-gray select-text error">\n                            <code>${e}</code>\n                        </div>`})}}))})}print(){return y(this,void 0,void 0,(function*(){const e=d().format("YYYYMMDD"),t=d(e).add(this.environment.INQUIRY_PRINT_EXPIRED_VALUE,this.environment.INQUIRY_PRINT_EXPIRED_UNIT).format("YYYYMMDD");if(void 0===this.eventOrders.find(e=>d(e.event.startDate).format("YYYYMMDD")<t)){void 0!==this.timer&&clearTimeout(this.timer);try{const e=yield this.orderService.getData(),t=yield this.userService.getData();if(void 0===e.order||void 0===t.pos||void 0===t.printer)return void this.router.navigate(["/error"]);const n=[e.order],r=t.pos,i=t.printer;yield this.orderService.print({orders:n,pos:r,printer:i}),this.router.navigate(["/inquiry/print"])}catch(n){console.error(n),this.router.navigate(["/error"])}}else this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.confirm.alert.printExpired")})}))}};g.ctorParameters=()=>[{type:l.b},{type:a.c},{type:p.i},{type:p.d},{type:p.h},{type:c.c},{type:p.f}],g=h([Object(i.n)({selector:"app-inquiry-confirm",template:b(n("+X77")).default,styles:[b(n("2+OO")).default]}),v("design:paramtypes",[l.b,a.c,p.i,p.d,p.h,c.c,p.f])],g);var I=n("nIj0"),O=n("WxsR"),q=n("ddJ1"),N=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a},R=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},x=function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{l(r.next(e))}catch(t){o(t)}}function s(e){try{l(r.throw(e))}catch(t){o(t)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}l((r=r.apply(e,t||[])).next())}))},w=function(e){return e&&e.__esModule?e:{default:e}};let S=class{constructor(e,t,n,r,i,o){this.store=e,this.formBuilder=t,this.utilService=n,this.orderService=r,this.router=i,this.translate=o,this.environment=Object(m.a)(),this.SearchCountryField=q.d,this.TooltipLabel=q.e,this.CountryISO=q.a}ngOnInit(){this.isLoading=this.store.pipe(Object(l.m)(f.b)),this.createInquiryForm(),setTimeout(()=>{if(void 0===this.intlTelInput)return;const e=this.intlTelInput.allCountries.find(e=>e.iso2===q.a.Japan);void 0!==e&&(e.placeHolder=this.translate.instant("form.placeholder.telephone"))},0)}createInquiryForm(){this.inquiryForm=this.formBuilder.group({confirmationNumber:["",[I.j.required,I.j.pattern(/^[0-9]+$/)]],telephone:["",this.environment.INQUIRY_INPUT_KEYPAD?[I.j.required,I.j.maxLength(15),I.j.minLength(9),e=>{const t=e.root.get("telephone");if(null!==t){if(""===t.value)return null;const e=new RegExp(/^\+/).test(t.value)?O.c(t.value):O.c(t.value,"JP");if(void 0===e.phone)return{telephone:!0};if(!O.b(e))return{telephone:!0}}return null}]:[I.j.required]]})}onSubmit(){return x(this,void 0,void 0,(function*(){if(Object.keys(this.inquiryForm.controls).forEach(e=>{this.inquiryForm.controls[e].markAsTouched()}),this.inquiryForm.controls.confirmationNumber.setValue(document.getElementById("confirmationNumber").value),this.environment.INQUIRY_INPUT_KEYPAD&&this.inquiryForm.controls.telephone.setValue(document.getElementById("telephone").value),this.inquiryForm.invalid)return;const e=this.inquiryForm.controls.confirmationNumber.value,t=this.environment.INQUIRY_INPUT_KEYPAD?this.inquiryForm.controls.telephone.value:this.inquiryForm.controls.telephone.value.e164Number;try{yield this.orderService.inquiry({confirmationNumber:e,customer:{telephone:t}}),this.router.navigate(["/inquiry/confirm"])}catch(n){console.error(n),this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.input.validation")})}}))}changeConfirmationNumber(e){this.inquiryForm.controls.confirmationNumber.setValue(e)}changeTelephone(e){this.inquiryForm.controls.telephone.setValue(e)}};S.ctorParameters=()=>[{type:l.b},{type:I.b},{type:p.i},{type:p.d},{type:a.c},{type:c.c}],N([Object(i.kb)("intlTelInput"),R("design:type",q.b)],S.prototype,"intlTelInput",void 0),S=N([Object(i.n)({selector:"app-inquiry-input",template:w(n("uWiq")).default,styles:[w(n("vcNb")).default]}),R("design:paramtypes",[l.b,I.b,p.i,p.d,a.c,c.c])],S);var T=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a},P=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},_=function(e){return e&&e.__esModule?e:{default:e}};let E=class{constructor(e){this.router=e,this.environment=Object(m.a)()}ngOnInit(){if(""===this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME)return;const e=Number(this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME);this.timer=setTimeout(()=>{this.router.navigate(["/inquiry/input"])},e)}ngOnDestroy(){void 0!==this.timer&&clearTimeout(this.timer)}};E.ctorParameters=()=>[{type:a.c}],E=T([Object(i.n)({selector:"app-inquiry-print",template:_(n("w++k")).default,styles:[_(n("LlIr")).default]}),P("design:paramtypes",[a.c])],E);var D=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a};const j=[{path:"",component:n("RRjC").a,children:[{path:"input",component:S},{path:"confirm",component:g},{path:"print",component:E}]}];let Y=class{};Y=D([Object(i.K)({imports:[a.d.forChild(j)],exports:[a.d]})],Y);var F=function(e,t,n,r){var i,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,n,a):i(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a};let C=class{};C=F([Object(i.K)({declarations:[S,g,E],imports:[r.c,Y,o.a]})],C)},LlIr:function(e,t,n){"use strict";n.r(t),t.default=""},uWiq:function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <form [formGroup]="inquiryForm">\n        <div class="mb-4">\n            <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.input.title\' | translate }}</h2>\n            <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.input.read\' | translate"></p>\n\n            <div class="inquiry-form mx-auto p-3 bg-white">\n\n                <div class="form-group">\n                    <label class="mb-2" for="">{{ \'common.confirmationNumber\' | translate }}</label>\n                    <app-numeric-keypad *ngIf="environment.INQUIRY_INPUT_KEYPAD" inputType="string"\n                        [inputValue]="inquiryForm.controls.confirmationNumber.value"\n                        (change)="changeConfirmationNumber($event)">\n                        <input type="text" class="form-control" formControlName="confirmationNumber"\n                            id="confirmationNumber" [placeholder]="\'form.placeholder.confirmationNumber\' | translate"\n                            readonly>\n                    </app-numeric-keypad>\n                    <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="text" class="form-control"\n                        formControlName="confirmationNumber" id="confirmationNumber"\n                        [placeholder]="\'form.placeholder.confirmationNumber\' | translate">\n                    <div *ngIf="inquiryForm.controls.confirmationNumber.invalid && inquiryForm.controls.confirmationNumber.touched"\n                        class="mt-2">\n                        <p *ngIf="inquiryForm.controls.confirmationNumber.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inquiryForm.controls.confirmationNumber.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                    </div>\n                </div>\n                <div class="form-group mb-0">\n                    <label class="mb-2" for="">{{ \'form.label.telephone\' | translate }}</label>\n                    <app-numeric-keypad *ngIf="environment.INQUIRY_INPUT_KEYPAD" inputType="telephone"\n                        [inputValue]="inquiryForm.controls.telephone.value" (change)="changeTelephone($event)">\n                        <input type="password" class="form-control" formControlName="telephone" id="telephone"\n                            [placeholder]="\'form.placeholder.telephone\' | translate" readonly>\n                    </app-numeric-keypad>\n                    <ngx-intl-tel-input *ngIf="!environment.INQUIRY_INPUT_KEYPAD"\n                        #intlTelInput\n                        [cssClass]="\'form-control text-security-disc\'"\n                        [preferredCountries]="[CountryISO.Japan]"\n                        [enableAutoCountrySelect]="false"\n                        [enablePlaceholder]="true"\n                        [searchCountryFlag]="true"\n                        [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"\n                        [selectFirstCountry]="false"\n                        [selectedCountryISO]="CountryISO.Japan"\n                        [maxLength]="15"\n                        [tooltipField]="TooltipLabel.Name"\n                        [phoneValidation]="true"\n                        [separateDialCode]="false"\n                        name="telephone"\n                        formControlName="telephone"\n                        type="password"></ngx-intl-tel-input>\n                    \x3c!-- <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="password" class="form-control"\n                        formControlName="telephone" id="telephone"\n                        [placeholder]="\'form.placeholder.telephone\' | translate"> --\x3e\n                    <div *ngIf="inquiryForm.controls.telephone.invalid && inquiryForm.controls.telephone.touched"\n                        class="mt-2">\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.minlength" class="text-danger">\n                            {{ \'form.validation.minlength\' | translate: { value: inquiryForm.controls.telephone.errors?.minlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.maxlength" class="text-danger">\n                            {{ \'form.validation.maxlength\' | translate: { value: inquiryForm.controls.telephone.errors?.maxlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.telephone" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}</p>\n                        <p *ngIf="inquiryForm.controls.telephone.errors?.validatePhoneNumber" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}\n                        </p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n\n        <div class="buttons mx-auto text-center">\n            <button type="submit" [disabled]="isLoading | async" class="btn btn-primary btn-block py-3 mb-3"\n                (click)="onSubmit()">{{ \'inquiry.input.next\' | translate }}</button>\n            <a *ngIf="environment.PORTAL_SITE_URL" class="btn btn-link portal-link"\n                [href]="environment.PORTAL_SITE_URL">{{ \'inquiry.input.prev\' | translate }}</a>\n            <button *ngIf="!environment.PORTAL_SITE_URL" type="button" class="btn btn-link"\n                routerLink="/">{{ \'inquiry.input.prev\' | translate }}</button>\n        </div>\n    </form>\n</div>'},vcNb:function(e,t,n){"use strict";n.r(t),t.default=".inquiry-form {\n  max-width: 500px;\n}"},"w++k":function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <div class="mb-4">\n        <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.print.title\' | translate }}</h2>\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.print.read\' | translate"></p>\n    </div>\n\n    <div class="buttons mx-auto text-center">\n        <button type="button" class="btn btn-primary btn-block py-3" routerLink="/inquiry/input">\n            {{ \'inquiry.print.prev\' | translate }}\n        </button>\n    </div>\n</div>'}}]);