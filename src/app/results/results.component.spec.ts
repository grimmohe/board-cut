import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CutService } from 'app/cut/cut.service';
import { StorageService } from 'app/storage/storage.service';
import { fakeSchedulers } from 'rxjs-marbles/jasmine/angular';
import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let element: HTMLElement;
  let storage: StorageService;
  let cutService: CutService;

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

  it('should host iframe', () => {
    expect(element.querySelector('iframe')).toBeTruthy();
  });

  it('should recalculate and set a new src url on any storage change event', () => {
    spyOn(cutService, 'cut');
    expect(component.iframeSrcUrl).toBeFalsy();

    storage.sourceMatsChanged.emit();
    expect(cutService.cut).toHaveBeenCalledTimes(1);
    expect(component.iframeSrcUrl).toBeTruthy();
  });

  it(
    'should delay computation for 5 seconds after last data change',
    fakeSchedulers(() => {
      spyOn(cutService, 'cut');

      storage.sourceMatsChanged.emit();
      tick(1000);
      storage.sourceMatsChanged.emit();
      tick(5500);
      expect(cutService.cut).toHaveBeenCalledTimes(1);
    })
  );
});
