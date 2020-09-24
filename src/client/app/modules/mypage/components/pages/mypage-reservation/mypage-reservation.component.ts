import { Component, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { UserService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-mypage-reservation',
    templateUrl: './mypage-reservation.component.html',
    styleUrls: ['./mypage-reservation.component.scss']
})
export class MypageReservationComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public reservations: factory.ownershipInfo.IOwnershipInfo<factory.ownershipInfo.IGoodWithDetail>[];
    public moment = moment;

    constructor(
        private store: Store<reducers.IState>,
        private userService: UserService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.reservations = [];
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.reservations = await this.userService.getReservations();
    }

}

