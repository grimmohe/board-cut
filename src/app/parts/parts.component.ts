import { Component, OnInit } from '@angular/core';
import { Part } from '../app.model';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  constructor(readonly storage: StorageService) {}

  ngOnInit() {}

  emitUpdate() {
    this.storage.sourceMatsChanged.next();
  }

  addPartItem() {
    this.storage.parts.push({
      description: '',
      height: 0,
      width: 0,
      followGrain: false,
      count: 1,
      stock: null
    });
    this.emitUpdate();
  }

  copyPartItem(item: Part) {
    this.storage.parts.splice(this.storage.parts.indexOf(item) + 1, 0, Object.assign({}, item));
    this.emitUpdate();
  }

  deletePartItem(item: Part) {
    this.storage.parts.splice(this.storage.parts.indexOf(item), 1);
    this.emitUpdate();
  }
}
