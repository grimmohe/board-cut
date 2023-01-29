import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StorageService } from 'src/app/storage/storage.service';
import { StockComponent } from './stock.component';

describe('StockComponent', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;
  let storage: StorageService;
  let changeEventCount: number;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StockComponent, TestHostComponent],
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
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    storage = TestBed.inject(StorageService);
    storage.sourceMatsChanged.subscribe(() => {
      changeEventCount++;
    });
    initStorage(storage);
    fixture.detectChanges();
  });

  beforeEach(waitForAsync(() => {
    fixture.whenStable().then(() => {
      changeEventCount = 0;
    });
  }));

  it('should display storage data', () => {
    expect(getDescInput().value).toBe('Tür');
    expect(getCountInput().value).toBe('1');
    expect(getHeightInput().value).toBe('1200');
    expect(getWidthInput().value).toBe('600');
    expect(getMaterialOption().textContent).toBe('OSB');
  });

  it('should update the description', () => {
    const input = getDescInput();
    input.value = 'Door';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(storage.stock[0].description).toBe('Door');
    expect(changeEventCount).toBe(1);
  });

  it('should update count', () => {
    const input = getCountInput();
    input.value = '13';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(storage.stock[0].count).toBe(13);
    expect(changeEventCount).toBe(1);
  });

  it('should update height', () => {
    const input = getHeightInput();
    input.value = '1000';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(storage.stock[0].height).toBe(1000);
    expect(changeEventCount).toBe(1);
  });

  it('should update width', () => {
    const input = getWidthInput();
    input.value = '500';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(storage.stock[0].width).toBe(500);
    expect(changeEventCount).toBe(1);
  });

  it('should change the material', waitForAsync(() => {
    storage.stock[0].material = storage.materials[1];
    getMaterialSelect().dispatchEvent(new Event('change'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(changeEventCount).toBe(1);
    });
  }));

  it('should add a stock element', () => {
    (element.querySelector('button.add') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(storage.stock.length).toBe(2);
    expect(changeEventCount).toBe(1);

    const descriptions = element.querySelectorAll('input.desc');
    expect(descriptions.length).toBe(2);
    expect((descriptions.item(1) as HTMLInputElement).value).toBe('');
  });

  it('should delete a stock element', () => {
    (element.querySelector('button.delete') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(storage.stock.length).toBe(0);
    expect(getDescInput()).toBeFalsy();
    expect(changeEventCount).toBe(1);
  });

  it('should copy a stock element', () => {
    (element.querySelector('button.copy') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(storage.stock.length).toBe(2);
    expect(changeEventCount).toBe(1);
    expect(storage.stock[0].description).toEqual(storage.stock[1].description);
  });

  function getDescInput(): HTMLInputElement {
    return element.querySelector('input.desc');
  }

  function getHeightInput(): HTMLInputElement {
    return element.querySelector('input.height');
  }

  function getWidthInput(): HTMLInputElement {
    return element.querySelector('input.width');
  }

  function getCountInput(): HTMLInputElement {
    return element.querySelector('input.count');
  }

  function getMaterialSelect(): HTMLElement {
    return element.querySelector('select.material');
  }

  function getMaterialOption(): HTMLElement {
    return element.querySelector('.material option');
  }
});

@Component({ template: '<app-stock></app-stock>' })
class TestHostComponent {}

function initStorage(storage: StorageService) {
  storage.materials.push(
    { id: 0, description: 'OSB', cuttingWidth: 4, thickness: 12 },
    { id: 1, description: 'Spahn', cuttingWidth: 4, thickness: 16 }
  );
  storage.stock.push({
    id: 0,
    description: 'Tür',
    count: 1,
    height: 1200,
    width: 600,
    material: storage.materials[0]
  });
}
