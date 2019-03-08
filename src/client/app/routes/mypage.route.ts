import { AuthGuardService } from '../canActivates';
import { BaseComponent } from '../components/pages';
import { MypageCoinComponent } from '../components/pages/mypage/mypage-coin/mypage-coin.component';
import { MypageCreditComponent } from '../components/pages/mypage/mypage-credit/mypage-credit.component';
import { MypageIndexComponent } from '../components/pages/mypage/mypage-index/mypage-index.component';
import { MypageProfileComponent } from '../components/pages/mypage/mypage-profile/mypage-profile.component';

/**
 * マイページルーティング
 */
export const route = {
    path: 'mypage',
    component: BaseComponent,
    canActivate: [AuthGuardService],
    children: [
        { path: '', component: MypageIndexComponent },
        { path: 'profile', component: MypageProfileComponent },
        { path: 'credit', component: MypageCreditComponent },
        { path: 'coin', component: MypageCoinComponent }
    ]
};
