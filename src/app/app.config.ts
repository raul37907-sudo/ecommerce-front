import { ApplicationConfig} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(
        routes,
        withInMemoryScrolling({
          scrollPositionRestoration: 'top', // Fuerza a iniciar siempre hasta arriba
          anchorScrolling: 'disabled'       // Deja el control del scroll a nuestro ngAfterViewInit
        })
      )
    ]
};
