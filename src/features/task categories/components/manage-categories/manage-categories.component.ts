import { Component, ElementRef, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { CategoryService } from '../../services/category service/category.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth/auth.service';

@Component({
  selector: 'app-manage-categories',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-categories.component.html',
  styleUrl: './manage-categories.component.css'
})
export class ManageCategoriesComponent {
  isEdit:boolean=false;
  categoryID:string|null=null;
  inputsForm!:FormGroup;
  formIsOpened:boolean=false;
  @ViewChildren('colorOption') colorsOption! : QueryList<ElementRef>;
constructor(private authService:AuthService,private categoriesService:CategoryService, private fb:FormBuilder , private renderer2:Renderer2){}
ngOnInit(): void {
 
  this.inputsForm = this.fb.group({
    name:new FormControl(null,[Validators.required]),
    color:new FormControl(null,[Validators.required]),
    is_protected:new FormControl(null),
    user_id:new FormControl(null),
  })
    
    this.inputsForm.patchValue({ color: '#3b82f6'});
}

pickCategoryColor(currentColor?:string){
  
  this.colorsOption.forEach((CP)=>{
      CP.nativeElement.classList.remove('selected');
      CP.nativeElement.innerHTML = '';
    if (CP.nativeElement.dataset.color == currentColor) {
        CP.nativeElement.classList.add('selected');
        CP.nativeElement.innerHTML = '<i class="fas fa-check"></i>';
        this.inputsForm.patchValue({ color: currentColor });
    }
  });
}
onSubmitForm(){

 if (!this.authService.$user_id()) {
    return;
  }
  this.inputsForm.get('user_id')?.patchValue(this.authService.$user_id())
  this.inputsForm.get('is_protected')?.patchValue(false);
  if (!this.inputsForm.valid) {
   this.inputsForm.markAllAsTouched();
   return;
  } 
  console.log(this.inputsForm.value);
  
  if (this.isEdit) {
    this.updateCategory(this.inputsForm.value);
  }
  else{
    this.insertNewCategory(this.inputsForm.value)
  }
}
insertNewCategory(value:any){
   this.categoriesService.insertNewCategory(value).then(()=>{
    this.hideForm();
   })
}
updateCategory(value:any){
  if (this.categoryID) 
  this.categoriesService.updateCategory(this.categoryID,value).then(()=>{
    this.hideForm();
})
}
patchFormValues(currentCategory:any){
  this.inputsForm.patchValue(currentCategory);
  this.pickCategoryColor(currentCategory.color);
  this.isEdit=true;
  this.categoryID=currentCategory.id
}
hideForm(){
this.formIsOpened = false;
 this.inputsForm.reset();
 this.pickCategoryColor('#3b82f6');
 this.isEdit=false;
}
}
