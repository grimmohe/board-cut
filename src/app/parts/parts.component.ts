import { Component, ElementRef, OnInit } from '@angular/core';
import { IdService } from 'app/id/id.service';
import { Part } from '../app.model';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  constructor(readonly storage: StorageService, private readonly idService: IdService, private readonly componentRef: ElementRef<HTMLElement>) { }

  ngOnInit() { }

  emitUpdate() {
    this.storage.sourceMatsChanged.next();
  }

  addPartItem() {
    this.storage.parts.push({
      id: this.idService.getNextId(),
      description: '',
      height: 0,
      width: 0,
      followGrain: false,
      count: 1,
      stock: null
    });
    this.emitUpdate();

    setTimeout(() => {
      const nameElements: NodeListOf<HTMLInputElement> = this.componentRef.nativeElement.querySelectorAll('.name');
      nameElements[nameElements.length - 1]?.focus();
    });
  }

  copyPartItem(item: Part) {
    const newPart = Object.assign({}, item);
    newPart.id = this.idService.getNextId();
    const index = this.storage.parts.indexOf(item) + 1;

    this.storage.parts.splice(index, 0, newPart);
    this.emitUpdate();

    setTimeout(() => {
      const nameElements: NodeListOf<HTMLInputElement> = this.componentRef.nativeElement.querySelectorAll('.name');
      nameElements[index]?.focus();
    });
  }

  deletePartItem(item: Part) {
    this.storage.parts.splice(this.storage.parts.indexOf(item), 1);
    this.emitUpdate();
  }
}
