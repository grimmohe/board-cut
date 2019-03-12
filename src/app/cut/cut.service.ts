import { Injectable } from '@angular/core';
import { Part, Resultset, Stock, UsedStock } from 'app/app.model';
import { PartDistribution } from 'app/cut/part-distribution';
import { UsedStockBuilder } from 'app/cut/used-stock.builder';
import { StorageService } from 'app/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CutService {
  partDistribution = new PartDistribution();

  constructor(private readonly storage: StorageService) {}

  cut() {
    this.cleanResultStorage();
    this.resetStockCounter(this.storage.stock);

    if (!this.storage.parts.length) {
      return;
    }

    const flatPartList = this.extentPartArray(this.storage.parts);

    this.cutParts(this.storage.result, this.storage.stock, flatPartList);
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
      for (let i = 0; i < part.count; i++) {
        e.push(part);
      }
    });

    return e;
  }

  private cutParts(result: Resultset, stocks: Stock[], parts: Part[]) {
    stocks.forEach((stock) => {
      const partsForStock = this.getPartsForStock(stock, parts);
      const usedStocks: UsedStock[] = [];

      this.cutForStockItem(stock, partsForStock, usedStocks);

      result.usedStock.push(...usedStocks);
    });
  }

  private getPartsForStock(stock: Stock, partsPool: Part[]): Part[] {
    return partsPool.filter((part) => {
      return part.stock === stock;
    });
  }

  cutForStockItem(stock: Stock, parts: Part[], usedStocks: UsedStock[]): void {
    let usedStock: UsedStock = null;

    while (parts.length) {
      if (!usedStock) {
        usedStock = UsedStockBuilder.getNewUsedStock(stock, usedStocks);
      }

      const useCount = this.partDistribution.addRowFor(parts, usedStock);

      if (!useCount) {
        if (usedStock.usedArea.x === 0 && usedStock.usedArea.y === 0) {
          break;
        } else {
          usedStock = null;
        }
      }
    }
  }
}
