import { Routes } from '@angular/router';
import { TaskListComponent } from '../features/task-list/components/task-list/task-list.component';
import { TaskFormComponent } from '../features/task-list/components/task-form/task-form.component';
import { CategoryListComponent } from '../features/task categories/components/category-list/category-list.component';
import { ManageCategoriesComponent } from '../features/task categories/components/manage-categories/manage-categories.component';
import { RegisterComponent } from '../features/auth/components/register/register.component';
import { DashboardComponent } from '../features/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path:'',
       component:DashboardComponent,
        children: [
      { path: '', redirectTo: 'alltasks', pathMatch: 'full' },
      { path: 'alltasks', component: TaskListComponent },
      { path: 'task-form', component: TaskFormComponent },
      { path: 'categories', component: CategoryListComponent },
    ]
    },
    {
        path:'register' , component:RegisterComponent
    }



];
