import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyPlanListViewComponent } from './study-plan-list-view.component';

describe('StudyPlanListViewComponent', () => {
  let component: StudyPlanListViewComponent;
  let fixture: ComponentFixture<StudyPlanListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyPlanListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyPlanListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
