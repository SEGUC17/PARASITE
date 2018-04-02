import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyPlanEditViewComponent } from './study-plan-edit-view.component';

describe('StudyPlanEditViewComponent', () => {
  let component: StudyPlanEditViewComponent;
  let fixture: ComponentFixture<StudyPlanEditViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyPlanEditViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyPlanEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
