(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{AL2A:function(t,e,n){"use strict";n.r(e);var r=n("WT9V"),s=n("LoAr"),o=n("DSWM"),i=n("IfiR"),a=n("981U"),c=n("GovN"),l=n("zZcu"),p=n("PIN6"),d=n("i7xV"),u=n("cHUu"),h=n("mOXJ"),f=function(t,e,n,r){var s,o=arguments.length,i=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o<3?s(i):o>3?s(e,n,i):s(e,n))||i);return o>3&&i&&Object.defineProperty(e,n,i),i},m=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},v=function(t,e,n,r){return new(n||(n=Promise))((function(s,o){function i(t){try{c(r.next(t))}catch(e){o(e)}}function a(t){try{c(r.throw(t))}catch(e){o(e)}}function c(t){t.done?s(t.value):new n((function(e){e(t.value)})).then(i,a)}c((r=r.apply(t,e||[])).next())}))},b=function(t,e){var n,r,s,o,i={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(s=2&o[0]?r.return:o[0]?r.throw||((s=r.return)&&s.call(r),0):r.next)&&!(s=s.call(r,o[1])).done)return s;switch(r=0,s&&(o=[2&o[0],s.value]),o[0]){case 0:case 1:s=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(s=(s=i.trys).length>0&&s[s.length-1])&&(6===o[0]||2===o[0])){i=0;continue}if(3===o[0]&&(!s||o[1]>s[0]&&o[1]<s[3])){i.label=o[1];break}if(6===o[0]&&i.label<s[1]){i.label=s[1],s=o;break}if(s&&i.label<s[2]){i.label=s[2],i.ops.push(o);break}s[2]&&i.ops.pop(),i.trys.pop();continue}o=e.call(t,i)}catch(a){o=[6,a],r=0}finally{n=s=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}},y=function(t){return t&&t.__esModule?t:{default:t}},g=function(){function t(t,e,n,r,s,o,i,a){this.store=t,this.utilService=e,this.masterService=n,this.userService=r,this.formBuilder=s,this.translate=o,this.orderService=i,this.router=a,this.viewType=d.f,this.printers=d.h,this.connectionType=d.g,this.environment=Object(p.a)()}return t.prototype.ngOnInit=function(){return v(this,void 0,void 0,(function(){var t;return b(this,(function(e){switch(e.label){case 0:this.isLoading=this.store.pipe(Object(c.j)(h.b)),this.user=this.store.pipe(Object(c.j)(h.g)),this.master=this.store.pipe(Object(c.j)(h.c)),this.error=this.store.pipe(Object(c.j)(h.a)),e.label=1;case 1:return e.trys.push([1,4,,5]),[4,this.masterService.getSellers()];case 2:return e.sent(),[4,this.createBaseForm()];case 3:return e.sent(),[3,5];case 4:return t=e.sent(),console.error(t),this.router.navigate(["/error"]),[3,5];case 5:return[2]}}))}))},t.prototype.createBaseForm=function(){return v(this,void 0,void 0,(function(){var t;return b(this,(function(e){switch(e.label){case 0:return this.baseForm=this.formBuilder.group({sellerBranchCode:["",[i.f.required]],posId:["",[i.f.required]],printerType:["",[i.f.required]],printerIpAddress:[""]}),[4,this.userService.getData()];case 1:return void 0!==(t=e.sent()).seller&&void 0!==t.seller.location&&this.baseForm.controls.sellerBranchCode.setValue(t.seller.location.branchCode),void 0!==t.pos&&(this.changePosList(),this.baseForm.controls.posId.setValue(t.pos.id)),void 0!==t.printer&&(this.baseForm.controls.printerType.setValue(t.printer.connectionType),this.baseForm.controls.printerIpAddress.setValue(t.printer.ipAddress)),[2]}}))}))},t.prototype.changePosList=function(){var t=this;this.baseForm.controls.posId.setValue("");var e=this.baseForm.controls.sellerBranchCode.value;""!==e?this.master.subscribe((function(n){var r=n.sellers.find((function(t){return void 0!==t.location&&t.location.branchCode===e}));t.posList=void 0!==r?void 0===r.hasPOS?[]:r.hasPOS:[]})).unsubscribe():this.posList=[]},t.prototype.updateBase=function(){return v(this,void 0,void 0,(function(){var t,e,n,r=this;return b(this,(function(s){switch(s.label){case 0:return Object.keys(this.baseForm.controls).forEach((function(t){r.baseForm.controls[t].markAsTouched()})),this.baseForm.invalid?(this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("setting.alert.validation")}),[2]):[4,this.masterService.getData()];case 1:return t=s.sent(),void 0!==(e=t.sellers.find((function(t){return void 0!==t.location&&t.location.branchCode===r.baseForm.controls.sellerBranchCode.value})))&&void 0!==e.hasPOS&&void 0===(n=e.hasPOS.find((function(t){return t.id===r.baseForm.controls.posId.value})))?[2]:(this.userService.updateBaseSetting({seller:e,pos:n,printer:{ipAddress:this.baseForm.controls.printerIpAddress.value,connectionType:this.baseForm.controls.printerType.value}}),this.utilService.openAlert({title:this.translate.instant("common.complete"),body:this.translate.instant("setting.alert.success")}),[2])}}))}))},t.prototype.print=function(){return v(this,void 0,void 0,(function(){var t,e;return b(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),t={connectionType:this.baseForm.controls.printerType.value,ipAddress:this.baseForm.controls.printerIpAddress.value},[4,this.orderService.print({orders:[],printer:t})];case 1:return n.sent(),[3,3];case 2:return e=n.sent(),console.error(e),this.utilService.openAlert({title:this.translate.instant("common.error"),body:'\n                <p class="mb-4">'+this.translate.instant("setting.alert.print")+'</p>\n                <div class="p-3 bg-light-gray select-text error">\n                    <code>'+e+"</code>\n                </div>"}),[3,3];case 3:return[2]}}))}))},t.prototype.changePrinterType=function(){this.baseForm.controls.printerType.value===d.g.StarBluetooth&&this.baseForm.controls.printerIpAddress.setValue(this.translate.instant("setting.starBluetoothAddress"))},t.ctorParameters=function(){return[{type:c.b},{type:u.i},{type:u.c},{type:u.h},{type:i.a},{type:l.c},{type:u.d},{type:a.c}]},t=f([Object(s.n)({selector:"app-setting",template:y(n("XREv")).default,styles:[y(n("zopa")).default]}),m("design:paramtypes",[c.b,u.i,u.c,u.h,i.a,l.c,u.d,a.c])],t)}(),F=n("RRjC"),I=function(t,e,n,r){var s,o=arguments.length,i=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o<3?s(i):o>3?s(e,n,i):s(e,n))||i);return o>3&&i&&Object.defineProperty(e,n,i),i},w=[{path:"",component:F.a,children:[{path:"",component:g}]}],x=function(){function t(){}return t=I([Object(s.I)({imports:[a.d.forChild(w)],exports:[a.d]})],t)}();n.d(e,"SettingModule",(function(){return O}));var j=function(t,e,n,r){var s,o=arguments.length,i=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o<3?s(i):o>3?s(e,n,i):s(e,n))||i);return o>3&&i&&Object.defineProperty(e,n,i),i},O=function(){function t(){}return t=j([Object(s.I)({declarations:[g],imports:[r.b,x,o.a]})],t)}()},XREv:function(t,e,n){"use strict";n.r(e),e.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'setting.title\' | translate }}</h2>\n    <p class="mb-4 text-md-center" [innerHTML]="\'setting.read\' | translate"></p>\n    <form *ngIf="baseForm" [formGroup]="baseForm">\n        <div class="mb-4 p-3 bg-white">\n\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'common.theater\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="sellerBranchCode" (change)="changePosList()">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let seller of (master | async).sellers"\n                                [value]="seller.location.branchCode">{{ seller.name.ja }}</option>\n                        </select>\n                        \x3c!-- <div *ngIf="baseForm.controls.sellerBranchCode.invalid && baseForm.controls.sellerBranchCode.touched"\n                            class="mt-2">\n                            <p *ngIf="baseForm.controls.sellerBranchCode.errors.required" class="text-danger">\n                                {{ \'form.validation.unselected\' | translate }}</p>\n                        </div> --\x3e\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.pos\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="posId">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let pos of posList" [value]="pos.id">{{ pos.name }}</option>\n                        </select>\n                        \x3c!-- <div *ngIf="baseForm.controls.posId.invalid && baseForm.controls.posId.touched"\n                            class="mt-2">\n                            <p *ngIf="baseForm.controls.posId.errors.required" class="text-danger">\n                                {{ \'form.validation.unselected\' | translate }}</p>\n                        </div> --\x3e\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.printer\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="printerType">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let printer of printers" [value]="printer.connectionType">\n                                {{ printer.name | translate }}</option>\n                        </select>\n                        <button\n                            *ngIf="this.baseForm.controls.printerType.value && this.baseForm.controls.printerType.value !== connectionType.None"\n                            type="button" class="btn btn-sm btn-primary py-2 mt-2"\n                            (click)="print()">{{ \'setting.testPrinting\' | translate }}</button>\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.printerIpAddress\' | translate }}</p>\n                    <div class="col-md-8">\n                        <input type="text" class="form-control" formControlName="printerIpAddress"\n                            placeholder="0.0.0.0">\n                        <div *ngIf="baseForm.controls.printerIpAddress.invalid && baseForm.controls.printerIpAddress.touched"\n                            class="mt-2">\n                            <p *ngIf="baseForm.controls.printerIpAddress.errors.required" class="text-danger">\n                                {{ \'form.validation.required\' | translate }}</p>\n                        </div>\n                        <p class="text-small mt-2">\n                            {{ \'setting.printerIpAddressDescription\' | translate }}\n                        </p>\n                    </div>\n                </div>\n            </div>\n            \n\n        </div>\n        <div class="buttons mx-auto text-center">\n            <button type="submit" class="btn btn-primary btn-block py-3 mb-3" [disabled]="isLoading | async"\n                (click)="updateBase()">{{ \'setting.next\' | translate }}</button>\n            <button type="button" class="btn btn-link"\n                [routerLink]="environment.BASE_URL">{{ \'setting.prev\' | translate }}</button>\n        </div>\n    </form>\n</div>'},zopa:function(t,e,n){"use strict";n.r(e),e.default=""}}]);