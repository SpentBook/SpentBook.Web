// Angular
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';

// Touch
import 'hammerjs';

// Reactive
import { timer, Observable } from 'rxjs';

// Models
import { LoginResponse, RegistrationRequest, ApiSpentBookService, Sex } from '@app/core';
import { BoxErrorComponent, ServerSideValidationService, CustomValidations, ToolbarService, ToolbarMode } from '@app/shared';
import { RadioValue } from '@src/app/shared/components/input-radio/input-radio.component';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.styl']
})
export class PageProfileComponent implements OnInit, AfterViewChecked {
  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  @Output()
  finish: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  urlCallbackConfirmation: string;

  form: FormGroup;
  isSubmitted = false;
  loading: boolean = false;
  observable$: Observable<LoginResponse>;
  sexValues: RadioValue[];

  get email(): any { return this.form.get('email'); }
  get firstName(): any { return this.form.get('firstName'); }
  get lastName(): any { return this.form.get('lastName'); }
  get sex(): any { return this.form.get('sex'); }
  get dateOfBirth(): any { return this.form.get('dateOfBirth'); }

  constructor(
    private fb: FormBuilder,
    private apiSpentBookService: ApiSpentBookService,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef,
    private toolbarService: ToolbarService
  ) {
    this.createForm();
    this.sexValues = [
      {
        value: Sex.Male,
        text: "Male"
      },
      {
        value: Sex.Female,
        text: "Female"
      }
    ];
  }

  ngOnInit() {
    
    this.toolbarService.toolbarMode = ToolbarMode.FULL;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
  }

  ngAfterViewChecked() {
    // Resolve o bug: ExpressionChangedAfterItHasBeenCheckedError: 
    // Expression has changed after it was checked.
    this.cdRef.detectChanges();
  }

  private createForm() {
    this.form = this.fb.group({
      email: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      dateOfBirth: new FormControl(),
      sex: new FormControl()
    });
  }

  submitForm() {
    if (!this.form.valid && !this.isSubmitted) {
      return;
    }

    this.isSubmitted = true;
    this.loading = true;

    timer(2000).subscribe(() => {
      let userRegister = new RegistrationRequest();
      userRegister.email = this.email.value;
      userRegister.firstName = this.firstName.value;
      userRegister.lastName = this.lastName.value;
      userRegister.dateOfBirth = this.dateOfBirth.value;
      userRegister.urlCallbackConfirmation = this.urlCallbackConfirmation;

      this.observable$ = this.apiSpentBookService.register(userRegister);
      this.observable$.subscribe(
        (response) => {
          this.loading = false;
          this.finish.emit({ userRegister: userRegister, loginResult: response });
        },
        error => {
          this.loading = false;
          this.serverSideValidate.validateWithBoxError(this, error, this.boxError);
        }
      );
    });
  }

  hideBoxError() {
    this.boxError.show = false;
  }

  // hasError(control: FormControl, errorName: string) {
  //   return this.serverSideValidate.hasError(control, errorName);
  // }

  // hiddenError(control: FormControl, errorName: string) {
  //   return this.serverSideValidate.hiddenError(control, errorName);
  // }
}