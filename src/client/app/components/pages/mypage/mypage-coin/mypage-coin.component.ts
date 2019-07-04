import { Component, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UtilService } from '../../../../services';
import { userAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';
import { ChargeCoinModalComponent } from '../../../parts';

@Component({
    selector: 'app-mypage-coin',
    templateUrl: './mypage-coin.component.html',
    styleUrls: ['./mypage-coin.component.scss']
})
export class MypageCoinComponent implements OnInit {
    public user: Observable<reducers.IUserState>;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private modal: BsModalService,
        private translate: TranslateService,
        private utilService: UtilService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
    }

    /**
     * チャージ確認
     * @param creditCard
     */
    public openCharge(creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.modal.show(ChargeCoinModalComponent, {
            initialState: {
                cb: (charge: number) => {
                    this.chargeCoin({ charge, creditCard });
                }
            }
        });
    }

    /**
     * コインのチャージ処理
     * @param args
     */
    private chargeCoin(args: {
        charge: number;
        creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard
    }) {
        console.log(args);
        this.store.dispatch(new userAction.ChargeCoin({}));
        const success = this.actions.pipe(
            ofType(userAction.ActionTypes.ChargeCoinSuccess),
            tap(() => { })
        );
        const fail = this.actions.pipe(
            ofType(userAction.ActionTypes.ChargeCoinFail),
            tap(() => {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('mypage.coin.alert.charge')
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}

