import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
const LANGUAGE = 'language';
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public language$: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor(private translate: TranslateService) {}

  init() {
    const lan = this.getDefaultLanguage();
    this.setDefaultLanguage(lan);
  }

  getDefaultLanguage(): string {
    const language = localStorage.getItem(LANGUAGE) || 'en';
    return language;
  }

  setDefaultLanguage(language: string): void {
    localStorage.setItem(LANGUAGE, language);
    this.translate.setDefaultLang(language);
    this.language$.next(language);
  }

  setLanguage(setLang: string): void {
    localStorage.setItem(LANGUAGE, setLang);
    this.translate.use(setLang);
    this.translate.setDefaultLang(setLang);
    this.language$.next(setLang);
  }

  getVal(key: string): string {
    return this.translate.instant(key) as string;
  }

  getValueWithParams(key: string, params: object): string {
    return this.translate.instant(key, params) as string;
  }
}
