import { Injectable } from '@angular/core';
import { Part, Resultset, Stock, UsedPart, UsedStock } from 'app/app.model';
import { StorageService } from 'app/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CutService {
  constructor(private readonly storage: StorageService) {}

  cutParts() {
    this.cleanResultStorage();
    this.resetPartCounter(this.storage.parts);
    this.resetStockCounter(this.storage.stock);

    if (!this.storage.parts.length) {
      return;
    }

    this.cut(new Resultset(), this.storage.stock, this.storage.parts);
  }

  private cleanResultStorage() {
    this.storage.results = [];
  }

  private resetPartCounter(parts: Part[]) {
    parts.forEach((part) => {
      part.countLeft = part.count;
    });
  }

  private resetStockCounter(stocks: Stock[]) {
    stocks.forEach((stock) => {
      stock.countLeft = stock.count;
    });
  }

  private cut(result: Resultset, stocks: Stock[], parts: Part[]) {
    this.storage.results.push(result);

    stocks.forEach((stock) => {
      const partsForStock = this.getPartsForStock(stock, parts);

      const usedStocks = this.cutForStockItem(stock, partsForStock);

      result.usedStock.push(...usedStocks);
    });
  }

  private cutForStockItem(stock: Stock, parts: Part[]): UsedStock[] {
    const usedStocks: UsedStock[] = [];
    let usedStock: UsedStock;

    parts.forEach((part) => {
      for (; part.countLeft > 0; part.countLeft--) {
        if (!this.stockStillUsable(usedStock)) {
          usedStock = {
            stock: parts[0].stock,
            usedParts: [],
            usedArea: { x: 0, y: 0 }
          };
          usedStocks.push(usedStock);
        }

        const usedPart: UsedPart = {
          part: part,
          position: Object.assign({}, usedStock.usedArea),
          turned: false
        };

        if (parts[0].stock.width < parts[0].width) {
          usedPart.turned = true;
        }

        usedStock.usedArea.x += part.width + stock.material.cuttingWidth;

        usedStock.usedParts.push(usedPart);
      }
    });

    return usedStocks;
  }

  private stockStillUsable(usedStock: UsedStock) {
    return (
      usedStock &&
      usedStock.usedArea.x < usedStock.stock.width &&
      usedStock.usedArea.y < usedStock.stock.height
    );
  }

  private getPartsForStock(stock: Stock, partsPool: Part[]): Part[] {
    return partsPool.filter((part) => {
      return part.stock === stock;
    });
  }
}
