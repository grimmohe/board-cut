import { EventEmitter, Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IdService } from 'src/app/id/id.service';
import { Material, Part, Project, Resultset, Stock } from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  projectName: string = '';
  created: Date = new Date();
  lastEdit: Date = new Date();

  materials: Material[] = [];
  stock: Stock[] = [];
  parts: Part[] = [];

  result: Resultset;

  sanitizedBlobUrl: SafeUrl;

  dataChanged = new EventEmitter<{ updateTimestamp: boolean }>();

  constructor(private readonly idService: IdService, private readonly sanitizer: DomSanitizer) {
    this.dataChanged.subscribe((opt) => this.updateLocalStorage(opt.updateTimestamp));
  }

  getProjects(): string[] {
    const projects: string[] = [];
    for (let index = 0; index < localStorage.length; index++) {
      projects.push(localStorage.key(index));
    }

    return projects.sort();
  }

  loadProject(projectName: string) {
    const stored: Project = JSON.parse(localStorage.getItem(projectName));
    this.projectName = projectName;
    this.created = new Date();
    this.materials.length = 0;
    this.stock.length = 0;
    this.parts.length = 0;

    if (stored) {
      this.created = new Date(stored.created);
      this.lastEdit = new Date(stored.lastEdit);

      try {
        if (stored.materials) {
          this.materials.push(...stored.materials);
          this.materials.forEach((mat) => this.idService.registerId(mat.id));
        }
        if (stored.stock) {
          this.stock.push(...stored.stock);
          this.restoreStockMaterial();
          this.stock.forEach((s) => this.idService.registerId(s.id));
        }
        if (stored.parts) {
          this.parts.push(...stored.parts);
          this.restorePartStock();
          this.parts.forEach((p) => this.idService.registerId(p.id));
        }
      } catch (error) {
        console.error(error);
      }
    }

    this.dataChanged.next({ updateTimestamp: false });
  }

  deleteProject(projectName: string) {
    localStorage.removeItem(projectName);
  }

  getNewProject(): string {
    let newName = 'new project 1';
    for (const project of this.getProjects()) {
      if (project.match('^new project \\d+$')) {
        newName = `new project ${Number(project.split(' ')[2]) + 1}`;
      }
    }

    this.projectName = newName;
    this.created = new Date();
    this.lastEdit = new Date();
    this.materials.length = 0;
    this.stock.length = 0;
    this.parts.length = 0;

    this.updateLocalStorage(false);

    return newName;
  }

  async addProjectFromFile(file: File): Promise<void> {
    let projectName = file.name.replace('.bcut', '');
    if (this.getProjects().includes(projectName)) {
      projectName = projectName + ' ' + new Date().getTime();
    }

    const content = await file.text();

    localStorage.setItem(projectName, content);
  }

  private restoreStockMaterial() {
    this.stock.forEach((s) => {
      if (s.material) {
        const copy = s.material;
        const real = this.materials.find((m) => m.id === copy.id);
        s.material = real;
      }
    });
  }

  private restorePartStock() {
    this.parts.forEach((p) => {
      if (p.stock) {
        const copy = p.stock;
        const real = this.stock.find((s) => s.id === copy.id);
        p.stock = real;
      }
    });
  }

  private updateLocalStorage(updateTimestamp: boolean) {
    if (updateTimestamp) {
      this.lastEdit = new Date();
    }

    const project: Project = {
      created: this.created.toISOString(),
      lastEdit: this.lastEdit.toISOString(),
      materials: this.materials,
      stock: this.stock,
      parts: this.parts,
    };

    const projectData = JSON.stringify(project);
    localStorage.setItem(this.projectName, projectData);

    const blob = new Blob([projectData], { type: 'application/json' });
    this.sanitizedBlobUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
  }
}
