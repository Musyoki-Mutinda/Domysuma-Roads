import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CareersComponent } from './careers.component';

const routes: Routes = [
  {
    path: '',
    component: CareersComponent
  }
];

@NgModule({
  declarations: [CareersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CareersModule { }
