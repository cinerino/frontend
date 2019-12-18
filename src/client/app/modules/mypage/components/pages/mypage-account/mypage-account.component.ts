import { Component, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { UserService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';
import { ChargeAccountModalComponent } from '../../../../shared/components/parts/charge-account-modal/charge-account-modal.component';
import { OpenAccountModalComponent } from '../../../../shared/components/parts/open-account-modal/open-account-modal.component';

@Component({
    selector: 'app-mypage-account',
    templateUrl: './mypage-account.component.html',
    styleUrls: ['./mypage-account.component.scss']
})
export class MypageAccountComponent implements OnInit {
    public user: Observable<reducers.IUserState>;

    constructor(
        private store: Store<reducers.IState>,
        private modal: BsModalService,
        private translate: TranslateService,
        private utilService: UtilService,
        private userService: UserService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
    }

    /**
     * チャージモーダル
     */
    public async openChageAccountModal(account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>) {
        const userData = await this.userService.getData();
        this.modal.show(ChargeAccountModalComponent, {
            initialState: {
                creditCards: userData.creditCards,
                cb: async (params: {
                    amount: number;
                    creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard;
                }) => {
                    // console.log({ amount, account });
                    try {
                        await this.userService.chargeAccount({ ...params, account });
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('mypage.account.alert.chargeSuccess')
                        });
                    } catch (error) {
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('mypage.account.alert.chargeFail')
                        });
                    }
                }
            },
            class: 'modal-dialog-centered'
        });
    }

    /**
     * 口座開設モーダル
     */
    public openOpenAccountModal() {
        this.modal.show(OpenAccountModalComponent, {
            initialState: {
                cb: async (params: {
                    name: string;
                    accountType: factory.accountType
                }) => {
                    // console.log({ amount, account });
                    try {
                        await this.userService.openAccount(params);
                        await this.userService.getAccount();
                        this.utilService.openAlert({
                            title: this.translate.instant('common.complete'),
                            body: this.translate.instant('mypage.account.alert.openAccountSuccess')
                        });
                    } catch (error) {
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('mypage.account.alert.openAccountFail')
                        });
                    }
                }
            },
            class: 'modal-dialog-centered'
        });
    }

    /**
     * 口座閉鎖確認
     */
    public confirmCloseAccount(account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('mypage.account.confirm.closeAccount'),
            cb: async () => {
                try {
                    await this.userService.cloaseAccount(account);
                    await this.userService.getAccount();
                    this.utilService.openAlert({
                        title: this.translate.instant('common.complete'),
                        body: this.translate.instant('mypage.account.alert.closeAccountSuccess')
                    });
                } catch (error) {
                    console.error(error);
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('mypage.account.alert.closeAccountFail')
                    });
                }
            }
        });
    }

}
