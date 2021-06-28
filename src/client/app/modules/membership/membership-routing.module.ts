import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    PurchaseTransactionGuardService,
    ViewTypeGuardService,
} from '../../canActivates';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { MembershipBaseComponent } from './components/pages/membership-base/membership-base.component';
import { MembershipCompleteComponent } from './components/pages/membership-complete/purchase-complete.component';
import { MembershipConfirmComponent } from './components/pages/membership-confirm/membership-confirm.component';
import { MembershipInputComponent } from './components/pages/membership-input/membership-input.component';
import { MembershipOffersComponent } from './components/pages/membership-offers/membership-offers.component';

const routes: Routes = [
    {
        path: '',
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
    {
        path: '',
        component: BaseComponent,
        children: [
            {
                path: 'offers',
                canActivate: [ViewTypeGuardService],
                children: [
                    { path: 'date', component: MembershipOffersComponent },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MembershipRoutingModule {}
