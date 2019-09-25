(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{AL2A:function(e,t,n){"use strict";n.r(t);var r=n("WT9V"),s=n("LoAr"),o=n("DSWM"),i=n("IfiR"),a=n("981U"),l=n("GovN"),c=n("zZcu"),p=n("PIN6"),d=n("i7xV"),u=n("cHUu"),v=n("mOXJ"),f=function(e,t,n,r){var s,o=arguments.length,i=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(o<3?s(i):o>3?s(t,n,i):s(t,n))||i);return o>3&&i&&Object.defineProperty(t,n,i),i},h=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},m=function(e,t,n,r){return new(n||(n=Promise))(function(s,o){function i(e){try{l(r.next(e))}catch(t){o(t)}}function a(e){try{l(r.throw(e))}catch(t){o(t)}}function l(e){e.done?s(e.value):new n(function(t){t(e.value)}).then(i,a)}l((r=r.apply(e,t||[])).next())})},b=function(e,t){var n,r,s,o,i={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(s=2&o[0]?r.return:o[0]?r.throw||((s=r.return)&&s.call(r),0):r.next)&&!(s=s.call(r,o[1])).done)return s;switch(r=0,s&&(o=[2&o[0],s.value]),o[0]){case 0:case 1:s=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(s=(s=i.trys).length>0&&s[s.length-1])&&(6===o[0]||2===o[0])){i=0;continue}if(3===o[0]&&(!s||o[1]>s[0]&&o[1]<s[3])){i.label=o[1];break}if(6===o[0]&&i.label<s[1]){i.label=s[1],s=o;break}if(s&&i.label<s[2]){i.label=s[2],i.ops.push(o);break}s[2]&&i.ops.pop(),i.trys.pop();continue}o=t.call(e,i)}catch(a){o=[6,a],r=0}finally{n=s=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}},y=function(e){return e&&e.__esModule?e:{default:e}},g=function(){function e(e,t,n,r,s,o,i,a){this.store=e,this.utilService=t,this.masterService=n,this.userService=r,this.formBuilder=s,this.translate=o,this.orderService=i,this.router=a,this.viewType=d.f,this.printers=d.h,this.connectionType=d.g,this.environment=p.a}return e.prototype.ngOnInit=function(){return m(this,void 0,void 0,function(){var e;return b(this,function(t){switch(t.label){case 0:this.isLoading=this.store.pipe(Object(l.i)(v.b)),this.user=this.store.pipe(Object(l.i)(v.g)),this.master=this.store.pipe(Object(l.i)(v.c)),this.error=this.store.pipe(Object(l.i)(v.a)),t.label=1;case 1:return t.trys.push([1,4,,5]),[4,this.masterService.getSellers()];case 2:return t.sent(),[4,this.createBaseForm()];case 3:return t.sent(),[3,5];case 4:return e=t.sent(),console.error(e),this.router.navigate(["/error"]),[3,5];case 5:return[2]}})})},e.prototype.createBaseForm=function(){return m(this,void 0,void 0,function(){var e;return b(this,function(t){switch(t.label){case 0:return this.baseForm=this.formBuilder.group({sellerBranchCode:["",[i.f.required]],posId:["",[i.f.required]],printerType:["",[i.f.required]],printerIpAddress:[""],isPurchaseCart:["0",[i.f.required,i.f.pattern(/^[0-9]+$/)]],viewType:["",[i.f.required]]}),[4,this.userService.getData()];case 1:return void 0!==(e=t.sent()).seller&&void 0!==e.seller.location&&this.baseForm.controls.sellerBranchCode.setValue(e.seller.location.branchCode),void 0!==e.pos&&(this.changePosList(),this.baseForm.controls.posId.setValue(e.pos.id)),void 0!==e.printer&&(this.baseForm.controls.printerType.setValue(e.printer.connectionType),this.baseForm.controls.printerIpAddress.setValue(e.printer.ipAddress)),this.baseForm.controls.isPurchaseCart.setValue(e.isPurchaseCart?"1":"0"),this.baseForm.controls.viewType.setValue(e.viewType),[2]}})})},e.prototype.changePosList=function(){var e=this;this.baseForm.controls.posId.setValue("");var t=this.baseForm.controls.sellerBranchCode.value;""!==t?this.master.subscribe(function(n){var r=n.sellers.find(function(e){return void 0!==e.location&&e.location.branchCode===t});e.posList=void 0!==r?void 0===r.hasPOS?[]:r.hasPOS:[]}).unsubscribe():this.posList=[]},e.prototype.updateBase=function(){return m(this,void 0,void 0,function(){var e,t,n,r,s,o=this;return b(this,function(i){switch(i.label){case 0:return Object.keys(this.baseForm.controls).forEach(function(e){o.baseForm.controls[e].markAsTouched()}),this.baseForm.invalid?(this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("setting.alert.validation")}),[2]):[4,this.masterService.getData()];case 1:return e=i.sent(),void 0!==(t=e.sellers.find(function(e){return void 0!==e.location&&e.location.branchCode===o.baseForm.controls.sellerBranchCode.value}))&&void 0!==t.hasPOS&&void 0===(n=t.hasPOS.find(function(e){return e.id===o.baseForm.controls.posId.value}))?[2]:(r="1"===this.baseForm.controls.isPurchaseCart.value,s=this.baseForm.controls.viewType.value,this.userService.updateBaseSetting({seller:t,pos:n,printer:{ipAddress:this.baseForm.controls.printerIpAddress.value,connectionType:this.baseForm.controls.printerType.value},isPurchaseCart:r,viewType:s}),this.utilService.openAlert({title:this.translate.instant("common.complete"),body:this.translate.instant("setting.alert.success")}),[2])}})})},e.prototype.print=function(){return m(this,void 0,void 0,function(){var e,t;return b(this,function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),e={connectionType:this.baseForm.controls.printerType.value,ipAddress:this.baseForm.controls.printerIpAddress.value},[4,this.orderService.print({orders:[],printer:e})];case 1:return n.sent(),[3,3];case 2:return t=n.sent(),console.error(t),this.utilService.openAlert({title:this.translate.instant("common.error"),body:'\n                <p class="mb-4">'+this.translate.instant("setting.alert.print")+'</p>\n                <div class="p-3 bg-light-gray select-text error">\n                    <code>'+t+"</code>\n                </div>"}),[3,3];case 3:return[2]}})})},e.prototype.changePrinterType=function(){this.baseForm.controls.printerType.value===d.g.StarBluetooth&&this.baseForm.controls.printerIpAddress.setValue(this.translate.instant("setting.starBluetoothAddress"))},e.ctorParameters=function(){return[{type:l.b},{type:u.g},{type:u.b},{type:u.f},{type:i.a},{type:c.c},{type:u.c},{type:a.c}]},e=f([Object(s.n)({selector:"app-setting",template:y(n("XREv")).default,styles:[y(n("zopa")).default]}),h("design:paramtypes",[l.b,u.g,u.b,u.f,i.a,c.c,u.c,a.c])],e)}(),w=n("RRjC"),F=function(e,t,n,r){var s,o=arguments.length,i=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(o<3?s(i):o>3?s(t,n,i):s(t,n))||i);return o>3&&i&&Object.defineProperty(t,n,i),i},T=[{path:"",component:w.a,children:[{path:"",component:g}]}],I=function(){function e(){}return e=F([Object(s.I)({imports:[a.d.forChild(T)],exports:[a.d]})],e)}();n.d(t,"SettingModule",function(){return C});var x=function(e,t,n,r){var s,o=arguments.length,i=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(o<3?s(i):o>3?s(t,n,i):s(t,n))||i);return o>3&&i&&Object.defineProperty(t,n,i),i},C=function(){function e(){}return e=x([Object(s.I)({declarations:[g],imports:[r.b,I,o.a]})],e)}()},XREv:function(e,t,n){"use strict";n.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'setting.title\' | translate }}</h2>\n    <p class="mb-4 text-md-center" [innerHTML]="\'setting.read\' | translate"></p>\n\n    <div class="mb-4 p-3 bg-white">\n        <form *ngIf="baseForm" [formGroup]="baseForm">\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'common.theater\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="sellerBranchCode" (change)="changePosList()">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let seller of (master | async).sellers"\n                                [value]="seller.location.branchCode">{{ seller.name.ja }}</option>\n                        </select>\n                        \x3c!-- <div *ngIf="baseForm.controls.sellerBranchCode.invalid && baseForm.controls.sellerBranchCode.touched"\n                            class="mt-2">\n                            <p *ngIf="baseForm.controls.sellerBranchCode.errors.required" class="text-danger">\n                                {{ \'form.validation.unselected\' | translate }}</p>\n                        </div> --\x3e\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.pos\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="posId">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let pos of posList" [value]="pos.id">{{ pos.name }}</option>\n                        </select>\n                        \x3c!-- <div *ngIf="baseForm.controls.posId.invalid && baseForm.controls.posId.touched"\n                            class="mt-2">\n                            <p *ngIf="baseForm.controls.posId.errors.required" class="text-danger">\n                                {{ \'form.validation.unselected\' | translate }}</p>\n                        </div> --\x3e\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.printer\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="printerType">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let printer of printers" [value]="printer.connectionType">\n                                {{ printer.name | translate }}</option>\n                        </select>\n                        <button\n                            *ngIf="this.baseForm.controls.printerType.value && this.baseForm.controls.printerType.value !== connectionType.None"\n                            type="button" class="btn btn-sm btn-primary py-2 mt-2"\n                            (click)="print()">{{ \'setting.testPrinting\' | translate }}</button>\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.printerIpAddress\' | translate }}</p>\n                    <div class="col-md-8">\n                        <input type="text" class="form-control" formControlName="printerIpAddress"\n                            placeholder="0.0.0.0">\n                        <div *ngIf="baseForm.controls.printerIpAddress.invalid && baseForm.controls.printerIpAddress.touched"\n                            class="mt-2">\n                            <p *ngIf="baseForm.controls.printerIpAddress.errors.required" class="text-danger">\n                                {{ \'form.validation.required\' | translate }}</p>\n                        </div>\n                        <p class="text-small mt-2">\n                            {{ \'setting.printerIpAddressDescription\' | translate }}\n                        </p>\n                    </div>\n                </div>\n            </div>\n            <div *ngIf="environment.SETTING_DEVELOP_OPTION">\n                <div class="form-group">\n                    <div class="row align-items-center">\n                        <p class="col-md-4 py-2 text-md-right"> {{ \'setting.isPurchaseCart\' | translate }}\n                        </p>\n                        <div class="col-md-8">\n                            <select type="text" class="form-control" formControlName="isPurchaseCart"\n                                id="isPurchaseCart" placeholder="">\n                                <option value="0">{{ \'common.off\' | translate }}</option>\n                                <option value="1">{{ \'common.on\' | translate }}</option>\n                            </select>\n                        </div>\n                    </div>\n                </div>\n                <div class="form-group mb-0">\n                    <div class="row align-items-center">\n                        <p class="col-md-4 py-2 text-md-right"> {{ \'setting.viewType\' | translate }}</p>\n                        <div class="col-md-8">\n                            <select class="form-control" id="viewType" formControlName="viewType">\n                                <option [value]="viewType.Cinema">{{ viewType.Cinema }}</option>\n                                <option [value]="viewType.Event">{{ viewType.Event }}</option>\n                            </select>\n                            <div *ngIf="baseForm.controls.viewType.invalid && baseForm.controls.viewType.touched"\n                                class="mt-2">\n                                <p *ngIf="baseForm.controls.viewType.errors.required" class="text-danger">\n                                    {{ \'form.validation.required\' | translate }}\n                                </p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n        </form>\n    </div>\n    <div class="buttons mx-auto text-center">\n        <button type="button" class="btn btn-primary btn-block py-3 mb-3" [disabled]="isLoading | async"\n            (click)="updateBase()">{{ \'setting.next\' | translate }}</button>\n        <button type="button" class="btn btn-link"\n            [routerLink]="environment.BASE_URL">{{ \'setting.prev\' | translate }}</button>\n    </div>\n\n</div>'},zopa:function(e,t,n){"use strict";n.r(t),t.default=""}}]);