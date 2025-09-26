import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // 👈 importa esto
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // 👈 conserva tus providers previos
    provideAnimations()             // 👈 agrega soporte de animaciones
  ]
}).catch((err) => console.error(err));
