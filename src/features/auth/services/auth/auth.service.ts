import { effect, Injectable, signal } from '@angular/core';
import { catchError, debounce, debounceTime, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { supabase, tokenName } from '../../../../enviroments/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../../shared/services/storage/storage.service';
import { OrganizationService } from '../../../organization/services/organization/organization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $user_id = signal<string|null>(null);
  $selectedOrgMember = signal<any|null>(null);
  $selectedtaskMember = signal<any|null>(null);
  $allSystemUsers = signal<any[]>([]);
  // local not from backend so gonna be cancelled
  $orgsUsers = signal<any>({});
  $autoCompleteList = signal<any[]|null>(null);
  $currentOrgUsers = signal<any[]|null>(null);
  loginIsOpened=signal<boolean>(false);
  registerIsOpened=signal<boolean>(false);
  constructor(private toastrServive:ToastrService , private storageService:StorageService,private organizationService:OrganizationService) {
  // this.getUsers().subscribe();
  const orgsUsers = this.storageService.getValue('orgsUsers');
  this.$orgsUsers.set(orgsUsers);
  effect(()=>{
     this.storageService.storeValue('orgsUsers',this.$orgsUsers());
    })
  }
  register(value:any){
   return from(supabase.auth.signUp({email:value.email,password:value.password})).pipe(
     tap(({data,error})=>{
  
       if(error) throw new Error(`${error.message}`);
      
       if (data.user?.id) { 
         this.organizationService.createNewOrganization({name:'personal',created_by:data.user?.id},data.user?.id).subscribe();
       }
      
    }),
    switchMap(
      ({data,error})=>{
        if(error) throw new Error(`${error.message}`);
        
        return from(supabase.from('users').insert(value));
        
      }
    ), map(({data,error})=>{
      if(error) throw new Error(`${error.message}`);
   return data || null;
   }),catchError((error)=>{
    this.toastrServive.error(`${error}`);
     return of(null)
   })
  )
  }
  // ========================================
  login(value:any){
   
    
  return from(supabase.auth.signInWithPassword(value)).pipe(
   switchMap(({data,error})=>{
   return supabase.auth.getUser();
   }),
    tap(({data,error})=>{
    if(error) throw new Error(`${error.message}`);
    this.toastrServive.success(`you logged in successefully`);
    this.$user_id.set(data.user.id);
   })
   ,
    map(({data,error})=>{
   if(error) throw new Error(`${error.message}`);
   return data || null;
   }),catchError((error)=>{
    this.toastrServive.error(`${error}`);
     return of(null)
   })
  )
  }
  // all users
  getUsers():Observable<any[]|null>{
  return from(supabase.from('users').select('*')).pipe( map(({data,error})=>{
    if(error) throw new Error(`${error.message}`);
   return data || null 
   }),catchError((error)=>{
    this.toastrServive.error(`${error}`);
     return of(null)
   })
  )
  }
  getSelectedOrgMember(searchedMember:any){
      if (searchedMember === '') return of([]);
      return from(supabase.from('users').select('*').like('email', `%${searchedMember}%`)).pipe(
    map(({data,error})=>{
    if(error) throw new Error(`${error.message}`);
   return data || [];
   }),catchError((error)=>{
    this.toastrServive.error(`${error}`);
     return of(null)
   })
  ) 
  }
  // current user :
  // to get user id each time the data changing ,
  getUser() {
    return from(supabase.auth.getUser()).pipe(
      tap(({data, error}) => {
        if (error) throw new Error(`${error.message}`);
        if (data.user) 
          this.$user_id.set(data.user.id);
          console.log(this.$user_id());
          
      }),
      map(({data, error}) => {
        if (error) throw new Error(`${error.message}`);
        return data || null;
      }),
      catchError((error) => {
        this.toastrServive.error(`${error}`);
        this.$user_id.set(null);
        return of(null);
      })
    );
  }
  logout(){
   return from(supabase.auth.signOut()).pipe(
      tap(({error}) => {
        if (error) throw new Error(`${error.message}`);
        this.$user_id.set(null);
    
      }),
      catchError((error) => {
        this.toastrServive.error(`${error}`);
        return of(null);
      })
    );
  }

}
