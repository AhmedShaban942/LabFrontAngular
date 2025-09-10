import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';


interface MenuItem {
  labelKey: string; // المفتاح للترجمة
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  userRole = 'Admin'; // تجيبها من الـ AuthService بعد تسجيل الدخول

  menuItems: MenuItem[] = [
    { labelKey: 'SIDEBAR.HOME', route: '/admin', roles: ['Admin', 'User'] },
    { labelKey: 'SIDEBAR.COMPANY', route: '/admin/company', roles: ['Admin'] },
    { labelKey: 'SIDEBAR.REPORTS', route: '/admin/reports', roles: ['Admin', 'Manager'] }
  ];

  get filteredMenu() {
    return this.menuItems.filter(item => item.roles.includes(this.userRole));
  }

  ngOnInit() {
    // تفعيل اللغة الحالية عند بدء المكون
    this.translate.use(this.languageService.getCurrentLang());
  }
}
