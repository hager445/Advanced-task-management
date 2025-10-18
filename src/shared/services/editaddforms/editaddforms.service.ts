import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditaddformsService {
  isEdit ={
   'orgForm' : signal<boolean>(false),
   'taskForm' : signal<boolean>(false),
  }
  constructor() {}
}
