import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio/inicio';
import { Login } from './inicio/login/login';
import { Admin } from './inicio/admin/admin';
import { authGuard } from './guards/auth-guard';
import { NuevaCita } from './inicio/nueva-cita/nueva-cita';
import { Dashboard} from './inicio/admin/dashboard/dashboard';
import { Citas } from './inicio/componentes/citas/citas';
import { Servicios } from './inicio/componentes/servicios/servicios';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  //{ path: 'admin', component: Admin ,  canActivate: [authGuard]},
  {
    path: 'admin',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: 'citas', component: Citas },
      { path: 'servicios', component: Servicios },
      { path: '', redirectTo: 'citas', pathMatch: 'full' },
    ]
  },
{ path: 'nuevacita', component: NuevaCita },
  { path: '**', redirectTo: '' }


];
