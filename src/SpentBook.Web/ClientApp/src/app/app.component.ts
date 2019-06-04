// Angular
import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

// App
import { fadeAnimation } from '@app/animations';
import { SidenavService } from '@app/shared';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl'],
  animations: [
    fadeAnimation,
  ]
})
export class AppComponent {
  title = 'ClientApp';
  resultado = false;
  currentPage: any;

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private sidenavService: SidenavService
  ) {
    http.get<boolean>(baseUrl + 'api/Post/Add').subscribe(result => {
      this.resultado = result;
    }, error => console.error(error));
  }

  back() {
    this.sidenavService.setMenu([
      {
        icon: 'contacts',
        route: 'sales/accounts',
        title: 'Accounts',
      }
    ]);
  }

  prepareRoute(outlet: RouterOutlet) {
    // console.log(outlet.isActivated ? outlet.activatedRoute : '');
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  public onRouterOutletActivate(event: any) {
    this.currentPage = event;
  }
}
