import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  private nextId = 0;

  constructor() {}

  getNextId(): number {
    try {
      return this.nextId;
    } finally {
      this.nextId++;
    }
  }
}
