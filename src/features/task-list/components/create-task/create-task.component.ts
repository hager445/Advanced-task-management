import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-task',
  imports: [RouterLink],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
createNewTask(){}
}
