import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ServicesRoutingModule } from './services-routing.module';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ServiceListComponent,
    ServiceDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ServicesRoutingModule,
    SharedModule
  ]
})
export class ServicesModule { }
