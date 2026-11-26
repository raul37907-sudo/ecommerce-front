/*-- -----dir: src/app/app.routers.ts*/
import { Routes } from '@angular/router';
import { DashboardComponent}  from './dashboard/dashboardComponent';
import { LoginComponent}  from './login/loginComponent';
import { DescripcionProductoComponent } from './descripcion-producto/descripcion-producto.component';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/pages/reset-password/reset-password';

export const routes: Routes = [
   // ruta  por defecto  de raiz,  muestra o  redirige o  muestra  los  productos
   { path: 'forgot-password', component: ForgotPassword, },
   { path: 'reset-password', component: ResetPassword, },
   { path:  '', component: DashboardComponent,},
   { path: 'app-login',    component:LoginComponent,},     //ruta explícita para inicio  de sesión
   { path: 'descripcion-producto/:id', component: DescripcionProductoComponent },
   { path: '**',  redirectTo: '' } //si  se intenta  entrar a una ruta que no  existe , redirige a productos
  ];
