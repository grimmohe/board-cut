import { Injectable } from '@angular/core';
import { Part, Resultset, Stock, UsedStock } from 'app/app.model';
import { PartDistribution } from 'app/cut/part-distribution';
import { UsedStockBuilder } from 'app/cut/used-stock.builder';
import { StorageService } from 'app/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CutService {
  partDistribution = new PartDistribution();

  constructor(private readonly storage: StorageService) { }

  cut() {
    const startTime = Date.now();

    this.cleanResultStorage();
    this.resetStockCounter(this.storage.stock);

    if (!this.storage.parts.length) {
      return;
    }

    const flatPartList = this.extentPartArray(this.storage.parts);

    this.cutParts(this.storage.result, this.storage.stock, flatPartList);

    console.log(`cutting took ${Date.now() - startTime}ms`);
  }

  private cleanResultStorage() {
    this.storage.result = { usedStock: [] };
  }

  private resetStockCounter(stocks: Stock[]) {
    stocks.forEach((stock) => {
      stock.countLeft = stock.count;
    });
  }

  private extentPartArray(parts: Part[]): Part[] {
    const e: Part[] = [];

    parts.forEach((part) => {
      if (part.width > 0 && part.height > 0) {
        for (let i = 0; i < part.count; i++) {
          e.push(part);
        }
      }
    });

    return e;
  }

  private cutParts(result: Resultset, stocks: Stock[], parts: Part[]) {
    stocks.forEach((stock) => {
      const partsForStock = this.getPartsForStock(stock, parts);
      const usedStocks: UsedStock[] = this.cutForStockItem(stock, partsForStock);

      result.usedStock.push(...usedStocks);
    });
  }

  private getPartsForStock(stock: Stock, partsPool: Part[]): Part[] {
    return partsPool.filter((part) => {
      return part.stock === stock;
    });
  }

  cutForStockItem(stock: Stock, parts: Part[]): UsedStock[] {
    let usedStock: UsedStock = null;
    const usedStocks: UsedStock[] = [];

    while (parts.length) {
      if (!usedStock) {
        usedStock = UsedStockBuilder.getNewUsedStock(stock, usedStocks);
      }

      this.partDistribution.fillStock(parts, usedStock, parts, [stock]);

      if (usedStock.usedArea.x === 0 && usedStock.usedArea.y === 0) {
        break;
      } else {
        usedStock = null;
      }
    }

    return usedStocks;
  }
}
