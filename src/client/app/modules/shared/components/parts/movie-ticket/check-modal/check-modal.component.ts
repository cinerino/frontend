import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Functions } from '../../../../../..';
import { ActionService, QRCodeService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';
import { ChangeLanguagePipe } from '../../../../pipes/change-language.pipe';

type IMovieTicketTypeChargeSpecification =
    factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification>;

@Component({
    selector: 'app-movieticket-check-modal',
    templateUrl: './check-modal.component.html',
    styleUrls: ['./check-modal.component.scss'],
})
export class MovieTicketCheckModalComponent implements OnInit {
    @Input() public paymentMethodType: factory.chevre.paymentMethodType;
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public inputForm: FormGroup;
    public errorMessage: string;
    public isSuccess: boolean;
    public successMessage: string;

    public stream: MediaStream | null;
    public isShowVideo: boolean;
    public video: HTMLVideoElement;
    public scanLoop: any;
    constructor(
        public modal: BsModalRef,
        private store: Store<reducers.IState>,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private qrcodeService: QRCodeService,
        private actionService: ActionService
    ) {}

    public ngOnInit() {
        this.errorMessage = '';
        this.successMessage = '';
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.createMvtkForm();
    }

    public createMvtkForm() {
        const CODE_LENGTH = 10;
        // const PASSWORD_LENGTH = 4;
        const codeValidators =
            this.paymentMethodType === factory.paymentMethodType.MovieTicket
                ? [
                      Validators.required,
                      Validators.maxLength(CODE_LENGTH),
                      Validators.minLength(CODE_LENGTH),
                      Validators.pattern(/^[0-9]+$/),
                  ]
                : [Validators.required, Validators.pattern(/^[0-9a-zA-Z]+$/)];
        this.inputForm = this.formBuilder.group({
            code: ['', codeValidators],
            password: ['', [Validators.required]],
        });
    }

    /**
     * checkMovieTicket
     */
    public async checkMovieTicket() {
        Object.keys(this.inputForm.controls).forEach((key) => {
            this.inputForm.controls[key].markAsTouched();
        });
        this.inputForm.controls.code.setValue(
            (<HTMLInputElement>document.getElementById('code')).value
        );
        this.inputForm.controls.password.setValue(
            (<HTMLInputElement>document.getElementById('password')).value
        );

        if (this.inputForm.invalid) {
            return;
        }
        this.errorMessage = '';
        this.successMessage = '';
        try {
            await this.actionService.purchase.payment.checkMovieTicket({
                movieTicket: {
                    code: this.inputForm.controls.code.value,
                    password: this.inputForm.controls.password.value,
                },
                paymentMethodType: this.paymentMethodType,
            });
            const purchase = await this.actionService.purchase.getData();
            const checkMovieTicketAction = purchase.checkMovieTicketAction;
            if (
                checkMovieTicketAction === undefined ||
                checkMovieTicketAction.result === undefined ||
                checkMovieTicketAction.result.purchaseNumberAuthResult
                    .knyknrNoInfoOut === null
            ) {
                this.isSuccess = false;
                this.errorMessage = this.translate.instant(
                    'modal.movieTicket.check.alert.validation'
                );
                console.error('validation');
                return;
            }
            const knyknrNoInfoOut =
                checkMovieTicketAction.result.purchaseNumberAuthResult
                    .knyknrNoInfoOut;

            if (knyknrNoInfoOut[0].ykknmiNum === '0') {
                this.isSuccess = false;
                this.errorMessage = this.translate.instant(
                    'modal.movieTicket.check.alert.used'
                );
                console.error('used');
                return;
            }

            const knyknrNoMkujyuCd = knyknrNoInfoOut[0].knyknrNoMkujyuCd;
            if (knyknrNoMkujyuCd !== undefined && knyknrNoMkujyuCd !== '') {
                const message = new ChangeLanguagePipe(
                    this.translate
                ).transform(
                    Functions.Purchase.movieTicketAuthErroCodeToMessage(
                        knyknrNoMkujyuCd
                    )
                );
                this.isSuccess = false;
                this.errorMessage = `${this.translate.instant(
                    'modal.movieTicket.check.alert.validation'
                )}<br>
                [${knyknrNoMkujyuCd}] ${message}`;
                console.error('knyknrNoMkujyuCd');
                return;
            }

            this.createMvtkForm();
            const user = await this.actionService.user.getData();
            const screeningEventTicketOffers =
                purchase.screeningEventTicketOffers;
            const movieTicketTypeOffers =
                Functions.Purchase.getMovieTicketTypeOffers({
                    screeningEventTicketOffers,
                });
            this.successMessage = this.translate.instant(
                'modal.movieTicket.check.success'
            );
            knyknrNoInfoOut.forEach((k) => {
                if (k.ykknInfo === null) {
                    return;
                }
                k.ykknInfo.forEach((y) => {
                    movieTicketTypeOffers.forEach((m) => {
                        const movieTicketPriceComponent = <
                            IMovieTicketTypeChargeSpecification
                        >m.priceSpecification.priceComponent.find(
                            (p) =>
                                p.typeOf ===
                                factory.chevre.priceSpecificationType
                                    .MovieTicketTypeChargeSpecification
                        );
                        if (movieTicketPriceComponent === undefined) {
                            return;
                        }
                        const appliesToMovieTicketType =
                            movieTicketPriceComponent.appliesToMovieTicket
                                ?.serviceType;
                        if (appliesToMovieTicketType !== y.ykknshTyp) {
                            return;
                        }
                        const name =
                            movieTicketPriceComponent.name === undefined
                                ? ''
                                : typeof movieTicketPriceComponent.name ===
                                  'string'
                                ? typeof movieTicketPriceComponent.name
                                : (user.language === 'ja' ||
                                      user.language === 'en' ||
                                      user.language === 'kr') &&
                                  movieTicketPriceComponent.name[
                                      user.language
                                  ] !== undefined
                                ? movieTicketPriceComponent.name[user.language]
                                : '';
                        const value = this.translate.instant(
                            'modal.movieTicket.check.value',
                            { value: y.ykknKnshbtsmiNum }
                        );
                        this.successMessage += `<br>${name} ${value}`;
                    });
                });
            });
            this.isSuccess = true;
        } catch (error) {
            console.error(error);
            this.isSuccess = false;
            this.errorMessage = this.translate.instant(
                'modal.movieTicket.check.alert.error'
            );
        }
    }

    public openQRReader() {
        this.qrcodeService.openQRCodeReader({
            cb: (data: string) => {
                const separation =
                    this.paymentMethodType ===
                    factory.paymentMethodType.MovieTicket
                        ? 10
                        : 9;
                const code = data.slice(0, separation);
                const password = data.slice(separation, data.length);
                this.inputForm.controls.code.setValue(code);
                this.inputForm.controls.password.setValue(password);
            },
        });
    }
}
