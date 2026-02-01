import { computed, effect, Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  Subscription,
  tap,
} from 'rxjs';
import { supabase } from '../../../../enviroments/supabase';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';
import { OrganizationService } from '../../../organization/services/organization/organization.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { userInfo } from 'os';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  $selectedOrganizationID = computed(() =>
    this.organizationService.orgSystemID.selectedOrganizationID()
  );
  $user_id = computed(() => this.authService.$user_id());
  listView = signal<boolean>(true);
  // the tasks which showed to user:
  $filteredTasks = signal<any[]>([]);
  $isSearchedInTaskForm = signal<boolean>(false);
  $todayTasks = signal<any[]>([]);
  $upcomingTasks = signal<any[]>([]);
  getTasksSubscription!: Subscription;
  // i use it for filtering ;
  private cache = new Map();
  private $tasks = new BehaviorSubject<any[]>([]);
  $tasksObservable = this.$tasks as Observable<any[]>;
  // for update task
  $updatedTask = signal<any>({});
  constructor(
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private organizationService: OrganizationService,
    private authService: AuthService
  ) {
    effect(() => {
      if (this.getTasksSubscription) this.getTasksSubscription.unsubscribe();
      if (this.$selectedOrganizationID())
        this.getTasksSubscription = this.getTasks().subscribe({
          complete: () => {
            spinner.hide('loading');
          },
        });
    });
  }
  setTasks(newValue: any) {
    this.$tasks.next(newValue);
  }
  getTasks(): Observable<any[] | null> {
    console.log(this.$selectedOrganizationID());

    if (!this.$selectedOrganizationID()) return of(null);
    this.spinner.show('loading');
    // if (this.cache.has(this.$selectedOrganizationID())) {
    //   console.log(this.cache);

    //   const data = this.cache.get(this.$selectedOrganizationID());
    //   this.$tasks.next(data);
    //   this.$filteredTasks.set(data);
    //   return of(null);
    // }
    return from(
      supabase
        .from('tasks')
        .select('*')
        .eq('organization_id', this.$selectedOrganizationID())
    ).pipe(
      tap(({ data, error }) => {
        // this.cache.set(this.$selectedOrganizationID(), data);
        if (data) {
          this.$tasks.next(data);
          this.$filteredTasks.set(data);
        }
      }),
      map(({ data, error }) => {
        if (error) throw new Error(error.message ?? 'Unknown error');

        return data ?? null;
      }),
      // tap((data)=>{
      //   if (data){
      //   const currentDate = new Date().toISOString().split("T")[0];
      //   const todayTasks = data?.filter(task=>{
      //     return task.due_date.split("T")[0] === currentDate ;
      //   });
      //   this.$todayTasks.set(todayTasks)
      //   const upcomingTasks = data.filter(task=>{
      //         return task.due_date.split("T")[0] > currentDate ;
      //   });
      //  this.$upcomingTasks.set(upcomingTasks)
      //  }

      // }),

      catchError((err) => {
        this.toastrService.error(`${err}`);
        return of(null);
      })
    );
  }
  insertNewTask(value: any): Observable<any[] | null> {
    return from(supabase.from('tasks').insert(value).select()).pipe(
      tap(({ data, error }) => {
        if (error) {
          throw new Error(error.message ?? 'Unknown error');
        }
        // console.log(data);
        // console.log(this.$tasks.value);

        const newData = [...this.$tasks.value, data[0]];
        this.$tasks.next(newData);
        // console.log(newData);
        this.$filteredTasks.set(this.$tasks.value);
        // console.log(this.$filteredTasks());
      }),
      map(({ data, error }) => {
        this.toastrService.success(`your task is added!`);
        return data?.[0] ?? null;
      }),
      catchError((err) => {
        this.toastrService.error(`${err}`);
        return of(null);
      })
    );
  }
  updateCurrentTask(value: any, taskID: string): Observable<any[] | null> {
    return from(
      supabase.from('tasks').update(value).eq('task_id', taskID).select()
    ).pipe(
      tap(({ data, error }) => {
        if (error) {
          throw new Error(error.message ?? 'Unknown error');
        }

        const updatedValue = this.$tasks.value.map((t) =>
          t.task_id === taskID ? { ...data[0] } : t
        );
        // const newData = [...this.$tasks.value,value]
        this.$tasks.next(updatedValue);
        this.$filteredTasks.set(updatedValue);
        this.toastrService.success(`your task is updated!`);
      }),
      map(({ data, error }) => {
        return data?.[0] ?? null;
      }),
      catchError((err) => {
        this.toastrService.error(`${err}`);
        return of(null);
      })
    );
  }
  // update
  getTaskByID(ID: string | null) {
    if (!ID) return;
    return from(supabase.from('tasks').select('*').eq('task_id', ID)).pipe(
      tap(({ data, error }) => {
        if (error) throw new Error(error.message ?? 'Unknown error');
        // console.log(data);

        this.$updatedTask.set(data?.[0]);
      }),
      map(({ data }) => {
        return data?.[0];
      }),
      catchError((err) => {
        this.toastrService.error(`${err}`);
        return of(null);
      })
    );
  }
  deleteTask(ID: string) {
    return from(supabase.from('tasks').delete().eq('task_id', ID)).pipe(
      tap(({ data, error }) => {
        if (error) throw new Error(`${error.message}`);
        const currentTasks =
          this.$tasks.value?.filter((t) => t.task_id !== ID) || null;
        this.$tasks.next(currentTasks);
        this.$filteredTasks.set(currentTasks);

        // if(currentTasks && currentTasks?.length>0)
        this.toastrService.success(`task is deleted!`);
      }),
      catchError((err) => {
        this.toastrService.error(`${err}`);
        return of(null);
      })
    );
  }
  setTaskScadule(data: any) {
    if (data) {
      const currentDate = new Date().toISOString().split('T')[0];
      const todayTasks = data?.filter((task: any) => {
        return task.due_date.split('T')[0] === currentDate;
      });
      this.$todayTasks.set(todayTasks);
      const upcomingTasks = data.filter((task: any) => {
        return task.due_date.split('T')[0] > currentDate;
      });
      this.$upcomingTasks.set(upcomingTasks);
    }
  }
}
