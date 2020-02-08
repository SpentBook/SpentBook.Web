import { Injectable } from '@angular/core';

export enum ToolbarMode {
  NONE,
  BACK_BAR,
  FULL
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  public toolbarMode: ToolbarMode;
  private showLogo: boolean;
  private showBackButton: boolean;
  private title: String;

  constructor() {
    this.toolbarMode = ToolbarMode.NONE;
    this.showLogo = true;
    this.showBackButton = true;
    this.title = null;
  }

  public setToolbar(toolbarMode: ToolbarMode, showLogo: boolean, showBackButton: boolean, title: String) {
    this.toolbarMode = toolbarMode;
    this.showLogo = showLogo;
    this.showBackButton = showBackButton;
    this.title = title;
  }

  // private _toolbarMode$: Subject<ToolbarMode>;
  // private _toolbarMode: ToolbarMode;

  // get toolbarMode$(): Subject<ToolbarMode> {
  //   return this._toolbarMode$;
  // }

  // get toolbarMode(): ToolbarMode {
  //   return this._toolbarMode;
  // }

  // set toolbarMode(mode: ToolbarMode) {
  //   this._toolbarMode = mode;
  //   this._toolbarMode$.next(this._toolbarMode);
  // }

  // constructor() {
  //   this._toolbarMode$ = new Subject<ToolbarMode>();
  //   this.toolbarMode = ToolbarMode.NONE;
  // }
}
