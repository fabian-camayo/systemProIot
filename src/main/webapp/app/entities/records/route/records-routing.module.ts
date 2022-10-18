import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RecordsComponent } from '../list/records.component';
import { RecordsDetailComponent } from '../detail/records-detail.component';
import { RecordsUpdateComponent } from '../update/records-update.component';
import { RecordsRoutingResolveService } from './records-routing-resolve.service';

const recordsRoute: Routes = [
  {
    path: '',
    component: RecordsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RecordsDetailComponent,
    resolve: {
      records: RecordsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RecordsUpdateComponent,
    resolve: {
      records: RecordsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RecordsUpdateComponent,
    resolve: {
      records: RecordsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(recordsRoute)],
  exports: [RouterModule],
})
export class RecordsRoutingModule {}
