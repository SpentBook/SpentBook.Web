// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App
import { AccountModule } from '@app/account';
import { CultureInfoModule } from '@app/culture-info';
import { DashboardModule } from '@app/dashboard';

// Module
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // App modules    
    AccountModule,
    DashboardModule,
    CultureInfoModule, // Adiciona o formato pt-br para o em campos de datas (material e outros)
    SharedModule,

    // Others
    BrowserModule,
    // HttpClientModule,
    BrowserAnimationsModule,
    // CommonModule,
    AppRoutingModule, // Deve sempre estar em último lugar para a rota curinga "**" não ganhar das demais
  ],
  exports: [
    
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
