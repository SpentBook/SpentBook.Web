import { Component, OnInit } from '@angular/core';
import { ToolbarService, ToolbarMode } from '@src/app/shared';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.styl']
})
export class PageProfileComponent implements OnInit {

  constructor(
    private toolbarService: ToolbarService
  ) { }

  ngOnInit() {
    this.toolbarService.toolbarMode = ToolbarMode.FULL;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
    this.toolbarService.title = "Meu perfil";
  }
}
