import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DocumentationDetailComponent } from './detail/documentation-detail.component';
import { DocumentationRoutingModule } from './route/documentation-routing.module';

@NgModule({
  imports: [SharedModule, DocumentationRoutingModule],
  declarations: [DocumentationDetailComponent],
})
export class DocumentationModule {}
