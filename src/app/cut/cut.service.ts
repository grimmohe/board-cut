import { Injectable } from '@angular/core';
import { HowToFit, Part, Resultset, Stock, UsedPart, UsedStock } from 'app/app.model';
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

    this.cut(this.storage.result, this.storage.stock, this.storage.parts);
  }

  private cleanResultStorage() {
    this.storage.result = { usedStock: [] };
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
        let howToFit = this.fitPartOntoStock(stock, usedStock, part);

        if (!usedStock || !howToFit.usable) {
          usedStock = {
            stock: stock,
            usedParts: [],
            usedArea: { x: 0, y: 0 }
          };
          usedStocks.push(usedStock);

          if (!howToFit.usable) {
            howToFit = this.fitPartOntoStock(stock, usedStock, part);
          }
        }

        const usedPart: UsedPart = {
          part: part,
          position: Object.assign({}, howToFit.position),
          turned: howToFit.turned
        };
        usedStock.usedParts.push(usedPart);

        this.updateUsedArea(usedStock, howToFit, part);
      }
    });

    return usedStocks;
  }

  private updateUsedArea(usedStock: UsedStock, howToFit: HowToFit, part: Part) {
    usedStock.usedArea.x = Math.max(
      usedStock.usedArea.x,
      howToFit.position.x + (howToFit.turned ? part.height : part.width)
    );
    usedStock.usedArea.y = Math.max(
      usedStock.usedArea.y,
      howToFit.position.y + (howToFit.turned ? part.width : part.height)
    );
  }

  private fitPartOntoStock(stock: Stock, usedStock: UsedStock, part: Part): HowToFit {
    const usedX = usedStock ? usedStock.usedArea.x : 0;
    const usedY = usedStock ? usedStock.usedArea.y : 0;

    const cutX = usedX > 0 ? stock.material.cuttingWidth : 0;
    const cutY = usedY > 0 ? stock.material.cuttingWidth : 0;

    const usableFit: HowToFit = {
      usable: true,
      turned: false,
      position: { x: 0, y: 0 }
    };

    if (stock.height >= part.height && usedX + cutX + part.width <= stock.width) {
      usableFit.position.x = usedX + cutX;

      return usableFit;
    }

    if (stock.width >= part.width && usedY + cutY + part.height <= stock.height) {
      usableFit.position.y = usedY + cutY;

      return usableFit;
    }

    if (!part.followGrain) {
      usableFit.turned = true;

      if (stock.height >= part.width && usedX + cutX + part.height <= stock.width) {
        usableFit.position.x = usedX + cutX;

        return usableFit;
      }

      if (stock.width >= part.height && usedY + cutY + part.width <= stock.height) {
        usableFit.position.y = usedY + cutY;
        usableFit.turned = true;

        return usableFit;
      }
    }

    return { usable: false, turned: null, position: null };
  }

  private getPartsForStock(stock: Stock, partsPool: Part[]): Part[] {
    return partsPool.filter((part) => {
      return part.stock === stock;
    });
  }
}
