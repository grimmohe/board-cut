import { Component, OnInit } from '@angular/core';
import { CutService } from 'app/cut/cut.service';
import { Pdf } from 'app/pdf/pdf';
import { debounceTime } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  iframeSrcUrl: string;

  constructor(private readonly storage: StorageService, private readonly cut: CutService) {}

  ngOnInit() {
    this.storage.sourceMatsChanged
      .pipe(debounceTime(5000))
      .subscribe(this.calculateAndDisplayNewCut.bind(this));
  }

  calculateAndDisplayNewCut() {
    console.log('called');
    this.cut.cut();
    this.iframeSrcUrl = Pdf.generatePdf(this.storage.result);
  }
}
