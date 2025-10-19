import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Meses } from './meses';

describe('Meses', () => {
  let component: Meses;
  let fixture: ComponentFixture<Meses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Meses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Meses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
