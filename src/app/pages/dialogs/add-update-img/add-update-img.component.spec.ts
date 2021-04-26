import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateImgComponent } from './add-update-img.component';

describe('AddUpdateImgComponent', () => {
  let component: AddUpdateImgComponent;
  let fixture: ComponentFixture<AddUpdateImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
