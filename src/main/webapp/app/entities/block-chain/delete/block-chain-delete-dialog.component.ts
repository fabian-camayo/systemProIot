import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlockChain } from '../block-chain.model';
import { BlockChainService } from '../service/block-chain.service';

@Component({
  templateUrl: './block-chain-delete-dialog.component.html',
})
export class BlockChainDeleteDialogComponent {
  blockChain?: IBlockChain;

  constructor(protected blockChainService: BlockChainService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blockChainService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
