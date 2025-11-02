import { Component, computed, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OrganizationService } from '../../../organization/services/organization/organization.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
registerIsOpened=computed(()=>this.authService.registerIsOpened());
showPass:boolean=false
inputsForm!:FormGroup;
constructor(private fb:FormBuilder , private authService:AuthService,private toastrService:ToastrService,private router:Router ,private organizationService:OrganizationService,){}
ngOnInit(): void {
  this.authService.loginIsOpened.set(false);
  this.inputsForm = this.fb.group({
    name:['',[  Validators.required]],
    email:['',[Validators.required,Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]],
    password:['Admin',[Validators.required ,Validators.minLength(6),Validators.maxLength(20)]]
  })
}

closeRegister(){
 
  this.router.navigate(['/']);
  this.authService.loginIsOpened.set(true);
}
onSubmit(){
  if (!this.inputsForm.valid) {
    this.inputsForm.markAllAsTouched();
    this.toastrService.error('please insert valid values');
    return;
  }
  this.authService.register(this.inputsForm.value).subscribe({next:(res)=>{
   this.toastrService.success('Congrates! you have been registered');
   
  }})
}
showPassword(e:Event){
  this.showPass = !this.showPass;
}

}
