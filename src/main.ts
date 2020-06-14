import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

// const gTagLibrary = document.createElement('script');
// gTagLibrary.type = 'text/javascript';
// gTagLibrary.src = `https://www.googletagmanager.com/gtag/js?id=${environment.GTAG_ID}`;
// document.head.appendChild(gTagLibrary);

// const gTagLibraryConfig = window.document.createElement('script');
// gTagLibraryConfig.type = 'text/javascript';
// gTagLibraryConfig.innerHTML = `
//   if(window['global'] === undefined){ window['global'] = window;
//     window.dataLayer = window.dataLayer || [];
//     function gtag(){dataLayer.push(arguments);}
//     gtag('js', new Date());
//     gtag('config', ${environment.GTAG_ID});
//   }
// `;
// document.head.appendChild(gTagLibraryConfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
