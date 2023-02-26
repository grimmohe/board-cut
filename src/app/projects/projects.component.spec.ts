import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StorageService } from 'src/app/storage/storage.service';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectsComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj<StorageService>(
            'StorageService',
            ['getProjects', 'getNewProject', 'loadProject', 'deleteProject'],
            ['projectName', 'created', 'lastEdit']
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    storageService.getNewProject.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list current projects', () => {
    const projects = ['Test 1', 'Test 2'];
    setProjects(projects);

    expect(
      fixture.debugElement
        .queryAll(By.css('#project-row #label'))
        .map((de) => (de.nativeElement as HTMLElement).textContent.trim())
    ).toEqual(projects);
  });

  it('should select a project', async () => {
    const projects = ['Test 1', 'Test 2'];
    setProjects(projects);
    getElement('#project-row #label').click();
    await fixture.whenStable();

    expect(storageService.loadProject).toHaveBeenCalledOnceWith(projects[0]);
    expect((getElement('input') as HTMLInputElement).value).toEqual(projects[0]);
  });

  it('should add a new project', async () => {
    const expectedProjectName = 'new project 1';
    const projects = ['Test'];
    setProjects(projects);
    getElement('#project-row #label').click();
    await fixture.whenStable();

    storageService.getNewProject.and.returnValue(expectedProjectName);
    getElement('#new-project').click();
    await fixture.whenStable();

    expect(storageService.getNewProject).toHaveBeenCalledTimes(1);
    expect((getElement('input') as HTMLInputElement).value).toEqual(expectedProjectName);
  });

  it('should init with new project', async () => {
    const expectedProjectName = 'new project 1';
    storageService.getNewProject.and.returnValue(expectedProjectName);
    component.ngOnInit();
    await fixture.whenStable();

    expect((getElement('input') as HTMLInputElement).value).toEqual(expectedProjectName);
  });

  it('should delete a project', () => {
    const projects = ['Test 1', 'Test 2'];
    setProjects(projects);

    getElement('#project-row #delete').click();

    expect(storageService.deleteProject).toHaveBeenCalledOnceWith(projects[0]);
  });

  function setProjects(projects: string[]): void {
    storageService.getProjects.and.returnValue(projects);

    component['reloadProjects']();
    fixture.detectChanges();
  }

  function getElement(css: string): HTMLElement {
    return fixture.debugElement.query(By.css(css)).nativeElement;
  }
});
