import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { UserService } from '../../../services/user/user.service';
import { AppRole } from '../../../models/Role/AppRole';
import { Claim } from '../../../models/Role/Claim';
import { BaseComponent } from '../../BaseComponent';

interface GroupedClaims {
  module: string;
  claims: Claim[];
}

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './claims-component.html',
  styleUrl: './claims-component.css'
})
export class ClaimsComponent extends BaseComponent implements OnInit {
  private userService = inject(UserService);
  private translate = inject(TranslateService);

  roles = signal<AppRole[]>([]);
  selectedRole = signal<AppRole | null>(null);
  claims = signal<Claim[]>([]);
  groupedClaims = signal<GroupedClaims[]>([]);

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadRoles();
    this.translate.use(this.translate.currentLang);
  }

  loadRoles() {
    this.userService.getRoles().subscribe(res => {
      if (res.succeeded) this.roles.set(res.data);
    });
  }

  selectRole(role: AppRole | null) {
    this.selectedRole.set(role);
    if (!role) return;

    this.userService.getClaims(role.id).subscribe(res => {
      if (res.succeeded) {
        this.claims.set(res.data);

        // 🔹 تجميع الـ Claims حسب الموديول (قبل النقطة)
        const grouped = res.data.reduce((acc: any, claim: Claim) => {
          const module = claim.value.split('.')[0]; // مثال: ManageUsers
          if (!acc[module]) acc[module] = [];
          acc[module].push(claim);
          return acc;
        }, {});

        this.groupedClaims.set(
          Object.keys(grouped).map(m => ({
            module: m,
            claims: grouped[m]
          }))
        );
      }
    });
  }

toggleClaim(claim: Claim) {
  claim.selected = !claim.selected;
}

toggleGroup(group: GroupedClaims, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  group.claims.forEach(c => (c.selected = checked));
}

/** ✅ ترجع true لو كل claims متعلمة */
isAllSelected(group: GroupedClaims): boolean {
  return group.claims.every(c => c.selected);
}

/** ✅ ترجع true لو بعضهم متعلم وبعضهم مش */
isIndeterminate(group: GroupedClaims): boolean {
  return group.claims.some(c => c.selected) && !this.isAllSelected(group);
}



  saveClaims() {
    const role = this.selectedRole();
    if (!role) return;

    this.userService.manageClaims(role.id, this.claims()).subscribe(res => {
      if (res.succeeded) alert(this.translate.instant('CLAIMS.SAVED'));
    });
  }

  selectRoleById(event: Event) {
    const target = event.target as HTMLSelectElement;
    const roleId = target.value;
    const role = this.roles().find(r => r.id === roleId) || null;
    this.selectRole(role);
  }
}
