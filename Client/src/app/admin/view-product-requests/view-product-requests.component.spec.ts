import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductRequestsComponent } from './view-product-requests.component';

describe('ViewProductRequestsComponent', () => {
  let component: ViewProductRequestsComponent;
  let fixture: ComponentFixture<ViewProductRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProductRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProductRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
