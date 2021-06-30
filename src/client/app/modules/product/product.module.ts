import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MembershipBaseComponent } from './components/pages/membership-base/membership-base.component';
import { MembershipCompleteComponent } from './components/pages/membership-complete/membership-complete.component';
import { MembershipConfirmComponent } from './components/pages/membership-confirm/membership-confirm.component';
import { MembershipInputComponent } from './components/pages/membership-input/membership-input.component';
import { MembershipComponent } from './components/pages/membership/membership.component';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
    declarations: [
        MembershipBaseComponent,
        MembershipInputComponent,
        MembershipConfirmComponent,
        MembershipCompleteComponent,
        MembershipComponent,
    ],
    entryComponents: [],
    imports: [CommonModule, ProductRoutingModule, SharedModule],
    exports: [],
})
export class ProductModule {}
