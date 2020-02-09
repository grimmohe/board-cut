import { Component, OnInit } from '@angular/core';
import { IdService } from 'app/id/id.service';
import { Material } from '../app.model';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  constructor(readonly storage: StorageService, private readonly idService: IdService) {}

  ngOnInit() {}

  emitUpdate() {
    this.storage.sourceMatsChanged.next();
  }

  addMaterialItem() {
    this.storage.materials.push({
      id: this.idService.getNextId(),
      description: '',
      cuttingWidth: 4,
      thickness: 19
    });
    this.emitUpdate();
  }

  copyMaterialItem(item: Material) {
    this.storage.materials.splice(
      this.storage.materials.indexOf(item) + 1,
      0,
      Object.assign({}, item)
    );
    this.emitUpdate();
  }

  deleteMaterialItem(item: Material) {
    this.storage.materials.splice(this.storage.materials.indexOf(item), 1);
    this.emitUpdate();
  }
}
