import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IRecords, Records } from '../records.model';

import { RecordsService } from './records.service';

describe('Service Tests', () => {
  describe('Records Service', () => {
    let service: RecordsService;
    let httpMock: HttpTestingController;
    let elemDefault: IRecords;
    let expectedResult: IRecords | IRecords[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RecordsService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        startDate: currentDate,
        endDate: currentDate,
        nameProcess: 'AAAAAAA',
        detailsProcess: 'AAAAAAA',
        device: 'AAAAAAA',
        codeDevice: 'AAAAAAA',
        descriptionDevice: 'AAAAAAA',
        owner: 'AAAAAAA',
        securityKey: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Records', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            startDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Records()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Records', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            startDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
            nameProcess: 'BBBBBB',
            detailsProcess: 'BBBBBB',
            device: 'BBBBBB',
            codeDevice: 'BBBBBB',
            descriptionDevice: 'BBBBBB',
            owner: 'BBBBBB',
            securityKey: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Records', () => {
        const patchObject = Object.assign(
          {
            startDate: currentDate.format(DATE_FORMAT),
            nameProcess: 'BBBBBB',
            detailsProcess: 'BBBBBB',
            codeDevice: 'BBBBBB',
            descriptionDevice: 'BBBBBB',
          },
          new Records()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Records', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            startDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
            nameProcess: 'BBBBBB',
            detailsProcess: 'BBBBBB',
            device: 'BBBBBB',
            codeDevice: 'BBBBBB',
            descriptionDevice: 'BBBBBB',
            owner: 'BBBBBB',
            securityKey: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Records', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRecordsToCollectionIfMissing', () => {
        it('should add a Records to an empty array', () => {
          const records: IRecords = { id: 123 };
          expectedResult = service.addRecordsToCollectionIfMissing([], records);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(records);
        });

        it('should not add a Records to an array that contains it', () => {
          const records: IRecords = { id: 123 };
          const recordsCollection: IRecords[] = [
            {
              ...records,
            },
            { id: 456 },
          ];
          expectedResult = service.addRecordsToCollectionIfMissing(recordsCollection, records);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Records to an array that doesn't contain it", () => {
          const records: IRecords = { id: 123 };
          const recordsCollection: IRecords[] = [{ id: 456 }];
          expectedResult = service.addRecordsToCollectionIfMissing(recordsCollection, records);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(records);
        });

        it('should add only unique Records to an array', () => {
          const recordsArray: IRecords[] = [{ id: 123 }, { id: 456 }, { id: 88709 }];
          const recordsCollection: IRecords[] = [{ id: 123 }];
          expectedResult = service.addRecordsToCollectionIfMissing(recordsCollection, ...recordsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const records: IRecords = { id: 123 };
          const records2: IRecords = { id: 456 };
          expectedResult = service.addRecordsToCollectionIfMissing([], records, records2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(records);
          expect(expectedResult).toContain(records2);
        });

        it('should accept null and undefined values', () => {
          const records: IRecords = { id: 123 };
          expectedResult = service.addRecordsToCollectionIfMissing([], null, records, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(records);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
