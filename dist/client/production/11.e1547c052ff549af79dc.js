(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{AL2A:function(t,e,r){"use strict";r.r(e);var n=r("WT9V"),s=r("LoAr"),o=r("DSWM"),i=r("IfiR"),a=r("981U"),c=r("GovN"),l=r("zZcu"),p=r("PIN6"),u=r("i7xV"),d=r("cHUu"),h=r("mOXJ"),f=function(t,e,r,n){var s,o=arguments.length,i=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o<3?s(i):o>3?s(e,r,i):s(e,r))||i);return o>3&&i&&Object.defineProperty(e,r,i),i},v=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},m=function(t,e,r,n){return new(r||(r=Promise))((function(s,o){function i(t){try{c(n.next(t))}catch(e){o(e)}}function a(t){try{c(n.throw(t))}catch(e){o(e)}}function c(t){t.done?s(t.value):new r((function(e){e(t.value)})).then(i,a)}c((n=n.apply(t,e||[])).next())}))},b=function(t,e){var r,n,s,o,i={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;i;)try{if(r=1,n&&(s=2&o[0]?n.return:o[0]?n.throw||((s=n.return)&&s.call(n),0):n.next)&&!(s=s.call(n,o[1])).done)return s;switch(n=0,s&&(o=[2&o[0],s.value]),o[0]){case 0:case 1:s=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,n=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(s=(s=i.trys).length>0&&s[s.length-1])&&(6===o[0]||2===o[0])){i=0;continue}if(3===o[0]&&(!s||o[1]>s[0]&&o[1]<s[3])){i.label=o[1];break}if(6===o[0]&&i.label<s[1]){i.label=s[1],s=o;break}if(s&&i.label<s[2]){i.label=s[2],i.ops.push(o);break}s[2]&&i.ops.pop(),i.trys.pop();continue}o=e.call(t,i)}catch(a){o=[6,a],n=0}finally{r=s=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}},g=function(t){return t&&t.__esModule?t:{default:t}},y=function(){function t(t,e,r,n,s,o,i,a){this.store=t,this.utilService=e,this.masterService=r,this.userService=n,this.formBuilder=s,this.translate=o,this.orderService=i,this.router=a,this.viewType=u.e,this.printers=u.g,this.connectionType=u.f,this.environment=Object(p.a)()}return t.prototype.ngOnInit=function(){return m(this,void 0,void 0,(function(){var t,e,r,n,s,o;return b(this,(function(i){switch(i.label){case 0:this.isLoading=this.store.pipe(Object(c.j)(h.b)),this.user=this.store.pipe(Object(c.j)(h.g)),this.master=this.store.pipe(Object(c.j)(h.c)),this.error=this.store.pipe(Object(c.j)(h.a)),i.label=1;case 1:return i.trys.push([1,7,,8]),[4,this.masterService.getSellers()];case 2:return i.sent(),[4,this.masterService.getTheaters()];case 3:return i.sent(),[4,this.userService.getData()];case 4:return t=i.sent(),[4,this.masterService.getData()];case 5:return e=i.sent(),void 0!==t.seller&&void 0!==t.pos&&void 0!==t.printer&&void 0===t.theater&&(r=t.seller,n=e.theaters.find((function(t){return void 0!==r.location&&t.branchCode===r.location.branchCode})),s=void 0===n?e.theaters[0]:n,this.userService.updateBaseSetting({seller:t.seller,pos:t.pos,theater:s,printer:t.printer})),[4,this.createBaseForm()];case 6:return i.sent(),[3,8];case 7:return o=i.sent(),console.error(o),this.router.navigate(["/error"]),[3,8];case 8:return[2]}}))}))},t.prototype.createBaseForm=function(){return m(this,void 0,void 0,(function(){var t;return b(this,(function(e){switch(e.label){case 0:return this.baseForm=this.formBuilder.group({theaterBranchCode:["",[i.g.required]],posId:["",[i.g.required]],printerType:["",[i.g.required]],printerIpAddress:[""]}),[4,this.userService.getData()];case 1:return void 0!==(t=e.sent()).theater&&this.baseForm.controls.theaterBranchCode.setValue(t.theater.branchCode),void 0!==t.pos&&(this.changePosList(),this.baseForm.controls.posId.setValue(t.pos.id)),void 0!==t.printer&&(this.baseForm.controls.printerType.setValue(t.printer.connectionType),this.baseForm.controls.printerIpAddress.setValue(t.printer.ipAddress)),[2]}}))}))},t.prototype.changePosList=function(){var t=this;this.baseForm.controls.posId.setValue("");var e=this.baseForm.controls.theaterBranchCode.value;""!==e?this.master.subscribe((function(r){var n=r.sellers.find((function(t){return void 0!==t.location&&t.location.branchCode===e}));t.posList=void 0!==n?void 0===n.hasPOS?[]:n.hasPOS:[]})).unsubscribe():this.posList=[]},t.prototype.updateBase=function(){return m(this,void 0,void 0,(function(){var t,e,r,n,s,o,i,a=this;return b(this,(function(c){switch(c.label){case 0:if(Object.keys(this.baseForm.controls).forEach((function(t){a.baseForm.controls[t].markAsTouched()})),this.baseForm.invalid)return this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("setting.alert.validation")}),[2];c.label=1;case 1:return c.trys.push([1,3,,4]),[4,this.masterService.getData()];case 2:if(t=c.sent(),e=this.baseForm.controls.theaterBranchCode.value,r=this.baseForm.controls.posId.value,void 0===(n=t.sellers.find((function(t){return void 0!==t.location&&t.location.branchCode===e})))||void 0===n.hasPOS)throw new Error("seller not found").message;if(void 0===(s=n.hasPOS.find((function(t){return t.id===r}))))throw new Error("pos not found").message;if(void 0===(o=t.theaters.find((function(t){return t.branchCode===e}))))throw new Error("theater not found").message;return this.userService.updateBaseSetting({seller:n,pos:s,theater:o,printer:{ipAddress:this.baseForm.controls.printerIpAddress.value,connectionType:this.baseForm.controls.printerType.value}}),this.utilService.openAlert({title:this.translate.instant("common.complete"),body:this.translate.instant("setting.alert.success")}),[3,4];case 3:return i=c.sent(),console.error(i),[3,4];case 4:return[2]}}))}))},t.prototype.print=function(){return m(this,void 0,void 0,(function(){var t,e;return b(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),t={connectionType:this.baseForm.controls.printerType.value,ipAddress:this.baseForm.controls.printerIpAddress.value},[4,this.orderService.print({orders:[],printer:t})];case 1:return r.sent(),[3,3];case 2:return e=r.sent(),console.error(e),this.utilService.openAlert({title:this.translate.instant("common.error"),body:'\n                <p class="mb-4">'+this.translate.instant("setting.alert.print")+'</p>\n                <div class="p-3 bg-light-gray select-text error">\n                    <code>'+e+"</code>\n                </div>"}),[3,3];case 3:return[2]}}))}))},t.prototype.changePrinterType=function(){this.baseForm.controls.printerType.value===u.f.StarBluetooth&&this.baseForm.controls.printerIpAddress.setValue(this.translate.instant("setting.starBluetoothAddress"))},t.ctorParameters=function(){return[{type:c.b},{type:d.i},{type:d.c},{type:d.h},{type:i.a},{type:l.c},{type:d.d},{type:a.c}]},t=f([Object(s.n)({selector:"app-setting",template:g(r("XREv")).default,styles:[g(r("zopa")).default]}),v("design:paramtypes",[c.b,d.i,d.c,d.h,i.a,l.c,d.d,a.c])],t)}(),w=r("RRjC"),F=function(t,e,r,n){var s,o=arguments.length,i=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o<3?s(i):o>3?s(e,r,i):s(e,r))||i);return o>3&&i&&Object.defineProperty(e,r,i),i},S=[{path:"",component:w.a,children:[{path:"",component:y}]}],I=function(){function t(){}return t=F([Object(s.I)({imports:[a.d.forChild(S)],exports:[a.d]})],t)}();r.d(e,"SettingModule",(function(){return O}));var j=function(t,e,r,n){var s,o=arguments.length,i=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o<3?s(i):o>3?s(e,r,i):s(e,r))||i);return o>3&&i&&Object.defineProperty(e,r,i),i},O=function(){function t(){}return t=j([Object(s.I)({declarations:[y],imports:[n.b,I,o.a]})],t)}()},XREv:function(t,e,r){"use strict";r.r(e),e.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'setting.title\' | translate }}</h2>\n    <p class="mb-4 text-md-center" [innerHTML]="\'setting.read\' | translate"></p>\n    <form *ngIf="baseForm" [formGroup]="baseForm">\n        <div class="mb-4 p-3 bg-white">\n\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'common.theater\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="theaterBranchCode" (change)="changePosList()">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let theater of (master | async).theaters"\n                                [value]="theater.branchCode">{{ theater.name | changeLanguage }}</option>\n                        </select>\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.pos\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="posId">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let pos of posList" [value]="pos.id">{{ pos.name }}</option>\n                        </select>\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.printer\' | translate }}</p>\n                    <div class="col-md-8">\n                        <select class="form-control" formControlName="printerType">\n                            <option value="">{{ \'setting.unselected\' | translate }}</option>\n                            <option *ngFor="let printer of printers" [value]="printer.connectionType">\n                                {{ printer.name | translate }}</option>\n                        </select>\n                        <button\n                            *ngIf="this.baseForm.controls.printerType.value && this.baseForm.controls.printerType.value !== connectionType.None"\n                            type="button" class="btn btn-sm btn-primary py-2 mt-2"\n                            (click)="print()">{{ \'setting.testPrinting\' | translate }}</button>\n                    </div>\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="row align-items-center">\n                    <p class="col-md-4 py-2 text-md-right">{{ \'setting.printerIpAddress\' | translate }}</p>\n                    <div class="col-md-8">\n                        <input type="text" class="form-control" formControlName="printerIpAddress"\n                            placeholder="0.0.0.0">\n                        <div *ngIf="baseForm.controls.printerIpAddress.invalid && baseForm.controls.printerIpAddress.touched"\n                            class="mt-2">\n                            <p *ngIf="baseForm.controls.printerIpAddress.errors.required" class="text-danger">\n                                {{ \'form.validation.required\' | translate }}</p>\n                        </div>\n                        <p class="text-small mt-2">\n                            {{ \'setting.printerIpAddressDescription\' | translate }}\n                        </p>\n                    </div>\n                </div>\n            </div>\n            \n\n        </div>\n        <div class="buttons mx-auto text-center">\n            <button type="submit" class="btn btn-primary btn-block py-3 mb-3" [disabled]="isLoading | async"\n                (click)="updateBase()">{{ \'setting.next\' | translate }}</button>\n            <button type="button" class="btn btn-link"\n                [routerLink]="environment.BASE_URL">{{ \'setting.prev\' | translate }}</button>\n        </div>\n    </form>\n</div>'},zopa:function(t,e,r){"use strict";r.r(e),e.default=""}}]);