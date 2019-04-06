import { Component, OnInit } from '@angular/core';
import { Material } from '../app.model';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  constructor(readonly storage: StorageService) {}

  ngOnInit() {}

  emitUpdate() {
    this.storage.sourceMatsChanged.emit();
  }

  addMaterialItem() {
    this.storage.materials.push({
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
