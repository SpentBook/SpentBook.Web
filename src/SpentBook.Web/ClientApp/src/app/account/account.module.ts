// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Social
import { SocialLoginModule, AuthServiceConfig, LoginOpt, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

// App
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

// Module
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountRoutingModule } from './account-routing.module';
import { FacebookBtnLoginComponent } from './components/facebook-btn-login/facebook-btn-login.component';
import { PageLogoutComponent } from './pages/page-logout/page-logout.component';
import { PageRegisterComponent } from './pages/page-register/page-register.component';
import { PageRegisterConfirmationComponent } from './pages/page-register-confirmation/page-register-confirmation.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { RegisterFinishComponent } from './components/register-finish/register-finish.component';
import { PageForgotPasswordComponent } from './pages/page-forgot-password/page-forgot-password.component';
import { PageChangePasswordComponent } from "./pages/page-change-password/page-change-password.component";
import { PageProfileComponent } from './pages/page-profile/page-profile.component';
import { PageProfileChangePwdComponent } from './pages/page-profile-change-pwd/page-profile-change-pwd.component';
import { PageUnregisterComponent } from './pages/page-unregister/page-unregister.component';

// Social Login
const fbLoginOptions: LoginOpt = {
  scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

let config = new AuthServiceConfig([
  // {
  //   id: GoogleLoginProvider.PROVIDER_ID,
  //   provider: new GoogleLoginProvider("Google-OAuth-Client-Id")
  // },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("637431430006219")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  declarations: [
    RegisterFinishComponent,
    LoginComponent,
    FacebookBtnLoginComponent,
    RegisterComponent,
    PageLoginComponent,
    PageLogoutComponent,
    PageRegisterComponent,
    PageRegisterConfirmationComponent,
    PageForgotPasswordComponent,
    PageChangePasswordComponent,
    PageProfileComponent,
    PageProfileChangePwdComponent,
    PageUnregisterComponent
  ],
  imports: [
    // App modules - Routes
    AccountRoutingModule,

    // App modules
    CoreModule,
    SharedModule,

    // Others
    CommonModule,
    ReactiveFormsModule,
    SocialLoginModule
  ],
  exports: [

  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})
export class AccountModule { }
