import { Component } from '@angular/core';
import { StorageService } from 'src/app/storage/storage.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent {
  constructor(protected readonly storage: StorageService) {}
}
