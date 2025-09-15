import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-component.html',
  styleUrls: ['./pagination-component.css'],
})
export class PaginationComponent {
  @Input() pageNumber: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalCount: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageChange.emit(page);
  }
}
