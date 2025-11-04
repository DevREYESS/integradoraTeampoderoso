import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaAgendada } from './cita-agendada';

describe('CitaAgendada', () => {
  let component: CitaAgendada;
  let fixture: ComponentFixture<CitaAgendada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaAgendada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaAgendada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
