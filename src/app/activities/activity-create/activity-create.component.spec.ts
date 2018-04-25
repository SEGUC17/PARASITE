import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCreateComponent } from './activity-create.component';

describe('ActivityCreateComponent', () => {
  let component: ActivityCreateComponent;
  let fixture: ComponentFixture<ActivityCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
