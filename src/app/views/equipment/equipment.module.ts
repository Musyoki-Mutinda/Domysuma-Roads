import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentComponent } from './equipment.component';

const routes: Routes = [
  {
    path: '',
    component: EquipmentComponent
  }
];

@NgModule({
  declarations: [EquipmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EquipmentModule { }
