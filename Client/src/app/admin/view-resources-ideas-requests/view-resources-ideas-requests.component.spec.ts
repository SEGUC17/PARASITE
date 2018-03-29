import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResourcesIdeasRequestsComponent } from './view-resources-ideas-requests.component';

describe('ViewResourcesIdeasRequestsComponent', () => {
  let component: ViewResourcesIdeasRequestsComponent;
  let fixture: ComponentFixture<ViewResourcesIdeasRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewResourcesIdeasRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResourcesIdeasRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
