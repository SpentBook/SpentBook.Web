// Angular
import { Component, OnInit, Input } from '@angular/core';

// App
import { ProblemDetails } from '@app/core';

// Module
import { FieldError } from '../../services/server-side-validation.service';

@Component({
  selector: 'app-box-error',
  templateUrl: './box-error.component.html',
  styleUrls: ['./box-error.component.styl']
})
export class BoxErrorComponent implements OnInit {
  @Input()
  public problemDetails: ProblemDetails;

  @Input()
  public unknownFieldsErrors: FieldError[];

  show: boolean;

  constructor() { }

  ngOnInit() {
  }
}
