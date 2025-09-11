import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompanyService } from '../../../services/company/company.service';
import { Company } from '../../../models/company/company.model';
import { BaseComponent } from '../../BaseComponent';


@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent extends BaseComponent {
  private translate = inject(TranslateService);

  companies = signal<Company[]>([]);
  selectedCompany = signal<Company | null>(null);

  constructor(private companyService: CompanyService) {
    super(); // ⚡ مهم عند الوراثة
  }

  override ngOnInit(): void { // 👈 استخدم override
    super.ngOnInit();        // ⚡ تهيئة الصلاحيات في BaseComponent
    this.loadCompanies();
    this.initializePermissions('ManageCompany'); // ⚡ هذا يحدد الصلاحيات الخاصة بالـ Company
    this.translate.use(this.translate.currentLang);
  }


  loadCompanies() {
    this.companyService.getAll().subscribe({
      next: (data) => this.companies.set(data),
      error: (err) => console.error(err)
    });
  }

  selectCompany(company: Company) {
    this.selectedCompany.set({ ...company });
  }

  saveCompany() {
    const company = this.selectedCompany();
    if (!company) return;

    if (company.id) {
      this.companyService.update(company.id, company).subscribe({
        next: () => {
          this.loadCompanies();
          this.selectedCompany.set(null);
        }
      });
    } else {
      this.companyService.create(company).subscribe({
        next: () => {
          this.loadCompanies();
          this.selectedCompany.set(null);
        }
      });
    }
  }

  deleteCompany(id: number) {
    if (!confirm(this.translate.instant('COMPANY.CONFIRM_DELETE'))) return;
    this.companyService.delete(id).subscribe({
      next: () => this.loadCompanies()
    });
  }

  addCompany() {
    this.selectedCompany.set({
      id: 0,
      comArName: '',
      comEnName: '',
      comPhon: '',
      comEmail: '',
      comAddress: '',
      comImagePath: ''
    } as Company);
  }
}
