import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { EMPTY, catchError } from 'rxjs';

export const routeDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const httpClient = inject(HttpClient);
  const router = inject(Router);
  return httpClient.get(`/assets/page-data/${state.url.slice(1)}.json`).pipe(
    catchError((_) => {
      router.navigateByUrl('/not-found');
      return EMPTY;
    })
  );
};
