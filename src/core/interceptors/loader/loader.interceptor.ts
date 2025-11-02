import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
    console.log('Request started:', req.url); // 👈 Check console

  spinner.show('loading'); // 👈 يظهر السبينر أول ما يبدأ الطلب

  return next(req).pipe(
    finalize(() => {
    console.log('Request finished:', req.url); // 👈 Check console

      spinner.hide('loading'); // 👈 يخفي السبينر بعد انتهاء الطلب (نجاح أو خطأ)
    })
  );
};
