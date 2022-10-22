import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'records',
        data: { pageTitle: 'systemProIotApp.records.home.title' },
        loadChildren: () => import('./records/records.module').then(m => m.RecordsModule),
      },
      {
        path: 'block-chain',
        data: { pageTitle: 'systemProIotApp.blockChain.home.title' },
        loadChildren: () => import('./block-chain/block-chain.module').then(m => m.BlockChainModule),
      },
      {
        path: 'documentation',
        data: { pageTitle: 'systemProIotApp.documentation.home.title' },
        loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
