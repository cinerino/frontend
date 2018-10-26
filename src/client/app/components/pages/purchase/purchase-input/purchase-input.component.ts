import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as libphonenumber from 'libphonenumber-js';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ActionTypes, AuthorizeCreditCard, AuthorizeMovieTicket, RegisterContact } from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { AlertModalComponent } from '../../../parts/alert-modal/alert-modal.component';

@Component({
    selector: 'app-purchase-input',
    templateUrl: './purchase-input.component.html',
    styleUrls: ['./purchase-input.component.scss']
})
export class PurchaseInputComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public customerContactForm: FormGroup;
    public paymentForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public amount: number;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private modal: NgbModal,
        private formBuilder: FormBuilder
    ) { }

    public ngOnInit() {
        this.amount = 0;
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.purchase.subscribe((purchase) => {
            if (purchase.authorizeSeatReservation === undefined
                || purchase.authorizeSeatReservation.result === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.amount = purchase.authorizeSeatReservation.result.price;
        }).unsubscribe();
        this.createCustomerContactForm();
        this.createPaymentForm();
        if (environment.ENV === 'local') {
            this.customerContactForm.controls.familyName.setValue('ハタグチ');
            this.customerContactForm.controls.givenName.setValue('アキト');
            this.customerContactForm.controls.email.setValue('hataguchi@motionpicture.jp');
            this.customerContactForm.controls.telephone.setValue('0362778824');
            this.paymentForm.controls.cardNumber.setValue('4111111111111111');
            this.paymentForm.controls.securityCode.setValue('123');
            this.paymentForm.controls.holderName.setValue('HATAGUCHI');
        }
    }

    private createCustomerContactForm() {
        const NAME_MAX_LENGTH = 12;
        const MAIL_MAX_LENGTH = 50;
        const TEL_MAX_LENGTH = 11;
        const TEL_MIN_LENGTH = 9;
        this.customerContactForm = this.formBuilder.group({
            familyName: ['', [
                Validators.required,
                Validators.maxLength(NAME_MAX_LENGTH),
                Validators.pattern(/^[ァ-ヶー]+$/)
            ]],
            givenName: ['', [
                Validators.required,
                Validators.maxLength(NAME_MAX_LENGTH),
                Validators.pattern(/^[ァ-ヶー]+$/)
            ]],
            email: ['', [
                Validators.required,
                Validators.maxLength(MAIL_MAX_LENGTH),
                Validators.email
            ]],
            telephone: ['', [
                Validators.required,
                Validators.maxLength(TEL_MAX_LENGTH),
                Validators.minLength(TEL_MIN_LENGTH),
                Validators.pattern(/^[0-9]+$/),
                (control: AbstractControl): ValidationErrors | null => {
                    const field = control.root.get('telephone');
                    if (field !== null) {
                        const parsedNumber = libphonenumber.parse(field.value, 'JP');
                        if (parsedNumber.phone === undefined) {
                            return { telephone: true };
                        }
                        const isValid = libphonenumber.isValidNumber(parsedNumber);
                        if (!isValid) {
                            return { telephone: true };
                        }
                    }

                    return null;
                }
            ]]
        });
    }

    private createPaymentForm() {
        this.cardExpiration = {
            year: [],
            month: []
        };
        for (let i = 0; i < 12; i++) {
            this.cardExpiration.month.push(`0${String(i + 1)}`.slice(-2));
        }
        for (let i = 0; i < 10; i++) {
            this.cardExpiration.year.push(moment().add(i, 'year').format('YYYY'));
        }
        this.paymentForm = this.formBuilder.group({
            cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            cardExpirationMonth: [this.cardExpiration.month[0], [Validators.required]],
            cardExpirationYear: [this.cardExpiration.year[0], [Validators.required]],
            securityCode: ['', [Validators.required]],
            holderName: ['', [Validators.required]]
        });
    }

    public onSubmit() {
        Object.keys(this.customerContactForm.controls).forEach((key) => {
            this.customerContactForm.controls[key].markAsTouched();
        });
        Object.keys(this.paymentForm.controls).forEach((key) => {
            this.paymentForm.controls[key].markAsTouched();
        });
        if (this.customerContactForm.invalid) {
            this.openAlert({
                title: 'エラー',
                body: '購入者情報に誤りがあります。'
            });
            return;
        }
        if (this.amount > 0 && this.paymentForm.invalid) {
            this.openAlert({
                title: 'エラー',
                body: '決済情報に誤りがあります。'
            });
            return;
        }

        this.registerContact();
    }

    /**
     * registerContact
     */
    private registerContact() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const transaction = purchase.transaction;
            const contact = {
                givenName: this.customerContactForm.controls.givenName.value,
                familyName: this.customerContactForm.controls.familyName.value,
                telephone: this.customerContactForm.controls.telephone.value,
                email: this.customerContactForm.controls.email.value,
            };
            this.store.dispatch(new RegisterContact({ transaction, contact }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.RegisterContactSuccess),
            tap(() => {
                this.purchase.subscribe((purchase) => {
                    const movieTickets = purchase.reservations.filter(reservation => reservation.isMovieTicket());
                    if (movieTickets.length > 0) {
                        this.authorizeMovieTicket();
                    } else {
                        this.authorizeCreditCard();
                    }
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.RegisterContactFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * authorizeCreditCard
     */
    private authorizeCreditCard() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined
                || purchase.movieTheater === undefined
                || purchase.authorizeSeatReservation === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new AuthorizeCreditCard({
                transaction: purchase.transaction,
                movieTheater: purchase.movieTheater,
                authorizeSeatReservation: purchase.authorizeSeatReservation,
                authorizeCreditCardPayment: purchase.authorizeCreditCardPayment,
                orderCount: purchase.orderCount,
                amount: this.amount,
                method: '1',
                creditCard: {
                    cardno: this.paymentForm.controls.cardNumber.value,
                    expire: `${this.paymentForm.controls.cardExpirationYear.value}${this.paymentForm.controls.cardExpirationMonth.value}`,
                    holderName: this.paymentForm.controls.holderName.value,
                    securityCode: this.paymentForm.controls.securityCode.value
                }
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.AuthorizeCreditCardSuccess),
            tap(() => {
                this.router.navigate(['/purchase/confirm']);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.AuthorizeCreditCardFail),
            tap(() => {
                this.openAlert({
                    title: 'エラー',
                    body: 'クレジットカード情報を確認してください。'
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * authorizeMovieTicket
     */
    private authorizeMovieTicket() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined
                || purchase.screeningEvent === undefined
                || purchase.authorizeSeatReservation === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new AuthorizeMovieTicket({
                transaction: purchase.transaction,
                authorizeMovieTicketPayment: purchase.authorizeMovieTicketPayment,
                authorizeSeatReservation: purchase.authorizeSeatReservation,
                reservations: purchase.reservations
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.AuthorizeMovieTicketSuccess),
            tap(() => {
                if (this.amount > 0) {
                    this.authorizeCreditCard();
                    return;
                }
                this.router.navigate(['/purchase/confirm']);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.AuthorizeMovieTicketFail),
            tap(() => {
                this.openAlert({
                    title: 'エラー',
                    body: 'ムビチケ情報を確認してください。'
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    public openAlert(args: {
        title: string;
        body: string;
    }) {
        const modalRef = this.modal.open(AlertModalComponent, {
            centered: true
        });
        modalRef.componentInstance.title = args.title;
        modalRef.componentInstance.body = args.body;
    }

}
