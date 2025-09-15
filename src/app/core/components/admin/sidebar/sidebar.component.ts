import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { SidebarItemComponent, MenuItem } from '../../sidebar-item-component/sidebar-item-component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TranslateModule, SidebarItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

menuItems: MenuItem[] = [
  { labelKey: 'SIDEBAR.HOME', route: '/admin', roles: ['Admin', 'User'], icon: 'bi bi-house' },

  // Company
  {
    labelKey: 'SIDEBAR.COMPANY',
    permissions: ['ManageCompany.View'],
    icon: 'bi bi-building',
    children: [
      { labelKey: 'SIDEBAR.COMPANY_LIST', route: '/admin/company', permissions: ['ManageCompany.View'], icon: 'bi bi-list' }
    ]
  },

  // Users
  {
    labelKey: 'SIDEBAR.USERS',
    permissions: ['ManageUsers.View'],
    icon: 'bi bi-people',
    children: [
      { labelKey: 'SIDEBAR.USERS', route: '/admin/users', permissions: ['ManageUsers.View'], icon: 'bi bi-list' },
      { labelKey: 'SIDEBAR.ROLES', route: '/admin/roles', permissions: ['ManageRoles.View'], icon: 'bi bi-shield-lock' },
      { labelKey: 'SIDEBAR.CLAIMS', route: '/admin/claims', permissions: ['ManageRoles.View'], icon: 'bi bi-key' }
    ]
  },

  // Complex
  {
    labelKey: 'SIDEBAR.COMPLEX',
    permissions: ['ManageComplex.View'],
    icon: 'bi bi-building', // ممكن تستخدم أي أيقونة مختلفة
    children: [
      { labelKey: 'SIDEBAR.COMPLEX_LIST', route: '/admin/complex', permissions: ['ManageComplex.View'], icon: 'bi bi-list' }
    ]
  },

  // Reports
  {
    labelKey: 'SIDEBAR.REPORTS',
    permissions: ['ViewReports'],
    icon: 'bi bi-bar-chart',
    children: [
      { labelKey: 'SIDEBAR.REPORTS_VIEW', route: '/admin/reports', permissions: ['ViewReports'], icon: 'bi bi-file-earmark-text' }
    ]
  }
];


  ngOnInit() {
    this.translate.use(this.languageService.getCurrentLang());
  }
}
