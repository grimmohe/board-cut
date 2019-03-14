import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialsComponent } from 'src/app/materials/materials.component';
import { PartsComponent } from 'src/app/parts/parts.component';
import { ResultsComponent } from 'src/app/results/results.component';
import { StockComponent } from 'src/app/stock/stock.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StockComponent,
        PartsComponent,
        ResultsComponent,
        MaterialsComponent
      ],
      imports: [
        BrowserModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        FormsModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'cut-it'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('cut-it');
  });

  it('should have all the components', () => {
    const ne: HTMLElement = fixture.debugElement.nativeElement;
    expect(ne.querySelector('app-materials')).toBeTruthy('materials');
    expect(ne.querySelector('app-stock')).toBeTruthy('stock');
    expect(ne.querySelector('app-parts')).toBeTruthy('parts');
    expect(ne.querySelector('app-results')).toBeTruthy('results');
  });
});
