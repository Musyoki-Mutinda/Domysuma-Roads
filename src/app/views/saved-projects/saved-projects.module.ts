import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SavedProjectsComponent } from './saved-projects.component';
import { ProjectProgressComponent } from './project-progress.component';

const routes: Routes = [
  {
    path: '',
    component: SavedProjectsComponent
  },
  {
    path: 'progress/:id',
    component: ProjectProgressComponent
  }
];

@NgModule({
  declarations: [SavedProjectsComponent, ProjectProgressComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SavedProjectsModule { }