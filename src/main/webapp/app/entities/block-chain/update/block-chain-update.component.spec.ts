jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BlockChainService } from '../service/block-chain.service';
import { IBlockChain, BlockChain } from '../block-chain.model';

import { BlockChainUpdateComponent } from './block-chain-update.component';

describe('Component Tests', () => {
  describe('BlockChain Management Update Component', () => {
    let comp: BlockChainUpdateComponent;
    let fixture: ComponentFixture<BlockChainUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let blockChainService: BlockChainService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BlockChainUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BlockChainUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BlockChainUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      blockChainService = TestBed.inject(BlockChainService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const blockChain: IBlockChain = { id: 456 };

        activatedRoute.data = of({ blockChain });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(blockChain));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const blockChain = { id: 123 };
        spyOn(blockChainService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ blockChain });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: blockChain }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(blockChainService.update).toHaveBeenCalledWith(blockChain);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const blockChain = new BlockChain();
        spyOn(blockChainService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ blockChain });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: blockChain }));
        saveSubject.complete();

        // THEN
        expect(blockChainService.create).toHaveBeenCalledWith(blockChain);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const blockChain = { id: 123 };
        spyOn(blockChainService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ blockChain });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(blockChainService.update).toHaveBeenCalledWith(blockChain);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
