import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

import { provideAnimations } from '@angular/platform-browser/animations';

/**
 * 📌 Configuración Global de la Aplicación (`app.config.ts`)
 *
 * Este archivo define los proveedores esenciales que necesita la aplicación en modo standalone.
 * Se usa en `main.ts` dentro de `bootstrapApplication(AppComponent, appConfig)`.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(appRoutes),
    provideAnimations(),
   
  ]
};
