import { Injectable } from '@angular/core';
import { Part, Resultset, Stock, UsedPart, UsedStock } from 'app/app.model';
import { CutToolbox } from 'app/cut/cut-toolbox';
import { Statistics } from 'app/cut/statistics';
import { StorageService } from 'app/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CutService {
  statistics = new Statistics();
  tool = new CutToolbox();

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
      const usedStocks: UsedStock[] = [];

      this.cutForStockItem(stock, partsForStock, usedStocks);

      result.usedStock.push(...usedStocks);
    });
  }

  cutForStockItem(stock: Stock, baseParts: Part[], baseUsedStocks: UsedStock[]): void {
    const best = {
      partIndex: 0,
      ratio: 0
    };

    const usedStocksString = JSON.stringify(baseUsedStocks);
    const partsString = JSON.stringify(baseParts);

    baseParts.forEach((part, partIndex) => {
      if (!part.countLeft) {
        return;
      }

      const copiedUsedStocks: UsedStock[] = JSON.parse(usedStocksString);
      const copiedParts: Part[] = JSON.parse(partsString);
      const copiedStock: Stock = Object.assign({}, stock);

      this.usePart(partIndex, copiedParts, copiedUsedStocks, copiedStock);

      const ratio = this.statistics.getUsageRatio(
        this.statistics.getStockArea(copiedUsedStocks),
        this.statistics.getPartsArea(copiedUsedStocks)
      );

      if (ratio > best.ratio) {
        best.ratio = ratio;
        best.partIndex = partIndex;
      }
    });

    if (best.ratio) {
      this.usePart(best.partIndex, baseParts, baseUsedStocks, stock);
      this.cutForStockItem(stock, baseParts, baseUsedStocks);
    }
  }

  usePart(partIndex: number, parts: Part[], usedStocks: UsedStock[], stock: Stock): void {
    const part = parts[partIndex];

    let usedStock: UsedStock = usedStocks.length
      ? usedStocks[usedStocks.length - 1]
      : this.tool.getNewUsedStock(stock, usedStocks);

    let howToFit = this.tool.fitPartOntoStock(stock, usedStock, part);

    if (!howToFit.usable) {
      usedStock = this.tool.getNewUsedStock(stock, usedStocks);

      if (!howToFit.usable) {
        howToFit = this.tool.fitPartOntoStock(stock, usedStock, part);
      }
    }

    part.countLeft -= 1;
    const usedPart: UsedPart = {
      part: part,
      position: Object.assign({}, howToFit.position),
      turned: howToFit.turned
    };
    usedStock.usedParts.push(usedPart);

    this.tool.updateUsedArea(usedStock, howToFit, part);
  }

  private getPartsForStock(stock: Stock, partsPool: Part[]): Part[] {
    return partsPool.filter((part) => {
      return part.stock === stock;
    });
  }
}
