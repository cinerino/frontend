import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseTransactionGuardService } from '../../canActivates';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { MembershipBaseComponent } from './components/pages/membership-base/membership-base.component';
import { MembershipCompleteComponent } from './components/pages/membership-complete/membership-complete.component';
import { MembershipConfirmComponent } from './components/pages/membership-confirm/membership-confirm.component';
import { MembershipInputComponent } from './components/pages/membership-input/membership-input.component';
import { MembershipComponent } from './components/pages/membership/membership.component';

const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        children: [
            {
                path: 'membership',
                canActivate: [],
                children: [{ path: '', component: MembershipComponent }],
            },
        ],
    },
    {
        path: 'membership',
        component: MembershipBaseComponent,
        children: [
            {
                path: 'input',
                canActivate: [PurchaseTransactionGuardService],
                component: MembershipInputComponent,
            },
            {
                path: 'confirm',
                canActivate: [PurchaseTransactionGuardService],
                component: MembershipConfirmComponent,
            },
            { path: 'complete', component: MembershipCompleteComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductRoutingModule {}
