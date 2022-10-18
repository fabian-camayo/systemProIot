import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { RecordsComponent } from './list/records.component';
import { RecordsDetailComponent } from './detail/records-detail.component';
import { RecordsUpdateComponent } from './update/records-update.component';
import { RecordsDeleteDialogComponent } from './delete/records-delete-dialog.component';
import { RecordsRoutingModule } from './route/records-routing.module';

@NgModule({
  imports: [SharedModule, RecordsRoutingModule],
  declarations: [RecordsComponent, RecordsDetailComponent, RecordsUpdateComponent, RecordsDeleteDialogComponent],
  entryComponents: [RecordsDeleteDialogComponent],
})
export class RecordsModule {}
