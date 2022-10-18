import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRecords, Records } from '../records.model';
import { RecordsService } from '../service/records.service';

@Injectable({ providedIn: 'root' })
export class RecordsRoutingResolveService implements Resolve<IRecords> {
  constructor(protected service: RecordsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRecords> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((records: HttpResponse<Records>) => {
          if (records.body) {
            return of(records.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Records());
  }
}
