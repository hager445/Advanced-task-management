import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, ViewChild } from '@angular/core';
import { OrganizationService } from '../../services/organization/organization.service';
import { BadgePipe } from '../../../../core/pipes/badge/badge.pipe';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../task-list/services/task services/task.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { StorageService } from '../../../../shared/services/storage/storage.service';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { CloseopenmodelsService } from '../../../../shared/services/closeopenmodels/closeopenmodels.service';
import { ToastrService } from 'ngx-toastr';
import { EditaddformsService } from '../../../../shared/services/editaddforms/editaddforms.service';

@Component({
  selector: 'app-organization-list',
  imports: [BadgePipe, CommonModule, SearchComponent],
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.css'
})
export class OrganizationListComponent {
  isMuted:boolean=true;
  colors = [
  "#1d4ed8", // blue-700
  "#3b82f6", // blue-500
  "#22c55e", // green-500
  "#eab308", // yellow-500
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#a855f7", // purple-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#6b7280"  // gray-500
];
  showedListIndex=computed (()=>this.organizationService.$showedListIndex())
  $selectedOrganizationID=computed (()=>this.organizationService.orgSystemID.selectedOrganizationID())
  $user_id=computed (()=>this.authService.$user_id())
  obj:{[key:string]:boolean}={}
  orgID:string = '';
  personalOrgID:string = '';
  isMatched:boolean = false;
  $organizations:any[]=[];
  $personalOrg:any;
constructor(private closeOpenModelsService:CloseopenmodelsService,private organizationService:OrganizationService ,private taskService:TaskService,private Router:Router,private authService:AuthService ,private cd:ChangeDetectorRef,private storageService:StorageService,private toastrService:ToastrService,private editAddFormsService:EditaddformsService){
  effect(()=>{
      if (this.$user_id()) 
      this.organizationService.getOrganizations(this.$user_id()).subscribe();
    
  })
}
 ngOnInit() {
   
   const isSelectedOrgID =  this.storageService.getValue('selectedOrgID');
   
   this.organizationService.$orgsObservable.subscribe({next:(data)=>{
     if (data&& data.length > 0){
       this.$personalOrg = data.filter(org=>org.name.toLowerCase() === 'personal' && org.created_by === this.$user_id());
       this.personalOrgID = this.$personalOrg?.[0]?.id || null;
       // default selected org ID:
       if (!isSelectedOrgID) {
         this.organizationService.orgSystemID.selectedOrganizationID.set(this.personalOrgID);
         this.storageService.storeValue('selectedOrgID',this.personalOrgID);

       }
       this.$organizations = data.filter(org=>org.name.toLowerCase() !== 'personal'); 
      }
   
    }})

  
  // fetch personal :


  
} 



// ============
toggleMenu(id:string){
  if ( id in this.obj) {
    // this.isMatched=!this.isMatched
    this.obj =  {...this.obj, [id]:!this.obj[id]};
    return;
  }
    this.obj={};
    // this.isMatched = true;
    this.obj[id] = true;
}
updateOrganization(currentID:string,org:any){
  this.obj =  {...this.obj, [currentID]:false};
    if (org.created_by !== this.authService.$user_id()) {
    this.toastrService.warning(`only admins can add members to this organization!`)
    return;
  }
  this.closeOpenModelsService.$isOpened['orgModel'].set(true);
// to close menu ...
this.organizationService.orgSystemID.organizationID.set(currentID);
  this.editAddFormsService.isEdit.orgForm.set(true);

}
deleteOrganization(currentID:string,org:any){
  this.obj =  {...this.obj, [currentID]:false};
    if (org.created_by !== this.authService.$user_id()) {
    this.toastrService.warning(`only admins can delete this organization!`)
    return;
  }
this.organizationService.deleteOrganization(currentID);

}
onPersonalMouseEnter(){
this.isMuted=false
}
onPersonalMouseLeave(){
this.isMuted=true
}

selectOrganization(orgID:string|null,e:Event,org:any){
    
  if (orgID===this.personalOrgID) {
    this.isMuted=false;
  }
if (e?.target) {
  const btn = (e.target as HTMLElement).closest('.menu-container');
  if (btn) {
    return;
  }
}
  this.organizationService.orgSystemID.selectedOrganizationID.set(orgID);
  this.storageService.storeValue('selectedOrgID',this.organizationService.orgSystemID.selectedOrganizationID());

  this.organizationService.$currentOrg.set(org);

if (orgID) 
  // for ui
this.orgID=orgID
this.Router.navigate(['/alltasks'])
}
// handle org members :
// @ViewChild('searchComponent') searchComponent!:SearchComponent;
onAddMembers(currentID:string,org:any){
  this.obj =  {...this.obj, [currentID]:false};
  console.log(org , this.authService.$user_id());
  
  if (org.created_by !== this.authService.$user_id()) {
    this.toastrService.warning(`only admins can add members to this organization!`)
    return;
  }
  this.organizationService.orgSystemID.organizationID.set(currentID);
  this.organizationService.$currentOrg.set(org);
  this.closeOpenModelsService.$isOpened['searchModel'].set(true);
  
  
  
}
onShowMembers(currentID:string,org:any){
  this.obj =  {...this.obj, [currentID]:false};
  this.closeOpenModelsService.$isOpened['orgMembersModel'].set(true);
  this.organizationService.$currentOrg.set(org);
  this.organizationService.orgSystemID.organizationID.set(currentID);
}
}
