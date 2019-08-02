import { Component, OnInit } from '@angular/core';
import { ToolbarService } from '../../services/toolbar.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.styl']
})
export class PageNotFoundComponent implements OnInit {

  constructor(toolbarService: ToolbarService) { }

  ngOnInit() {
    
  }

}
