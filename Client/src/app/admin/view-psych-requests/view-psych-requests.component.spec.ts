import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPsychRequestsComponent } from './view-psych-requests.component';

describe('ViewPsychRequestsComponent', () => {
  let component: ViewPsychRequestsComponent;
  let fixture: ComponentFixture<ViewPsychRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPsychRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPsychRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
