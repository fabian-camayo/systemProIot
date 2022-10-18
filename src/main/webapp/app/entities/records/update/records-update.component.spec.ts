jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RecordsService } from '../service/records.service';
import { IRecords, Records } from '../records.model';

import { RecordsUpdateComponent } from './records-update.component';

describe('Component Tests', () => {
  describe('Records Management Update Component', () => {
    let comp: RecordsUpdateComponent;
    let fixture: ComponentFixture<RecordsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let recordsService: RecordsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RecordsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RecordsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RecordsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      recordsService = TestBed.inject(RecordsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const records: IRecords = { id: 456 };

        activatedRoute.data = of({ records });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(records));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const records = { id: 123 };
        spyOn(recordsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ records });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: records }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(recordsService.update).toHaveBeenCalledWith(records);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const records = new Records();
        spyOn(recordsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ records });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: records }));
        saveSubject.complete();

        // THEN
        expect(recordsService.create).toHaveBeenCalledWith(records);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const records = { id: 123 };
        spyOn(recordsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ records });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(recordsService.update).toHaveBeenCalledWith(records);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
