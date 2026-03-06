import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SavedProjectsService } from '../../core/services/saved-projects.service';
import { ProjectsService } from '../projects/projects.service';

@Component({
  selector: 'app-project-progress',
  templateUrl: './project-progress.component.html',
  styleUrls: ['./project-progress.component.scss']
})
export class ProjectProgressComponent implements OnInit {

  projectId: string;
  project: any;
  progressUpdates: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private savedProjectsService: SavedProjectsService,
    private projectsService: ProjectsService
  ) {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadProjectData();
  }

  loadProjectData(): void {
    this.loading = true;
    this.error = null;

    // Load project details
    this.projectsService.getProjectById(this.projectId).subscribe({
      next: (project: any) => {
        this.project = project;
      },
      error: (err: any) => {
        console.error('Error loading project details:', err);
        this.error = 'Failed to load project details. Please try again.';
        this.loading = false;
      }
    });

    // Load progress updates
    this.savedProjectsService.getProjectProgress(this.projectId).subscribe({
      next: (updates: any[]) => {
        this.progressUpdates = updates;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading progress updates:', err);
        this.error = 'Failed to load progress updates. Please try again.';
        this.loading = false;
      }
    });
  }

  getCurrentProgress(): number {
    if (this.progressUpdates.length === 0) return 0;
    // Get the latest update
    const latestUpdate = this.progressUpdates.reduce((latest, current) => {
      const latestDate = new Date(latest.updateDate);
      const currentDate = new Date(current.updateDate);
      return currentDate > latestDate ? current : latest;
    });
    return latestUpdate.completionPercentage;
  }

  getProgressClass(percentage: number): string {
    if (percentage < 33) return 'bg-danger';
    if (percentage < 66) return 'bg-warning';
    return 'bg-success';
  }
}
