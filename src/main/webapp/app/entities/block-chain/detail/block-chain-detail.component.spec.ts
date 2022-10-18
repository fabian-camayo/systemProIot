import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlockChainDetailComponent } from './block-chain-detail.component';

describe('Component Tests', () => {
  describe('BlockChain Management Detail Component', () => {
    let comp: BlockChainDetailComponent;
    let fixture: ComponentFixture<BlockChainDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BlockChainDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ blockChain: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BlockChainDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BlockChainDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load blockChain on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.blockChain).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
