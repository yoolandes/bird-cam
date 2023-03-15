import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode, NgModule } from '@angular/core';
import {
  TRANSLOCO_LOADER,
  translocoConfig,
  TRANSLOCO_CONFIG,
  TranslocoModule,
  TranslocoLoader,
  Translation,
} from '@ngneat/transloco'
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';;

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  imports: [TranslocoMessageFormatModule.forRoot()],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['de_DE'],
        defaultLang: 'de_DE',
        prodMode: !isDevMode(),
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class TranslocoRootModule {}
