(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"+X77":function(t,e,n){"use strict";n.r(e),e.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.confirm.title\' | translate }}</h2>\n    <div *ngIf="(order | async)?.order.orderStatus === orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.canceled\' | translate"></p>\n    </div>\n    <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.confirm.read\' | translate"></p>\n        <app-order-detail *ngIf="environment.INQUIRY_QRCODE && code" [order]="(order | async)?.order" [code]="code"></app-order-detail>\n        <app-order-detail *ngIf="!environment.INQUIRY_QRCODE" [order]="(order | async)?.order"></app-order-detail>\n    </div>\n\n\n    <div class="buttons mx-auto text-center">\n        <div *ngIf="(order | async)?.order.orderStatus !== orderStatus.OrderReturned">\n            <button *ngIf="environment.INQUIRY_PRINT"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-primary btn-block py-3 mb-3" (click)="print()"\n                [disabled]="isLoading | async">{{ \'inquiry.confirm.print\' | translate }}</button>\n            <button *ngIf="environment.INQUIRY_CANCEL"\n                [disabled]="(order | async)?.order.orderStatus !== orderStatus.OrderDelivered" type="button"\n                class="btn btn-danger btn-block py-3 mb-3"\n                (click)="cancelConfirm()">{{ \'inquiry.confirm.cancel\' | translate }}</button>\n        </div>\n        <button type="button" class="btn btn-outline-primary btn-block py-3"\n            routerLink="/inquiry/input">{{ \'inquiry.confirm.prev\' | translate }}</button>\n    </div>\n</div>'},"2+OO":function(t,e,n){"use strict";n.r(e),e.default=""},"2ISw":function(t,e,n){"use strict";n.r(e),n.d(e,"InquiryModule",(function(){return C}));var r=n("2kYt"),o=n("EM62"),i=n("DSWM"),a=n("sEIs"),s=n("icHh"),l=n("sN6X"),c=n("s2Ay"),u=n("wgY5"),d=n("x8Mb"),p=n("PIN6"),m=n("cHUu"),f=n("mOXJ"),h=function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},b=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},y=function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{l(r.next(t))}catch(e){i(e)}}function s(t){try{l(r.throw(t))}catch(e){i(e)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,s)}l((r=r.apply(t,e||[])).next())}))},v=function(t){return t&&t.__esModule?t:{default:t}};let g=class{constructor(t,e,n,r,o){this.store=t,this.router=e,this.utilService=n,this.actionService=r,this.translate=o,this.moment=u,this.orderStatus=s.factory.orderStatus,this.environment=Object(p.a)()}ngOnInit(){return y(this,void 0,void 0,(function*(){this.isLoading=this.store.pipe(Object(l.m)(f.b)),this.error=this.store.pipe(Object(l.m)(f.a)),this.order=this.store.pipe(Object(l.m)(f.d)),this.user=this.store.pipe(Object(l.m)(f.g));try{const t=(yield this.actionService.order.getData()).order;if(void 0===t)throw new Error("order undefined");if(this.environment.INQUIRY_QRCODE&&(this.code=yield this.actionService.order.authorizeOrder({order:t})),""!==this.environment.INQUIRY_PRINT_WAIT_TIME){const t=Number(this.environment.INQUIRY_PRINT_WAIT_TIME);this.timer=setTimeout(()=>{this.router.navigate(["/inquiry/input"])},t)}}catch(t){console.error(t),this.router.navigate(["/error"])}}))}ngOnDestroy(){void 0!==this.timer&&clearTimeout(this.timer)}cancelConfirm(){this.utilService.openConfirm({title:this.translate.instant("common.confirm"),body:this.translate.instant("inquiry.confirm.confirm.cancel"),cb:()=>y(this,void 0,void 0,(function*(){try{const t=yield this.actionService.user.getData();let e=yield this.actionService.order.getData();if(void 0===e.order)throw new Error("order undefined");const n=[e.order],r=t.language;if(yield this.actionService.order.cancel({orders:n,language:r}),e=yield this.actionService.order.getData(),void 0===e.order)throw new Error("order undefined");yield this.actionService.order.inquiry({confirmationNumber:e.order.confirmationNumber,customer:{telephone:e.order.customer.telephone}})}catch(t){this.utilService.openAlert({title:this.translate.instant("common.error"),body:`\n                        <p class="mb-4">${this.translate.instant("inquiry.confirm.alert.cancel")}</p>\n                        <div class="p-3 bg-light-gray select-text error">\n                            <code>${t}</code>\n                        </div>`})}}))})}print(){return y(this,void 0,void 0,(function*(){try{const{order:t}=yield this.actionService.order.getData(),{pos:e,printer:n}=yield this.actionService.user.getData();if(void 0===t||void 0===e||void 0===n)throw new Error("order or pos or printer undefined");const r=u().format("YYYYMMDD"),o=u(r).add(this.environment.INQUIRY_PRINT_EXPIRED_VALUE,this.environment.INQUIRY_PRINT_EXPIRED_UNIT).format("YYYYMMDD"),i=d.a.Purchase.order2EventOrders({order:t});if(void 0!==i.find(t=>u(t.event.startDate).format("YYYYMMDD")<o))return void this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.confirm.alert.printExpired")});void 0!==this.timer&&clearTimeout(this.timer);const a=[t];yield this.actionService.order.print({orders:a,pos:e,printer:n}),this.router.navigate(["/inquiry/print"])}catch(t){console.error(t),this.router.navigate(["/error"])}}))}};g.ctorParameters=()=>[{type:l.b},{type:a.c},{type:m.g},{type:m.a},{type:c.c}],g=h([Object(o.n)({selector:"app-inquiry-confirm",template:v(n("+X77")).default,styles:[v(n("2+OO")).default]}),b("design:paramtypes",[l.b,a.c,m.g,m.a,c.c])],g);var I=n("nIj0"),N=n("WxsR"),R=n("ddJ1"),P=function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},x=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},O=function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{l(r.next(t))}catch(e){i(e)}}function s(t){try{l(r.throw(t))}catch(e){i(e)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,s)}l((r=r.apply(t,e||[])).next())}))},T=function(t){return t&&t.__esModule?t:{default:t}};let _=class{constructor(t,e,n,r,o,i,a){this.store=t,this.formBuilder=e,this.utilService=n,this.actionService=r,this.activatedRoute=o,this.router=i,this.translate=a,this.environment=Object(p.a)(),this.SearchCountryField=R.c,this.TooltipLabel=R.d,this.CountryISO=R.a}ngOnInit(){this.isLoading=this.store.pipe(Object(l.m)(f.b)),this.isPasswordMask=!0,this.createInputForm(),setTimeout(()=>{if(void 0===this.intlTelInput)return;const t=this.intlTelInput.allCountries.find(t=>t.iso2===R.a.Japan);void 0!==t&&(t.placeHolder=this.translate.instant("form.placeholder.telephone"))},0)}createInputForm(){this.inputForm=this.formBuilder.group({confirmationNumber:["",[I.k.required,I.k.pattern(/^[0-9]+$/)]],telephone:["",this.environment.INQUIRY_INPUT_KEYPAD?[I.k.required,I.k.maxLength(15),I.k.minLength(9),t=>{const e=t.root.get("telephone");if(null!==e){if(""===e.value)return null;const t=new RegExp(/^\+/).test(e.value)?N.c(e.value):N.c(e.value,"JP");if(void 0===t.phone)return{telephone:!0};if(!N.b(t))return{telephone:!0}}return null}]:[I.k.required]]});const t=this.activatedRoute.snapshot.params.confirmationNumber;void 0!==t&&this.inputForm.controls.confirmationNumber.setValue(t)}onSubmit(){return O(this,void 0,void 0,(function*(){if(Object.keys(this.inputForm.controls).forEach(t=>{this.inputForm.controls[t].markAsTouched()}),this.inputForm.controls.confirmationNumber.setValue(document.getElementById("confirmationNumber").value),this.environment.INQUIRY_INPUT_KEYPAD&&this.inputForm.controls.telephone.setValue(document.getElementById("telephone").value),this.inputForm.invalid)return;const t=this.inputForm.controls.confirmationNumber.value,e=this.environment.INQUIRY_INPUT_KEYPAD?this.inputForm.controls.telephone.value:this.inputForm.controls.telephone.value.e164Number;try{yield this.actionService.order.inquiry({confirmationNumber:t,customer:{telephone:e}}),this.router.navigate(["/inquiry/confirm"])}catch(n){console.error(n),this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("inquiry.input.validation")})}}))}changeConfirmationNumber(t){this.inputForm.controls.confirmationNumber.setValue(t)}changeTelephone(t){this.inputForm.controls.telephone.setValue(t)}changePassWordMask(){this.isPasswordMask=!this.isPasswordMask,void 0!==this.intlTelInput&&(this.intlTelInput.cssClass=this.isPasswordMask?"form-control text-security-disc":"form-control")}};_.ctorParameters=()=>[{type:l.b},{type:I.b},{type:m.g},{type:m.a},{type:a.a},{type:a.c},{type:c.c}],_.propDecorators={intlTelInput:[{type:o.lb,args:["intlTelInput"]}]},_=P([Object(o.n)({selector:"app-inquiry-input",template:T(n("uWiq")).default,styles:[T(n("vcNb")).default]}),x("design:paramtypes",[l.b,I.b,m.g,m.a,a.a,a.c,c.c])],_);var S=function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},w=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},k=function(t){return t&&t.__esModule?t:{default:t}};let q=class{constructor(t){this.router=t,this.environment=Object(p.a)()}ngOnInit(){if(""===this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME)return;const t=Number(this.environment.INQUIRY_PRINT_SUCCESS_WAIT_TIME);this.timer=setTimeout(()=>{this.router.navigate(["/inquiry/input"])},t)}ngOnDestroy(){void 0!==this.timer&&clearTimeout(this.timer)}};q.ctorParameters=()=>[{type:a.c}],q=S([Object(o.n)({selector:"app-inquiry-print",template:k(n("w++k")).default,styles:[k(n("LlIr")).default]}),w("design:paramtypes",[a.c])],q);var Y=function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a};const D=[{path:"",component:n("RRjC").a,children:[{path:"input",component:_},{path:"input/:confirmationNumber",component:_},{path:"confirm",component:g},{path:"print",component:q}]}];let E=class{};E=Y([Object(o.K)({imports:[a.d.forChild(D)],exports:[a.d]})],E);var F=function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a};let C=class{};C=F([Object(o.K)({declarations:[_,g,q],imports:[r.c,E,i.a]})],C)},LlIr:function(t,e,n){"use strict";n.r(e),e.default=""},uWiq:function(t,e,n){"use strict";n.r(e),e.default='<div class="contents-width mx-auto px-3 py-5">\n    <form [formGroup]="inputForm">\n        <div class="mb-4">\n            <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.input.title\' | translate }}</h2>\n            <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.input.read\' | translate"></p>\n\n            <div class="inquiry-form mx-auto p-3 bg-white">\n\n                <div class="form-group">\n                    <label class="mb-2" for="">{{ \'common.confirmationNumber\' | translate }}</label>\n                    <app-numeric-keypad *ngIf="environment.INQUIRY_INPUT_KEYPAD" inputType="string"\n                        [inputValue]="inputForm.controls.confirmationNumber.value"\n                        (change)="changeConfirmationNumber($event)">\n                        <input type="text" class="form-control" formControlName="confirmationNumber"\n                            id="confirmationNumber" [placeholder]="\'form.placeholder.confirmationNumber\' | translate"\n                            readonly>\n                    </app-numeric-keypad>\n                    <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="text" class="form-control"\n                        formControlName="confirmationNumber" id="confirmationNumber"\n                        [placeholder]="\'form.placeholder.confirmationNumber\' | translate">\n                    <div *ngIf="inputForm.controls.confirmationNumber.invalid && inputForm.controls.confirmationNumber.touched"\n                        class="mt-2">\n                        <p *ngIf="inputForm.controls.confirmationNumber.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.confirmationNumber.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                    </div>\n                </div>\n                <div class="form-group mb-0">\n                    <label class="mb-2" for="">{{ \'form.label.telephone\' | translate }}</label>\n                    <div class="position-relative" *ngIf="environment.INQUIRY_INPUT_KEYPAD">\n                        <app-numeric-keypad inputType="telephone"\n                            [inputValue]="inputForm.controls.telephone.value" (change)="changeTelephone($event)">\n                            <input [type]="(isPasswordMask) ? \'password\' : \'text\'" class="form-control" formControlName="telephone" id="telephone"\n                                [placeholder]="\'form.placeholder.telephone\' | translate" readonly>\n                        </app-numeric-keypad>\n                        <button type="button" class="btn position-absolute" style="top: 0; right: 0;" (click)="changePassWordMask()">\n                            <i *ngIf="isPasswordMask" class="fas fa-eye"></i>\n                            <i *ngIf="!isPasswordMask" class="fas fa-eye-slash"></i>\n                        </button>\n                    </div>\n                    <div class="position-relative" *ngIf="!environment.INQUIRY_INPUT_KEYPAD">\n                        <ngx-intl-tel-input\n                            #intlTelInput\n                            [cssClass]="\'form-control text-security-disc\'"\n                            [preferredCountries]="[CountryISO.Japan]"\n                            [enableAutoCountrySelect]="false"\n                            [enablePlaceholder]="true"\n                            [searchCountryFlag]="true"\n                            [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"\n                            [selectFirstCountry]="false"\n                            [selectedCountryISO]="CountryISO.Japan"\n                            [maxLength]="15"\n                            [tooltipField]="TooltipLabel.Name"\n                            [phoneValidation]="true"\n                            [separateDialCode]="false"\n                            name="telephone"\n                            formControlName="telephone"\n                            type="password"></ngx-intl-tel-input>\n                            <button type="button" class="btn position-absolute" style="top: 0; right: 0;" (click)="changePassWordMask()">\n                                <i *ngIf="isPasswordMask" class="fas fa-eye"></i>\n                                <i *ngIf="!isPasswordMask" class="fas fa-eye-slash"></i>\n                            </button>\n                    </div>\n                    \n                    \x3c!-- <input *ngIf="!environment.INQUIRY_INPUT_KEYPAD" type="password" class="form-control"\n                        formControlName="telephone" id="telephone"\n                        [placeholder]="\'form.placeholder.telephone\' | translate"> --\x3e\n                    <div *ngIf="inputForm.controls.telephone.invalid && inputForm.controls.telephone.touched"\n                        class="mt-2">\n                        <p *ngIf="inputForm.controls.telephone.errors?.required" class="text-danger">\n                            {{ \'form.validation.required\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.minlength" class="text-danger">\n                            {{ \'form.validation.minlength\' | translate: { value: inputForm.controls.telephone.errors?.minlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.maxlength" class="text-danger">\n                            {{ \'form.validation.maxlength\' | translate: { value: inputForm.controls.telephone.errors?.maxlength.requiredLength } }}\n                        </p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.pattern" class="text-danger">\n                            {{ \'form.validation.number\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.telephone" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}</p>\n                        <p *ngIf="inputForm.controls.telephone.errors?.validatePhoneNumber" class="text-danger">\n                            {{ \'form.validation.telephone\' | translate }}\n                        </p>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n\n        <div class="buttons mx-auto text-center">\n            <button type="submit" [disabled]="isLoading | async" class="btn btn-primary btn-block py-3 mb-3"\n                (click)="onSubmit()">{{ \'inquiry.input.next\' | translate }}</button>\n            <a *ngIf="environment.PORTAL_SITE_URL" class="btn btn-outline-primary btn-block py-3 portal-link"\n                [href]="environment.PORTAL_SITE_URL">{{ \'inquiry.input.prev\' | translate }}</a>\n            <button *ngIf="!environment.PORTAL_SITE_URL" type="button" class="btn btn-outline-primary btn-block py-3"\n                routerLink="/">{{ \'inquiry.input.prev\' | translate }}</button>\n        </div>\n    </form>\n</div>'},vcNb:function(t,e,n){"use strict";n.r(e),e.default=".inquiry-form {\n  max-width: 500px;\n}"},"w++k":function(t,e,n){"use strict";n.r(e),e.default='<div class="contents-width mx-auto px-3 py-5">\n    <div class="mb-4">\n        <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'inquiry.print.title\' | translate }}</h2>\n        <p class="mb-4 text-md-center" [innerHTML]="\'inquiry.print.read\' | translate"></p>\n    </div>\n\n    <div class="buttons mx-auto text-center">\n        <button type="button" class="btn btn-primary btn-block py-3" routerLink="/inquiry/input">\n            {{ \'inquiry.print.prev\' | translate }}\n        </button>\n    </div>\n</div>'}}]);