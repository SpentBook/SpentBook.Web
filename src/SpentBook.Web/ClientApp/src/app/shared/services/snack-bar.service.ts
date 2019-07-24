import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

export enum SnackBarType {
  ERROR,
  SUCCESS,
  WARNING
}

export class SnackBarButtonAction {
  label: string;
  action: () => void;
}

export class SnackBarData {
  okAction: SnackBarButtonAction;
  cancelAction: SnackBarButtonAction;
  message: string;
  type: SnackBarType
}

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private duration: number = 5000;

  constructor(private _snackBar: MatSnackBar) { }

  // show(msg: string, action?: string, config?: MatSnackBarConfig) {
  //   this._snackBar.open(msg, action, config);
  // }

  show(msg: string, type: SnackBarType, okAction?: SnackBarButtonAction, cancelAction?: SnackBarButtonAction, config?: MatSnackBarConfig) {
    if (config == null) {
      config = new MatSnackBarConfig();
      config.verticalPosition = "bottom";
      config.horizontalPosition = "end";
    }

    if (!config.duration)
      config.duration = this.duration;

    if (okAction == null) {
      okAction = new SnackBarButtonAction();
      okAction.label = "OK";
    }

    // if (cancelAction == null) {
    //   cancelAction = new SnackBarButtonAction();
    //   cancelAction.label = "Cancelar";
    // }

    config.data = {
      okAction: okAction,
      cancelAction: cancelAction,
      message: msg,
      type: type
    }

    this._snackBar.openFromComponent(SnackbarComponent, config);
  }

  success(msg: string, okAction?: SnackBarButtonAction, cancelAction?: SnackBarButtonAction) {
    this.show(msg, SnackBarType.SUCCESS, okAction, cancelAction)
  }

  error(msg: string, okAction?: SnackBarButtonAction, cancelAction?: SnackBarButtonAction) {
    this.show(msg, SnackBarType.ERROR, okAction, cancelAction)
  }

  warning(msg: string, okAction?: SnackBarButtonAction, cancelAction?: SnackBarButtonAction) {
    this.show(msg, SnackBarType.WARNING, okAction, cancelAction)
  }
}
