import { EventEmitter, Injectable } from '@angular/core';
import { Material, Part, Resultset, Stock } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  materials: Material[] = [];
  stock: Stock[] = [];
  parts: Part[] = [];

  result: Resultset;

  sourceMatsChanged = new EventEmitter<any>();

  constructor() {}
}
