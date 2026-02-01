import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { supabase } from '../../enviroments/supabase';
import { inject, Inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth/auth.service';
import { TaskService } from '../../features/task-list/services/task services/task.service';
import { EditaddformsService } from '../services/editaddforms/editaddforms.service';

export const checkSameTask = (): AsyncValidatorFn => {
  const authService = inject(AuthService);
  const taskService = inject(TaskService);
  const editaddformsService = inject(EditaddformsService);
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const taskTitle = control.value;

    return from(
      supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to ', authService.$user_id())
        .eq('organization_id', taskService.$selectedOrganizationID())
    ).pipe(
      map(({ data, error }) => {
        const exists = data?.some((task) => {
          if (
            editaddformsService.isEdit.taskForm() &&
            task.task_id === taskService.$updatedTask().task_id
          ) {
            return false;
          }
          return task.title.toLowerCase() === taskTitle.toLowerCase();
        });
        return exists ? { sameTaskName: true } : null;
      }),
      catchError(() => {
        return of({ serverError: true });
      })
    );
  };
};
