// Angular
import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

// App
import { fadeAnimation } from '@app/animations';

interface ROUTE {
  icon?: string;
  route?: string;
  title?: string;
}

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
  componentEventActive: any;

  myWorkRoutes: ROUTE[] = [
    {
      icon: 'assignment',
      route: 'sales/activities',
      title: 'Activities',
    }, {
      icon: 'dashboard',
      route: 'sales/dashboards',
      title: 'Dashboards',
    }
  ];

  customerRoutes: ROUTE[] = [
    {
      icon: 'contacts',
      route: 'sales/accounts',
      title: 'Accounts',
    }, {
      icon: 'people',
      route: 'sales/contacts',
      title: 'Contacts',
    }, {
      icon: 'settings_phone',
      route: 'sales/leads',
      title: 'Leads',
    }, {
      icon: 'account_box',
      route: 'sales/opportunities',
      title: 'Opportunities',
    }
  ];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    http.get<boolean>(baseUrl + 'api/Post/Add').subscribe(result => {
      this.resultado = result;
    }, error => console.error(error));
  }

  prepareRoute(outlet: RouterOutlet) {
    console.log(outlet.isActivated ? outlet.activatedRoute : '');
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  public onRouterOutletActivate(event: any) {
    console.log(event);
    this.componentEventActive = event;
  }
}
