import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecords } from '../records.model';
import { RecordsService } from '../service/records.service';

@Component({
  templateUrl: './records-delete-dialog.component.html',
})
export class RecordsDeleteDialogComponent {
  records?: IRecords;

  constructor(protected recordsService: RecordsService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.recordsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
