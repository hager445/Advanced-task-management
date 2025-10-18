import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrganizationService } from '../../../features/organization/services/organization/organization.service';

@Component({
  selector: 'app-load-more',
  imports: [],
  templateUrl: './load-more.component.html',
  styleUrl: './load-more.component.css'
})
export class LoadMoreComponent {
  // isOpened = {
  //   loadMore : true,
  //   loadLess: false
  // }
  @Input() forLoadMore:boolean = false;
  @Output() navigateTo = new EventEmitter<void>();
constructor(private organizationService:OrganizationService){}
loadMore(){
  this.organizationService.$showedListIndex.update((index)=>  index + 1);
}
loadLess(){
  this.organizationService.$showedListIndex.update((index)=> index >= 2 ? index - 1: index);
}
onNavigateTo(){
  this.navigateTo.emit();

}
}
