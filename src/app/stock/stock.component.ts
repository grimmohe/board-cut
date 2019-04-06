import { Component, OnInit } from '@angular/core';
import { Material, Stock } from '../app.model';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  materials: Material[];
  stock: Stock[];

  constructor(private readonly storage: StorageService) {
    this.materials = storage.materials;
    this.stock = storage.stock;
  }

  ngOnInit() {}

  addStockItem() {
    this.stock.push({
      height: 0,
      width: 0,
      count: 1,
      description: '',
      material: null
    });
    this.emitUpdate();
  }

  copyStockItem(item: Stock) {
    this.stock.splice(this.stock.indexOf(item) + 1, 0, Object.assign({}, item));
    this.emitUpdate();
  }

  deleteStockItem(item: Stock) {
    this.stock.splice(this.stock.indexOf(item), 1);
    this.emitUpdate();
  }

  emitUpdate() {
    this.storage.sourceMatsChanged.emit();
  }
}
