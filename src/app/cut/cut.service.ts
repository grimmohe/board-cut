import { Injectable } from '@angular/core';
import { Part, Resultset, Stock, UsedPart, UsedStock } from 'app/app.model';
import { PartDistribution } from 'app/cut/part-distribution';
import { Statistics } from 'app/cut/statistics';
import { UsedAreaCalculation } from 'app/cut/used-area-calculation';
import { UsedStockBuilder } from 'app/cut/used-stock.builder';
import { StorageService } from 'app/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CutService {
  constructor(private readonly storage: StorageService) {}

  cutParts() {
    this.cleanResultStorage();
    this.resetStockCounter(this.storage.stock);

    if (!this.storage.parts.length) {
      return;
    }

    const flatPartList = this.extentPartArray(this.storage.parts);

    this.cut(this.storage.result, this.storage.stock, flatPartList);
  }

  private cleanResultStorage() {
    this.storage.result = { usedStock: [] };
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

  cutForStockItem(stock: Stock, parts: Part[], usedStocks: UsedStock[]): void {
    const best = this.recursiveCutWalk(stock, [], parts, usedStocks);

    const partsCopy = [...parts];
    best.useOrder.forEach((use) => {
      this.usePart(partsCopy[use.partIndex], usedStocks, stock);
      partsCopy.splice(use.partIndex, 1);
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

  private recursiveCutWalk(
    stock: Stock,
    useOrder: UseOrder[],
    parts: Part[],
    baseUsedStocks: UsedStock[]
  ): Best {
    let best: Best;

    const usedStocksString = JSON.stringify(baseUsedStocks);

    parts.forEach((part, partIndex) => {
      const copiedUsedStocks: UsedStock[] = JSON.parse(usedStocksString);
      const copiedParts: Part[] = [];
      copiedParts.push(...parts);
      copiedParts.splice(partIndex, 1);
      const copiedStock: Stock = Object.assign({}, stock);

      const copiedUseOrder: UseOrder[] = [];
      copiedUseOrder.push(...useOrder, { partIndex: partIndex });

      this.usePart(part, copiedUsedStocks, copiedStock);

      const newBest = this.recursiveCutWalk(
        copiedStock,
        copiedUseOrder,
        copiedParts,
        copiedUsedStocks
      );

      if (!best || newBest.ratio > best.ratio) {
        best = newBest;
      }
    });

    if (best) {
      return best;
    }

    return this.ceateBestFallbackResult(baseUsedStocks, useOrder, parts);
  }

  private ceateBestFallbackResult(
    baseUsedStocks: UsedStock[],
    useOrder: UseOrder[],
    baseParts: Part[]
  ) {
    const ratio = Statistics.getUsageRatio(
      Statistics.getStockArea(baseUsedStocks),
      Statistics.getPartsArea(baseUsedStocks)
    );

    return {
      ratio: ratio,
      useOrder: useOrder,
      usedStock: baseUsedStocks,
      parts: baseParts
    } as Best;
  }

  usePart(part: Part, usedStocks: UsedStock[], stock: Stock): void {
    let usedStock: UsedStock = usedStocks.length
      ? usedStocks[usedStocks.length - 1]
      : UsedStockBuilder.getNewUsedStock(stock, usedStocks);

    let howToFit = PartDistribution.fitPartOntoStock(stock, usedStock, part);

    if (!howToFit.usable) {
      usedStock = UsedStockBuilder.getNewUsedStock(stock, usedStocks);

      if (!howToFit.usable) {
        howToFit = PartDistribution.fitPartOntoStock(stock, usedStock, part);
      }
    }

    const usedPart: UsedPart = {
      part: part,
      position: Object.assign({}, howToFit.position),
      turned: howToFit.turned
    };
    usedStock.usedParts.push(usedPart);

    UsedAreaCalculation.updateUsedArea(usedStock, howToFit, part);
  }

  private getPartsForStock(stock: Stock, partsPool: Part[]): Part[] {
    return partsPool.filter((part) => {
      return part.stock === stock;
    });
  }
}

interface Best {
  ratio: number;
  useOrder: UseOrder[];
  usedStock: UsedStock[];
  parts: Part[];
}

interface UseOrder {
  partIndex: number;
}
