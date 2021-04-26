import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDataRoomComponent } from './show-data-room.component';

describe('ShowDataRoomComponent', () => {
  let component: ShowDataRoomComponent;
  let fixture: ComponentFixture<ShowDataRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDataRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDataRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
