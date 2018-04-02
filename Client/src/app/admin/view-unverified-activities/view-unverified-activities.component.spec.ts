import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnverifiedActivitiesComponent } from './view-unverified-activities.component';

describe('ViewVerifiedContributerRequestsComponent', () => {
  let component: ViewUnverifiedActivitiesComponent;
  let fixture: ComponentFixture<ViewUnverifiedActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUnverifiedActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUnverifiedActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
