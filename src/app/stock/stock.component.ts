import { Component, OnInit } from '@angular/core';
import { Stock } from '../app.model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  stock: Stock[];

  constructor(storate: StorageService) {
    this.stock = storate.stock;
  }

  ngOnInit() {
  }

  addStockItem() {
    let lastUsedThickness = 0;

    if (this.stock.length) {
      lastUsedThickness = this.stock[this.stock.length - 1].thickness;
    }

    this.stock.push({height: 0, width: 0, cuttingWidth: 4, thickness: lastUsedThickness, description: ''});
  }

  copyStockItem(item: Stock) {
    this.stock.splice(this.stock.indexOf(item) + 1, 0, Object.assign({}, item));
  }

  deleteStockItem(item: Stock) {
    this.stock.splice(this.stock.indexOf(item), 1);
  }
}
