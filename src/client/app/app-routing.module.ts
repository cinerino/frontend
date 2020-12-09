/**
 * ルーティング
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getEnvironment } from '../environments/environment';
import { AuthGuardService, ProjectGuardService } from './canActivates';
import { IndexComponent } from './index/index.component';
import { ErrorModule } from './modules/error/error.module';

const appRoutes: Routes = [
    // { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: '', component: IndexComponent },
    {
        path: 'purchase',
        canActivate: [ProjectGuardService],
        loadChildren: () => import('./modules/purchase/purchase.module')
            .then(m => m.PurchaseModule)
            .catch(() => location.reload())
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module')
            .then(m => m.AuthModule)
            .catch(() => location.reload())
    },
    {
        path: 'inquiry',
        canActivate: [ProjectGuardService],
        loadChildren: () => import('./modules/inquiry/inquiry.module')
            .then(m => m.InquiryModule)
            .catch(() => location.reload())
    },
    {
        path: 'order',
        canActivate: [ProjectGuardService],
        loadChildren: () => import('./modules/order/order.module')
            .then(m => m.OrderModule)
            .catch(() => location.reload())
    },
    {
        path: 'mypage',
        canActivate: [ProjectGuardService, AuthGuardService],
        loadChildren: () => import('./modules/mypage/mypage.module')
            .then(m => m.MypageModule)
            .catch(() => location.reload())
    },
    {
        path: 'setting',
        canActivate: [ProjectGuardService, AuthGuardService],
        loadChildren: () => import('./modules/setting/setting.module')
            .then(m => m.SettingModule)
            .catch(() => location.reload())
    },
    {
        path: '',
        loadChildren: () => ErrorModule
    }
];

// tslint:disable-next-line:no-stateless-class
@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { useHash: true, enableTracing: !getEnvironment().production }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
