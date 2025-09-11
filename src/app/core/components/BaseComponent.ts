import { Injectable, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export abstract class BaseComponent implements OnInit {
  protected authService = inject(AuthService);

  // الصلاحيات العامة لأي Component
  canAdd = false;
  canEdit = false;
  canDelete = false;

  ngOnInit(): void {
    this.initializePermissions();
  }

  /**
   * يتم تمرير Prefix لكل Component لتحديد الصلاحيات الخاصة به
   * مثال: "ManageCompany" أو "ManageUser"
   */
  protected initializePermissions(prefix?: string): void {
    const permissions = this.authService.permissions();

    if (prefix) {
      this.canAdd = permissions.includes(`${prefix}.Create`);
      this.canEdit = permissions.includes(`${prefix}.Update`);
      this.canDelete = permissions.includes(`${prefix}.Delete`);
    }
  }

  protected hasPermission(permission: string): boolean {
    return this.authService.permissions().includes(permission);
  }

  protected hasRole(role: string): boolean {
    return this.authService.roles().includes(role);
  }
}
