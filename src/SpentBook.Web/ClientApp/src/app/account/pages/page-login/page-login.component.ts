// Angular
import { Component, OnInit } from '@angular/core';
import { PageInterface, ToolbarComponent } from '@app/shared';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.styl'],
})
export class PageLoginComponent extends PageInterface implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {
    
  }

  setToolBar(header: ToolbarComponent): void {
    // header.backClick.
  }
}
