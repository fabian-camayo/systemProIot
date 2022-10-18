import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecords, getRecordsIdentifier } from '../records.model';

export type EntityResponseType = HttpResponse<IRecords>;
export type EntityArrayResponseType = HttpResponse<IRecords[]>;

@Injectable({ providedIn: 'root' })
export class RecordsService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/records');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(records: IRecords): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(records);
    return this.http
      .post<IRecords>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(records: IRecords): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(records);
    return this.http
      .put<IRecords>(`${this.resourceUrl}/${getRecordsIdentifier(records) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(records: IRecords): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(records);
    return this.http
      .patch<IRecords>(`${this.resourceUrl}/${getRecordsIdentifier(records) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRecords>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRecords[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRecordsToCollectionIfMissing(recordsCollection: IRecords[], ...recordsToCheck: (IRecords | null | undefined)[]): IRecords[] {
    const records: IRecords[] = recordsToCheck.filter(isPresent);
    if (records.length > 0) {
      const recordsCollectionIdentifiers = recordsCollection.map(recordsItem => getRecordsIdentifier(recordsItem)!);
      const recordsToAdd = records.filter(recordsItem => {
        const recordsIdentifier = getRecordsIdentifier(recordsItem);
        if (recordsIdentifier == null || recordsCollectionIdentifiers.includes(recordsIdentifier)) {
          return false;
        }
        recordsCollectionIdentifiers.push(recordsIdentifier);
        return true;
      });
      return [...recordsToAdd, ...recordsCollection];
    }
    return recordsCollection;
  }

  protected convertDateFromClient(records: IRecords): IRecords {
    return Object.assign({}, records, {
      startDate: records.startDate?.isValid() ? records.startDate.format(DATE_FORMAT) : undefined,
      endDate: records.endDate?.isValid() ? records.endDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((records: IRecords) => {
        records.startDate = records.startDate ? dayjs(records.startDate) : undefined;
        records.endDate = records.endDate ? dayjs(records.endDate) : undefined;
      });
    }
    return res;
  }
}
