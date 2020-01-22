/**
 * ルーティング
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getEnvironment } from '../environments/environment';
import { AuthGuardService } from './canActivates';
import { ErrorModule } from './modules/error/error.module';

const appRoutes: Routes = [
    { path: '', redirectTo: getEnvironment().BASE_URL.replace('\/', ''), pathMatch: 'full' },
    {
        path: 'purchase',
        loadChildren: () => import('./modules/purchase/purchase.module').then(m => m.PurchaseModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'inquiry',
        loadChildren: () => import('./modules/inquiry/inquiry.module').then(m => m.InquiryModule)
    },
    {
        path: 'mypage',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./modules/mypage/mypage.module').then(m => m.MypageModule)
    },
    {
        path: 'setting',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./modules/setting/setting.module').then(m => m.SettingModule)
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
