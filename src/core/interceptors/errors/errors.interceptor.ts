import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HandleErrorsService } from '../../../shared/services/handle-errors/handle-errors.service';
import { catchError, EMPTY, of } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const handleErrors = inject(HandleErrorsService);
  return next(req).pipe(
    catchError((err)=>{
     handleErrors.handleErrors(err);
     return EMPTY;
    })
  );
};
