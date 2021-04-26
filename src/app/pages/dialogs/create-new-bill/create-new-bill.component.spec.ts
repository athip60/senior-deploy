import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewBillComponent } from './create-new-bill.component';

describe('CreateNewBillComponent', () => {
  let component: CreateNewBillComponent;
  let fixture: ComponentFixture<CreateNewBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
