import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseAgreementComponent } from './lease-agreement.component';

describe('LeaseAgreementComponent', () => {
  let component: LeaseAgreementComponent;
  let fixture: ComponentFixture<LeaseAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
