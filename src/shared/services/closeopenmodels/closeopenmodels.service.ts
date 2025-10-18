import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { OrganizationService } from '../../../features/organization/services/organization/organization.service';
import { TaskService } from '../../../features/task-list/services/task services/task.service';

@Injectable({
  providedIn: 'root'
})
export class CloseopenmodelsService {
  $isSelectedCategoryMode= signal<boolean>(false);
  $isOpened : {[key:string]:WritableSignal<boolean>}= {
    'searchModel' : signal<boolean>(false),
    'orgMembersModel':signal<boolean>(false),
    'orgModel':signal<boolean>(false),
  }
  $searchModelIsOpened = signal<boolean>(false);
  $orgMembersModelIsOpened = signal<boolean>(false);
  constructor(private organizationService:OrganizationService,private taskService:TaskService) { }
closeSearchModel(e: Event, containerClass: string, modelName: string) {
  const target = e.target as HTMLElement;
 
  
  if (!target) return;
  

  const container = target.closest(`.${containerClass}`);
 
  if (!container) {
    this.$isOpened[modelName].set(false);
    this.initializeValuesInTaskForm()
  }
  
}
initializeValuesInTaskForm(){
    this.organizationService.$currentOrg.set(null);
    this.taskService.$isSearchedInTaskForm.set(false);
    this.organizationService.members.currentOrgMembersInTaskForm.set(null);
}
}
