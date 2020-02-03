import { Component } from '@angular/core';
import {
  async,
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StorageService } from 'app/storage/storage.service';
import { MaterialsComponent } from './materials.component';

describe('MaterialsComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;
  const storage = new StorageService();
  let storageChanged = 0;

  beforeAll(() => {
    storage.sourceMatsChanged.subscribe(() => {
      storageChanged++;
    });
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialsComponent, TestHostComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        FormsModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: StorageService, useValue: storage },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    storageChanged = 0;
    storage.materials.length = 0;
    storage.materials.push({ cuttingWidth: 4, thickness: 12, description: 'test' });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all thats needed', () => {
    fixture.detectChanges();

    const widthInput = getWidthInputElement();
    expect(widthInput).toBeTruthy('width input');

    const thicknessInput = getThicknessInputElement();
    expect(thicknessInput).toBeTruthy('thickness input');

    const descInput = getDescInputElement();
    expect(descInput).toBeTruthy('desc input');

    const copyButton = getCopyButtonElement();
    expect(copyButton).toBeTruthy('copy button');

    const deleteButton = getDeleteButtonElement();
    expect(deleteButton).toBeTruthy('delete button');

    const addButton = getAddButtonElement();
    expect(addButton).toBeTruthy('add button');
  });

  it('should tell when the width input changed', async(() => {
    const input = getWidthInputElement();
    input.value = '10';
    input.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      expect(storage.materials[0].cuttingWidth).toBe(10);
      expect(storageChanged).toBe(1, 'storage update');
    });
  }));

  it('should tell when the thickness input changed', async(() => {
    const input = getThicknessInputElement();
    input.value = '10';
    input.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      expect(storage.materials[0].thickness).toBe(10);
      expect(storageChanged).toBe(1, 'storage update');
    });
  }));

  it('should tell when the description input changed', async(() => {
    const input = getDescInputElement();
    input.value = 'hallo';
    input.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      expect(storage.materials[0].description).toEqual('hallo');
      expect(storageChanged).toBe(1, 'storage update');
    });
  }));

  it('should add a line', () => {
    const button = getAddButtonElement();
    button.click();
    fixture.whenStable().then(() => {
      expect(storage.materials.length).toBe(2);
      expect(storageChanged).toBe(1, 'storage update');
    });
  });

  it('should delete a line', () => {
    const button = getDeleteButtonElement();
    button.click();
    fixture.whenStable().then(() => {
      expect(storage.materials.length).toBe(0);
      expect(storageChanged).toBe(1, 'storage update');
    });
  });

  it('should copy a line', () => {
    const input = getWidthInputElement();
    input.value = '10';
    input.dispatchEvent(new Event('input'));

    const button = getCopyButtonElement();
    button.click();

    fixture.whenStable().then(() => {
      expect(storage.materials.length).toBe(2);
      expect(storage.materials[1].cuttingWidth).toBe(10);
      expect(storageChanged).toBe(2, 'storage update');
    });
  });

  function getWidthInputElement(): HTMLInputElement {
    return element.querySelector('input.width');
  }

  function getThicknessInputElement(): HTMLInputElement {
    return element.querySelector('input.thickness');
  }

  function getDescInputElement(): HTMLInputElement {
    return element.querySelector('input.desc');
  }

  function getAddButtonElement(): HTMLButtonElement {
    return element.querySelector('button.add');
  }

  function getDeleteButtonElement(): HTMLButtonElement {
    return element.querySelector('button.delete');
  }

  function getCopyButtonElement(): HTMLButtonElement {
    return element.querySelector('button.copy');
  }
});

@Component({
  selector: 'app-test-host',
  template: '<app-materials></app-materials>'
})
class TestHostComponent {}
