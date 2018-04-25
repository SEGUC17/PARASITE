import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPsychRequestComponent } from './add-psych-request.component';

describe('AddPsychRequestComponent', () => {
  let component: AddPsychRequestComponent;
  let fixture: ComponentFixture<AddPsychRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPsychRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPsychRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
