import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.styl']
})
export class RegisterComponent implements OnInit {
  authForm: FormGroup;
  loading: boolean = false;
  showError: boolean = false;

  get email(): any { return this.authForm.get('email'); }
  get password(): any { return this.authForm.get('password'); }

  constructor(
    private fb: FormBuilder
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  submitForm() {
    alert(1)
  }
}
