import { Component, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { UserService, UtilService } from '../../../../services';
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
     * チャージ確認
     * @param creditCard
     */
    public openCharge(creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard) {
        this.modal.show(ChargeCoinModalComponent, {
            initialState: {
                cb: async (charge: number) => {
                    console.log({ charge, creditCard });
                    try {
                        await this.userService.chargeCoin();
                    } catch (error) {
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: this.translate.instant('mypage.coin.alert.charge')
                        });
                    }
                }
            }
        });
    }

}

