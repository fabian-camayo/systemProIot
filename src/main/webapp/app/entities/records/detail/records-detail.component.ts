import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRecords } from '../records.model';

@Component({
  selector: 'jhi-records-detail',
  templateUrl: './records-detail.component.html',
})
export class RecordsDetailComponent implements OnInit {
  records: IRecords | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ records }) => {
      this.records = records;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
