import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRecords, Records } from '../records.model';
import { RecordsService } from '../service/records.service';

@Component({
  selector: 'jhi-records-update',
  templateUrl: './records-update.component.html',
})
export class RecordsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    startDate: [],
    endDate: [],
    nameProcess: [],
    detailsProcess: [],
    device: [],
    codeDevice: [],
    descriptionDevice: [],
    owner: [],
    securityKey: [],
  });

  constructor(protected recordsService: RecordsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ records }) => {
      this.updateForm(records);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const records = this.createFromForm();
    if (records.id !== undefined) {
      this.subscribeToSaveResponse(this.recordsService.update(records));
    } else {
      this.subscribeToSaveResponse(this.recordsService.create(records));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecords>>): void {
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

  protected updateForm(records: IRecords): void {
    this.editForm.patchValue({
      id: records.id,
      startDate: records.startDate,
      endDate: records.endDate,
      nameProcess: records.nameProcess,
      detailsProcess: records.detailsProcess,
      device: records.device,
      codeDevice: records.codeDevice,
      descriptionDevice: records.descriptionDevice,
      owner: records.owner,
      securityKey: records.securityKey,
    });
  }

  protected createFromForm(): IRecords {
    return {
      ...new Records(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      nameProcess: this.editForm.get(['nameProcess'])!.value,
      detailsProcess: this.editForm.get(['detailsProcess'])!.value,
      device: this.editForm.get(['device'])!.value,
      codeDevice: this.editForm.get(['codeDevice'])!.value,
      descriptionDevice: this.editForm.get(['descriptionDevice'])!.value,
      owner: this.editForm.get(['owner'])!.value,
      securityKey: this.editForm.get(['securityKey'])!.value,
    };
  }
}
