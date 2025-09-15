import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { BaseComponent } from '../../BaseComponent';
import { CompanyService } from '../../../services/company/company.service';
import { Company } from '../../../models/company/company.model';
import { PaginationComponent } from '../../pagination-component/pagination-component';
import { Complex } from '../../../models/Complex/complex.model';
import { ComplexService } from '../../../services/Complex/complex.service';

@Component({
  selector: 'app-complex',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, PaginationComponent],
  templateUrl: './complex-component.html',
  styleUrls: ['./complex-component.css'],
})
export class ComplexComponent extends BaseComponent {
  private translate = inject(TranslateService);

  complexes = signal<Complex[]>([]);
  selectedComplex = signal<Complex | null>(null);
  companies = signal<Company[]>([]);

  // Pagination
  pageNumber = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);

  // Search & Sort
  searchText = signal('');
  sortBy = signal('CompArName');
  sortDesc = signal(false);

  constructor(
    private complexService: ComplexService,
    private companyService: CompanyService
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.initializePermissions('ManageComplex');
    this.loadCompanies();
    this.loadComplexes();
    this.translate.use(this.translate.currentLang);
  }

  loadCompanies() {
    this.companyService.getAll().subscribe(c => this.companies.set(c));
  }

  loadComplexes() {
    this.complexService.getPaged({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      search: this.searchText(),
      sortBy: this.sortBy(),
      sortDescending: this.sortDesc()
    }).subscribe(res => {
      this.complexes.set(res.items ?? []);
      this.totalCount.set(res.totalCount ?? 0);
      this.pageNumber.set(res.pageNumber ?? 1);
      this.pageSize.set(res.pageSize ?? 10);
    });
  }

  addComplex() {
    this.selectedComplex.set({
      id: 0,
      compArName: '',
      compEnName: '',
      compPhon: '',
      compEmail: '',
      compAddress: '',
      compImagePath: '',
      compComId: 0
    });
  }

  selectComplex(c: Complex) {
    this.selectedComplex.set({ ...c });
  }

  saveComplex() {
    const complex = this.selectedComplex();
    if (!complex) return;

    if (complex.id) {
      this.complexService.update(complex.id, complex).subscribe(() => {
        this.loadComplexes();
        this.selectedComplex.set(null);
      });
    } else {
      this.complexService.create(complex).subscribe(() => {
        this.loadComplexes();
        this.selectedComplex.set(null);
      });
    }
  }

  deleteComplex(id?: number) {
    if (!id) return;
    if (!confirm(this.translate.instant('COMPLEX.CONFIRM_DELETE'))) return;

    this.complexService.delete(id).subscribe({
      next: () => this.loadComplexes()
    });
  }

  // Sort
  sort(column: string) {
    if (this.sortBy() === column) {
      this.sortDesc.set(!this.sortDesc());
    } else {
      this.sortBy.set(column);
      this.sortDesc.set(false);
    }
    this.loadComplexes();
  }

  getSortIcon(column: string): string {
    if (this.sortBy() !== column) return 'fas fa-sort';
    return this.sortDesc() ? 'fas fa-sort-down' : 'fas fa-sort-up';
  }

  // Pagination change
  onPageChange(page: number) {
    this.pageNumber.set(page);
    this.loadComplexes();
  }

  // ✅ Getters عشان تتفادى مشكلة WritableSignal<number>
  get currentPageNumber(): number {
    return this.pageNumber();
  }
  get currentPageSize(): number {
    return this.pageSize();
  }
  get currentTotalCount(): number {
    return this.totalCount();
  }

  // Get Company Name
  getCompanyNameById(id?: number): string {
    if (!id) return '';
    const company = this.companies().find(co => co.id === id);
    return company ? company.comArName : '';
  }

  // عند تغيير البحث

onSearchChange(value: string) {
  this.searchText.set(value); // القيمة مباشرة
  this.pageNumber.set(1);
  this.loadComplexes();
}

// عند تغيير Page Size
onPageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  this.pageSize.set(+target.value); // تحويل القيمة إلى رقم
  this.pageNumber.set(1);           // إعادة الصفحة الأولى
  this.loadComplexes();
}


}
