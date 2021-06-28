!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"+X77":function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.confirm.title\' | translate }}</h2>\n    <div *ngIf="(order | async)?.order.orderStatus === orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.canceled\' | translate"></p>\n    </div>\n    <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.read\' | translate"></p>\n        <app-order-detail *ngIf="environment.INQUIRY_QRCODE && code" [order]="(order | async)?.order" [code]="code"></app-order-detail>\n        <app-order-detail *ngIf="!environment.INQUIRY_QRCODE" [order]="(order | async)?.order"></app-order-detail>\n    </div>\n\n\n    <div class="buttons mx-auto text-center">\n        <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n            <button *ngIf="environment.INQUIRY_PRINT"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-primary btn-block py-3 mb-3" (click)="print()"\n                [disabled]="isLoading | async">{{ \'inquiry.confirm.print\' | translate }}</button>\n            <button *ngIf="environment.INQUIRY_CANCEL"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-danger btn-block py-3 mb-3"\n                (click)="cancelConfirm()">{{ \'inquiry.confirm.cancel\' | translate }}</button>\n        </div>\n        <button type="button" class="btn btn-outline-primary btn-block py-3"\n            routerLink="/inquiry/input">{{ \'inquiry.confirm.prev\' | translate }}</button>\n    </div>\n</div>'},"2+OO":function(e,t,n){"use strict";n.r(t),t.default=""},"2ISw":function(t,r,o){"use strict";o.r(r),o.d(r,"InquiryModule",(function(){return _}));var i=o("2kYt"),a=o("EM62"),s=o("DSWM"),c=o("sEIs"),l=o("icHh"),u=o("sN6X"),p=o("s2Ay"),d=o("wgY5"),f=o("x8Mb"),m=o("PIN6"),h=o("cHUu"),v=o("mOXJ"),b=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{c(r.next(e))}catch(t){i(t)}}function s(e){try{c(r.throw(e))}catch(t){i(t)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}))},y=function(e){return e&&e.__esModule?e:{default:e}},g=function(){function t(n,r,o,i,a){e(this,t),this.store=n,this.router=r,this.utilService=o,this.actionService=i,this.translate=a,this.moment=d,this.orderStatus=l.factory.orderStatus,this.environment=Object(m.a)()}return n(t,[{key:"ngOnInit",value:function(){return b(this,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.isLoading=this.store.pipe(Object(u.m)(v.b)),this.error=this.store.pipe(Object(u.m)(v.a)),this.order=this.store.pipe(Object(u.m)(v.d)),this.user=this.store.pipe(Object(u.m)(v.g)),e.prev=1,e.next=4,this.actionService.order.getData();case 4:if(void 0!==(t=e.sent.order)){e.next=7;break}throw new Error("order undefined");case 7:if(e.t0=this.environment.INQUIRY_QRCODE,!e.t0){e.next=12;break}return e.next=11,this.actionService.order.authorizeOrder({order:t});case 11:this.code=e.sent;case 12:if(""===this.environment.INQUIRY_PRINT_WAIT_TIME){e.next=15;break}n=Number(this.environment.INQUIRY_PRINT_WAIT_TIME),this.timer=setTimeout((function(){r.router.navigate(["/inquiry/input"])}),n);case 15:e.next=20;break;case 17:e.prev=17,e.t1=e.catch(1),console.error(e.t1),this.router.navigate(["/error"]);case 20:case"end":return e.stop()}}),e,this,[[1,17]])})))}},{key:"ngOnDestroy",value:function(){void 0!==this.timer&&clearTimeout(this.timer)}},{key:"cancelConfirm",value:function(){var e=this;this.utilService.openConfirm({title:this.translate.instant("common.confirm"),body:this.translate.instant("inquiry.confirm.confirm.cancel"),cb:function(){return b(e,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.actionService.user.getData();case 3:return t=e.sent,e.next=6,this.actionService.order.getData();case 6:if(void 0!==(n=e.sent).order){e.next=9;break}throw new Error("order undefined");case 9:return r=[n.order],o=t.language,e.next=12,this.actionService.order.cancel({orders:r,language:o});case 12:return e.next=14,this.actionService.order.getData();case 14:if(void 0!==(n=e.sent).order){e.next=17;break}throw new Error("order undefined");case 17:return e.next=19,this.actionService.order.inquiry({confirmationNumber:n.order.confirmationNumber,customer:{telephone:n.order.customer.telephone}});case 19:e.next=24;break;case 21:e.prev=21,e.t0=e.catch(0),this.utilService.openAlert({title:this.translate.instant("common.error"),body:'\n                        <p class="mb-4">'.concat(this.translate.instant("inquiry.confirm.alert.cancel"),'</p>\n                        <div class="p-3 bg-light-gray select-text error">\n                            <code>').concat(e.t0,"</code>\n                        </div>")});case 24:case"end":return e.stop()}}),e,this,[[0,21]])})))}})}},{key:"print",value:function(){return b(this,void 0,void 0,regeneratorRuntime.mark((function e(){var t,n,r,o,i,a,s,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.actionService.order.getData();case 3:return t=e.sent,n=t.order,e.next=7,this.actionService.user.getData();case 7:if(r=e.sent,o=r.pos,i=r.printer,void 0!==n&&void 0!==o&&void 0!==i){e.next=12;break}throw new Error("order or pos or printer undefined");case 12:if(a=d().format("YYYYMMDD"),s=d(a).add(this.environment.INQUIRY_PRINT_EXPIRED_VALUE,this.environment.INQUIRY_PRINT_EXPIRED_UNIT).format("YYYYMMDD"),void 0===f.a.Purchase.order2EventOrders({order:n}).find((function(e){return d(e.event.startDate).format("YYYYMMDD")<s}))){e.next=15;break}return e.abrupt("return",void this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.confirm.alert.printExpired")}));case 15:return void 0!==this.timer&&clearTimeout(this.timer),c=[n],e.next=19,this.actionService.order.print({orders:c,pos:o,printer:i});case 19:this.router.navigate(["/inquiry/print"]),e.next=25;break;case 22:e.prev=22,e.t0=e.catch(0),console.error(e.t0),this.router.navigate(["/error"]);case 25:case"end":return e.stop()}}),e,this,[[0,22]])})))}}]),t}();g.ctorParameters=function(){return[{type:u.b},{type:c.c},{type:h.f},{type:h.a},{type:p.c}]},g=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-confirm",template:y(o("+X77")).default,styles:[y(o("2+OO")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[u.b,c.c,h.f,h.a,p.c])],g);var I=o("nIj0"),x=o("WxsR"),R=o("ddJ1"),N=function(e){return e&&e.__esModule?e:{default:e}},k=function(){function t(n,r,o,i,a,s,c){e(this,t),this.store=n,this.formBuilder=r,this.utilService=o,this.actionService=i,this.activatedRoute=a,this.router=s,this.translate=c,this.environment=Object(m.a)(),this.SearchCountryField=R.c,this.TooltipLabel=R.d,this.CountryISO=R.a}return n(t,[{key:"ngOnInit",value:function(){var e=this;this.isLoading=this.store.pipe(Object(u.m)(v.b)),this.isPasswordMask=!0,this.createInputForm(),setTimeout((function(){if(void 0!==e.intlTelInput){var t=e.intlTelInput.allCountries.find((function(e){return e.iso2===R.a.Japan}));void 0!==t&&(t.placeHolder=e.translate.instant("form.placeholder.telephone"))}}),0)}},{key:"createInputForm",value:function(){this.inputForm=this.formBuilder.group({confirmationNumber:["",[I.k.required,I.k.pattern(/^[0-9]+$/)]],telephone:["",this.environment.INQUIRY_INPUT_KEYPAD?[I.k.required,I.k.maxLength(15),I.k.minLength(9),function(e){var t=e.root.get("telephone");if(null!==t){if(""===t.value)return null;var n=new RegExp(/^\+/).test(t.value)?x.c(t.value):x.c(t.value,"JP");if(void 0===n.phone)return{telephone:!0};if(!x.b(n))return{telephone:!0}}return null}]:[I.k.required]]});var e=this.activatedRoute.snapshot.params.confirmationNumber;void 0!==e&&this.inputForm.controls.confirmationNumber.setValue(e)}},{key:"onSubmit",value:function(){return e=this,t=void 0,n=void 0,r=regeneratorRuntime.mark((function e(){var t,n,r=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object.keys(this.inputForm.controls).forEach((function(e){r.inputForm.controls[e].markAsTouched()})),this.inputForm.controls.confirmationNumber.setValue(document.getElementById("confirmationNumber").value),this.environment.INQUIRY_INPUT_KEYPAD&&this.inputForm.controls.telephone.setValue(document.getElementById("telephone").value),!this.inputForm.invalid){e.next=2;break}return e.abrupt("return");case 2:return t=this.inputForm.controls.confirmationNumber.value,n=this.environment.INQUIRY_INPUT_KEYPAD?this.inputForm.controls.telephone.value:this.inputForm.controls.telephone.value.e164Number,e.prev=3,e.next=6,this.actionService.order.inquiry({confirmationNumber:t,customer:{telephone:n}});case 6:this.router.navigate(["/inquiry/confirm"]),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(3),console.error(e.t0),this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.input.validation")});case 12:case"end":return e.stop()}}),e,this,[[3,9]])})),new(n||(n=Promise))((function(o,i){function a(e){try{c(r.next(e))}catch(t){i(t)}}function s(e){try{c(r.throw(e))}catch(t){i(t)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}));var e,t,n,r}},{key:"changeConfirmationNumber",value:function(e){this.inputForm.controls.confirmationNumber.setValue(e)}},{key:"changeTelephone",value:function(e){this.inputForm.controls.telephone.setValue(e)}},{key:"changePassWordMask",value:function(){this.isPasswordMask=!this.isPasswordMask,void 0!==this.intlTelInput&&(this.intlTelInput.cssClass=this.isPasswordMask?"form-control text-security-disc":"form-control")}}]),t}();k.ctorParameters=function(){return[{type:u.b},{type:I.b},{type:h.f},{type:h.a},{type:c.a},{type:c.c},{type:p.c}]},k.propDecorators={intlTelInput:[{type:a.lb,args:["intlTelInput"]}]},k=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-input",template:N(o("uWiq")).default,styles:[N(o("vcNb")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[u.b,I.b,h.f,h.a,c.a,c.c,p.c])],k);var w=function(e){return e&&e.__esModule?e:{default:e}},P=function(){function t(n){e(this,t),this.router=n,this.environment=Object(m.a)()}return n(t,[{key:"ngOnInit",value:function(){var e=this;if(""!==this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME){var t=Number(this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME);this.timer=setTimeout((function(){e.router.navigate(["/inquiry/input"])}),t)}}},{key:"ngOnDestroy",value:function(){void 0!==this.timer&&clearTimeout(this.timer)}}]),t}();P.ctorParameters=function(){return[{type:c.c}]},P=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.n)({selector:"app-inquiry-print",template:w(o("w++k")).default,styles:[w(o("LlIr")).default]}),function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}("design:paramtypes",[c.c])],P);var O=[{path:"",component:o("RRjC").a,children:[{path:"input",component:k},{path:"input/:confirmationNumber",component:k},{path:"confirm",component:g},{path:"print",component:P}]}],T=function t(){e(this,t)};T=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.K)({imports:[c.d.forChild(O)],exports:[c.d]})],T);var _=function t(){e(this,t)};_=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}([Object(a.K)({declarations:[k,g,P],imports:[i.c,T,s.a]})],_)},LlIr:function(e,t,n){"use strict";n.r(t),t.default=""},uWiq:function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <form [formGroup]="inputForm">\n        <div class="mb-4">\n            <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.input.title\' | translate }}</h2>\n            <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.input.read\' | translate"></p>\n\n            <div class="inquiry-form mx-auto p-3 bg-white">\n\n                <div class="form-group">\n                    <label class="mb-2" for="">{{ \'common.confirmationNumber\' | translate }}</label>\n                    <app-numeric-keypad *ngIf="environment.INQUIRY_INPUT_KEYPAD" inputType="string"\n                        [inputValue]="inputForm.controls.confirmationNumber.value"\n                        (change)="changeConfirmationNumber($event)">\n                        <input type="text" class="form-control" formControlName="confirmationNumber"\n                            id="confirmationNumber" [placeholder]="\'form.placeholder.confirmationNumber\' | translate"\n                            readonly>\n                    </app-numeric-keypad>\n                    <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="text" class="form-control"\n                        formControlName="confirmationNumber" id="confirmationNumber"\n                        [placeholder]="\'form.placeholder.confirmationNumber\' | translate">\n                    <div *ngIf="inputForm.controls.confirmationNumber.invalid && inputForm.controls.confirmationNumber.touched"\n                        class="mt-2">\n                        <p *ngIf="inputForm.controls.confirmationNumber.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.confirmationNumber.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                    </div>\n                </div>\n                <div class="form-group mb-0">\n                    <label class="mb-2" for="">{{ \'form.label.telephone\' | translate }}</label>\n                    <div class="position-relative" *ngIf="environment.INQUIRY_INPUT_KEYPAD">\n                        <app-numeric-keypad inputType="telephone" [inputValue]="inputForm.controls.telephone.value"\n                            (change)="changeTelephone($event)">\n                            <input [type]="(isPasswordMask) ? \'password\' : \'text\'" class="form-control"\n                                formControlName="telephone" id="telephone"\n                                [placeholder]="\'form.placeholder.telephone\' | translate" readonly>\n                        </app-numeric-keypad>\n                        <button type="button" class="btn position-absolute" style="top: 0; right: 0;"\n                            (click)="changePassWordMask()">\n                            <i *ngIf="isPasswordMask" class="bi bi-eye-fill"></i>\n                            <i *ngIf="!isPasswordMask" class="bi bi-eye-slash-fill"></i>\n                        </button>\n                    </div>\n                    <div class="position-relative" *ngIf="!environment.INQUIRY_INPUT_KEYPAD">\n                        <ngx-intl-tel-input #intlTelInput [cssClass]="\'form-control text-security-disc\'"\n                            [preferredCountries]="[CountryISO.Japan]" [enableAutoCountrySelect]="false"\n                            [enablePlaceholder]="true" [searchCountryFlag]="true"\n                            [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"\n                            [selectFirstCountry]="false" [selectedCountryISO]="CountryISO.Japan" [maxLength]="15"\n                            [tooltipField]="TooltipLabel.Name" [phoneValidation]="true" [separateDialCode]="false"\n                            name="telephone" formControlName="telephone" type="password"></ngx-intl-tel-input>\n                        <button type="button" class="btn position-absolute" style="top: 0; right: 0;"\n                            (click)="changePassWordMask()">\n                            <i *ngIf="isPasswordMask" class="bi bi-eye-fill"></i>\n                            <i *ngIf="!isPasswordMask" class="bi bi-eye-slash-fill"></i>\n                        </button>\n                    </div>\n\n                    \x3c!-- <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="password" class="form-control"\n                        formControlName="telephone" id="telephone"\n                        [placeholder]="\'form.placeholder.telephone\' | translate"> --\x3e\n                    <div *ngIf="inputForm.controls.telephone.invalid && inputForm.controls.telephone.touched"\n                        class="mt-2">\n                        <p *ngIf="inputForm.controls.telephone.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.minlength" class="text-danger">\n                            {{ \'form.validation.minlength\' | translate: { value:\n                            inputForm.controls.telephone.errors?.minlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.maxlength" class="text-danger">\n                            {{ \'form.validation.maxlength\' | translate: { value:\n                            inputForm.controls.telephone.errors?.maxlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.telephone" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.validatePhoneNumber" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}\n                        </p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n\n        <div class="buttons mx-auto text-center">\n            <button type="submit" [disabled]="isLoading | async" class="btn btn-primary btn-block py-3 mb-3"\n                (click)="onSubmit()">{{ \'inquiry.input.next\' | translate }}</button>\n            <a *ngIf="environment.PORTAL_SITE_URL" class="btn btn-outline-primary btn-block py-3 portal-link"\n                [href]="environment.PORTAL_SITE_URL">{{ \'inquiry.input.prev\' | translate }}</a>\n            <button *ngIf="!environment.PORTAL_SITE_URL" type="button" class="btn btn-outline-primary btn-block py-3"\n                routerLink="/">{{ \'inquiry.input.prev\' | translate }}</button>\n        </div>\n    </form>\n</div>'},vcNb:function(e,t,n){"use strict";n.r(t),t.default=".inquiry-form {\n  max-width: 500px;\n}"},"w++k":function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <div class="mb-4">\n        <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.print.title\' | translate }}</h2>\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.print.read\' | translate"></p>\n    </div>\n\n    <div class="buttons mx-auto text-center">\n        <button type="button" class="btn btn-primary btn-block py-3" routerLink="/inquiry/input">\n            {{ \'inquiry.print.prev\' | translate }}\n        </button>\n    </div>\n</div>'}}])}();