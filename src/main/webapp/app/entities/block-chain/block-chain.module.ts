import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BlockChainComponent } from './list/block-chain.component';
import { BlockChainDetailComponent } from './detail/block-chain-detail.component';
import { BlockChainUpdateComponent } from './update/block-chain-update.component';
import { BlockChainDeleteDialogComponent } from './delete/block-chain-delete-dialog.component';
import { BlockChainRoutingModule } from './route/block-chain-routing.module';

@NgModule({
  imports: [SharedModule, BlockChainRoutingModule],
  declarations: [BlockChainComponent, BlockChainDetailComponent, BlockChainUpdateComponent, BlockChainDeleteDialogComponent],
  entryComponents: [BlockChainDeleteDialogComponent],
})
export class BlockChainModule {}
