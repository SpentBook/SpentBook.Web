// Angular/Core
import { Component, OnInit, Input } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { MatSidenav } from '@angular/material';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.styl']
})
export class SidenavComponent implements OnInit {
  @Input()
  sidenavComponent: MatSidenav;

  constructor(
    private sidenavService: SidenavService,
    private menuService: MenuService
  ) {

  }

  ngOnInit() {
    this.sidenavService.getObservable().subscribe((openSidenav: boolean) => {
      if (openSidenav) {
        this.sidenavComponent.open();
      }
      else {
        this.sidenavComponent.close();
      }
    });
  }
}
