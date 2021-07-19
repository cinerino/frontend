import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import {
    ActionService,
    MasterService,
    UtilService,
} from '../../../../../services';
import * as reducers from '../../../../../store/reducers';
import { CreditcardRegisterModalComponent } from '../../../../shared/components/parts/creditcard/register-modal/register-modal.component';

@Component({
    selector: 'app-mypage-credit',
    templateUrl: './mypage-credit.component.html',
    styleUrls: ['./mypage-credit.component.scss'],
})
export class MypageCreditComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public isLoading: Observable<boolean>;
    public sellers: factory.chevre.seller.ISeller[];

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private masterService: MasterService,
        private actionService: ActionService,
        private translate: TranslateService,
        private router: Router,
        private modal: BsModalService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.sellers = [];
        try {
            this.sellers = await this.masterService.searchSellers();
            await this.actionService.user.getCreditCards();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * クレジットカード情報削除確認
     * @param creditCard
     */
    public confirmRemoveCreditCard(
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
    ) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('mypage.credit.confirm.remove'),
            cb: async () => {
                try {
                    await this.actionService.user.removeCreditCard(creditCard);
                    await this.actionService.user.getCreditCards();
                } catch (error) {
                    console.error(error);
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant(
                            'mypage.credit.alert.removeFail'
                        ),
                    });
                }
            },
        });
    }

    /**
     * クレジットカード登録モーダル
     */
    public async openRegisterCreditcardModal() {
        this.modal.show(CreditcardRegisterModalComponent, {
            initialState: {
                sellers: this.sellers,
                cb: async (params: {
                    creditCard: {
                        cardno: string;
                        expire: string;
                        holderName: string;
                        securityCode: string;
                    };
                    seller?: factory.chevre.seller.ISeller;
                }) => {
                    try {
                        const creditCard = params.creditCard;
                        const seller = params.seller;
                        if (seller === undefined) {
                            throw new Error('seller undefined');
                        }
                        await this.actionService.user.addCreditCard({
                            creditCard,
                            seller,
                        });
                        await this.actionService.user.getCreditCards();
                    } catch (error) {
                        console.error(error);
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant(
                                'mypage.account.alert.registerFail'
                            ),
                        });
                    }
                },
            },
            class: 'modal-dialog-centered modal-lg',
        });
    }
}
