import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface ROUTE {
  icon?: string;
  route?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenavIsOpen$: Subject<boolean>;

  myWorkRoutes: ROUTE[] = [
    {
      icon: 'assignment',
      route: 'sales/activities',
      title: 'Activities 2 2 ',
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

  constructor() {
    this.sidenavIsOpen$ = new Subject<boolean>();
  }

  public open() {
    this.sidenavIsOpen$.next(true);
  }

  public close() {
    this.sidenavIsOpen$.next(false);
  }

  public getObservable(): Subject<boolean> {
    return this.sidenavIsOpen$;
  }

  public setMenu(menu: ROUTE[]) {
    //this.customerRoutes = menu;
    this.customerRoutes[0].title = "ALTERADO";
  }
}
