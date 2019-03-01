import { Component, OnInit } from '@angular/core';
import { Material } from '../app.model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {

  materials: Material[];

  constructor(storage: StorageService) {
    this.materials = storage.materials;
  }

  ngOnInit() {
  }

  addMaterialItem() {
    this.materials.push({
      description: '',
      cuttingWidth: 4,
      thickness: 19
    });
  }

  copyMaterialItem(item: Material) {
    this.materials.splice(this.materials.indexOf(item) + 1, 0, Object.assign({}, item));
  }

  deleteMaterialItem(item: Material) {
    this.materials.splice(this.materials.indexOf(item), 1);
  }

}
