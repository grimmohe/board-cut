import { Component, OnInit } from '@angular/core';
import { CutService } from 'app/cut/cut.service';
import { ResultSvg } from 'app/svg/result-svg';
import { debounceTime } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  svg: string;

  constructor(private readonly storage: StorageService, private readonly cut: CutService) {}

  ngOnInit() {
    this.storage.sourceMatsChanged
      .pipe(debounceTime(5000))
      .subscribe(this.calculateAndDisplayNewCut.bind(this));
  }

  calculateAndDisplayNewCut() {
    console.log('called');
    this.cut.cut();
    this.svg = new ResultSvg().render(this.storage.result).svg();
  }
}
