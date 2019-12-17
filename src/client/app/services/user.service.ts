import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IPrinter, ViewType } from '../models';
import { userAction } from '../store/actions';
import * as reducers from '../store/reducers';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private translate: TranslateService,
        private utilService: UtilService
    ) {
        this.user = this.store.pipe(select(reducers.getUser));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * データ取得
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
     * プロフィール取得
     */
    public async getProfile() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.GetProfile());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.GetProfileSuccess),
                tap(() => resolve())
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.GetProfileFail),
                tap(() => reject())
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 口座情報取得
     */
    public async getAccount() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.GetAccount());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.GetAccountSuccess),
                tap(() => resolve())
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.GetAccountFail),
                tap(() => reject())
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 口座開設
     */
    public async openAccount(params: {
        name: string;
        accountType: factory.accountType;
    }) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.OpenAccount(params));
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.OpenAccountSuccess),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.OpenAccountFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 口座閉鎖
     */
    public async cloaseAccount(account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.CloseAccount({ account }));
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.CloseAccountSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.CloseAccountFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
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
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード一覧取得
     */
    public async getCreditCards() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.GetCreditCards());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.GetCreditCardsSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.GetCreditCardsFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード追加
     */
    public async addCreditCard(params: {
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
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード削除
     */
    public async removeCreditCard(creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.RemoveCreditCard({ creditCard }));
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.RemoveCreditCardSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.RemoveCreditCardFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
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
     * 口座チャージ
     */
    public async chargeAccount(params: {
        amount: number;
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>;
        creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard;
    }) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.ChargeAccount(params));
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.ChargeAccountSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.ChargeAccountFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * バージョン確認
     */
    public async checkVersion() {
        this.utilService.loadStart();
        const query = `?date=${moment().toISOString()}`;
        const { version } = await this.utilService.getJson<{ version: string }>(`/api/version${query}`);
        const data = await this.getData();
        if (data.version === undefined) {
            this.store.dispatch(new userAction.SetVersion({ version }));
        }
        if (data.version !== undefined
            && data.version !== version) {
            this.store.dispatch(new userAction.SetVersion({ version }));
            location.reload();
        }
        this.utilService.loadEnd();
    }

}
