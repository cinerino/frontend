(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"+LEz":function(e,t,r){"use strict";r.r(t),t.default=".scroll-horizontal .table {\n  min-width: 900px;\n}"},cfg2:function(e,t,r){"use strict";r.r(t);var n=r("WT9V"),o=r("LoAr"),i=r("DSWM"),a=r("981U"),s=r("E3Fy"),d=r("GovN"),l=r("zZcu"),c=r("wgY5"),m=r("aroP"),u=r("i7xV"),f=r("cHUu"),p=r("mOXJ"),h=r("EOQR"),b=r("/nds"),g=function(e,t,r,n){var o,i=arguments.length,a=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,r,a):o(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a},v=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},y=function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function a(e){try{d(n.next(e))}catch(t){i(t)}}function s(e){try{d(n.throw(e))}catch(t){i(t)}}function d(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(a,s)}d((n=n.apply(e,t||[])).next())})},S=function(e,t){var r,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,n=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(s){i=[6,s],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},O=function(e){return e&&e.__esModule?e:{default:e}},x=function(){function e(e,t,r,n,o,i,a){this.store=e,this.modal=t,this.router=r,this.userService=n,this.utilService=o,this.orderService=i,this.translate=a,this.moment=c,this.orderStatus=s.factory.orderStatus,this.OrderActions=u.b}return e.prototype.ngOnInit=function(){this.actionSelect="",this.selectedOrders=[],this.isLoading=this.store.pipe(Object(d.i)(p.b)),this.error=this.store.pipe(Object(d.i)(p.a)),this.master=this.store.pipe(Object(d.i)(p.c)),this.order=this.store.pipe(Object(d.i)(p.d)),this.limit=20,this.conditions={sellerId:"",orderDateFrom:"",orderDateThrough:"",confirmationNumber:"",orderNumber:"",customer:{familyName:"",givenName:"",email:"",telephone:""},orderStatuses:"",page:1},this.orderService.delete()},e.prototype.isSelected=function(e){return void 0!==this.selectedOrders.find(function(t){return t.orderNumber===e.orderNumber})},e.prototype.addOrder=function(e){this.selectedOrders.push(e)},e.prototype.removeOrder=function(e){var t=this.selectedOrders.findIndex(function(t){return t.orderNumber===e.orderNumber});this.selectedOrders.splice(t,1)},e.prototype.orderSearch=function(e,t){return y(this,void 0,void 0,function(){var r;return S(this,function(n){switch(n.label){case 0:this.selectedOrders=[],void 0!==t&&(this.confirmedConditions.page=t.page),e&&(this.confirmedConditions={sellerId:this.conditions.sellerId,orderDateFrom:this.conditions.orderDateFrom,orderDateThrough:this.conditions.orderDateThrough,confirmationNumber:this.conditions.confirmationNumber,orderNumber:this.conditions.orderNumber,customer:{familyName:this.conditions.customer.familyName,givenName:this.conditions.customer.givenName,email:this.conditions.customer.email,telephone:this.conditions.customer.telephone},orderStatuses:this.conditions.orderStatuses,page:1}),r={seller:{ids:""===this.confirmedConditions.sellerId?void 0:[this.confirmedConditions.sellerId]},customer:{email:""===this.confirmedConditions.customer.email?void 0:this.confirmedConditions.customer.email,telephone:""===this.confirmedConditions.customer.telephone?void 0:this.confirmedConditions.customer.telephone,familyName:""===this.confirmedConditions.customer.familyName?void 0:this.confirmedConditions.customer.familyName,givenName:""===this.confirmedConditions.customer.givenName?void 0:this.confirmedConditions.customer.givenName},orderStatuses:""===this.confirmedConditions.orderStatuses?void 0:[this.confirmedConditions.orderStatuses],orderDateFrom:""===this.confirmedConditions.orderDateFrom?c("1970-01-01").toDate():c(this.confirmedConditions.orderDateFrom).toDate(),orderDateThrough:""===this.confirmedConditions.orderDateThrough?c().add(1,"day").toDate():c(this.confirmedConditions.orderDateThrough).add(1,"day").toDate(),confirmationNumbers:""===this.confirmedConditions.confirmationNumber?void 0:[this.confirmedConditions.confirmationNumber],orderNumbers:""===this.confirmedConditions.orderNumber?void 0:[this.confirmedConditions.orderNumber],limit:this.limit,page:this.confirmedConditions.page,sort:{orderDate:s.factory.sortType.Descending}},n.label=1;case 1:return n.trys.push([1,3,,4]),[4,this.orderService.search(r)];case 2:return n.sent(),[3,4];case 3:return n.sent(),this.router.navigate(["/error"]),[3,4];case 4:return[2]}})})},e.prototype.cancelConfirm=function(e){var t=this;this.utilService.openConfirm({title:this.translate.instant("common.confirm"),body:this.translate.instant("order.list.confirm.cancel"),cb:function(){return y(t,void 0,void 0,function(){var t,r,n;return S(this,function(o){switch(o.label){case 0:return o.trys.push([0,3,,4]),[4,this.userService.getData()];case 1:return t=o.sent(),r=t.language,[4,this.orderService.cancel({orders:e,language:r})];case 2:return o.sent(),[3,4];case 3:return n=o.sent(),console.error(n),this.utilService.openAlert({title:this.translate.instant("common.error"),body:'\n                        <p class="mb-4">'+this.translate.instant("order.list.alert.cancel")+'</p>\n                        <div class="p-3 bg-light-gray select-text error">\n                            <code>'+n+"</code>\n                        </div>"}),[3,4];case 4:return[2]}})})}})},e.prototype.openDetail=function(e){this.modal.show(h.a,{initialState:{order:e},class:"modal-dialog-centered"})},e.prototype.selecedtAction=function(){var e=this;0===this.selectedOrders.length&&this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("order.list.alert.unselected")}),this.actionSelect===u.b.Cancel&&this.utilService.openConfirm({title:this.translate.instant("common.confirm"),body:this.translate.instant("order.list.confirm.cancel"),cb:function(){return y(e,void 0,void 0,function(){var e,t,r;return S(this,function(n){switch(n.label){case 0:return n.trys.push([0,3,,4]),[4,this.userService.getData()];case 1:return e=n.sent(),t=e.language,[4,this.orderService.cancel({orders:this.selectedOrders,language:t})];case 2:return n.sent(),[3,4];case 3:return r=n.sent(),console.error(r),this.utilService.openAlert({title:this.translate.instant("common.error"),body:'\n                            <p class="mb-4">'+this.translate.instant("order.list.alert.cancel")+'</p>\n                            <div class="p-3 bg-light-gray select-text error">\n                                <code>'+r+"</code>\n                            </div>"}),[3,4];case 4:return[2]}})})}})},e.prototype.openQrCode=function(){return y(this,void 0,void 0,function(){var e,t,r;return S(this,function(n){switch(n.label){case 0:return n.trys.push([0,4,,5]),[4,this.orderService.getData()];case 1:if(void 0===(e=n.sent()).order)throw new Error("order undefined");return[4,this.orderService.authorize(e.order)];case 2:return n.sent(),[4,this.orderService.getData()];case 3:if(e=n.sent(),void 0===(t=e.order))throw new Error("authorizeOrder undefined");return this.modal.show(b.a,{initialState:{order:t},class:"modal-dialog-centered"}),[3,5];case 4:return r=n.sent(),console.error(r),this.utilService.openAlert({title:this.translate.instant("common.error"),body:this.translate.instant("order.list.alert.authorize")}),[3,5];case 5:return[2]}})})},e.ctorParameters=function(){return[{type:d.b},{type:m.e},{type:a.c},{type:f.f},{type:f.g},{type:f.c},{type:l.c}]},e=g([Object(o.n)({selector:"app-order-search",template:O(r("gxgf")).default,styles:[O(r("+LEz")).default]}),v("design:paramtypes",[d.b,m.e,a.c,f.f,f.g,f.c,l.c])],e)}(),D=r("RRjC"),N=function(e,t,r,n){var o,i=arguments.length,a=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,r,a):o(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a},w=[{path:"",component:D.a,children:[{path:"search",component:x}]}],C=function(){function e(){}return e=N([Object(o.I)({imports:[a.d.forChild(w)],exports:[a.d]})],e)}();r.d(t,"OrderModule",function(){return F});var M=function(e,t,r,n){var o,i=arguments.length,a=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,r,a):o(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a},F=function(){function e(){}return e=M([Object(o.I)({declarations:[x],entryComponents:[],imports:[n.b,C,i.a]})],e)}()},gxgf:function(e,t,r){"use strict";r.r(t),t.default='<div class="contents-width mx-auto px-3 py-5">\n    <h2 class="text-large mb-4 text-center font-weight-bold">{{ \'order.list.title\' | translate }}</h2>\n    <p class="mb-4 text-md-center" [innerHTML]="\'order.list.read\' | translate"></p>\n    <div class="conditions p-3 bg-white mb-4">\n        <form (submit)="orderSearch(true)">\n            <div class="form-row">\n                <div class="form-group col-md-3">\n                    <label for="orderDateFrom"\n                        class="mb-2">{{ \'order.list.conditions.orderDateFrom\' | translate }}</label>\n                    <input type="date" class="form-control" name="orderDateFrom" id="orderDateFrom"\n                        [(ngModel)]="conditions.orderDateFrom" placeholder="{{ moment().format(\'YYYY-MM-DD\') }}">\n                </div>\n                <div class="form-group col-md-3">\n                    <label for="orderDateThrough"\n                        class="mb-2">{{ \'order.list.conditions.orderDateThrough\' | translate }}</label>\n                    <input type="date" class="form-control" name="orderDateThrough" id="orderDateThrough"\n                        [(ngModel)]="conditions.orderDateThrough" placeholder="{{ moment().format(\'YYYY-MM-DD\') }}">\n                </div>\n                <div class="form-group col-md-3">\n                    <label for="confirmationNumber" class="mb-2">{{ \'common.confirmationNumber\' | translate }}</label>\n                    <input type="text" class="form-control" name="confirmationNumber" id="confirmationNumber"\n                        [(ngModel)]="conditions.confirmationNumber"\n                        placeholder="{{ \'common.confirmationNumber\' | translate }}">\n                </div>\n                <div class="form-group col-md-3">\n                    <label for="orderNumber" class="mb-2">{{ \'common.orderNumber\' | translate }}</label>\n                    <input type="text" class="form-control" name="orderNumber" id="orderNumber"\n                        [(ngModel)]="conditions.orderNumber" placeholder="{{ \'common.orderNumber\' | translate }}">\n                </div>\n            </div>\n            \x3c!-- <div class="form-row">\n                <div class="form-group col-md-6">\n                    <label for="familyName" class="mb-2">セイ</label>\n                    <input type="text" class="form-control" name="familyName" id="familyName" [(ngModel)]="conditions.customer.familyName"\n                        placeholder="セイ">\n                </div>\n                <div class="form-group col-md-6">\n                    <label for="givenName" class="mb-2">メイ</label>\n                    <input type="text" class="form-control" name="givenName" id="givenName" [(ngModel)]="conditions.customer.givenName"\n                        placeholder="メイ">\n                </div>\n            </div>\n            <div class="form-row">\n                <div class="form-group col-md-6">\n                    <label for="email" class="mb-2">メールアドレス</label>\n                    <input type="email" class="form-control" name="email" id="email" [(ngModel)]="conditions.customer.email"\n                        placeholder="メールアドレス">\n                </div>\n                <div class="form-group col-md-6">\n                    <label for="telephone" class="mb-2">電話番号（下4桁）</label>\n                    <input type="telephone" class="form-control" name="telephone" id="telephone" [(ngModel)]="conditions.customer.telephone"\n                        placeholder="電話番号">\n                </div>\n            </div> --\x3e\n            <div class="form-row">\n                <div class="form-group col-md-3">\n                    <label for="sellerId" class="mb-2">{{ \'common.theater\' | translate }}</label>\n                    <select class="form-control" name="sellerId" id="sellerId" [(ngModel)]="conditions.sellerId">\n                        <option [value]="\'\'">{{ \'common.all\' | translate }}</option>\n                        <option *ngFor="let theater of (master | async).sellers" [value]="theater.id">{{\n                            theater.name | changeLanguage }}</option>\n                    </select>\n                </div>\n                <div class="form-group col-md-3">\n                    <label for="orderStatus" class="mb-2">{{ \'common.orderStatus\' | translate }}</label>\n                    <select class="form-control" name="orderStatus" id="orderStatus"\n                        [(ngModel)]="conditions.orderStatuses">\n                        <option [value]="\'\'">{{ \'common.all\' | translate }}</option>\n                        \x3c!-- <option [value]="orderStatus.OrderCancelled">{{ \'order.list.orderStatus.orderCancelled\' | translate }}</option> --\x3e\n                        <option [value]="orderStatus.OrderDelivered">\n                            {{ \'order.list.orderStatus.orderDelivered\' | translate }}</option>\n                        \x3c!-- <option [value]="orderStatus.OrderPaymentDue">{{ \'order.list.orderStatus.orderPaymentDue\' | translate }}</option> --\x3e\n                        \x3c!-- <option [value]="orderStatus.OrderPickupAvailable">{{ \'order.list.orderStatus.orderPickupAvailable\' | translate }}</option> --\x3e\n                        \x3c!-- <option [value]="orderStatus.OrderProblem">{{ \'order.list.orderStatus.orderProblem\' | translate }}</option> --\x3e\n                        <option [value]="orderStatus.OrderProcessing">\n                            {{ \'order.list.orderStatus.orderProcessing\' | translate }}</option>\n                        <option [value]="orderStatus.OrderReturned">\n                            {{ \'order.list.orderStatus.orderReturned\' | translate }}</option>\n                    </select>\n                </div>\n            </div>\n            <div class="buttons mx-auto text-center">\n                <button type="submit" class="btn btn-primary btn-block py-3"\n                    [disabled]="isLoading | async">{{ \'order.list.search\' | translate }}</button>\n            </div>\n        </form>\n    </div>\n    <p *ngIf="(order | async).orders.length === 0">{{ \'order.list.notfound\' | translate }}</p>\n\n    <div *ngIf="(order | async).orders.length > 0">\n        <div class="d-md-flex align-items-center justify-content-between mb-4">\n            <div class="text-md-right text-center mb-3 mb-md-0 order-2">\n                <div class="d-inline-block">\n                    <pagination [(ngModel)]="confirmedConditions.page" [totalItems]="(order | async).pageCount * 10"\n                        [maxSize]="5" [boundaryLinks]="false" (pageChanged)="orderSearch(false, $event)"\n                        previousText="&lsaquo;" nextText="&rsaquo;" firstText="&laquo;" lastText="&raquo;"></pagination>\n                </div>\n            </div>\n            <div class="form-group text-center text-md-left mb-3 mb-md-0 order-1">\n                <select class="form-control d-inline-block w-auto mr-2" name="actionSelect" id="actionSelect"\n                    [(ngModel)]="actionSelect">\n                    <option value="">{{ \'order.list.unselected\' | translate }}</option>\n                    <option [value]="OrderActions.Cancel">{{ \'order.list.cancel\' | translate }}</option>\n                </select>\n                <button type="button" class="btn btn-primary py-2 px-4"\n                    (click)="selecedtAction()">{{ \'order.list.apply\' | translate }}</button>\n            </div>\n        </div>\n\n        <div class="scroll-horizontal">\n            <table class="table bg-white border text-small mb-0">\n                <thead>\n                    <tr>\n                        <th scope="col"></th>\n                        <th scope="col">{{ \'common.orderDate\' | translate }}</th>\n                        <th scope="col">{{ \'common.confirmationNumber\' | translate }}</th>\n                        <th scope="col">{{ \'common.event\' | translate }}</th>\n                        <th scope="col">{{ \'common.customer\' | translate }}</th>\n                        \x3c!-- <th scope="col">決済方法</th> --\x3e\n                        \x3c!-- <th scope="col">注文ステータス</th> --\x3e\n                        <th scope="col"></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr *ngFor="let order of (order | async).orders let index = index"\n                        [class.bg-light-gray]="index % 2 === 0">\n                        <td class="align-middle text-large text-center">\n                            <i *ngIf="!isSelected(order)" class="far fa-square pointer" (click)="addOrder(order)"></i>\n                            <i *ngIf="isSelected(order)" class="far fa-check-square pointer"\n                                (click)="removeOrder(order)"></i>\n                        </td>\n                        <td class="align-middle">\n                            <p>{{ order.orderDate | formatDate: \'YYYY/MM/DD (ddd) HH:mm\' }}</p>\n                        </td>\n                        <td class="align-middle">{{ order.confirmationNumber }}</td>\n                        <td class="align-middle">\n                            <div *ngFor="let acceptedOffer of order.acceptedOffers">\n                                <p *ngIf="(acceptedOffer.itemOffered.reservationFor.name | changeLanguage).length > 10">{{\n                                    acceptedOffer.itemOffered.reservationFor.name | changeLanguage | slice:0:10 }}</p>\n                                <p\n                                    *ngIf="!((acceptedOffer.itemOffered.reservationFor.name | changeLanguage).length > 10)">{{\n                                    acceptedOffer.itemOffered.reservationFor.name | changeLanguage }}</p>\n                                <p>\n                                    <span class="theatre-name">{{ acceptedOffer.itemOffered.reservationFor.superEvent.location.name | changeLanguage }}</span>\n                                    <span class="screen-name">&nbsp;/&nbsp;{{ acceptedOffer.itemOffered.reservationFor.location.name | changeLanguage }}</span>\n                                </p>\n                                <p>{{ acceptedOffer.itemOffered.reservationFor.startDate | formatDate: \'YYYY/MM/DD (ddd) HH:mm\' }}\n                                    -</p>\n                            </div>\n                        </td>\n                        <td class="align-middle">{{ order.customer.familyName }} {{ order.customer.givenName }}</td>\n                        \x3c!-- <td class="align-middle">\n                            <div *ngFor="let paymentMethod of order.paymentMethods">\n                                <p>{{ paymentMethod.name }}</p>\n                            </div>\n                        </td> --\x3e\n                        \x3c!-- <td class="align-middle">\n                            {{ order.orderStatus }}\n                        </td> --\x3e\n                        <td class="align-middle">\n                            <button class="btn btn-primary mr-2" (click)="openDetail(order)"><i\n                                    class="fas fa-search-plus"></i></button>\n                            <button [disabled]="order.orderStatus !== orderStatus.OrderDelivered"\n                                class="btn btn-primary mr-2" (click)="openQrCode(order)"><i\n                                    class="fas fa-qrcode"></i></button>\n                            <button\n                                [disabled]="order.orderStatus !== orderStatus.OrderDelivered && order.orderStatus === orderStatus.OrderReturned"\n                                class="btn btn-primary" (click)="cancelConfirm([order])"><i\n                                    class="fas fa-trash-alt"></i></button>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n\n\n    </div>\n</div>'}}]);