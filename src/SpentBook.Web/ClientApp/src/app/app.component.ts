import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'ClientApp';
  resultado = false;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    
    http.get<boolean>(baseUrl + 'api/Post/Add').subscribe(result => {
      this.resultado = result;
    }, error => console.error(error));
  }
}
