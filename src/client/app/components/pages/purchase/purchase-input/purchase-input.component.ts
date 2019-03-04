import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as libphonenumber from 'libphonenumber-js';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { getAmount } from '../../../../functions';
import { ViewType } from '../../../../models';
import { LibphonenumberFormatPipe } from '../../../../pipes/libphonenumber-format.pipe';
import { UtilService } from '../../../../services';
import { ActionTypes, CreateGmoTokenObject, RegisterContact } from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { SecurityCodeModalComponent } from '../../../parts/security-code-modal/security-code-modal.component';

@Component({
    selector: 'app-purchase-input',
    templateUrl: './purchase-input.component.html',
    styleUrls: ['./purchase-input.component.scss']
})
export class PurchaseInputComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public customerContactForm: FormGroup;
    public paymentForm: FormGroup;
    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public amount: number;
    public environment = environment;
    public viewType: typeof ViewType = ViewType;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private modal: NgbModal,
        private formBuilder: FormBuilder,
        private util: UtilService,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.amount = 0;
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.createCustomerContactForm();
        this.createPaymentForm();
        this.purchase.subscribe((purchase) => {
            this.amount = getAmount(purchase.authorizeSeatReservations);
            if (purchase.customerContact !== undefined) {
                this.customerContactForm.controls.familyName.setValue(purchase.customerContact.familyName);
                this.customerContactForm.controls.givenName.setValue(purchase.customerContact.givenName);
                this.customerContactForm.controls.email.setValue(purchase.customerContact.email);
                this.customerContactForm.controls.telephone.setValue(
                    new LibphonenumberFormatPipe().transform(purchase.customerContact.telephone)
                );
                return;
            }
            this.user.subscribe((user) => {
                if (environment.ENV === 'local') {
                    this.customerContactForm.controls.familyName.setValue('ハタグチ');
                    this.customerContactForm.controls.givenName.setValue('アキト');
                    this.customerContactForm.controls.email.setValue('hataguchi@motionpicture.jp');
                    this.customerContactForm.controls.telephone.setValue('0362778824');
                    this.paymentForm.controls.cardNumber.setValue('4111111111111111');
                    this.paymentForm.controls.securityCode.setValue('123');
                    this.paymentForm.controls.holderName.setValue('HATAGUCHI');
                }
                if (user.isMember && user.profile !== undefined) {
                    this.customerContactForm.controls.familyName.setValue(user.profile.familyName);
                    this.customerContactForm.controls.givenName.setValue(user.profile.givenName);
                    this.customerContactForm.controls.email.setValue(user.profile.email);
                    this.customerContactForm.controls.telephone.setValue(
                        new LibphonenumberFormatPipe().transform(user.profile.telephone)
                    );
                }
            }).unsubscribe();
        }).unsubscribe();
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
        this.customerContactForm.controls.familyName.setValue((<HTMLInputElement>document.getElementById('familyName')).value);
        this.customerContactForm.controls.givenName.setValue((<HTMLInputElement>document.getElementById('givenName')).value);
        this.customerContactForm.controls.email.setValue((<HTMLInputElement>document.getElementById('email')).value);
        this.customerContactForm.controls.telephone.setValue((<HTMLInputElement>document.getElementById('telephone')).value);
        if (this.amount > 0) {
            this.paymentForm.controls.cardNumber.setValue((<HTMLInputElement>document.getElementById('cardNumber')).value);
            this.paymentForm.controls.securityCode.setValue((<HTMLInputElement>document.getElementById('securityCode')).value);
            this.paymentForm.controls.holderName.setValue((<HTMLInputElement>document.getElementById('holderName')).value);
        }
        if (this.customerContactForm.invalid) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.input.alert.customer')
            });
            return;
        }
        if (this.amount > 0 && this.paymentForm.invalid) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.input.alert.payment')
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
                if (this.amount > 0) {
                    this.createGmoTokenObject();
                } else {
                    this.router.navigate(['/purchase/confirm']);
                }
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
     * createGmoTokenObject
     */
    private createGmoTokenObject() {
        this.purchase.subscribe((purchase) => {
            if (purchase.seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new CreateGmoTokenObject({
                seller: purchase.seller,
                creditCard: {
                    cardno: this.paymentForm.controls.cardNumber.value,
                    expire: `${this.paymentForm.controls.cardExpirationYear.value}${this.paymentForm.controls.cardExpirationMonth.value}`,
                    holderName: this.paymentForm.controls.holderName.value,
                    securityCode: this.paymentForm.controls.securityCode.value
                }
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.CreateGmoTokenObjectSuccess),
            tap(() => {
                this.router.navigate(['/purchase/confirm']);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.CreateGmoTokenObjectFail),
            tap(() => {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.input.alert.gmoToken')
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    public openSecurityCode() {
        this.modal.open(SecurityCodeModalComponent, {
            centered: true
        });
    }

}
