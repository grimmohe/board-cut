import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/storage/storage.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  protected projectName: string;

  protected projects: string[] = [];

  constructor(private readonly cd: ChangeDetectorRef, protected readonly storage: StorageService) {}

  ngOnInit(): void {
    this.reloadProjects();
    if (this.projects?.length) {
      this.onProjectSelect(this.projects[0]);
    } else {
      this.onNewProject();
    }
  }

  protected onProjectSelect(projectName: string): void {
    this.storage.loadProject(projectName);
    this.projectName = projectName;
    this.cd.detectChanges();
  }

  protected onNewProject(): void {
    this.projectName = this.storage.getNewProject();
    this.reloadProjects();
    this.cd.detectChanges();
  }

  protected onDelete(projectName: string): void {
    this.storage.deleteProject(projectName);
    this.reloadProjects();
  }

  protected onNameChange(newValue: string): void {
    this.storage.projectName = newValue;
    this.storage.dataChanged.next({ updateTimestamp: true });
    this.storage.deleteProject(this.projectName);
    this.projectName = newValue;

    this.reloadProjects();
  }

  protected async onFileSelect(file: File): Promise<void> {
    await this.storage.addProjectFromFile(file);
    this.reloadProjects();
  }

  private reloadProjects(): void {
    this.projects = this.storage.getProjects();
  }
}
