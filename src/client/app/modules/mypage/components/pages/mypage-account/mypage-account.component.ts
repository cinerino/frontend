import { Component, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ActionService, MasterService, QRCodeService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';
import { AccountChargeModalComponent } from '../../../../shared/components/parts/account/charge-modal/charge-modal.component';
import { AccountOpenModalComponent } from '../../../../shared/components/parts/account/open-modal/open-modal.component';
import { AccountTransferModalComponent } from '../../../../shared/components/parts/account/transfer-modal/transfer-modal.component';

@Component({
    selector: 'app-mypage-account',
    templateUrl: './mypage-account.component.html',
    styleUrls: ['./mypage-account.component.scss']
})
export class MypageAccountComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public sellers: factory.chevre.seller.ISeller[];

    constructor(
        private store: Store<reducers.IState>,
        private modal: BsModalService,
        private translate: TranslateService,
        private utilService: UtilService,
        private actionService: ActionService,
        private masterService: MasterService,
        private qrcodeService: QRCodeService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.sellers = [];
        try {
            this.sellers = await this.masterService.getSellers();
            await this.actionService.user.getAccount();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 入金モーダル
     */
    public async openChageAccountModal(account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>) {
        const userData = await this.actionService.user.getData();
        const creditCards = userData.creditCards;
        this.modal.show(AccountChargeModalComponent, {
            initialState: {
                sellers: this.sellers,
                creditCards,
                cb: async (params: {
                    amount: number;
                    creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard;
                    seller: factory.chevre.seller.ISeller;
                }) => {
                    try {
                        const creditCard = {
                            memberId: 'me',
                            cardSeq: Number(params.creditCard.cardSeq)
                        };
                        const profile = userData.profile;
                        if (profile === undefined) {
                            throw new Error('profile undefined');
                        }
                        await this.actionService.user.chargeAccount({ ...params, account, profile, creditCard });
                        await this.actionService.user.getAccount();
                        this.utilService.openAlert({
                            title: this.translate.instant('common.complete'),
                            body: this.translate.instant('mypage.account.alert.chargeSuccess')
                        });
                    } catch (error) {
                        console.error(error);
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
     * 転送モーダル
     */
    public async openTransferAccountModal(account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>) {
        const userData = await this.actionService.user.getData();
        this.modal.show(AccountTransferModalComponent, {
            initialState: {
                sellers: this.sellers,
                cb: async (params: {
                    seller: factory.chevre.seller.ISeller;
                    amount: number;
                    description: string;
                    accountNumber: string
                }) => {
                    try {
                        const profile = userData.profile;
                        if (profile === undefined) {
                            throw new Error('profile undefined');
                        }
                        await this.actionService.user.transferAccount({ ...params, account, profile });
                        await this.actionService.user.getAccount();
                        this.utilService.openAlert({
                            title: this.translate.instant('common.complete'),
                            body: this.translate.instant('mypage.account.alert.transferSuccess')
                        });
                    } catch (error) {
                        console.error(error);
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('mypage.account.alert.transferFail')
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
        this.modal.show(AccountOpenModalComponent, {
            initialState: {
                cb: async (params: {
                    name: string;
                    accountType: factory.accountType
                }) => {
                    // console.log({ amount, account });
                    try {
                        await this.actionService.user.openAccount(params);
                        await this.actionService.user.getAccount();
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
    public confirmCloseAccount(account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('mypage.account.confirm.closeAccount'),
            cb: async () => {
                try {
                    await this.actionService.user.cloaseAccount(account);
                    await this.actionService.user.getAccount();
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

    public openQRCodeViewer(event: Event, account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>) {
        event.preventDefault();
        this.qrcodeService.openQRCodeViewer({
            title: this.translate.instant('mypage.account.accountNumber'),
            body: account.typeOfGood.accountNumber,
            code: account.typeOfGood.accountNumber
        });
    }

}

