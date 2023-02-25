import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
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

  registerId(id: number) {
    if (typeof id === 'number' && id + 1 > this.nextId) {
      this.nextId = id + 1;
    }
  }
}
