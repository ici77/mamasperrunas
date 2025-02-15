import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

/**
 * 📌 Configuración Global de la Aplicación (`app.config.ts`)
 *
 * Este archivo define los proveedores esenciales que necesita la aplicación en **modo standalone**.
 * Se usa en `main.ts` dentro de `bootstrapApplication(AppComponent, appConfig)`.
 *
 * 🔹 **Servicios Proporcionados:**
 * - `provideHttpClient()`: Habilita el servicio `HttpClient` para realizar peticiones HTTP.
 * - `provideRouter(appRoutes)`: Proporciona el sistema de enrutamiento basado en `app.routes.ts`.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // 📌 Habilita el uso de `HttpClient` en toda la aplicación.
    provideRouter(appRoutes), // 📌 Configura el enrutador con las rutas definidas en `app.routes.ts`.
  ],
};
