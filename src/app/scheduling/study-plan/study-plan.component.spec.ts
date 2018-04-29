import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyPlanComponent } from './study-plan.component';

describe('StudyPlanComponent', () => {
  let component: StudyPlanComponent;
  let fixture: ComponentFixture<StudyPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
