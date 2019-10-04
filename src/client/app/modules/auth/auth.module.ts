import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthIndexComponent } from './components/pages/auth-index/auth-index.component';
import { AuthSigninComponent } from './components/pages/auth-signin/auth-signin.component';
import { AuthSignoutComponent } from './components/pages/auth-signout/auth-signout.component';



@NgModule({
  declarations: [
    AuthIndexComponent,
    AuthSigninComponent,
    AuthSignoutComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
  ]
})
export class AuthModule { }
