import { Component, computed, effect, ElementRef, Input, signal, untracked, ViewChild } from '@angular/core';
import { BadgePipe } from '../../../core/pipes/badge/badge.pipe';
import { AuthService } from '../../../features/auth/services/auth/auth.service';
import { CloseopenmodelsService } from '../../services/closeopenmodels/closeopenmodels.service';
import { debounceTime, distinctUntilChanged, from, fromEvent, last, map, switchMap, takeLast } from 'rxjs';
import { IDtoNamePipe } from '../../../core/pipes/IDtoName/idto-name.pipe';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../features/organization/services/organization/organization.service';
import { TaskService } from '../../../features/task-list/services/task services/task.service';

@Component({
  selector: 'app-search',
  imports: [BadgePipe,CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  $organizationID = computed(()=>this.organizationService.orgSystemID.organizationID());
  $selectedOrganizationID = computed(()=>this.organizationService.orgSystemID.selectedOrganizationID());
  $allMembersOfCurrentSystem = computed(()=>this.organizationService.members.allMembersOfCurrentSystem());
  $orgsUsers=computed(()=>this.authService.$orgsUsers());
  $currentOrgMembersInTaskForm = computed(()=>this.organizationService.members.currentOrgMembersInTaskForm());
  // $currentOrgMembersInTaskForm=signal<any[]>([]);
  $autoCompleteList=computed(()=>this.authService.$autoCompleteList());
  $selectedOrgMember=computed(()=>this.authService.$selectedOrgMember());
  $selectedtaskMember=computed(()=>this.authService.$selectedtaskMember());
  $user_id=computed(()=>this.authService.$user_id());
  $isSearchedInTaskForm=computed(()=>{console.log(this.taskService.$isSearchedInTaskForm())
    return this.taskService.$isSearchedInTaskForm();
  });
  $searchModelIsOpened =computed(()=>this.closeOpenModelService.$isOpened['searchModel']())
  @Input() searchModelIsOpened:boolean = false;
// selectedId?:string
isOpenedMenu:boolean=false;
selectedAsignee:string='Asignee To...';
selectedID:string|null=null
@ViewChild('input') input!:ElementRef
constructor(private authService:AuthService, private closeOpenModelService:CloseopenmodelsService,private organizationService:OrganizationService,private taskService:TaskService){
  // this.organizationService.getOrganizationMembers(this.organizationService.orgIDs());
  effect(()=>{
    if (!this.$isSearchedInTaskForm()&&this.$searchModelIsOpened()) {
     untracked(()=> this.getMatchedUser()) 
    }
  })
}

toggleMenu(){
  this.isOpenedMenu = !this.isOpenedMenu;
}
ngAfterViewInit(): void {
}
getMatchedUser()
{
fromEvent(this.input.nativeElement, 'input').pipe(
  map((event: any) => event.target.value),
  debounceTime(1000),
  switchMap((value)=>{
    return this.authService.getSelectedOrgMember(value);
  })
 ).subscribe({
  next:(data)=>{
   
  if (data) 
  this.authService.$autoCompleteList.set(data);
  this.authService.$selectedOrgMember.set(null);
  }
 })
// }
}
selectOption(selectedValue:any){
  this.isOpenedMenu = false;
  // this.closeOpenModelService.initializeValuesInTaskForm();
  if (this.$isSearchedInTaskForm()) {
    this.authService.$selectedtaskMember.set(selectedValue);
   return;
  }
    this.authService.$selectedOrgMember.set(selectedValue);
   
 
  }
  closeSearchModel(e:Event){
  this.closeOpenModelService.closeSearchModel(e,'search-container','searchModel');
  //  if (this.$isSearchedInTaskForm()) 
  //  this.taskService.$isSearchedInTaskForm.set(false);
  }
addNewMemberToCurrentOrg(){
    //  in case of working with the form only close then return ;
    this.closeOpenModelService.$isOpened['searchModel'].set(false);
    this.closeOpenModelService.initializeValuesInTaskForm();
    // this.organizationService.members.currentOrgMembersInTaskForm.set(null);
    if (this.$isSearchedInTaskForm()) return;
    // ===============================================
    // in case of searching for system members
    if (!this.$organizationID()) return;
    const currentOrgID = this.$organizationID();
    if (!this.$selectedOrgMember()) return;
    const request = {organization_id:this.$organizationID(),user_id:this.$selectedOrgMember().id , role:'member'};
    this.organizationService.addMemberToOrganization(request).subscribe({next:()=>{
      // update ui 
      if (currentOrgID) {
      this.organizationService.orgSystemID.orgIDs.update(ids=> [...ids,currentOrgID])
      
      // this.authService.$orgsUsers.update((v:any) => this.$matchedUser() ? {...v, [currentOrgID] : [...v?.[currentOrgID] || [],this.$matchedUser()]}: v);
      }
    this.authService.$selectedOrgMember.set(null);
    this.authService.$autoCompleteList.set(null);
    this.input.nativeElement.value=''
    }})
}
fetchMembersInTaskForm(){
  this.organizationService.fetchMembersInTaskForm();
}
}
