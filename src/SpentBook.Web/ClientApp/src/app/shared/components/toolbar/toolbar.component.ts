// Angular
import { OnInit, Output, EventEmitter, Component, Input } from "@angular/core";

// Module
import { PageInterface } from "../..";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.styl']
})
export class ToolbarComponent implements OnInit {
  private _currentPage: any;

  @Output()
  backClick = new EventEmitter<void>();

  @Output()
  settingClick = new EventEmitter<void>();

  get currentPage(): any {
    return this._currentPage;
  }

  @Input()
  set currentPage(value: any) {
    this._currentPage = value;
    this.setToolBar();
  }

  constructor() { }

  ngOnInit() {

  }

  setToolBar() {
    if (this._currentPage && this._currentPage instanceof PageInterface) {
      (this._currentPage as PageInterface).setToolBar(this);
    }
  }

  back() {
    this.backClick.emit();
  }

  settings() {
    this.settingClick.emit();
  }
}
