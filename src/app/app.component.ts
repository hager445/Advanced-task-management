import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from "../shared/components/header/header.component";
import { TaskFormComponent } from "../features/task-list/components/task-form/task-form.component";
import { TaskListComponent } from "../features/task-list/components/task-list/task-list.component";
import { SidebarComponent } from "../features/sidebar/components/sidebar/sidebar.component";
import { RegisterComponent } from "../features/auth/components/register/register.component";
import { AuthService } from '../features/auth/services/auth/auth.service';
import { LoginComponent } from "../features/auth/components/login/login.component";
import { StorageService } from '../shared/services/storage/storage.service';
import { OrganizationService } from '../features/organization/services/organization/organization.service';
import { supabase, tokenName } from '../enviroments/supabase';
import { CategoryService } from '../features/task categories/services/category service/category.service';
import { NgxSpinnerModule } from "ngx-spinner";
// import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-root',
  imports: [  NgxSpinnerModule,RouterOutlet, ButtonModule, HeaderComponent, TaskFormComponent, TaskListComponent, SidebarComponent, RegisterComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task-manager';
  constructor(private categoryService :CategoryService,private authService:AuthService,private storageService:StorageService,private organizationService:OrganizationService){
    effect(()=>{
      if (this.authService.$user_id())
      this.categoryService.getCategory(this.authService.$user_id());
    })
    
  }
  ngOnInit(): void {
     supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      this.authService.$user_id.set(session.user.id);
      // Refresh session on tab focus
    } else {
      this.authService.$user_id.set(null);
    }
  });
   const token =  this.storageService.getValue(tokenName);
   const selectedOrgID =  this.storageService.getValue('selectedOrgID');
   
   if (!token) {
     this.showAuthForm();
   }
  this.authService.getUser().subscribe();
  if (selectedOrgID) {
    this.organizationService.orgSystemID.selectedOrganizationID.set(selectedOrgID);
  }
  }
  showAuthForm(){
    setTimeout(()=>{
      this.authService.loginIsOpened.set(true);
    },500)
  }
}
