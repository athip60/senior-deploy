import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertDataRoomComponent } from './insert-data-room.component';

describe('InsertDataRoomComponent', () => {
  let component: InsertDataRoomComponent;
  let fixture: ComponentFixture<InsertDataRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertDataRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertDataRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
