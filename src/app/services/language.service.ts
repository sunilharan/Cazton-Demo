import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
const LANGUAGE = 'language';
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translate: TranslateService) {}

  init() {
    const lan = this.getDefaultLanguage();
    this.setDefaultLanguage(lan);
  }

  getDefaultLanguage(): string {
    let language = localStorage.getItem(LANGUAGE);
    language = 'en';
    return language;
  }

  setDefaultLanguage(language: string): void {
    localStorage.setItem(LANGUAGE, language);
    this.translate.setDefaultLang(language);
  }

  setLanguage(setLang: string): void {
    localStorage.setItem(LANGUAGE, setLang);
    this.translate.use(setLang);
  }

  getVal(key: string): string {
    return this.translate.instant(key) as string;
  }

  getValueWithParams(key: string, params: object): string {
    return this.translate.instant(key, params) as string;
  }
}
