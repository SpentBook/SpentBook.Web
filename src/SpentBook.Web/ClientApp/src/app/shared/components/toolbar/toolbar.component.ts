// Angular
import { OnInit, Component } from "@angular/core";

// Module
import { SidenavService } from "../../services/sidenav.service";
import { ToolbarMode, ToolbarService } from "../../services/toolbar.service";
import { Router } from "@angular/router";
import { AuthService } from "@app/core";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.styl']
})
export class ToolbarComponent implements OnInit {
  ToolbarModeEnum = ToolbarMode;

  constructor(
    private sidenavService: SidenavService,
    private router: Router,
    private toolbarService: ToolbarService,
    private authService: AuthService
  ) {
    // this.toolbarService.toolbarMode$.subscribe((mode: ToolbarMode) => {
    //   if (mode == this.ToolbarModeEnum.FULL) {
    //   }
    //   else {
    //   }
    // });
  }

  ngOnInit() {

  }

  back() {
    //this.backClick.emit();
  }

  openHome() {
    this.router.navigate(["/"]);
  }

  openMenu() {
    this.sidenavService.open();
  }

  settings() {
    this.sidenavService.open();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
