import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CutService } from 'app/cut/cut.service';
import { StorageService } from 'app/storage/storage.service';
import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let element: HTMLElement;
  let storage: StorageService;
  let cutService: CutService;

  beforeEach(() => {
    localStorage.clear();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        FormsModule,
        MatInputModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    storage = TestBed.inject(StorageService);
    cutService = TestBed.inject(CutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
