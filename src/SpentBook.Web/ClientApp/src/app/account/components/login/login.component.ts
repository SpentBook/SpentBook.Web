import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;  
  isSubmitting = false;

  get email(): any { return this.authForm.get('email'); }
  get password(): any { return this.authForm.get('password'); }

  constructor(
    private authService: AuthService,
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
    this.authService.login(this.email.value, this.password.value);
  }
}
