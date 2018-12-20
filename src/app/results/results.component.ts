import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { Resultset } from '../app.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  results: Resultset[];

  constructor(storage: StorageService) {
    this.results = storage.results;
  }

  ngOnInit() {
  }

}
