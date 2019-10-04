import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthIndexComponent } from './components/pages/auth-index/auth-index.component';
import { AuthSigninComponent } from './components/pages/auth-signin/auth-signin.component';
import { AuthSignoutComponent } from './components/pages/auth-signout/auth-signout.component';


const routes: Routes = [
  { path: '', component: AuthIndexComponent },
  { path: 'signin', component: AuthSigninComponent },
  { path: 'signout', component: AuthSignoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
