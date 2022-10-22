import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DocumentationDetailComponent } from '../detail/documentation-detail.component';

const blockChainRoute: Routes = [
  {
    path: '',
    component: DocumentationDetailComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blockChainRoute)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
