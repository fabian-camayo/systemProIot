import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecordsDetailComponent } from './records-detail.component';

describe('Component Tests', () => {
  describe('Records Management Detail Component', () => {
    let comp: RecordsDetailComponent;
    let fixture: ComponentFixture<RecordsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RecordsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ records: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RecordsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RecordsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load records on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.records).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
