// src/app/core/services/language.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private lang$ = new BehaviorSubject<'ar' | 'en'>('ar');
  currentLang$ = this.lang$.asObservable();

  constructor(private translate: TranslateService) {
    // تعيين اللغة الافتراضية عند بدء التطبيق
    this.translate.setDefaultLang('ar');
    this.useLang('ar');
  }

  useLang(lang: 'ar' | 'en') {
    this.lang$.next(lang);
    this.translate.use(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLang() {
    return this.lang$.value;
  }
}
