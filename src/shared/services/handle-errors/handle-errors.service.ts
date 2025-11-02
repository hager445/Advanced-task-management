import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorsService {
  private toastr = inject(ToastrService);
  constructor() { }
  handleErrors(error:any){
const msg = error.message;
if (msg.includes('invalid login')) return this.toastr.error('Invalid email or password');
if (msg.includes('email not confirmed')) return this.toastr.warning('Please verify your email before logging in');
if (msg.includes('too many requests')) return this.toastr.info('Too many attempts, please try again later');
if (msg.includes('duplicate')) return this.toastr.info('This record already exists');
if (msg.includes('violates foreign key')) return this.toastr.error('Invalid data relationship');
if (msg.includes('failed to fetch')) return this.toastr.warning('Please check your internet connection');
return;
  }
}
