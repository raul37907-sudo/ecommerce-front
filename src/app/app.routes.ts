import { Routes } from '@angular/router';
import {DashboardComponent}  from './dashboard/dashboardComponent';
import {LoginComponent}  from './login/loginComponent';

export const routes: Routes = [

  {
      path: '',
      redirectTo: 'app-login',
      pathMatch: 'full'
    },
  {
    path:'app-login',
    component:LoginComponent,
    },

  {
    path:'dashboard',
    component: DashboardComponent,
    }

  ];
