import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IdService } from 'src/app/id/id.service';
import { StorageService } from 'src/app/storage/storage.service';
import { PartsComponent } from './parts.component';

describe('PartsComponent', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let storage: StorageService;
  let element: HTMLElement;
  let changeTriggerCount: number;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PartsComponent, TestHostComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        FormsModule,
        MatInputModule,
        MatCheckboxModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  beforeEach(waitForAsync(() => {
    storage = TestBed.inject(StorageService);
    storage.materials = [{ id: 0, description: 'Spahn', thickness: 12, cuttingWidth: 4 }];
    storage.stock = [
      {
        id: 0,
        description: 'Standard',
        height: 3000,
        width: 1200,
        count: 1,
        material: storage.materials[0]
      },
      {
        id: 1,
        description: 'Alternativ',
        height: 5000,
        width: 1000,
        count: 1,
        material: storage.materials[0]
      }
    ];
    storage.parts = [
      {
        id: 0,
        description: 'Tür',
        height: 1000,
        width: 600,
        count: 2,
        followGrain: true,
        stock: storage.stock[0]
      }
    ];
    storage.sourceMatsChanged.subscribe(() => {
      changeTriggerCount++;
    });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      changeTriggerCount = 0;
    });
  }));

  it('should create', () => {
    expect(testHost).toBeTruthy();
  });

  it('should display parts', () => {
    expect(getDescInput().value).toBe('Tür');
    expect(getHeightInput().value).toBe('1000');
    expect(getWidthInput().value).toBe('600');
    expect(getCountInput().value).toBe('2');
    // expect(getFollowInput().checked).toBe(true);
    expect(getStockOption().textContent.trim()).toBe('Standard (3000:1200)');
  });

  it('should add a part', waitForAsync(() => {
    const button: HTMLButtonElement = element.querySelector('button.add');
    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const names = element.querySelectorAll('input.name');
      expect(names.length).toBe(2);
      expect((names.item(1) as HTMLInputElement).value).toBe('');
      expect(changeTriggerCount).toBe(1);
    });
  }));

  it('should copy a part', waitForAsync(() => {
    const idService: IdService = TestBed.get(IdService);
    idService.getNextId();

    const button: HTMLButtonElement = element.querySelector('button.copy');
    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const names = element.querySelectorAll('input.name');
      expect(names.length).toBe(2);
      expect((names.item(1) as HTMLInputElement).value).toBe('Tür');
      expect(storage.parts.length).toBe(2);
      expect(storage.parts[0]).not.toBe(storage.parts[1]);
      expect(storage.parts[0].id).not.toEqual(storage.parts[1].id);
      storage.parts[0].id = storage.parts[1].id;
      expect(storage.parts[0]).toEqual(storage.parts[1]);
      expect(changeTriggerCount).toBe(1);
    });
  }));

  it('should delete a part', waitForAsync(() => {
    const button: HTMLButtonElement = element.querySelector('button.delete');
    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const names = element.querySelectorAll('input.name');
      expect(names.length).toBe(0);
      expect(storage.parts.length).toBe(0);
      expect(changeTriggerCount).toBe(1);
    });
  }));

  it('should change the name', waitForAsync(() => {
    getDescInput().value = 'Test';
    getDescInput().dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(storage.parts[0].description).toBe('Test');
      expect(changeTriggerCount).toBe(1);
    });
  }));

  it('should change the height', waitForAsync(() => {
    getHeightInput().value = '123';
    getHeightInput().dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(storage.parts[0].height).toBe(123);
      expect(changeTriggerCount).toBe(1);
    });
  }));

  it('should change the width', waitForAsync(() => {
    getWidthInput().value = '123';
    getWidthInput().dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(storage.parts[0].width).toBe(123);
      expect(changeTriggerCount).toBe(1);
    });
  }));

  it('should change the count', waitForAsync(() => {
    getCountInput().value = '123';
    getCountInput().dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(storage.parts[0].count).toBe(123);
      expect(changeTriggerCount).toBe(1);
    });
  }));

  it('should change follow grain', waitForAsync(() => {
    getFollowInput().checked = false;
    getFollowInput().click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(storage.parts[0].followGrain).toBe(false);
      expect(changeTriggerCount).toBe(1);
    });
  }));

  it('should change the stock', waitForAsync(() => {
    storage.parts[0].stock = storage.stock[1];
    getStockSelect().dispatchEvent(new Event('change'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(changeTriggerCount).toBe(1);
    });
  }));

  function getDescInput(): HTMLInputElement {
    return element.querySelector('input.name');
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

  function getFollowInput(): HTMLInputElement {
    return element.querySelector('.follow input');
  }

  function getStockSelect(): HTMLElement {
    return element.querySelector('select.stock');
  }

  function getStockOption(): HTMLElement {
    return element.querySelector('.stock option');
  }
});

@Component({ template: '<app-parts></app-parts>' })
class TestHostComponent {
  @ViewChild(PartsComponent, /* TODO: add static flag */ {}) component: PartsComponent;
}
