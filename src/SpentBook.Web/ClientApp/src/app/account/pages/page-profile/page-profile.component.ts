// Angular
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';

// Touch
import 'hammerjs';

// Reactive
import { timer, Observable } from 'rxjs';

// Models
import { Gender, User, ApiSpentBookUserService } from '@app/core';
import { RadioValue, BoxErrorComponent, ServerSideValidationService, ToolbarService, ToolbarMode } from '@app/shared';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.styl']
})
export class PageProfileComponent implements OnInit, AfterViewChecked {
  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  // @Input()
  // urlCallbackConfirmation: string;

  form: FormGroup;
  isSubmitted = false;
  loading: boolean = false;
  observableGet$: Observable<User>;
  observable$: Observable<Object>;
  sexValues: RadioValue[];

  get email(): any { return this.form.get('email'); }
  get firstName(): any { return this.form.get('firstName'); }
  get lastName(): any { return this.form.get('lastName'); }
  get gender(): any { return this.form.get('gender'); }
  get dateOfBirth(): any { return this.form.get('dateOfBirth'); }

  constructor(
    private fb: FormBuilder,
    private apiSpentBookUserService: ApiSpentBookUserService,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef,
    private toolbarService: ToolbarService
  ) {
    this.createForm();
    this.sexValues = [
      {
        value: Gender.Male,
        text: "Masculino"
      },
      {
        value: Gender.Female,
        text: "Feminino"
      }
    ];
  }

  ngOnInit() {
    this.toolbarService.toolbarMode = ToolbarMode.FULL;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;

    this.loading = true;
    this.observableGet$ = this.apiSpentBookUserService.get();
    this.observableGet$.subscribe(
      (response) => {
        this.loading = false;

        this.email.setValue(response.email);
        this.firstName.setValue(response.firstName);
        this.lastName.setValue(response.lastName);
        this.gender.setValue(response.gender);

        // const date = response.dateOfBirth.toString().substring(0, 10);
        this.dateOfBirth.setValue(response.dateOfBirth);
      },
      error => {
        this.loading = false;
        this.serverSideValidate.validateWithBoxError(this, error, this.boxError);
      }
    );
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
      gender: new FormControl()
    });
  }

  submitForm() {
    if (!this.form.valid && !this.isSubmitted) {
      return;
    }

    this.isSubmitted = true;
    this.loading = true;

    timer(2000).subscribe(() => {
      let request = new User();
      request.id = null;
      request.email = this.email.value;
      request.firstName = this.firstName.value;
      request.lastName = this.lastName.value;
      request.dateOfBirth = this.dateOfBirth.value;
      request.gender = this.gender.value;

      this.observable$ = this.apiSpentBookUserService.update(request);
      this.observable$.subscribe(
        (response) => {
          this.loading = false;
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
}