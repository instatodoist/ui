import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  // Google Analytics will be enabled on Production
  // On deployment server Set the GTAG_ID
  document.write(`
    <script async src="https://www.googletagmanager.com/gtag/js?id=${environment.GTAG_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', ${environment.GTAG_ID});
    </script>
  `);
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
