import { Injectable } from '@angular/core';
import { Part, Position, Resultset, Stock, UsedPart } from 'app/app.model';
import { StorageService } from 'app/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CutService {
  constructor(private readonly storage: StorageService) {}

  cutParts() {
    this.cleanResultStorage();
    this.resetPartCounter(this.storage.parts);

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

  private cut(result: Resultset, stocks: Stock[], parts: Part[]) {
    this.storage.results.push(result);

    stocks.forEach((stock) => {
      const partsForStock = this.getPartsForStock(stock, parts);

      const usedStock = {
        stock: parts[0].stock,
        usedParts: []
      };

      const position: Position = { x: 0, y: 0 };

      partsForStock.forEach((part) => {
        for (; part.countLeft > 0; part.countLeft--) {
          const usedPart: UsedPart = {
            part: part,
            position: Object.assign({}, position),
            turned: false
          };

          if (parts[0].stock.width < parts[0].width) {
            usedPart.turned = true;
          }

          position.x += part.width + stock.material.cuttingWidth;

          usedStock.usedParts.push(usedPart);
        }
      });

      result.usedStock.push(usedStock);
    });
  }

  getPartsForStock(stock: Stock, partsPool: Part[]): Part[] {
    return partsPool.filter((part) => {
      return part.stock === stock;
    });
  }
}
