import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MiddlewareGuard } from './guards/middleware.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [MiddlewareGuard], data: { isProtected: false } },
  { path: 'home', component: HomeComponent, canActivate: [MiddlewareGuard], data: { isProtected: true } },
  { path: '', redirectTo: '/login',  pathMatch: 'full',
  },
];
