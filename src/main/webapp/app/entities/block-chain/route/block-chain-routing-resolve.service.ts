import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlockChain, BlockChain } from '../block-chain.model';
import { BlockChainService } from '../service/block-chain.service';

@Injectable({ providedIn: 'root' })
export class BlockChainRoutingResolveService implements Resolve<IBlockChain> {
  constructor(protected service: BlockChainService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlockChain> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((blockChain: HttpResponse<BlockChain>) => {
          if (blockChain.body) {
            return of(blockChain.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BlockChain());
  }
}
