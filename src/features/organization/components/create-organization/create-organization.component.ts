import { Component, EventEmitter, Output } from '@angular/core';
import { OrganizationService } from '../../services/organization/organization.service';
import { EditaddformsService } from '../../../../shared/services/editaddforms/editaddforms.service';
import { CloseopenmodelsService } from '../../../../shared/services/closeopenmodels/closeopenmodels.service';

@Component({
  selector: 'app-create-organization',
  imports: [],
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.css'
})
export class CreateOrganizationComponent {

constructor(private closeOpenModelsService:CloseopenmodelsService,private editAddFormsService:EditaddformsService){}
createNewOrganization(){
 
  this.closeOpenModelsService.$isOpened['orgModel'].set(true);
  this.editAddFormsService.isEdit.orgForm.set(false);


  
}
}
