import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  storeValue(valueName:string,value:any){
  // const result = localStorage.getItem(valueName);
  // if (result) {
  //   return;
  // }
  localStorage.setItem(valueName,JSON.stringify(value));
  }
 getValue(valueName: string) {
  const result = localStorage.getItem(valueName);
  if (!result) return null;

  try {
    return JSON.parse(result);
  } catch {
    console.warn(`⚠️ Invalid JSON found in localStorage for key: ${valueName}`);
    return null;
  }
}
  removeValue(valueName:string){
    console.log(valueName);
    
    localStorage.removeItem(valueName);
  }
}
