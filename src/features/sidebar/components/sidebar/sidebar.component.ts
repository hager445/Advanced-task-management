import { Component, computed, effect, EventEmitter, Output, ViewChild } from '@angular/core';
import { CreateOrganizationComponent } from "../../../organization/components/create-organization/create-organization.component";
import { OrganizationListComponent } from "../../../organization/components/organization-list/organization-list.component";
import { OrganizationModalComponent } from "../../../organization/components/organization-modal/organization-modal.component";
import { OrganizationService } from '../../../organization/services/organization/organization.service';
import { LoadMoreComponent } from "../../../../shared/components/load-more/load-more.component";
import { CreateTaskComponent } from "../../../task-list/components/create-task/create-task.component";
import { TaskService } from '../../../task-list/services/task services/task.service';
import { CreateNewCategoryComponent } from "../../../task categories/components/create-new-category/create-new-category.component";
import { ManageCategoriesComponent } from '../../../task categories/components/manage-categories/manage-categories.component';
import { CategoryListComponent } from "../../../task categories/components/category-list/category-list.component";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth/auth.service';


@Component({
  selector: 'app-sidebar',
  imports: [CreateOrganizationComponent, OrganizationListComponent, OrganizationModalComponent, LoadMoreComponent, CreateTaskComponent, CreateNewCategoryComponent, ManageCategoriesComponent, CategoryListComponent,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  categoriesRouterLink:string='/categories'
  $selectedOrganizationID = computed(()=>this.organizationService.orgSystemID.selectedOrganizationID());
  $currentOrg = computed(()=>this.organizationService.$currentOrg());
  $selectedOrganization:any;
  todayTasks=computed(()=>this.tasksService.$todayTasks());
  upcomingTasks=computed(()=>this.tasksService.$upcomingTasks());
  $tasks:any[]=[];
  // $isOpenedOrgModal = computed(()=>(this.organizationService.$isOpenedOrgModal()));
  constructor(private organizationService:OrganizationService,private tasksService:TaskService,private Router:Router , private authService:AuthService){
    this.tasksService.$tasksObservable.subscribe((tasks)=>{
      this.$tasks = tasks;
      this.tasksService.setTaskScadule(tasks);
    })
   
    effect(()=>{
      this.organizationService.getOrganizationByID(this.$selectedOrganizationID())?.subscribe((res)=>{
       this.$selectedOrganization = res;
      })

    })
  }
isOpened:boolean = false;

ngOnInit(): void {


}
@ViewChild('manageC') manageCategoryComponent!:ManageCategoriesComponent;
showForm(){
this.manageCategoryComponent.formIsOpened = true;
}
navigateToList()
{
this.Router.navigate([this.categoriesRouterLink]);
}
logout(){
this.authService.logout().subscribe({next:(res)=>{
this.Router.navigate(['/register']);
// localStorage.clear();
localStorage.removeItem('listView')
localStorage.removeItem('btnView')
localStorage.removeItem('orgsUsers')
localStorage.removeItem('updatedUser')
localStorage.removeItem('selectedOrgID')
sessionStorage.clear()
}})
}
}
