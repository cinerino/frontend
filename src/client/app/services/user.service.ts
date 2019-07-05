import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { userAction } from '../store/actions';
import * as reducers from '../store/reducers';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public user: Observable<reducers.IUserState>;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions
    ) { }

    /**
     * マスタデータ取得
     */
    public async getData() {
        return new Promise<reducers.IUserState>((resolve) => {
            this.user.subscribe((user) => {
                resolve(user);
            }).unsubscribe();
        });
    }

    /**
     * データ削除
     */
    public delete() {
        this.store.dispatch(new userAction.Delete());
    }

    /**
     * 初期化
     */
    public initialize() {

    }

    /**
     * プロフィール初期化
     */
    public initializeProfile() {

    }

    /**
     * コイン口座初期化
     */
    public initializeCoinAccount() {

    }

    /**
     * 言語更新
     */
    public updateLanguage() {

    }

    /**
     * プロフィール更新
     */
    public updateProfile() {

    }

    /**
     * クレジットカード一覧取得
     */
    public getCreditCards() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.GetCreditCards());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.GetCreditCardsSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.GetCreditCardsFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード追加
     */
    public addCreditCard(params: {
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
        creditCard: {
            cardno: string;
            expire: string;
            holderName: string;
            securityCode: string;
        };
    }) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.AddCreditCard(params));
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.AddCreditCardSuccess),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.AddCreditCardFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード削除
     */
    public removeCreditCard(creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.RemoveCreditCard({ creditCard }));
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.RemoveCreditCardSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.RemoveCreditCardFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 基本設定更新
     */
    public updateBaseSetting() {

    }

    /**
     * コイン口座チャージ
     */
    public chargeCoin() {

    }

}
