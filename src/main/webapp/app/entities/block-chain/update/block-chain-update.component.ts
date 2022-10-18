import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBlockChain, BlockChain } from '../block-chain.model';
import { BlockChainService } from '../service/block-chain.service';

@Component({
  selector: 'jhi-block-chain-update',
  templateUrl: './block-chain-update.component.html',
})
export class BlockChainUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    block: [],
  });

  constructor(protected blockChainService: BlockChainService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blockChain }) => {
      this.updateForm(blockChain);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blockChain = this.createFromForm();
    if (blockChain.id !== undefined) {
      this.subscribeToSaveResponse(this.blockChainService.update(blockChain));
    } else {
      this.subscribeToSaveResponse(this.blockChainService.create(blockChain));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlockChain>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(blockChain: IBlockChain): void {
    this.editForm.patchValue({
      id: blockChain.id,
      block: blockChain.block,
    });
  }

  protected createFromForm(): IBlockChain {
    return {
      ...new BlockChain(),
      id: this.editForm.get(['id'])!.value,
      block: this.editForm.get(['block'])!.value,
    };
  }
}
