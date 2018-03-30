import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContentRequestsComponent } from './view-content-requests.component';

describe('ViewContentRequestsComponent', () => {
  let component: ViewContentRequestsComponent;
  let fixture: ComponentFixture<ViewContentRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContentRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
