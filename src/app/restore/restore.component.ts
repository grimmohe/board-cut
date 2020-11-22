import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css']
})
export class RestoreComponent implements OnInit {
  constructor(
    private readonly dialog: MatDialogRef<RestoreComponent>,
    private readonly storage: StorageService
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialog.close();
  }

  restore() {
    this.storage.loadLocalStorage();
    this.close();
  }
}
