import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CutService } from 'app/cut/cut.service';
import { RestoreComponent } from 'app/restore/restore.component';
import { ResultSvg } from 'app/svg/result-svg';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { debounceTime } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  svg: SafeHtml[] = [];

  constructor(
    private readonly storage: StorageService,
    private readonly cut: CutService,
    private readonly sanitizer: DomSanitizer,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.storage.sourceMatsChanged
      .pipe(debounceTime(1000))
      .subscribe(this.calculateAndDisplayNewCut.bind(this));

    if (this.storage.isLocalStorageFilled()) {
      const dialogRef = this.dialog.open(RestoreComponent);
      dialogRef.afterClosed().subscribe(() => this.calculateAndDisplayNewCut());
    }
  }

  calculateAndDisplayNewCut() {
    this.cut.cut();

    this.svg.length = 0;

    const svgList = new ResultSvg().render(this.storage.result, true);
    svgList.forEach((svg) => {
      const svgString = svg.svg();
      this.svg.push(this.sanitizer.bypassSecurityTrustHtml(svgString));
    });
  }

  downloadPdf() {
    const content = [];
    const definition = {
      info: {
        title: 'board-cut'
      },
      pageOrientation: 'landscape',
      footer: function(currentPage, pageCount) {
        return { text: currentPage.toString() + ' of ' + pageCount, margin: 10 };
      },
      content
    };

    new ResultSvg().render(this.storage.result, true).forEach((svg) => {
      content.push({ svg: svg.svg(), fit: [750, 500] });
    });

    pdfMake.createPdf(definition).download(`cut${new Date().toISOString()}.pdf`);
  }
}
