import { Component, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginIsOpened  =  computed(()=>this.authService.loginIsOpened());
showPass:boolean=false

// showPass:boolean=false
inputsForm!:FormGroup;
constructor(private fb:FormBuilder , private authService:AuthService){
}
ngOnInit(): void {
// this.getAllEmails()
  this.inputsForm = this.fb.group({
   
    email:['',[Validators.required]],
    password:['',[Validators.required]]
  })
}
login(){
if (!this.inputsForm.valid) {
  return;
}
this.authService.login(this.inputsForm.value).subscribe({next:(res)=>{
  if (!res) {
    return
  } 
  console.log(res);
  
this.closeLogin()  
}})
}
showPassword(e:Event){
  this.showPass = !this.showPass;
}
navigateTo(){
  this.closeLogin();
  // this.authService.registerIsOpened.set(true);
}
closeLogin(){
  this.authService.loginIsOpened.set(false);
}
}
