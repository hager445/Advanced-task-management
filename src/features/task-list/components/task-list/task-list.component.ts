import { EditaddformsService } from './../../../../shared/services/editaddforms/editaddforms.service';
import { Component, computed, effect } from '@angular/core';
import { TaskService } from '../../services/task services/task.service';
import { CommonModule } from '@angular/common';
import { FilterComponent } from "../../../../shared/components/filter/filter.component";
import { TaskCardComponent } from "../task-card/task-card.component";

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FilterComponent, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
 filteredTasks: {
  pendingTasks: any[];
  inProgressTasks: any[];
  completedTasks: any[];
} = {
  pendingTasks: [],
  inProgressTasks: [],
  completedTasks: []
};

  $filteredTasks=computed(()=>this.taskService.$filteredTasks());
  $tasks:any[]=[];
  constructor(private taskService:TaskService,private editaddformsService:EditaddformsService){
     this.editaddformsService.isEdit.taskForm.set(false);
    this.taskService.$tasksObservable.subscribe({
    next:(res)=>{
 
      this.$tasks = res;
      this.getFilteredTasks();
    }
  })
}

getFilteredTasks(){
  // for getting the num of each task's state
  this.filteredTasks.pendingTasks = this.$tasks?.filter(task=>task.status==='pending')
  this.filteredTasks.inProgressTasks = this.$tasks?.filter(task=>task.status==='progress')
  this.filteredTasks.completedTasks = this.$tasks?.filter(task=>task.status==='completed')
}
}
