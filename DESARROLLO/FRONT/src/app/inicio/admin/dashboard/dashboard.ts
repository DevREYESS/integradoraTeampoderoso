import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  sidebarOpen = true;
  activeMenu = 'dashboard';
  showUserMenu = false;

  citas: boolean = false;

  menuItems: MenuItem[] = [
    { id: 'citas', name: 'Citas', icon: '📊', route: 'citas' },
    { id: 'servicios', name: 'Servicios', icon: '📈', route: 'servicios' },
    { id: 'horarios', name: 'Horarios', icon: '👥', route: '/dashboard/users' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setActiveMenu(menuId: string): void {
    this.activeMenu = menuId;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }
}
