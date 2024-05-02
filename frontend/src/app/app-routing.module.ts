import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { LoginComponent } from './components/login/login.component';
import { HelloComponent } from './hello/hello.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepartmentComponent } from './components/department/department.component';
import { LocationComponent } from './components/location/location.component';
import { UpdateDepartmentComponent } from './components/update-department/update-department.component';
import { UpdateLocationComponent } from './components/update-location/update-location.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register',component: RegisterComponent},
  { path: 'user', component: ViewUserComponent },
  { path: 'add', component: AddUserComponent },
  { path: 'update/:id', component: UpdateUserComponent},
  { path: 'dashboard', component: DashboardComponent },
  {path : 'hello',component:HelloComponent},
  { path: 'departments', component: DepartmentComponent },
  { path: 'locations', component: LocationComponent },
  
  { path: 'updatedepartment/:id', component: UpdateDepartmentComponent },
  {path:'updatelocation/:id',component:UpdateLocationComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
