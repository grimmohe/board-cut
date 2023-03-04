import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDrawerContainerHarness } from '@angular/material/sidenav/testing';
import { AppModule } from 'src/app/app.module';
import { MaterialsComponent } from 'src/app/materials/materials.component';
import { PartsComponent } from 'src/app/parts/parts.component';
import { ProjectsComponent } from 'src/app/projects/projects.component';
import { ResultsComponent } from 'src/app/results/results.component';
import { SelectDirective } from 'src/app/select.directive';
import { StockComponent } from 'src/app/stock/stock.component';
import { TitleComponent } from 'src/app/title/title.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StockComponent,
        PartsComponent,
        ResultsComponent,
        MaterialsComponent,
        ProjectsComponent,
        TitleComponent,
        SelectDirective,
      ],
      imports: [AppModule],
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(AppComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);

    const container = await loader.getHarness(MatDrawerContainerHarness);
    const content = await container.getContent();
    await content.host();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'board-cut'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('board-cut');
  });

  it('should have all the components', () => {
    const ne: HTMLElement = fixture.debugElement.nativeElement;
    expect(ne.querySelector('app-materials')).toBeTruthy('materials');
    expect(ne.querySelector('app-stock')).toBeTruthy('stock');
    expect(ne.querySelector('app-parts')).toBeTruthy('parts');
    expect(ne.querySelector('app-results')).toBeTruthy('results');
  });
});
