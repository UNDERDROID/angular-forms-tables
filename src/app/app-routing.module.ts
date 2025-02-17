import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './components/auth/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { superadminGuard } from './components/auth/superadmin.guard';


const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'login',
    component:LoginComponent
  },{
    path: 'register',
    component:RegisterComponent
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users-table',
    component: UsersComponent,
    canActivate: [authGuard, superadminGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
