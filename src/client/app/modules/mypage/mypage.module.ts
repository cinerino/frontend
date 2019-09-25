import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MypageCoinComponent } from './components/pages/mypage-coin/mypage-coin.component';
import { MypageCreditComponent } from './components/pages/mypage-credit/mypage-credit.component';
import { MypageIndexComponent } from './components/pages/mypage-index/mypage-index.component';
import { MypageProfileComponent } from './components/pages/mypage-profile/mypage-profile.component';
import { MypageRoutingModule } from './mypage-routing.module';

@NgModule({
  declarations: [
    MypageIndexComponent,
    MypageProfileComponent,
    MypageCreditComponent,
    MypageCoinComponent,
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    MypageRoutingModule,
    SharedModule,
  ]
})
export class MypageModule { }
