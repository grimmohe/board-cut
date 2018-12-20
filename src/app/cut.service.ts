import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Resultset, Part, Stock } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class CutService {

  constructor(private readonly storage: StorageService) { }

  cutParts() {
    this.cleanResultStorage();

    this.cut(new Resultset(), this.storage.stock, this.storage.parts);
  }

  private cleanResultStorage() {
    this.storage.results = [];
  }

  private cut(result: Resultset, stock: Stock[], parts: Part[]) {

  }
}
