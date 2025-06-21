import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GestionarComponent } from './pages/gestionar/gestionar.component';
import { AsignarComponent } from './pages/asignar/asignar.component';
import { CalendarioComponent } from './pages/calendario/calendario.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gestionar', component: GestionarComponent },
  { path: 'asignar', component: AsignarComponent },
  { path: 'calendario', component: CalendarioComponent },
];
