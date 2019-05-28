// Angular
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {
  @Output()
  backClick = new EventEmitter<void>();

  @Output()
  settingClick = new EventEmitter<void>();

  constructor(private _location: Location) { }

  ngOnInit() {

  }

  back() {
    this._location.back();
  }

  settings() {
    this.settingClick.emit();
  }
}
