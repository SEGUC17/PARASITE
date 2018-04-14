import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditePsychComponent } from './edite-psych.component';

describe('EditePsychComponent', () => {
  let component: EditePsychComponent;
  let fixture: ComponentFixture<EditePsychComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditePsychComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditePsychComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
