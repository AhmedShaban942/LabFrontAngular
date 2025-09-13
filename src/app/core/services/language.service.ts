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
    // قراءة اللغة المحفوظة من localStorage
    const savedLang = localStorage.getItem('lang') as 'ar' | 'en' || 'ar';
    this.lang$.next(savedLang);
    this.translate.setDefaultLang('ar');
    this.translate.use(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  }

  useLang(lang: 'ar' | 'en') {
    this.lang$.next(lang);
    localStorage.setItem('lang', lang); // حفظ اللغة
    this.translate.use(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLang() {
    return this.lang$.value;
  }
}
