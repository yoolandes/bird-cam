import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode, NgModule } from '@angular/core';
import {
  TRANSLOCO_LOADER,
  TranslocoModule,
  TranslocoLoader,
  Translation,
  provideTransloco,
} from '@ngneat/transloco';
import { provideTranslocoMessageformat } from '@ngneat/transloco-messageformat';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTranslocoMessageformat(),
    provideTransloco({
      config: {
        availableLangs: ['de_DE'],
        defaultLang: 'de_DE',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class TranslocoRootModule {}
