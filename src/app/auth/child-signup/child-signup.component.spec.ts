import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildSignupComponent } from './child-signup.component';

describe('ChildSignupComponent', () => {
  let component: ChildSignupComponent;
  let fixture: ComponentFixture<ChildSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
