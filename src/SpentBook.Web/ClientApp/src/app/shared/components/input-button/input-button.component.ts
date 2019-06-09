// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-button',
  templateUrl: './input-button.component.html',
  styleUrls: ['./input-button.component.styl']
})
export class InputButtonComponent implements OnInit {
  @Input()
  placeholder: string;

  @Input()
  icon: string;

  @Input()
  disabled: boolean;

  @Output()
  clicked: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.clicked.emit(); // Pass any payload as argument
  }
}
