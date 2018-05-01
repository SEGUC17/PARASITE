import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentRedirectorComponent } from './content-redirector.component';

describe('ContentRedirectorComponent', () => {
  let component: ContentRedirectorComponent;
  let fixture: ComponentFixture<ContentRedirectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRedirectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRedirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
