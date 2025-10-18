import { AuthService } from './../../../auth/services/auth/auth.service';
import { Injectable, signal } from '@angular/core';
import { supabase } from '../../../../enviroments/supabase';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  $selectedTaskID = signal<string|null>(null)
 private $categories = new BehaviorSubject<any[]>([]);
  $categoriesObservable = this.$categories as Observable<any[]>;
  constructor(private toastrService:ToastrService) { 
//   this.getCategory().then(data=>
//   {
//    if (data) {
//   }
// }
// )
}
async getCategory(userID:string|null){
  if (!userID) {
    return;
  }
  try {
    const {data , error} = await supabase.from('categories').select('*').or(`user_id.eq.${userID},user_id.is.null`);

    if (!data && error) {
      throw new Error('something went wrong for fetching category!')
    }
    this.$categories.next(data);
      return data ;
    } catch (error) {
      this.toastrService.error(`${error}`)
      return null;
    }
   
  }
  async insertNewCategory(value:any){

  
  const isExist =  this.checkIfExists(value);
  if (isExist){
this.toastrService.warning('this category has been added before!')
return;
  } ;
  try{  
     const {data,error} = await supabase.from('categories').insert(value).select()
     if (error) {
        throw new Error('something went wrong for fetching category!')
     }
  const newData = [...this.$categories.value,data[0]]
  this.$categories.next(newData);
  
      return data ;
    } catch (error) {
      this.toastrService.error(`${error}`)
      return ;
    }
  }
 async deleteCategory(categoryID:string){
   const isProtected = await this.isProtected(categoryID);
   if (isProtected?.is_protected) {
      this.toastrService.warning(`you can't delete a system item!`);
    return;
   }
   try {
        const {data,error} = await supabase.from('categories').delete().eq('id',categoryID); 
      if (error) {
        throw new Error(error.message || 'couldnt delete this item for some reasons!')
      }
      const filtered = this.$categories.value.filter(c=>c.id !== categoryID);
      this.$categories.next(filtered);
      this.toastrService.success(`this item is deleted!`);
    } catch (error) {
      this.toastrService.error(`${error}`);
    }
  }
 async deleteCategoryItem(taskID:string|null){
   try {
        
        const {data,error} = (await supabase.from('tasks').update({'category_id':null}).eq('task_id',taskID).select()); 
      if (error) {
        throw new Error(error.message || 'couldnt delete this item for some reasons!')
      }
      
      return data
    } catch (error) {
      this.toastrService.error(`${error}`);
      return;
    }
  }
  async updateCategory(categoryID:string,value:any){
       const isProtected = await this.isProtected(categoryID);
      
   if (isProtected?.is_protected) {
      this.toastrService.warning(`you can't update a system item!`);
    return;
   }
      try {
        const {data,error} = await supabase.from('categories').update(value).eq('id',categoryID); 
      if (error) {
        throw new Error(error.message || 'couldnt update this item for some reasons!')
      }
    //  update ui
    const updatedValue = this.$categories.value.map(cat =>
     cat.id === categoryID ? { ...cat, name: value.name , color:value.color } : cat
     );

      this.$categories.next(updatedValue);
    
      this.toastrService.success(`this item is updated!`);
    } catch (error) {
      this.toastrService.error(`${error}`);
    }
  }
async  addCategoryToTask(categoryID:string|null){
  console.log(this.$selectedTaskID());
  
  if (!categoryID && !this.$selectedTaskID()) return;
try{  
     const {data,error} = (await supabase.from('tasks').update({'category_id':categoryID}).eq('task_id',this.$selectedTaskID()).select());
     if (error) {
        throw new Error(`${error.message}`)
     }
      return data ;
    } catch (error) {
      this.toastrService.error(`${error}`)
      return ;
    }
  }
  checkIfExists(data:any){
  const isExist = this.$categories.value.some(C=>C.name === data.name);
  return isExist;
  }
 async isProtected(ID:string){
    try {
      const {data , error} = await supabase.from('categories').select('is_protected').eq('id',ID);
     if (error) {
      throw Error(`${error.message}`);
     }
      return data?.[0];
    } catch (error) {
      this.toastrService.error(`${error}`)
      return null;
    }
  }
}
