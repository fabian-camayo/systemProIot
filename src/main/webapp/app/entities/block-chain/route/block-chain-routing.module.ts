import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlockChainComponent } from '../list/block-chain.component';
import { BlockChainDetailComponent } from '../detail/block-chain-detail.component';
import { BlockChainUpdateComponent } from '../update/block-chain-update.component';
import { BlockChainRoutingResolveService } from './block-chain-routing-resolve.service';

const blockChainRoute: Routes = [
  {
    path: '',
    component: BlockChainComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlockChainDetailComponent,
    resolve: {
      blockChain: BlockChainRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlockChainUpdateComponent,
    resolve: {
      blockChain: BlockChainRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlockChainUpdateComponent,
    resolve: {
      blockChain: BlockChainRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blockChainRoute)],
  exports: [RouterModule],
})
export class BlockChainRoutingModule {}
