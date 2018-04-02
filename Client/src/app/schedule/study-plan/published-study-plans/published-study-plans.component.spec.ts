import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedStudyPlansComponent } from './published-study-plans.component';

describe('PublishedStudyPlansComponent', () => {
  let component: PublishedStudyPlansComponent;
  let fixture: ComponentFixture<PublishedStudyPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedStudyPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedStudyPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
