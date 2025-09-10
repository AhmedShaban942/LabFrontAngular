import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,TranslateModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})
export class HeaderComponent {
 @Output() toggleSidebar = new EventEmitter<void>();
  auth = inject(AuthService);
  languageService = inject(LanguageService);

  currentLang = this.languageService.getCurrentLang();

  switchLang(lang: 'ar' | 'en') {
    this.languageService.useLang(lang);
    this.currentLang = lang;
  }
  logout() {
    this.auth.logout();
  }

    authUser() {
    return this.auth.user();
  }
}