import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { RestoreComponent } from './restore.component';

describe('RestoreComponent', () => {
  let component: RestoreComponent;
  let fixture: ComponentFixture<RestoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestoreComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
