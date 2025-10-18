import { Component, computed, Input, ViewChild } from '@angular/core';
import { CategoryService } from '../../services/category service/category.service';
import { ManageCategoriesComponent } from '../manage-categories/manage-categories.component';
import { CreateNewCategoryComponent } from "../create-new-category/create-new-category.component";
import { CloseopenmodelsService } from '../../../../shared/services/closeopenmodels/closeopenmodels.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TaskService } from '../../../task-list/services/task services/task.service';
import { AuthService } from '../../../auth/services/auth/auth.service';

@Component({
  selector: 'app-category-list',
  imports: [ManageCategoriesComponent, CreateNewCategoryComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  checkedCategory :{ID:string,state:boolean} ={ID:'',state:false}
  @Input()isSideBar:boolean = false;
  $isSelectedCategoryMode=computed(()=>this.closeopenmodelsService.$isSelectedCategoryMode());
  $selectedTaskID =computed(()=>this.categoryService.$selectedTaskID());
  $categories:any[]=[];
constructor(private authService:AuthService,private taskService:TaskService,private Router:Router,private categoryService:CategoryService,private closeopenmodelsService:CloseopenmodelsService,private toastrService:ToastrService){}
async ngOnInit() {
//  await this.categoryService.getCategory(this.authService.$user_id());
 this.getCategory();
}
getCategory(){
 this.categoryService.$categoriesObservable.subscribe({
  next:(res)=>{
    this.$categories = res;
  }
 })
}
deleteCategory(ID:string){
  this.categoryService.deleteCategory(ID);
}
updateCategory(currentCategory:any){
  this.manageCategoryComponent.patchFormValues(currentCategory);
  this.showForm();
}
@ViewChild('manageC') manageCategoryComponent!:ManageCategoriesComponent;
showForm(){
this.manageCategoryComponent.formIsOpened = true;
}
assignCheckedCategory(categoryID:string,isChecked:boolean){
this.checkedCategory = {ID:categoryID,state:isChecked};
  console.log(this.categoryService.$selectedTaskID());

}
addCategoryToTask(){
  this.categoryService.addCategoryToTask(this.checkedCategory.ID).then((data)=>{
      const mappedTasks = [...this.taskService.$filteredTasks()].map(t=>t.task_id === data?.[0].task_id?data?.[0]:t)
        // still i dont know why i need to do this step even the ui depend on $filtered array
      this.taskService.setTasks(mappedTasks);
      this.taskService.$filteredTasks.set(mappedTasks);
      this.toastrService.success(`this category is added to your task!`);
      this.closeopenmodelsService.$isSelectedCategoryMode.set(false);
      this.Router.navigate(['/alltasks']);
  })
}
}
