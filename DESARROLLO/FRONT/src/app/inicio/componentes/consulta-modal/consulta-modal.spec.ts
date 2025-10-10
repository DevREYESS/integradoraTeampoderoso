import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaModal } from './consulta-modal';

describe('ConsultaModal', () => {
  let component: ConsultaModal;
  let fixture: ComponentFixture<ConsultaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
