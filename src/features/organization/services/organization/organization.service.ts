import { effect, Injectable, signal } from '@angular/core';
import { supabase } from '../../../../enviroments/supabase';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, from, map, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { StorageService } from '../../../../shared/services/storage/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  $showedListIndex = signal<number>(2);
  $currentOrg = signal<any|null>(null);
  orgSystemID=
  {
  selectedOrganizationID:signal<string|null>(null),
  organizationID:signal<string|null>(null),
  orgIDs:signal<string[]>([])
  }
  members =
  {
  allMembersOfCurrentSystem:signal<any[]|null>(null),
  // coming from selected ID
  currentOrgMembersInTaskForm:signal<any[]|null>(null),
  // coming from organization ID
  currentOrgMembers:signal<any[]|null>(null),
  }
  // all orgs of systym
  private $orgs = new BehaviorSubject<any[]>([]);
  $orgsObservable = this.$orgs as Observable<any[]>
  getSystemMembersSubscription!:Subscription;
  constructor(private toastrService:ToastrService,private storageService:StorageService,private spinner:NgxSpinnerService) {
    effect(()=>{
      // should trigger whenever ids change ;
        this.getSystemMembersSubscription?.unsubscribe();

      this.getSystemMembersSubscription = this.getSystemMembers(this.orgSystemID.orgIDs()).subscribe();
    })
    effect(()=>{
      
      const $organizationID = this.orgSystemID.organizationID()
      
      if ($organizationID) {
      const currentMembers = this.members.allMembersOfCurrentSystem()?.filter(org=>org.organization_id === $organizationID)
             if(currentMembers)
              // for showing in org_members component...
              this.members.currentOrgMembers.set(currentMembers);
              
}
      })
    // effect(()=>{
    // storageService.storeValue('selectedOrgID',this.orgSystemID.selectedOrganizationID());
    //   })
    }
  getOrganizations(userID:string|null){
    this.spinner.show('loading');
    return from(supabase.from('user_organizations').select('organization_id').eq('user_id',userID)).pipe(
      tap(({data,error})=>{
        if(error)
        throw new Error(`${error.message}`);   
        console.log(data);
      
        // we get org_ids of the system
        this.orgSystemID.orgIDs.set(data?.map(o=>o.organization_id) as string[]);
      }),
      switchMap(({data,error})=>{
        if(error)
          throw new Error(`${error.message}`);   
        return supabase.from('organizations').select('*').in('id',this.orgSystemID.orgIDs());
    }),
    tap(({data,error})=>{
      if(error)
        throw new Error(`${error.message}`);   
      // this.getOrganizationMembers(this.orgSystemID.orgIDs())
        this.$orgs.next(data);
        console.log(this.$orgs.value);
        
        }),map(({data})=>{
        return data;
        }), catchError((error)=>{
          this.toastrService.error(`${error}`)
          return of(null);
        })
      );
  }
  createNewOrganization(value:any,user_ID:string|null){
      console.log(value);
      return from(supabase.from('organizations').insert(value).select()).pipe(
         tap(({data,error})=>{
          if(error)
            throw new Error(`${error.message}`)
          // update locally
          const newValue = [...this.$orgs.value,data[0]];
          this.$orgs.next(newValue);
          this.orgSystemID.orgIDs.update(ids=>[...ids,data[0].id])
          console.log(data);
          
        })
        ,
        switchMap(({data,error})=>{
          
        if(error || !data?.[0]?.id)
        throw new Error(`${error?.message}`);

           return supabase.from('user_organizations').insert({organization_id:data?.[0].id,user_id:user_ID , role:'admin'})

        }),   tap(({data,error})=>{
          if(error)
          throw new Error(`${error.message}`)
          console.log(data);
          
        }),map(({data})=>{
        return data;
        }),

         catchError((error)=>{
          this.toastrService.error(`${error}`)
          return of(null);
        })
      );
 
      
     
 
   
  } 
  addMemberToOrganization(value:any){
  
    
      return from(supabase.from('user_organizations').insert(value)).pipe(
         tap(({data,error})=>{
        
          if(error)
            throw new Error(`${error.message}`)
           this.toastrService.success('added successfully!')
        })
        ,
     
        map(({data})=>{
        return data || null;
        }),

         catchError((error)=>{
          this.toastrService.error(`${error}`)
          return of(null);
        })
      );
 
      
     
 
   
  } 
  getSystemMembers(IDs:string[]){  
    // console.log(IDs);
      if (IDs.length === 0) return of(null);
    return from(supabase.from('organization_members_view').select('*').in('organization_id',IDs
    )).pipe(
      tap(({data,error})=>{
      
        if(error)
            throw new Error(`${error.message}`)
          // to set system members :
             this.members.allMembersOfCurrentSystem.set(data);
            console.log(this.members.allMembersOfCurrentSystem());
            
             
        })
        ,
     
        map(({data})=>{
        return data || null;
        }),

         catchError((error)=>{
          this.toastrService.error(`${error}`)
          return of(null);
        })
      )
 
      
     
 
   
  } 
  deleteOrganizationMemberByUserID(ID:string){
  
     
    return from(supabase.from('user_organizations').delete().eq('user_id',ID
    )).pipe(
      tap(({data,error})=>{
        if(error)
            throw new Error(`${error.message}`)
            const deleted = this.members.currentOrgMembers()?.filter(m=>m.user_id!==ID)||null;
            // if(deleted && deleted?.length>0)
          this.members.currentOrgMembers.set(deleted)
          this.toastrService.success(`member is deleted!`)
        })
        ,
     
        // map(({data})=>{
        // return data || null;
        // }),

         catchError((error)=>{
          this.toastrService.error(`${error}`)
          return of(null);
        })
      );
 
      
     
 
   
  } 

  // =====
  deleteOrganization(orgID:string){
        this.spinner.show('loading')
        return from(supabase.from('organizations').delete().eq('id',orgID)).pipe(
      tap(({data,error})=>{
        if (error) {
        throw new Error(error.message || 'couldnt delete this organization for some reasons!')
      }
      const notDeleted = this.$orgs.value.filter(c=>c.id !== orgID);
      console.log(notDeleted);
      
      this.$orgs.next(notDeleted);
      this.toastrService.success(`this organization is deleted!`);
        })
        ,
         catchError((error)=>{
          this.toastrService.error(`${error}`)
          return of(null);
        })
      );
 
 
  }
 updateOrganizationByID(orgID:string|null,value:any){
       return from(supabase.from('organizations').update(value).eq('id',orgID)).pipe(
      tap(({data,error})=>{
     if (error) {
        throw new Error(error.message || 'couldnt update this organization for some reasons!')
      }

        //  update ui
    const updatedValue = this.$orgs.value.map(org =>
     org.id === orgID ? { ...org, name: value.name } : org
     );
    
      this.$orgs.next(updatedValue);
      this.toastrService.success(`this organization is updated!`);
      }),
      catchError((error)=>{
          this.toastrService.error(`${error}`)
          return of(null);
        })
      );
 
  }
 getOrganizationByID(organizationID:string|null){

   if (!organizationID) return;
     
    return from(supabase.from('organizations').select('*').eq('id',organizationID)).pipe(
      tap(({data,error})=>{
        if(error)
        throw new Error(`${error.message}`);  
      }),map(({data})=>{
        return data?.[0] || null;
        }), catchError((error)=>{
          this.toastrService.error(`${error}`)
          return of(null);
        })
      );

  }
  checkReapetedNames(insertedOrg:any){
    console.log(this.$orgs.value);
    
    const isReapetd = this.$orgs.value.some(org=> org.name.toLowerCase() === insertedOrg.name.toLowerCase() && org.created_by === insertedOrg.created_by);
    // console.log(isReapetd , 'repeated');
    
    return isReapetd;
  }
  fetchMembersInTaskForm(){
  const data = this.members.allMembersOfCurrentSystem()?.filter(m=>m.organization_id === this.orgSystemID.selectedOrganizationID()) || []
  // console.log(this.members.allMembersOfCurrentSystem());
  this.members.currentOrgMembersInTaskForm.set(data);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.getSystemMembersSubscription.unsubscribe();
  }
}
