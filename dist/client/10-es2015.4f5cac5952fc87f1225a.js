(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"+NJH":function(e,t,n){"use strict";n.r(t),t.default='<app-loading [isLoading]="true" process="process.authAction.CheckLogin"></app-loading>'},"92n9":function(e,t,n){"use strict";n.r(t),t.default=""},Sq0r:function(e,t,n){"use strict";n.r(t),t.default='<app-loading [isLoading]="true" [process]="process | async"></app-loading>'},bfiW:function(e,t,n){"use strict";n.r(t),t.default=""},hN61:function(e,t,n){"use strict";n.r(t),t.default=""},jycc:function(e,t,n){"use strict";n.r(t),t.default='<app-loading [isLoading]="true" process="process.authAction.Logout"></app-loading>'},k0tg:function(e,t,n){"use strict";n.r(t),n.d(t,"AuthModule",(function(){return _}));var r=n("2kYt"),o=n("EM62"),c=n("DSWM"),i=n("sEIs"),a=n("x8Mb"),s=n("cHUu"),l=function(e,t,n,r){var o,c=arguments.length,i=c<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(i=(c<3?o(i):c>3?o(t,n,i):o(t,n))||i);return c>3&&i&&Object.defineProperty(t,n,i),i},f=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},u=function(e,t,n,r){return new(n||(n=Promise))((function(o,c){function i(e){try{s(r.next(e))}catch(t){c(t)}}function a(e){try{s(r.throw(e))}catch(t){c(t)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}s((r=r.apply(e,t||[])).next())}))},p=function(e){return e&&e.__esModule?e:{default:e}};let d=class{constructor(e){this.cinerino=e}ngOnInit(){return u(this,void 0,void 0,(function*(){const e=a.a.Util.getExternalData();sessionStorage.setItem("EXTERNAL",JSON.stringify(Object.assign(Object.assign({},e),{redirectUrl:void 0})));const t=void 0===e.redirectUrl?void 0:atob(e.redirectUrl);yield this.cinerino.signIn({redirectUrl:t})}))}};d.ctorParameters=()=>[{type:s.b}],d=l([Object(o.n)({selector:"app-auth-index",template:p(n("+NJH")).default,styles:[p(n("bfiW")).default]}),f("design:paramtypes",[s.b])],d);var g=n("sN6X"),h=n("PIN6"),y=n("mOXJ"),v=function(e,t,n,r){var o,c=arguments.length,i=c<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(i=(c<3?o(i):c>3?o(t,n,i):o(t,n))||i);return c>3&&i&&Object.defineProperty(t,n,i),i},R=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},b=function(e,t,n,r){return new(n||(n=Promise))((function(o,c){function i(e){try{s(r.next(e))}catch(t){c(t)}}function a(e){try{s(r.throw(e))}catch(t){c(t)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}s((r=r.apply(e,t||[])).next())}))},m=function(e){return e&&e.__esModule?e:{default:e}};let O=class{constructor(e,t,n){this.router=e,this.actionService=t,this.store=n,this.environment=Object(h.a)()}ngOnInit(){return b(this,void 0,void 0,(function*(){this.process=this.store.pipe(Object(g.m)(y.e)),this.actionService.user.delete(),this.actionService.user.initialize({login:!0});try{const e=null===sessionStorage.getItem("REDIRECT_URL")?this.environment.BASE_URL:sessionStorage.getItem("REDIRECT_URL");if(sessionStorage.removeItem("REDIRECT_URL"),null===e)throw new Error("redirectUrl === null");location.href=e}catch(e){this.router.navigate(["/error"])}}))}};O.ctorParameters=()=>[{type:i.c},{type:s.a},{type:g.b}],O=v([Object(o.n)({selector:"app-auth-signin",template:m(n("Sq0r")).default,styles:[m(n("92n9")).default]}),R("design:paramtypes",[i.c,s.a,g.b])],O);var j=function(e,t,n,r){var o,c=arguments.length,i=c<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(i=(c<3?o(i):c>3?o(t,n,i):o(t,n))||i);return c>3&&i&&Object.defineProperty(t,n,i),i},w=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},S=function(e){return e&&e.__esModule?e:{default:e}};let U=class{constructor(e,t){this.router=e,this.actionService=t}ngOnInit(){this.actionService.order.delete(),this.actionService.purchase.delete(),this.actionService.user.delete();const e=null===sessionStorage.getItem("LOGOUT_URL")?"/":sessionStorage.getItem("LOGOUT_URL");sessionStorage.removeItem("LOGOUT_URL"),this.router.navigate([e])}};U.ctorParameters=()=>[{type:i.c},{type:s.a}],U=j([Object(o.n)({selector:"app-auth-signout",template:S(n("jycc")).default,styles:[S(n("hN61")).default]}),w("design:paramtypes",[i.c,s.a])],U);var I=function(e,t,n,r){var o,c=arguments.length,i=c<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(i=(c<3?o(i):c>3?o(t,n,i):o(t,n))||i);return c>3&&i&&Object.defineProperty(t,n,i),i};const L=[{path:"",component:d},{path:"signin",component:O},{path:"signout",component:U}];let P=class{};P=I([Object(o.K)({imports:[i.d.forChild(L)],exports:[i.d]})],P);var E=function(e,t,n,r){var o,c=arguments.length,i=c<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(i=(c<3?o(i):c>3?o(t,n,i):o(t,n))||i);return c>3&&i&&Object.defineProperty(t,n,i),i};let _=class{};_=E([Object(o.K)({declarations:[d,O,U],imports:[r.c,P,c.a]})],_)}}]);