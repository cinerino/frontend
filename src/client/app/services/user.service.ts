import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Models } from '..';
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
        this.store.dispatch(userAction.remove());
    }

    /**
     * 初期化
     */
    public initialize(params: {
        isMember: boolean;
    }) {
        this.store.dispatch(userAction.initialize(params));
    }

    /**
     * プロフィール取得
     */
    public async getProfile() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(userAction.getProfile());
            const success = this.actions.pipe(
                ofType(userAction.getProfileSuccess.type),
                tap(() => resolve())
            );
            const fail = this.actions.pipe(
                ofType(userAction.getProfileFail.type),
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
            this.store.dispatch(userAction.getAccount());
            const success = this.actions.pipe(
                ofType(userAction.getAccountSuccess.type),
                tap(() => resolve())
            );
            const fail = this.actions.pipe(
                ofType(userAction.getAccountFail.type),
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
            this.store.dispatch(userAction.openAccount(params));
            const success = this.actions.pipe(
                ofType(userAction.openAccountSuccess.type),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(userAction.openAccountFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 口座閉鎖
     */
    public async cloaseAccount(account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(userAction.closeAccount({ account }));
            const success = this.actions.pipe(
                ofType(userAction.closeAccountSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.closeAccountFail.type),
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
        this.store.dispatch(userAction.updateLanguage({ language }));
    }

    /**
     * プロフィール更新
     */
    public async updateProfile(profile: factory.person.IProfile) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(userAction.updateProfile({ profile }));

            const success = this.actions.pipe(
                ofType(userAction.updateProfileSuccess.type),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(userAction.updateProfileFail.type),
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
            this.store.dispatch(userAction.getCreditCards());
            const success = this.actions.pipe(
                ofType(userAction.getCreditCardsSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.getCreditCardsFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード追加
     */
    public async addCreditCard(params: {
        seller: factory.chevre.seller.ISeller;
        creditCard: {
            cardno: string;
            expire: string;
            holderName: string;
            securityCode: string;
        };
    }) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(userAction.addCreditCard(params));
            const success = this.actions.pipe(
                ofType(userAction.addCreditCardSuccess.type),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(userAction.addCreditCardFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード削除
     */
    public async removeCreditCard(creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(userAction.removeCreditCard({ creditCard }));
            const success = this.actions.pipe(
                ofType(userAction.removeCreditCardSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.removeCreditCardFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 基本設定更新
     */
    public updateBaseSetting(params: {
        pos?: factory.chevre.place.movieTheater.IPOS;
        theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        printer?: Models.Common.Printer.IPrinter;
    }) {
        this.store.dispatch(userAction.updateBaseSetting({
            pos: params.pos,
            theater: params.theater,
            printer: params.printer
        }));
    }

    /**
     * 口座入金
     */
    public async chargeAccount(params: {
        seller: factory.chevre.seller.ISeller;
        profile: factory.person.IProfile;
        amount: number;
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>;
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember;
    }) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(userAction.chargeAccount(params));
            const success = this.actions.pipe(
                ofType(userAction.chargeAccountSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.chargeAccountFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 口座転送
     */
    public async transferAccount(params: {
        seller: factory.chevre.seller.ISeller;
        profile: factory.person.IProfile;
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>;
        amount: number;
        description: string;
        accountNumber: string
    }) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(userAction.transferAccount(params));
            const success = this.actions.pipe(
                ofType(userAction.transferAccountSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(userAction.transferAccountFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * バージョン確認
     */
    public async checkVersion() {
        const query = `?date=${moment().toISOString()}`;
        const { version } = await this.utilService.getJson<{ version: string }>(`/api/version${query}`);
        const data = await this.getData();
        if (data.version === undefined) {
            this.store.dispatch(userAction.setVersion({ version }));
        }
        if (data.version !== undefined
            && data.version !== version) {
            this.store.dispatch(userAction.setVersion({ version }));
            location.reload();
        }
    }

}
