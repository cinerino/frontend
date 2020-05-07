function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-setting-setting-module"], {
  /***/
  "./app/modules/setting/pages/setting/setting.component.ts":
  /*!****************************************************************!*\
    !*** ./app/modules/setting/pages/setting/setting.component.ts ***!
    \****************************************************************/

  /*! exports provided: SettingComponent */

  /***/
  function appModulesSettingPagesSettingSettingComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SettingComponent", function () {
      return SettingComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/forms */
    "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "../../node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @ngrx/store */
    "../../node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @ngx-translate/core */
    "../../node_modules/@ngx-translate/core/__ivy_ngcc__/fesm2015/ngx-translate-core.js");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../../../../../environments/environment */
    "./environments/environment.ts");
    /* harmony import */


    var _models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../../../../models */
    "./app/models/index.ts");
    /* harmony import */


    var _services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ../../../../services */
    "./app/services/index.ts");
    /* harmony import */


    var _store_reducers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ../../../../store/reducers */
    "./app/store/reducers/index.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/common */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _shared_pipes_change_language_pipe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ../../../shared/pipes/change-language.pipe */
    "./app/modules/shared/pipes/change-language.pipe.ts");

    var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    function SettingComponent_form_6_option_15_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 23);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "changeLanguage");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var theater_r6 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", theater_r6.branchCode);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, theater_r6.name));
      }
    }

    function SettingComponent_form_6_option_29_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 23);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var pos_r7 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", pos_r7.id);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](pos_r7.name);
      }
    }

    function SettingComponent_form_6_option_40_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 23);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var printer_r8 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", printer_r8.connectionType);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, printer_r8.name), "");
      }
    }

    function SettingComponent_form_6_button_41_Template(rf, ctx) {
      if (rf & 1) {
        var _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 24);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingComponent_form_6_button_41_Template_button_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r10);

          var ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r9.print();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, "setting.testPrinting"));
      }
    }

    function SettingComponent_form_6_div_49_p_1_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 27);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, "form.validation.required"), "");
      }
    }

    function SettingComponent_form_6_div_49_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 25);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SettingComponent_form_6_div_49_p_1_Template, 3, 3, "p", 26);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r5.baseForm.controls.printerIpAddress.errors.required);
      }
    }

    function SettingComponent_form_6_Template(rf, ctx) {
      if (rf & 1) {
        var _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "form", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](6, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "span", 9);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](9, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "select", 11);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function SettingComponent_form_6_Template_select_change_11_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);

          var ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r12.changePosList();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "option", 12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](14, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](15, SettingComponent_form_6_option_15_Template, 3, 4, "option", 13);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "p", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](20, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "span", 9);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](23, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "select", 14);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "option", 12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](28, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](29, SettingComponent_form_6_option_29_Template, 2, 2, "option", 13);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "p", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](34, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "select", 15);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "option", 12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](39, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](40, SettingComponent_form_6_option_40_Template, 3, 4, "option", 13);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](41, SettingComponent_form_6_button_41_Template, 3, 3, "button", 16);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](46, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](48, "input", 17);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](49, SettingComponent_form_6_div_49_Template, 2, 1, "div", 18);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "p", 19);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](52, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 20);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "button", 21);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingComponent_form_6_Template_button_click_54_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);

          var ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r14.updateBase();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](55, "async");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](57, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "button", 22);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](60, "translate");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r0.baseForm);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](6, 20, "common.theater"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](9, 22, "common.required"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](14, 24, "setting.unselected"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.theaters);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](20, 26, "setting.pos"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](23, 28, "common.required"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](28, 30, "setting.unselected"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.posList);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](34, 32, "setting.printer"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](39, 34, "setting.unselected"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.printers);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.baseForm.controls.printerType.value && ctx_r0.baseForm.controls.printerType.value !== ctx_r0.connectionType.None);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](46, 36, "setting.printerIpAddress"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.baseForm.controls.printerIpAddress.invalid && ctx_r0.baseForm.controls.printerIpAddress.touched);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](52, 38, "setting.printerIpAddressDescription"), " ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](55, 40, ctx_r0.isLoading));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](57, 42, "setting.next"));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", ctx_r0.environment.BASE_URL);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](60, 44, "setting.prev"));
      }
    }

    var SettingComponent = /*#__PURE__*/function () {
      function SettingComponent(store, utilService, masterService, userService, formBuilder, translate, orderService, router) {
        _classCallCheck(this, SettingComponent);

        this.store = store;
        this.utilService = utilService;
        this.masterService = masterService;
        this.userService = userService;
        this.formBuilder = formBuilder;
        this.translate = translate;
        this.orderService = orderService;
        this.router = router;
        this.viewType = _models__WEBPACK_IMPORTED_MODULE_6__["ViewType"];
        this.printers = _models__WEBPACK_IMPORTED_MODULE_6__["printers"];
        this.connectionType = _models__WEBPACK_IMPORTED_MODULE_6__["connectionType"];
        this.environment = Object(_environments_environment__WEBPACK_IMPORTED_MODULE_5__["getEnvironment"])();
      }

      _createClass(SettingComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    this.isLoading = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_8__["getLoading"]));
                    this.user = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_8__["getUser"]));
                    this.error = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(_store_reducers__WEBPACK_IMPORTED_MODULE_8__["getError"]));
                    this.theaters = [];
                    _context.prev = 4;
                    _context.next = 7;
                    return this.masterService.getTheaters();

                  case 7:
                    this.theaters = _context.sent;
                    _context.next = 10;
                    return this.createBaseForm();

                  case 10:
                    _context.next = 16;
                    break;

                  case 12:
                    _context.prev = 12;
                    _context.t0 = _context["catch"](4);
                    console.error(_context.t0);
                    this.router.navigate(['/error']);

                  case 16:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this, [[4, 12]]);
          }));
        }
      }, {
        key: "createBaseForm",
        value: function createBaseForm() {
          return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var user;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    this.baseForm = this.formBuilder.group({
                      theaterBranchCode: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                      posId: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                      printerType: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                      printerIpAddress: ['']
                    });
                    _context2.next = 3;
                    return this.userService.getData();

                  case 3:
                    user = _context2.sent;

                    if (user.theater !== undefined) {
                      this.baseForm.controls.theaterBranchCode.setValue(user.theater.branchCode);
                      this.changePosList();
                    }

                    if (user.pos !== undefined) {
                      this.baseForm.controls.posId.setValue(user.pos.id);
                    }

                    if (user.printer !== undefined) {
                      this.baseForm.controls.printerType.setValue(user.printer.connectionType);
                      this.baseForm.controls.printerIpAddress.setValue(user.printer.ipAddress);
                    }

                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));
        }
        /**
         * POS変更
         */

      }, {
        key: "changePosList",
        value: function changePosList() {
          this.baseForm.controls.posId.setValue('');
          var theaterBranchCode = this.baseForm.controls.theaterBranchCode.value;

          if (theaterBranchCode === '') {
            this.posList = [];
            return;
          }

          var findResult = this.theaters.find(function (t) {
            return t.branchCode === theaterBranchCode;
          });

          if (findResult === undefined) {
            this.posList = [];
            return;
          }

          this.posList = findResult.hasPOS === undefined ? [] : findResult.hasPOS;
        }
        /**
         * 更新
         */

      }, {
        key: "updateBase",
        value: function updateBase() {
          return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var _this = this;

            var theaterBranchCode, posId, theater, pos;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    Object.keys(this.baseForm.controls).forEach(function (key) {
                      _this.baseForm.controls[key].markAsTouched();
                    });

                    if (!this.baseForm.invalid) {
                      _context3.next = 4;
                      break;
                    }

                    this.utilService.openAlert({
                      title: this.translate.instant('common.error'),
                      body: this.translate.instant('setting.alert.validation')
                    });
                    return _context3.abrupt("return");

                  case 4:
                    _context3.prev = 4;
                    theaterBranchCode = this.baseForm.controls.theaterBranchCode.value;
                    posId = this.baseForm.controls.posId.value;
                    theater = this.theaters.find(function (t) {
                      return t.branchCode === theaterBranchCode;
                    });

                    if (!(theater === undefined || theater.hasPOS === undefined)) {
                      _context3.next = 10;
                      break;
                    }

                    throw new Error('theater not found').message;

                  case 10:
                    pos = theater.hasPOS.find(function (p) {
                      return p.id === posId;
                    });

                    if (!(pos === undefined)) {
                      _context3.next = 13;
                      break;
                    }

                    throw new Error('pos not found').message;

                  case 13:
                    this.userService.updateBaseSetting({
                      pos: pos,
                      theater: theater,
                      printer: {
                        ipAddress: this.baseForm.controls.printerIpAddress.value,
                        connectionType: this.baseForm.controls.printerType.value
                      }
                    });
                    this.utilService.openAlert({
                      title: this.translate.instant('common.complete'),
                      body: this.translate.instant('setting.alert.success')
                    });
                    _context3.next = 20;
                    break;

                  case 17:
                    _context3.prev = 17;
                    _context3.t0 = _context3["catch"](4);
                    console.error(_context3.t0);

                  case 20:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this, [[4, 17]]);
          }));
        }
      }, {
        key: "print",
        value: function print() {
          return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var printer;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.prev = 0;
                    printer = {
                      connectionType: this.baseForm.controls.printerType.value,
                      ipAddress: this.baseForm.controls.printerIpAddress.value
                    };
                    _context4.next = 4;
                    return this.orderService.print({
                      orders: [],
                      printer: printer
                    });

                  case 4:
                    _context4.next = 10;
                    break;

                  case 6:
                    _context4.prev = 6;
                    _context4.t0 = _context4["catch"](0);
                    console.error(_context4.t0);
                    this.utilService.openAlert({
                      title: this.translate.instant('common.error'),
                      body: "\n                <p class=\"mb-4\">".concat(this.translate.instant('setting.alert.print'), "</p>\n                <div class=\"p-3 bg-light-gray select-text error\">\n                    <code>").concat(_context4.t0, "</code>\n                </div>")
                    });

                  case 10:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this, [[0, 6]]);
          }));
        }
        /**
         * プリンター変更
         */

      }, {
        key: "changePrinterType",
        value: function changePrinterType() {
          if (this.baseForm.controls.printerType.value === _models__WEBPACK_IMPORTED_MODULE_6__["connectionType"].StarBluetooth) {
            this.baseForm.controls.printerIpAddress.setValue(this.translate.instant('setting.starBluetoothAddress'));
          }
        }
      }]);

      return SettingComponent;
    }();

    SettingComponent.ɵfac = function SettingComponent_Factory(t) {
      return new (t || SettingComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services__WEBPACK_IMPORTED_MODULE_7__["UtilService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services__WEBPACK_IMPORTED_MODULE_7__["MasterService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services__WEBPACK_IMPORTED_MODULE_7__["UserService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services__WEBPACK_IMPORTED_MODULE_7__["OrderService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]));
    };

    SettingComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: SettingComponent,
      selectors: [["app-setting"]],
      decls: 7,
      vars: 7,
      consts: [[1, "contents-width", "mx-auto", "px-3", "py-5"], [1, "text-large", "mb-4", "text-center", "font-weight-bold"], [1, "mb-4", "text-md-center", 3, "innerHTML"], [3, "formGroup", 4, "ngIf"], [3, "formGroup"], [1, "mb-4", "p-3", "bg-white"], [1, "form-group"], [1, "row", "align-items-center"], [1, "col-md-4", "py-2", "text-md-right"], [1, "badge", "badge-danger", "ml-2"], [1, "col-md-8"], ["formControlName", "theaterBranchCode", 1, "form-control", 3, "change"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "posId", 1, "form-control"], ["formControlName", "printerType", 1, "form-control"], ["type", "button", "class", "btn btn-sm btn-primary py-2 mt-2", 3, "click", 4, "ngIf"], ["type", "text", "formControlName", "printerIpAddress", "placeholder", "0.0.0.0", 1, "form-control"], ["class", "mt-2", 4, "ngIf"], [1, "text-small", "mt-2"], [1, "buttons", "mx-auto", "text-center"], ["type", "submit", 1, "btn", "btn-primary", "btn-block", "py-3", "mb-3", 3, "disabled", "click"], ["type", "button", 1, "btn", "btn-link", 3, "routerLink"], [3, "value"], ["type", "button", 1, "btn", "btn-sm", "btn-primary", "py-2", "mt-2", 3, "click"], [1, "mt-2"], ["class", "text-danger", 4, "ngIf"], [1, "text-danger"]],
      template: function SettingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h2", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "p", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](5, "translate");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, SettingComponent_form_6_Template, 61, 46, "form", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 3, "setting.title"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("innerHTML", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](5, 5, "setting.read"), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeHtml"]);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.baseForm);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["SelectControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgSelectOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_x"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgForOf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLink"]],
      pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslatePipe"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["AsyncPipe"], _shared_pipes_change_language_pipe__WEBPACK_IMPORTED_MODULE_10__["ChangeLanguagePipe"]],
      styles: [""]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SettingComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-setting',
          templateUrl: './setting.component.html',
          styleUrls: ['./setting.component.scss']
        }]
      }], function () {
        return [{
          type: _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"]
        }, {
          type: _services__WEBPACK_IMPORTED_MODULE_7__["UtilService"]
        }, {
          type: _services__WEBPACK_IMPORTED_MODULE_7__["MasterService"]
        }, {
          type: _services__WEBPACK_IMPORTED_MODULE_7__["UserService"]
        }, {
          type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]
        }, {
          type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__["TranslateService"]
        }, {
          type: _services__WEBPACK_IMPORTED_MODULE_7__["OrderService"]
        }, {
          type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./app/modules/setting/setting-routing.module.ts":
  /*!*******************************************************!*\
    !*** ./app/modules/setting/setting-routing.module.ts ***!
    \*******************************************************/

  /*! exports provided: SettingRoutingModule */

  /***/
  function appModulesSettingSettingRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SettingRoutingModule", function () {
      return SettingRoutingModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "../../node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _shared_components_pages_base_base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ../shared/components/pages/base/base.component */
    "./app/modules/shared/components/pages/base/base.component.ts");
    /* harmony import */


    var _pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./pages/setting/setting.component */
    "./app/modules/setting/pages/setting/setting.component.ts");

    var routes = [{
      path: '',
      component: _shared_components_pages_base_base_component__WEBPACK_IMPORTED_MODULE_2__["BaseComponent"],
      children: [{
        path: '',
        component: _pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__["SettingComponent"]
      }]
    }];

    var SettingRoutingModule = function SettingRoutingModule() {
      _classCallCheck(this, SettingRoutingModule);
    };

    SettingRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: SettingRoutingModule
    });
    SettingRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function SettingRoutingModule_Factory(t) {
        return new (t || SettingRoutingModule)();
      },
      imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](SettingRoutingModule, {
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SettingRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./app/modules/setting/setting.module.ts":
  /*!***********************************************!*\
    !*** ./app/modules/setting/setting.module.ts ***!
    \***********************************************/

  /*! exports provided: SettingModule */

  /***/
  function appModulesSettingSettingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SettingModule", function () {
      return SettingModule;
    });
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/common */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ../shared/shared.module */
    "./app/modules/shared/shared.module.ts");
    /* harmony import */


    var _pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./pages/setting/setting.component */
    "./app/modules/setting/pages/setting/setting.component.ts");
    /* harmony import */


    var _setting_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./setting-routing.module */
    "./app/modules/setting/setting-routing.module.ts");

    var SettingModule = function SettingModule() {
      _classCallCheck(this, SettingModule);
    };

    SettingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: SettingModule
    });
    SettingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      factory: function SettingModule_Factory(t) {
        return new (t || SettingModule)();
      },
      imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _setting_routing_module__WEBPACK_IMPORTED_MODULE_4__["SettingRoutingModule"], _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"]]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](SettingModule, {
        declarations: [_pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__["SettingComponent"]],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _setting_routing_module__WEBPACK_IMPORTED_MODULE_4__["SettingRoutingModule"], _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](SettingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
          declarations: [_pages_setting_setting_component__WEBPACK_IMPORTED_MODULE_3__["SettingComponent"]],
          imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _setting_routing_module__WEBPACK_IMPORTED_MODULE_4__["SettingRoutingModule"], _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"]]
        }]
      }], null, null);
    })();
    /***/

  }
}]);