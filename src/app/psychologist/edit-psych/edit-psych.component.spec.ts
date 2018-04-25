import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPsychComponent } from './edit-psych.component';

describe('EditPsychComponent', () => {
  let component: EditPsychComponent;
  let fixture: ComponentFixture<EditPsychComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPsychComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPsychComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
