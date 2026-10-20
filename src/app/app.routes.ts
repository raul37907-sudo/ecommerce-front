import { Routes } from '@angular/router';
import {DashboardComponent}  from './dashboard/dashboardComponent';
import {LoginComponent}  from './login/loginComponent';
import { DescripcionProductoComponent } from './descripcion-producto/descripcion-producto.component';

export const routes: Routes = [

   // ruta  por defecto  de raiz,  muestra o  redirige o  muestra  los  productos
   { path:'', component: DashboardComponent,},
   { path:'app-login',    component:LoginComponent,},     //ruta explícita para inicio  de sesión
   { path: 'descripcion-producto/:id', component: DescripcionProductoComponent },
   { path: '**',  redirectTo: '' ,pathMatch: 'full'}//si  se intenta  entrar a una ruta que no  existe , redirige a productos
  ];
