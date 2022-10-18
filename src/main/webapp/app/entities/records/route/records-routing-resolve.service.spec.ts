jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRecords, Records } from '../records.model';
import { RecordsService } from '../service/records.service';

import { RecordsRoutingResolveService } from './records-routing-resolve.service';

describe('Service Tests', () => {
  describe('Records routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RecordsRoutingResolveService;
    let service: RecordsService;
    let resultRecords: IRecords | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RecordsRoutingResolveService);
      service = TestBed.inject(RecordsService);
      resultRecords = undefined;
    });

    describe('resolve', () => {
      it('should return IRecords returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecords = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRecords).toEqual({ id: 123 });
      });

      it('should return new IRecords if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecords = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRecords).toEqual(new Records());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecords = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRecords).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
