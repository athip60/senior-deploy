import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillGuestComponent } from './bill-guest.component';

describe('BillGuestComponent', () => {
  let component: BillGuestComponent;
  let fixture: ComponentFixture<BillGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillGuestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
