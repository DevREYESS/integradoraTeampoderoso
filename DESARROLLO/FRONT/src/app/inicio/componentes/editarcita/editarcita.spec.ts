import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editarcita } from './editarcita';

describe('Editarcita', () => {
  let component: Editarcita;
  let fixture: ComponentFixture<Editarcita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editarcita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editarcita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
