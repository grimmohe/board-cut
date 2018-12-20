import { Injectable } from '@angular/core';
import { Part, Resultset, Stock, Material } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  materials: Material[] = [];
  stock: Stock[] = [];
  parts: Part[] = [];
  results: Resultset[] = [];

  constructor() { }

}
