import { CloseopenmodelsService } from './../../../../shared/services/closeopenmodels/closeopenmodels.service';
import { OrganizationService } from './../../../organization/services/organization/organization.service';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, Input, signal, Signal, WritableSignal } from '@angular/core';
import { TaskService } from '../../services/task services/task.service';
import { Router } from '@angular/router';
import { EditaddformsService } from '../../../../shared/services/editaddforms/editaddforms.service';
import { IDtoNamePipe } from '../../../../core/pipes/IDtoName/idto-name.pipe';
import { BadgePipe } from '../../../../core/pipes/badge/badge.pipe';
import { CategoryService } from '../../../task categories/services/category service/category.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../../shared/services/storage/storage.service';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule,IDtoNamePipe,BadgePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
// @Input() filteredTasks!:Signal<any[]>;
 viewList = computed(()=>this.taskService.listView())
 $allMembersOfCurrentSystem = computed(()=>this.organizationService.members.allMembersOfCurrentSystem())
 $selectedTaskID = computed(()=>this.categoryService.$selectedTaskID())
 $filteredTasks=computed(()=>this.taskService.$filteredTasks())
$categories:any[]=[];

constructor(private storageService:StorageService,private toastrService:ToastrService,private taskService:TaskService,private Router:Router,private editaddformsService:EditaddformsService , private organizationService:OrganizationService,private closeopenmodelsService:CloseopenmodelsService,private categoryService:CategoryService){
   this.categoryService.$categoriesObservable.subscribe({
  next:(res)=>{
    this.$categories = res;
  }
 })
//  effect(()=>{
//   console.log(this.$filteredTasks());
  
//  })
}
deleteTask(ID:string){
this.taskService.deleteTask(ID).subscribe();
}
updateTask(ID:string,task:any){
 if (!ID) return;
 this.editaddformsService.isEdit.taskForm.set(true);
 this.taskService.getTaskByID(ID)?.subscribe({next:(task)=>{
  this.storageService.storeValue('updatedTask',task);
  this.Router.navigate(['/task-form']);
 }});
}
addCategory(ID:string|null){
  this.categoryService.$selectedTaskID.set(ID);
  if(!this.categoryService.$selectedTaskID())return;
  this.Router.navigate(['/categories']);
  this.closeopenmodelsService.$isSelectedCategoryMode.set(true);
}
deleteCategoryItem(taskID:string|null){
this.categoryService.deleteCategoryItem(taskID).then((data)=>{
      const mappedTasks = [...this.taskService.$filteredTasks()].map(t=>t.task_id === data?.[0].task_id?data?.[0]:t)
        // still i dont know why i need to do this step even the ui depend on $filtered array
      this.taskService.setTasks(mappedTasks);
      this.taskService.$filteredTasks.set(mappedTasks);
      this.toastrService.success(`this category is deleted from your task!`);
})
}
}
