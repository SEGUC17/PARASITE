import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildsignupComponent } from './childsignup.component';

describe('ChildsignupComponent', () => {
  let component: ChildsignupComponent;
  let fixture: ComponentFixture<ChildsignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildsignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
