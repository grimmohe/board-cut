import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  svg: SafeHtml;

  constructor(
    private readonly storage: StorageService,
    private readonly cut: CutService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.storage.sourceMatsChanged
      .pipe(debounceTime(1000))
      .subscribe(this.calculateAndDisplayNewCut.bind(this));
  }

  calculateAndDisplayNewCut() {
    this.cut.cut();

    const svgString = new ResultSvg().render(this.storage.result).svg();
    this.svg = this.sanitizer.bypassSecurityTrustHtml(svgString);
  }
}
