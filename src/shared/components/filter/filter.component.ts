import { IsAny } from './../../../../node_modules/@supabase/postgrest-js/src/select-query-parser/utils';
import { Component, computed, effect, Input } from '@angular/core';
import { TaskService } from '../../../features/task-list/services/task services/task.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
$tasksList: any[]=[];
$filteredTasks=computed(()=>this.taskService.$filteredTasks());

isOpened:{[key:string]:boolean} = {
  'sortingDropdown':false,
  'priorityDropdown':false
}
selectedValues:{[key:string]:string} = {
  sortingValue:'',
  priorityValue:'',
  searchValue:''
}
// ai suggestion instead change the proper array!
 priorityOrder: Record<string, number> = {
  high: 1,
  medium: 2,
  low: 3
};
priorityOptions = [

  { value: 'All Tasks', label: 'All Tasks', icon: 'fas fa-clock' },
  { value: 'pending', label: 'Pending', icon: 'fas fa-clock' },
  { value: 'progress', label: 'In Progress', icon: 'fas fa-exclamation-triangle' },
  { value: 'completed', label: 'Completed', icon: 'fas fa-calendar-alt' }
];
sortOptions = [
  { value: 'priority', label: 'Priority', icon: 'fas fa-exclamation-triangle' },
  { value: 'deadline', label: 'Deadline', icon: 'fas fa-calendar-alt' },
  { value: 'alphabit', label: 'A-Z', icon: 'fas fa-sort-alpha-down' }
];
toggleView = [
  { isActive: true, icon: 'fas fa-th-large' },
  { isActive: false, icon: 'fas fa-list' },
 
];
constructor(private taskService:TaskService,private storageService:StorageService){
const listView  = this.storageService.getValue('listView');
const btnView  = this.storageService.getValue('btnView');
if (btnView) {
  this.toggleView = btnView;
}
if (listView !== null)
this.taskService.listView.set(listView);
 this.taskService.$tasksObservable.subscribe({next:(tasks)=>{
 this.$tasksList = tasks;
}})
}
toggleDropdown(dropdown:string){
this.isOpened[dropdown]=!this.isOpened[dropdown];
}
ngOnInit(): void {
  this.filterOperation()
}
selectSortValue(value:string){
this.selectedValues['sortingValue']= value;
console.log(this.selectedValues);
this.isOpened['sortingDropdown']= false;
this.filterOperation()

}
selectPriorityValue(value:string){
this.selectedValues['priorityValue']= value;
console.log(this.selectedValues);
this.isOpened['priorityDropdown'] = false;
this.filterOperation()

}
selectSearchValue(e:Event){
const input = e.target as HTMLInputElement;
this.selectedValues['searchValue']= input.value;
console.log(this.selectedValues);
this.filterOperation()

}
sortBy(filteredTasks:any[]){
  if (this.selectedValues['sortingValue'] === 'alphabit') {
    filteredTasks.sort((a,b)=>a.title.localeCompare(b.title));
  }
 else if (this.selectedValues['sortingValue'] === 'priority') {
   filteredTasks.sort(
  (a, b) => this.priorityOrder[a.priority.toLowerCase()] - this.priorityOrder[b.priority.toLowerCase()]
);
   
  }
  else if(this.selectedValues['sortingValue'] === 'deadline'){
    filteredTasks.sort((a,b)=>    new Date(a.due_date.split("T")[0]).getTime() -
    new Date(b.due_date.split("T")[0]).getTime());
  }


}
filterOperation(){
  if (this.$tasksList?.length === 0) return;
  const filteredTasksList = this.$tasksList.filter(task=>{
  let statusIsMatched = this.selectedValues['priorityValue']?.toLowerCase() ? task.status.toLowerCase() === this.selectedValues['priorityValue']?.toLowerCase() : true 
  if (this.selectedValues['priorityValue'].toLowerCase() === 'all tasks'.toLowerCase()) {
    statusIsMatched = true
  }
    const searchIsMatched = this.selectedValues['searchValue']?.toLowerCase() ? task.title.toLowerCase().includes(this.selectedValues['searchValue']?.toLowerCase()):true
    return statusIsMatched && searchIsMatched
  }) 
  if (this.selectedValues['sortingValue']) {
    this.sortBy(filteredTasksList)
  }
  this.taskService.$filteredTasks.set(filteredTasksList);
}
onToggleView(i:number){
const view = this.toggleView.map((v,index)=>i===index?{...v,isActive:true}:{...v,isActive:false})
this.toggleView = view;
// we do a signal to control the view in other component
this.storageService.storeValue('btnView',view);
this.storageService.storeValue('listView',this.toggleView[0].isActive);
this.taskService.listView.set(this.toggleView[0].isActive);
}
// onToggleView(i: number) {
//   this.toggleView.forEach((v, index) => {
//     v.isActive = index === i;  // لو هو نفس الـ index يبقى active، غير كدا false
//   });
// }
}
