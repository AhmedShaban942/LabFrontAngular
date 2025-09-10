import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-home-component.html',
  styleUrl: './dashboard-home-component.css'
})
export class DashboardHomeComponent {
  private translate = inject(TranslateService);

  ngOnInit() {
    // تحديث اللغة الحالية عند تحميل المكون
    this.translate.use(this.translate.currentLang);
  }
}
