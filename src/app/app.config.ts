import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from '../core/interceptors/loader/loader.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideAnimations } from '@angular/platform-browser/animations';

// import Aura from '@primeuix/themes/aura';
export const appConfig: ApplicationConfig = {
  providers: [      provideAnimations(),

        provideToastr(), // Toastr providers
          importProvidersFrom(NgxSpinnerModule),

        providePrimeNG({
            theme: {
                                preset: Aura

            }
        }) ,provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),provideHttpClient(withInterceptors([loaderInterceptor]))]
};
