import { Component, OnInit, Inject, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { SnackBarData, SnackBarType } from '../../services/snack-bar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.styl']
})
export class SnackbarComponent implements OnInit, AfterViewChecked {

  get snackClass(): string {
    switch (this.data.type) {
      case SnackBarType.ERROR:
        return 'error';
      case SnackBarType.WARNING:
        return 'warning';
      default:
        return 'success';
    }
  }

  constructor(
    public matSnackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {

  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ok() {
    this.matSnackBarRef.dismiss();
    if (this.data.okAction.action != null)
      this.data.okAction.action();
  }

  cancel() {
    this.matSnackBarRef.dismiss();
    if (this.data.cancelAction.action != null)
      this.data.cancelAction.action();
  }
}
