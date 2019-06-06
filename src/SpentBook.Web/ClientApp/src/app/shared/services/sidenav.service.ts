import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenavIsOpen$: Subject<boolean>;

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

}
