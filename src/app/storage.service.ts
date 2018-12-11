import { Injectable } from '@angular/core';
import { Part, Resultset, Stock } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  stock: Stock[] = [];
  parts: Part[] = [];
  results: Resultset[] = [];

  constructor() { }

}
