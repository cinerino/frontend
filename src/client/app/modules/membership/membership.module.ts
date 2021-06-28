import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MembershipBaseComponent } from './components/pages/membership-base/membership-base.component';
import { MembershipCompleteComponent } from './components/pages/membership-complete/purchase-complete.component';
import { MembershipConfirmComponent } from './components/pages/membership-confirm/membership-confirm.component';
import { MembershipInputComponent } from './components/pages/membership-input/membership-input.component';
import { MembershipOffersComponent } from './components/pages/membership-offers/membership-offers.component';
import { MembershipRoutingModule } from './membership-routing.module';

@NgModule({
    declarations: [
        MembershipBaseComponent,
        MembershipInputComponent,
        MembershipConfirmComponent,
        MembershipCompleteComponent,
        MembershipOffersComponent,
    ],
    entryComponents: [],
    imports: [CommonModule, MembershipRoutingModule, SharedModule],
    exports: [],
})
export class MembershipModule {}
