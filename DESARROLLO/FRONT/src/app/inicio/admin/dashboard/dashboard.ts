import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';
import {Tooltip} from 'primeng/tooltip';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Tooltip],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  sidebarOpen = true;
  activeMenu = 'dashboard';
  showUserMenu = false;

  citas: boolean = false;

  constructor(private router: Router) {
  }

  menuItems: MenuItem[] = [
    { id: 'citas', name: 'Citas', icon: 'pi pi-calendar', route: 'citas' },
    { id: 'servicios', name: 'Servicios', icon: 'pi pi-bell', route: 'servicios' },
    { id: 'horarios', name: 'Horarios', icon: 'pi pi-clock', route: '/dashboard/users' },
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

  logout() {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      text: 'Tu sesión actual se cerrará.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result: any) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/']); // o donde tengas tu ruta de login
      }
    });
  }
}
