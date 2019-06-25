// Angular
import { Component, OnInit } from '@angular/core';
import { ToolbarService, ToolbarMode } from '@src/app/shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.styl']
})
export class PageHomeComponent implements OnInit {

  constructor(
    private toolbarService: ToolbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.toolbarService.toolbarMode = ToolbarMode.FULL;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
    this.toolbarService.title = "Dashboard";
  }
}
