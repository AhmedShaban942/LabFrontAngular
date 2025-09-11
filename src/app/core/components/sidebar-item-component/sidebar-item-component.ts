import { Component, Input, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

export interface MenuItem {
  labelKey: string;
  route?: string;
  roles?: string[];
  permissions?: string[];
  icon?: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sidebar-item-component.html',
  styleUrls: ['./sidebar-item-component.css']
})
export class SidebarItemComponent implements OnInit {
  @Input() item!: MenuItem;

  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  private router = inject(Router);

  ngOnInit() {
    this.item.isOpen = this.hasActiveChild(this.item);
  }

  toggle(item: MenuItem) {
    item.isOpen = !item.isOpen;
  }

  hasAccess(item: MenuItem): boolean {
    if (item.roles && !item.roles.some(r => this.authService.roles().includes(r))) return false;
    if (item.permissions && !item.permissions.some(p => this.authService.permissions().includes(p))) return false;
    return true;
  }

  get filteredChildren(): MenuItem[] {
    if (!this.item.children) return [];
    return this.item.children.filter(child => this.hasAccess(child));
  }

  isActiveRoute(route?: string): boolean {
    if (!route) return false;
    return this.router.url === route;
  }

  hasActiveChild(item: MenuItem): boolean {
    if (item.children) {
      return item.children.some(child => this.isActiveRoute(child.route) || this.hasActiveChild(child));
    }
    return this.isActiveRoute(item.route);
  }
}
