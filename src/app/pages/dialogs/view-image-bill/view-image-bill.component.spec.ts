import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImageBillComponent } from './view-image-bill.component';

describe('ViewImageBillComponent', () => {
  let component: ViewImageBillComponent;
  let fixture: ComponentFixture<ViewImageBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewImageBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewImageBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
