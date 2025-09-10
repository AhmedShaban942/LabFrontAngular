// dashboard-layout.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header-component/header-component";
import { SidebarComponent } from "../admin/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-dashboard-layout',
    standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, HeaderComponent, SidebarComponent, RouterOutlet],
})

export class DashboardComponent {
   isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
