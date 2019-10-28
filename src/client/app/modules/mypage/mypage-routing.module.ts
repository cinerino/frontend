import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { MypageCoinComponent } from './components/pages/mypage-coin/mypage-coin.component';
import { MypageCreditComponent } from './components/pages/mypage-credit/mypage-credit.component';
import { MypageIndexComponent } from './components/pages/mypage-index/mypage-index.component';
import { MypageProfileComponent } from './components/pages/mypage-profile/mypage-profile.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: '', component: MypageIndexComponent },
      { path: 'profile', component: MypageProfileComponent },
      { path: 'credit', component: MypageCreditComponent },
      { path: 'coin', component: MypageCoinComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MypageRoutingModule { }