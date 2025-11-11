import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio/inicio';
import { Login } from './inicio/login/login';
import { Admin } from './inicio/admin/admin';
import { authGuard } from './guards/auth-guard';
import { NuevaCita } from './inicio/nueva-cita/nueva-cita';

export const routes: Routes = [
 { path: '', component: Inicio },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin ,  canActivate: [authGuard]},
{ path: 'nuevacita', component: NuevaCita },
  { path: '**', redirectTo: '' }

  
];
