/**
 * ルーティング
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './components/pages/base/base.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { SettingComponent } from './components/pages/setting/setting.component';
import * as auth from './routes/auth.route';
import * as inquiry from './routes/inquiry.route';
import * as purchase from './routes/purchase.route';

const appRoutes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    purchase.route,
    auth.route,
    inquiry.route,
    {
        path: '',
        component: BaseComponent,
        children: [
            { path: 'setting', component: SettingComponent },
            { path: 'error', component: ErrorComponent },
            { path: '**', component: NotfoundComponent }
        ]
    }
];

// tslint:disable-next-line:no-stateless-class
@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { useHash: true, enableTracing: true }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
