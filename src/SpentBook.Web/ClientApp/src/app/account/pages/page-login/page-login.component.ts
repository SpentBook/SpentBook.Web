// Angular
import { Component, OnInit } from '@angular/core';
import { ToolbarService, ToolbarMode } from '@app/shared';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.styl'],
})
export class PageLoginComponent implements OnInit {

  constructor(
    private toolbarService: ToolbarService
  ) { }

  ngOnInit() {
    this.toolbarService.setToolbar(ToolbarMode.BACK_BAR, true, false, "Login");
  }
}
