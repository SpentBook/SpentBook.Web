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
    this.toolbarService.toolbarMode = ToolbarMode.BACK_BAR;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
    this.toolbarService.title = "Login";
  }
}
