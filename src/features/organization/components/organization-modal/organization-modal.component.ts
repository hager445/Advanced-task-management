import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, input, Input, Output, SimpleChanges } from '@angular/core';
import { OrganizationService } from '../../services/organization/organization.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { EditaddformsService } from '../../../../shared/services/editaddforms/editaddforms.service';
import { CloseopenmodelsService } from '../../../../shared/services/closeopenmodels/closeopenmodels.service';

@Component({
  selector: 'app-organization-modal',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './organization-modal.component.html',
  styleUrl: './organization-modal.component.css'
})
export class OrganizationModalComponent {
$organizationID=computed(()=>(this.organizationService.orgSystemID.organizationID()));
$isOrgEdit=computed(()=>(this.editAddFormsService.isEdit.orgForm()));
$user_id=computed(()=>(this.authService.$user_id(
)));
$isOpenedOrgModal = computed(()=>(this.closeOpenModelsService.$isOpened['orgModel']()));
// @Input() isOpened:boolean=false;
// @Output() modalIsClosed = new EventEmitter<boolean>();
inputsForm!:FormGroup;
constructor(private closeOpenModelsService:CloseopenmodelsService,private organizationService:OrganizationService , private fb:FormBuilder , private toastrService:ToastrService, private authService:AuthService,private editAddFormsService:EditaddformsService){
 
  effect(()=>{
   
   if (this.$organizationID()&&this.$isOrgEdit()) { 
   organizationService.getOrganizationByID(this.$organizationID())?.subscribe(value=>{
    this.inputsForm.patchValue(value);
   })
     
    }
  
  })
  
}
closeModal(){

  this.closeOpenModelsService.$isOpened['orgModel'].set(false);
  this.organizationService.orgSystemID.organizationID.set(null);
  // this.organizationService.$isOrgEdit.set(false);
  this.editAddFormsService.isEdit.orgForm.set(false);
  this.inputsForm.reset()
  
  
}

ngOnInit(): void {

  this.inputsForm = this.fb.group({
    name:['',[Validators.required]],
    created_by:['',[Validators.required]]
  })
}
onOrgFormSubmit(){

   if (!this.$user_id())return;
   this.inputsForm.get('created_by')?.patchValue(this.$user_id());
   if (!this.inputsForm.valid )return;
  if (this.$organizationID()&&  this.editAddFormsService.isEdit.orgForm()) {
    this.updateOrganizationByID(this.$organizationID(),this.inputsForm.value);
    return;
  }
  
    this.insertNewOrganization(this.inputsForm.value);

}
updateOrganizationByID(orgID:string|null,formValue:any){
 
this.organizationService.updateOrganizationByID(orgID,formValue).subscribe(()=>{
  this.closeModal()
})
}
insertNewOrganization(formValue:any){
 
  const nameIsRepeated = this.organizationService.checkReapetedNames(formValue);
 
  if (nameIsRepeated) {
    this.toastrService.error('This Organization Name is already exists!');
    return;
  }
this.organizationService.createNewOrganization(formValue,this.$user_id()).subscribe({next:(res)=>{
  this.closeModal();
}})
}
}
