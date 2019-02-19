import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  isSubmitting = false;
  returnUrl: string;

  get email(): any { return this.authForm.get('email'); }
  get password(): any { return this.authForm.get('password'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {
  }

  submitForm() {
    this.authService.login(this.email.value, this.password.value)
      .subscribe(
        data => this.router.navigateByUrl(this.returnUrl),
        err => {
          alert(4)
        }
      );
  }
}
