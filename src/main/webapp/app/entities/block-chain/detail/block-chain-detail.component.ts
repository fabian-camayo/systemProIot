import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlockChain } from '../block-chain.model';

@Component({
  selector: 'jhi-block-chain-detail',
  templateUrl: './block-chain-detail.component.html',
})
export class BlockChainDetailComponent implements OnInit {
  blockChain: IBlockChain | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blockChain }) => {
      this.blockChain = blockChain;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
