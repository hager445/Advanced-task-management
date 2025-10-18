import { Component, computed, effect, untracked } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task services/task.service';
import { ToastrService } from 'ngx-toastr';
import { checkSameTask } from '../../../../shared/validators/task.validator';
import { OrganizationService } from '../../../organization/services/organization/organization.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { BadgePipe } from '../../../../core/pipes/badge/badge.pipe';
import { CloseopenmodelsService } from '../../../../shared/services/closeopenmodels/closeopenmodels.service';
import { EditaddformsService } from '../../../../shared/services/editaddforms/editaddforms.service';
import { StorageService } from '../../../../shared/services/storage/storage.service';

@Component({
  selector: 'app-task-form',
  imports: [RouterLink,ReactiveFormsModule,BadgePipe],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  $selectedOrganizationID = computed(()=>this.organizationService.orgSystemID.selectedOrganizationID());
  $updatedTask = computed(()=>this.taskService.$updatedTask());
  $currentOrg = computed(()=>this.organizationService.$currentOrg());
  $orgsUsers = computed(()=>this.authService.$orgsUsers());
  $isEditTaskForm = computed(()=>this.editaddformsService.isEdit.taskForm());
  $selectedtaskMember = computed(()=>this.authService.$selectedtaskMember());
  
  priorities = [
  { label: 'Low', value: 'low', icon: 'fa-arrow-down'},
  { label: 'Medium', value: 'medium', icon: 'fa-minus'},
  { label: 'High', value: 'high', icon: 'fa-arrow-up'},
];
  statusList = [
  { label: 'Pending', value: 'pending', icon: 'fa-arrow-down' },
  { label: 'In Progress', value: 'progress', icon: 'fa-minus'},
  { label: 'Completed', value: 'completed', icon: 'fa-arrow-up'},
];
selectedId?:string
isOpenedMenu:boolean=false;
inputsForm!:FormGroup;
selectedAsignee:string='Asignee To...';
selectedID:string|null=null
constructor(private storageService:StorageService,private editaddformsService:EditaddformsService,private fb:FormBuilder,private taskService:TaskService, private toastrService:ToastrService, private router:Router,private organizationService:OrganizationService, private authService:AuthService, private closeOpenModelService:CloseopenmodelsService){
  // const updatedTask = this.storageService.getValue('updatedTask');
  // if (updatedTask) {
  //   this.taskService.$updatedTask.set(updatedTask);
  // }
  effect(()=>{
    // console.log(this.$updatedTask());
    
  if (Object.keys(this.$updatedTask()).length === 0)return;
  // السطر دا بيتجاهل وجود اي تعديل في اي سيجنال فالدالة بالتالي يمنع عمل loop
    untracked(()=> this.patchTaskValueForEdit());
  })
   effect(()=>{
      if (!this.editaddformsService.isEdit.taskForm()) {
     untracked(()=>  this.initializeForm())
      }
    })

  this.inputsForm=this.fb.group({
   
   title: ['', {
    validators: [Validators.required],
    asyncValidators: [checkSameTask()],
    updateOn: 'blur'
  }],
    description:['',[Validators.required]],
    due_date:['',[Validators.required]],
    status:['',[Validators.required]],
    priority:['',[Validators.required]],
    assigned_to :['',[Validators.required]],
    organization_id:['',[Validators.required]],
    created_by:['',[Validators.required]]
  })
}
toggleMenu(){
  this.isOpenedMenu = !this.isOpenedMenu;
}
selectOption(controlName:string,selectedValue:string){

  this.inputsForm.get(controlName)?.setValue(selectedValue);
  this.selectedID = selectedValue;
  this.isOpenedMenu = false;

  
}
onSubmit(){
  // if (!this.$selectedtaskMember()) return;
  // let payload = {...this.inputsForm.value} 
  if (this.inputsForm.get('title')?.errors?.['sameTaskName']) {
    this.toastrService.error(`This Task is already exists!`);
    return;
  }
  console.log(this.$isEditTaskForm());
  
  if (this.$isEditTaskForm()) {
    this.updateCurrentTask()
  }else{
    this.inputsForm.patchValue({
     'assigned_to' : this.$selectedtaskMember()?.user_id,
     'organization_id' : this.$selectedOrganizationID(),
     'created_by':this.authService.$user_id()
   })
   
   this.insertNewTask();
  }
  
  // this.inputsForm.reset()
}
insertNewTask(){
 if (!this.inputsForm.valid) {
    this.toastrService.error(`please insert valid values!`);
    return;
  }
this.taskService.insertNewTask(this.inputsForm.value).subscribe({next:()=>{

this.initializeForm()
this.router.navigate(['/alltasks']);
}})
}
updateCurrentTask(){
    if (!this.inputsForm.valid) {
    this.toastrService.error(`please insert valid values!`);
    return;
  }
this.taskService.updateCurrentTask(this.inputsForm.value,this.$updatedTask().task_id).subscribe({next:()=>{
  this.initializeForm()
  this.storageService.removeValue('updatedTask');
  this.router.navigate(['/alltasks']);
}})
}
openSearchModel(){
  this.closeOpenModelService.$isOpened['searchModel'].set(true);
  this.taskService.$isSearchedInTaskForm.set(true)
}
patchTaskValueForEdit(){
    const data = this.organizationService.members.allMembersOfCurrentSystem()?.filter(m=>m.organization_id === this.organizationService.orgSystemID.selectedOrganizationID()) || []
    const matchTaskMember = data?.find(m => m.user_id === this.$updatedTask().assigned_to);
     this.authService.$selectedtaskMember.set(matchTaskMember);
    const currentObj = {
      ...this.$updatedTask(),
      'due_date':this.$updatedTask().due_date.split('T')[0]
    }
    
    
    this.inputsForm.patchValue(currentObj);
}
initializeForm(){
this.authService.$selectedtaskMember.set(null);
this.taskService.$updatedTask.set({});
// remove from localstorage
this.inputsForm.reset();
}
}
