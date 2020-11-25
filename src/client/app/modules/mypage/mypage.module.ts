import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MypageAccountComponent } from './components/pages/mypage-account/mypage-account.component';
import { MypageCreditComponent } from './components/pages/mypage-credit/mypage-credit.component';
import { MypageIndexComponent } from './components/pages/mypage-index/mypage-index.component';
import { MypageOrderDetailComponent } from './components/pages/mypage-order-detail/mypage-order-detail.component';
import { MypageOrderComponent } from './components/pages/mypage-order/mypage-order.component';
import { MypageProfileComponent } from './components/pages/mypage-profile/mypage-profile.component';
import { MypageRoutingModule } from './mypage-routing.module';

@NgModule({
  declarations: [
    MypageIndexComponent,
    MypageProfileComponent,
    MypageCreditComponent,
    MypageAccountComponent,
    MypageOrderComponent,
    MypageOrderDetailComponent,
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    MypageRoutingModule,
    SharedModule,
  ]
})
export class MypageModule { }
