import { TestBed } from '@angular/core/testing';
import { Material, Part, Project, Stock } from 'src/app/app.model';
import { IdService } from 'src/app/id/id.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [IdService] });
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save to local storage', () => {
    const project = getMockProject(1);
    const projectName = setMockData(project);

    expect(JSON.parse(localStorage.getItem(projectName))).toEqual(project);
  });

  it('should list saved projects', () => {
    const projects: string[] = ['test1', 'test2'];

    for (const project of projects) {
      localStorage.setItem(project, '{}');
    }

    expect(service.getProjects()).toEqual(projects);
  });

  it('should load from storage', () => {
    const project = getMockProject(1);
    const projectName = setMockData(project);

    setMockData(getMockProject(2));

    service.loadProject(projectName);

    expect(service.projectName).toEqual(projectName);
    expect(service.created).toEqual(new Date(project.created));
    expect(service.lastEdit).toEqual(new Date(project.lastEdit));
    expect(service.materials).toEqual(project.materials);
    expect(service.stock).toEqual(project.stock);
    expect(service.parts).toEqual(project.parts);
  });

  it('should delete from storage', () => {
    const projects: string[] = ['test1', 'test2'];

    for (const project of projects) {
      localStorage.setItem(project, '{}');
    }

    service.deleteProject(projects[0]);

    expect(service.getProjects()).toEqual([projects[1]]);
  });

  it('should create a new project name and reset project', () => {
    localStorage.setItem('new project 1', '');
    localStorage.setItem('new project 12', '');
    setMockData(getMockProject(12));

    expect(service.getNewProject()).toEqual('new project 13');
    expect(service.projectName).toEqual('new project 13');
    expect(service.materials).toHaveSize(0);
    expect(service.stock).toHaveSize(0);
    expect(service.parts).toHaveSize(0);
  });

  function getMockProject(seed: number): Project {
    const materials: Material[] = [];
    const stock: Stock[] = [];
    const parts: Part[] = [];

    for (let index = 0; index < seed; index++) {
      const mat: Material = {
        id: index,
        cuttingWidth: seed,
        thickness: index,
      };
      materials.push(mat);

      const s: Stock = {
        id: index,
        count: seed,
        height: index,
        width: index,
        material: mat,
      };
      stock.push(s);

      const part: Part = {
        id: index,

        count: seed,
        followGrain: true,
        height: index,
        width: index,
        stock: s,
      };
      parts.push(part);
    }

    return {
      created: new Date().toISOString(),
      lastEdit: new Date().toISOString(),
      materials,
      parts,
      stock,
    };
  }

  function setMockData(project: Project): string {
    service.projectName = `new project  ${project.materials.length}`;
    service.created = new Date(project.created);

    service.materials = project.materials;
    service.stock = project.stock;
    service.parts = project.parts;

    service.dataChanged.emit();

    project.lastEdit = service.lastEdit.toISOString();

    return service.projectName;
  }
});
