import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    AboutComponent,
    TestimonialsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    AboutComponent,
    TestimonialsComponent
  ]
})
export class AboutModule { }
