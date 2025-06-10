import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * 📌 Punto de entrada principal de la aplicación Angular.
 *
 * - Utiliza `bootstrapApplication()` en lugar de `platformBrowserDynamic().bootstrapModule()`
 *   porque la aplicación está configurada en modo **standalone**.
 * - Carga la configuración de la aplicación desde `app.config.ts`.
 * - Arranca el componente principal `AppComponent`.
 */

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); // Manejo de errores en caso de fallo en la inicialización.
