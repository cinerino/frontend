import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { factory } from '@cinerino/api-javascript-client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ActionTypes, CheckMovieTicket } from '../../../store/actions/purchase.action';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-mvtk-check-modal',
    templateUrl: './mvtk-check-modal.component.html',
    styleUrls: ['./mvtk-check-modal.component.scss']
})
export class MvtkCheckModalComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public mvtkForm: FormGroup;
    public errorMessage: string;
    public isSuccess: boolean;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private formBuilder: FormBuilder,
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
        this.errorMessage = '';
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.createMvtkForm();
    }

    public createMvtkForm() {
        const CODE_LENGTH = 10;
        const PASSWORD_LENGTH = 4;
        this.mvtkForm = this.formBuilder.group({
            code: ['', [
                Validators.required,
                Validators.maxLength(CODE_LENGTH),
                Validators.minLength(CODE_LENGTH),
                Validators.pattern(/^[0-9]+$/)
            ]],
            password: ['', [
                Validators.required,
                Validators.maxLength(PASSWORD_LENGTH),
                Validators.minLength(PASSWORD_LENGTH),
                Validators.pattern(/^[0-9]+$/)
            ]]
        });
    }

    /**
     * checkMovieTicket
     */
    public checkMovieTicket() {
        Object.keys(this.mvtkForm.controls).forEach((key) => {
            this.mvtkForm.controls[key].markAsTouched();
        });
        if (this.mvtkForm.invalid) {
            return;
        }
        this.errorMessage = '';
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined
                || purchase.screeningEvent === undefined) {
                return;
            }
            this.store.dispatch(new CheckMovieTicket({
                transaction: purchase.transaction,
                movieTickets: [{
                    typeOf: factory.paymentMethodType.MovieTicket,
                    identifier: this.mvtkForm.controls.code.value, // 購入管理番号
                    accessCode: this.mvtkForm.controls.password.value // PINコード
                }],
                screeningEvent: purchase.screeningEvent
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.CheckMovieTicketSuccess),
            tap(() => {
                this.purchase.subscribe((purchase) => {
                    const checkMovieTicketAction = purchase.checkMovieTicketAction;
                    if (checkMovieTicketAction === undefined
                        || checkMovieTicketAction.result === undefined
                        || checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut === null
                        || checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut[0].ykknInfo === null) {
                        this.isSuccess = false;
                        this.errorMessage = 'ムビチケ情報をご確認ください';
                        return;
                    }
                    this.createMvtkForm();
                    this.isSuccess = true;
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.CheckMovieTicketFail),
            tap(() => {
                this.isSuccess = false;
                this.errorMessage = 'エラーが発生しました';
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
