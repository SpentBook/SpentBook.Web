import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function getBaseUrl() {
  return "/";
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
.then(() => {
    // let splashScreen = document.getElementById('splash');
    // splashScreen.remove();

    // splashScreen.setAttribute('class', 'loaded');
    // setTimeout(function(){ splashScreen.remove(); }, 1000);
})
.catch(err => {
  console.error(err)
});
