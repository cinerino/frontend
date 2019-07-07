import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IPrinter, ViewType } from '../models';
import { userAction } from '../store/actions';
import * as reducers from '../store/reducers';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public user: Observable<reducers.IUserState>;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private translate: TranslateService
    ) {
        this.user = this.store.pipe(select(reducers.getUser));
     }

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
        this.store.dispatch(new userAction.Initialize());
    }

    /**
     * プロフィール初期化
     */
    public initializeProfile() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.InitializeProfile());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.InitializeProfileSuccess),
                tap(() => {
                    resolve();
                })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.InitializeProfileFail),
                tap(() => {
                    reject();
                })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * コイン口座初期化
     */
    public initializeCoinAccount() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.InitializeCoinAccount());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.InitializeCoinAccountSuccess),
                tap(() => {
                    resolve();
                })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.InitializeCoinAccountFail),
                tap(() => {
                    reject();
                })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 言語更新
     */
    public updateLanguage(language: string) {
        const element = document.querySelector<HTMLSelectElement>('#language');
        if (element !== null) {
            element.value = language;
        }
        this.translate.use(language);
        const html = <HTMLElement>document.querySelector('html');
        html.setAttribute('lang', language);
        this.store.dispatch(new userAction.UpdateLanguage({ language }));
    }

    /**
     * プロフィール更新
     */
    public async updateProfile(profile: factory.person.IProfile) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(new userAction.UpdateProfile({ profile }));

            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.UpdateProfileSuccess),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.UpdateProfileFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
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
    public updateBaseSetting(params: {
        seller?: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
        pos?: factory.seller.IPOS;
        printer?: IPrinter;
        isPurchaseCart: boolean;
        viewType: ViewType;
    }) {
        this.store.dispatch(new userAction.UpdateBaseSetting({
            seller: params.seller,
            pos: params.pos,
            printer: params.printer,
            isPurchaseCart: params.isPurchaseCart,
            viewType: params.viewType
        }));
    }

    /**
     * コイン口座チャージ
     */
    public async chargeCoin() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.ChargeCoin({}));
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.ChargeCoinSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.ChargeCoinFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

}
