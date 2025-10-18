import { Component, computed, effect } from '@angular/core';
import { CloseopenmodelsService } from '../../../../shared/services/closeopenmodels/closeopenmodels.service';
import { OrganizationService } from '../../services/organization/organization.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { BadgePipe } from '../../../../core/pipes/badge/badge.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-organization-members',
  imports: [BadgePipe],
  templateUrl: './organization-members.component.html',
  styleUrl: './organization-members.component.css'
})
export class OrganizationMembersComponent {
  $orgMembersModelIsOpened = computed(()=>this.closeOpenModelService.$isOpened['orgMembersModel']())
  $currentOrgMembers = computed(()=>this.organizationService.members.currentOrgMembers())
  // $members:any[] = []
constructor(private authService:AuthService, private closeOpenModelService:CloseopenmodelsService,private organizationService:OrganizationService,private toastrService:ToastrService){

}
ngOnInit(): void {
}
deleteMember(user_id:string,created_by:string){
  console.log(created_by , this.authService.$user_id());
  
   if (created_by !== this.authService.$user_id()) {
    this.toastrService.warning(`Admins only can delete members`);
    return;
   }
  this.organizationService.deleteOrganizationMemberByUserID(user_id).subscribe();
  
}
  closeSearchModel(e:Event){

  this.closeOpenModelService.closeSearchModel(e,'members-container','orgMembersModel');
   this.organizationService.$currentOrg.set(null);
  }
}
