import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider } from 'angularx-social-login';
import { AuthService as AuthServiceApp, LoginResponse } from '@app/core';

@Component({
  selector: 'app-facebook-btn-login',
  templateUrl: './facebook-btn-login.component.html',
  styleUrls: ['./facebook-btn-login.component.styl']
})
export class FacebookBtnLoginComponent implements OnInit {

  constructor(private authService: AuthService, private authServiceApp: AuthServiceApp) { }

  ngOnInit(): void {
    
  }

  login(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

}
