import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlockChain, getBlockChainIdentifier } from '../block-chain.model';

export type EntityResponseType = HttpResponse<IBlockChain>;
export type EntityArrayResponseType = HttpResponse<IBlockChain[]>;

@Injectable({ providedIn: 'root' })
export class BlockChainService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/block-chains');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(blockChain: IBlockChain): Observable<EntityResponseType> {
    return this.http.post<IBlockChain>(this.resourceUrl, blockChain, { observe: 'response' });
  }

  update(blockChain: IBlockChain): Observable<EntityResponseType> {
    return this.http.put<IBlockChain>(`${this.resourceUrl}/${getBlockChainIdentifier(blockChain) as number}`, blockChain, {
      observe: 'response',
    });
  }

  partialUpdate(blockChain: IBlockChain): Observable<EntityResponseType> {
    return this.http.patch<IBlockChain>(`${this.resourceUrl}/${getBlockChainIdentifier(blockChain) as number}`, blockChain, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlockChain>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlockChain[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlockChainToCollectionIfMissing(
    blockChainCollection: IBlockChain[],
    ...blockChainsToCheck: (IBlockChain | null | undefined)[]
  ): IBlockChain[] {
    const blockChains: IBlockChain[] = blockChainsToCheck.filter(isPresent);
    if (blockChains.length > 0) {
      const blockChainCollectionIdentifiers = blockChainCollection.map(blockChainItem => getBlockChainIdentifier(blockChainItem)!);
      const blockChainsToAdd = blockChains.filter(blockChainItem => {
        const blockChainIdentifier = getBlockChainIdentifier(blockChainItem);
        if (blockChainIdentifier == null || blockChainCollectionIdentifiers.includes(blockChainIdentifier)) {
          return false;
        }
        blockChainCollectionIdentifiers.push(blockChainIdentifier);
        return true;
      });
      return [...blockChainsToAdd, ...blockChainCollection];
    }
    return blockChainCollection;
  }
}
