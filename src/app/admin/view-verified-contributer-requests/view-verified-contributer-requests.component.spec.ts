import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVerifiedContributerRequestsComponent } from './view-verified-contributer-requests.component';

describe('ViewVerifiedContributerRequestsComponent', () => {
  let component: ViewVerifiedContributerRequestsComponent;
  let fixture: ComponentFixture<ViewVerifiedContributerRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVerifiedContributerRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVerifiedContributerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
