import { EventEmitter, Injectable } from '@angular/core';
import { IdService } from 'src/app/id/id.service';
import { Material, Part, Resultset, Stock } from '../app.model';

const localStorageKey = 'cut-mats';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  materials: Material[] = [];
  stock: Stock[] = [];
  parts: Part[] = [];

  result: Resultset;

  sourceMatsChanged = new EventEmitter<void>();

  constructor(private idService: IdService) {
    this.sourceMatsChanged.subscribe(this.updateLocalStorage.bind(this));
  }

  isLocalStorageFilled(): boolean {
    return localStorage.getItem(localStorageKey) > '';
  }

  loadLocalStorage() {
    const stored: Storage = JSON.parse(localStorage.getItem(localStorageKey));

    if (stored) {
      try {
        if (stored.materials) {
          this.materials.push(...stored.materials);
          this.materials.forEach((mat) => this.idService.registerId(mat.id));
        }
        if (stored.stock) {
          this.stock.push(...stored.stock);
          this.restoreStockMaterial();
          this.stock.forEach((s) => this.idService.registerId(s.id));
        }
        if (stored.parts) {
          this.parts.push(...stored.parts);
          this.restorePartStock();
          this.parts.forEach((p) => this.idService.registerId(p.id));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private restoreStockMaterial() {
    this.stock.forEach((s) => {
      if (s.material) {
        const copy = s.material;
        const real = this.materials.find((m) => m.id === copy.id);
        s.material = real;
      }
    });
  }

  private restorePartStock() {
    this.parts.forEach((p) => {
      const copy = p.stock;
      const real = this.stock.find((s) => s.id === copy.id);
      p.stock = real;
    });
  }

  private updateLocalStorage() {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify(<Storage>{
        materials: this.materials,
        stock: this.stock,
        parts: this.parts
      })
    );
  }
}

interface Storage {
  materials: Material[];
  stock: Stock[];
  parts: Part[];
}
