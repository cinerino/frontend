import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ErrorRoutingModule } from './error-routing.module';
import { CongestionComponent } from './pages/congestion/congestion.component';
import { ErrorComponent } from './pages/error/error.component';
import { ExpiredComponent } from './pages/expired/expired.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';


@NgModule({
  declarations: [
    MaintenanceComponent,
    CongestionComponent,
    ExpiredComponent,
    ErrorComponent,
    NotfoundComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    SharedModule,
  ]
})
export class ErrorModule { }
