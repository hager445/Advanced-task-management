import { Component, EventEmitter, Output } from '@angular/core';
import { ManageCategoriesComponent } from '../manage-categories/manage-categories.component';

@Component({
  selector: 'app-create-new-category',
  imports: [ManageCategoriesComponent],
  templateUrl: './create-new-category.component.html',
  styleUrl: './create-new-category.component.css'
})
export class CreateNewCategoryComponent {
@Output() showForm = new EventEmitter<void>();
}
