// Angular
import { Component, OnInit } from '@angular/core';
import { ToolbarService, ToolbarMode } from '@app/shared';
import { SnackBarService } from '@src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.styl'],
})
export class PageLoginComponent implements OnInit {

  constructor(
    private toolbarService: ToolbarService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.toolbarService.toolbarMode = ToolbarMode.BACK_BAR;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
    this.toolbarService.title = "Login";    
    //this.snackBarService.success("shgiwasd");
  }
}
