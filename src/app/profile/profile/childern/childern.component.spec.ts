import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildernComponent } from './childern.component';

describe('ChildernComponent', () => {
  let component: ChildernComponent;
  let fixture: ComponentFixture<ChildernComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildernComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
