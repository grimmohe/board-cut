import { Component, OnInit } from '@angular/core';
import { IdService } from 'src/app/id/id.service';
import { Material, Stock } from '../app.model';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  materials: Material[];
  stock: Stock[];

  constructor(private readonly storage: StorageService, private readonly idService: IdService) {
    this.materials = storage.materials;
    this.stock = storage.stock;
  }

  ngOnInit() {}

  addStockItem() {
    this.stock.push({
      id: this.idService.getNextId(),
      height: 0,
      width: 0,
      count: 1,
      description: '',
      material: null,
    });
    this.emitUpdate();
  }

  copyStockItem(item: Stock) {
    const newStock = Object.assign({}, item);
    newStock.id = this.idService.getNextId();
    this.stock.splice(this.stock.indexOf(item) + 1, 0, newStock);
    this.emitUpdate();
  }

  deleteStockItem(item: Stock) {
    this.stock.splice(this.stock.indexOf(item), 1);
    this.emitUpdate();
  }

  emitUpdate() {
    this.storage.dataChanged.next();
  }
}
