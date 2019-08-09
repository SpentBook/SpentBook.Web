import { Component, OnInit } from '@angular/core';
import { ToolbarService, ToolbarMode } from '../../services/toolbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.styl']
})
export class PageNotFoundComponent implements OnInit {
  public href: string = "";
  
  constructor(
    private toolbarService: ToolbarService,
    private router: Router
  ) {
    this.href = this.router.url;
  }

  ngOnInit() {
    this.toolbarService.setToolbar(ToolbarMode.BACK_BAR, false, true, "Página não encontrada");
  }

}
