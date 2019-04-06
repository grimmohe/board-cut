import { Component, OnInit } from '@angular/core';
import { Resultset } from '../app.model';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  result: Resultset;

  constructor(storage: StorageService) {
    this.result = storage.result;
  }

  ngOnInit() {}
}
