// Angular
import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

// App
import { fadeAnimation } from '@app/animations';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl'],
  animations: [
    fadeAnimation
  ]
})
export class AppComponent {
  title = 'ClientApp';
  resultado = false;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    
    http.get<boolean>(baseUrl + 'api/Post/Add').subscribe(result => {
      this.resultado = result;
    }, error => console.error(error));
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
