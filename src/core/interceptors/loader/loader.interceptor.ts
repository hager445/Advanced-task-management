import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  
  spinner.show(); // 👈 يظهر السبينر أول ما يبدأ الطلب

  return next(req).pipe(
    finalize(() => {
      spinner.hide(); // 👈 يخفي السبينر بعد انتهاء الطلب (نجاح أو خطأ)
    })
  );
};
