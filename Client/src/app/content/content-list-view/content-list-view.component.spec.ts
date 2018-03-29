import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentListViewComponent } from './content-list-view.component';

describe('ContentListViewComponent', () => {
  let component: ContentListViewComponent;
  let fixture: ComponentFixture<ContentListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
