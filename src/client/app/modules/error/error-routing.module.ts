import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { CongestionComponent } from './pages/congestion/congestion.component';
import { ErrorComponent } from './pages/error/error.component';
import { ExpiredComponent } from './pages/expired/expired.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';


const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'congestion', component: CongestionComponent },
      { path: 'expired', component: ExpiredComponent },
      { path: 'error', component: ErrorComponent },
      { path: '**', component: NotfoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
