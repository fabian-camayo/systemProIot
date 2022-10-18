import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlockChain, BlockChain } from '../block-chain.model';

import { BlockChainService } from './block-chain.service';

describe('Service Tests', () => {
  describe('BlockChain Service', () => {
    let service: BlockChainService;
    let httpMock: HttpTestingController;
    let elemDefault: IBlockChain;
    let expectedResult: IBlockChain | IBlockChain[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BlockChainService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        block: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a BlockChain', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new BlockChain()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BlockChain', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            block: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a BlockChain', () => {
        const patchObject = Object.assign({}, new BlockChain());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BlockChain', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            block: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a BlockChain', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBlockChainToCollectionIfMissing', () => {
        it('should add a BlockChain to an empty array', () => {
          const blockChain: IBlockChain = { id: 123 };
          expectedResult = service.addBlockChainToCollectionIfMissing([], blockChain);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(blockChain);
        });

        it('should not add a BlockChain to an array that contains it', () => {
          const blockChain: IBlockChain = { id: 123 };
          const blockChainCollection: IBlockChain[] = [
            {
              ...blockChain,
            },
            { id: 456 },
          ];
          expectedResult = service.addBlockChainToCollectionIfMissing(blockChainCollection, blockChain);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BlockChain to an array that doesn't contain it", () => {
          const blockChain: IBlockChain = { id: 123 };
          const blockChainCollection: IBlockChain[] = [{ id: 456 }];
          expectedResult = service.addBlockChainToCollectionIfMissing(blockChainCollection, blockChain);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(blockChain);
        });

        it('should add only unique BlockChain to an array', () => {
          const blockChainArray: IBlockChain[] = [{ id: 123 }, { id: 456 }, { id: 43952 }];
          const blockChainCollection: IBlockChain[] = [{ id: 123 }];
          expectedResult = service.addBlockChainToCollectionIfMissing(blockChainCollection, ...blockChainArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const blockChain: IBlockChain = { id: 123 };
          const blockChain2: IBlockChain = { id: 456 };
          expectedResult = service.addBlockChainToCollectionIfMissing([], blockChain, blockChain2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(blockChain);
          expect(expectedResult).toContain(blockChain2);
        });

        it('should accept null and undefined values', () => {
          const blockChain: IBlockChain = { id: 123 };
          expectedResult = service.addBlockChainToCollectionIfMissing([], null, blockChain, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(blockChain);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
