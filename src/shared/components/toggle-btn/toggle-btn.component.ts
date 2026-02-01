import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-btn',
  imports: [],
  templateUrl: './toggle-btn.component.html',
  styleUrl: './toggle-btn.component.css',
})
export class ToggleBtnComponent {
  @Output() toggleSidebar = new EventEmitter<boolean>();
}
