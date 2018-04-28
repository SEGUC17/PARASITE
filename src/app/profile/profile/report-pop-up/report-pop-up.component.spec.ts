import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPopUpComponent } from './report-pop-up.component';

describe('ComposeMailComponent', () => {
  let component: ReportPopUpComponent;
  let fixture: ComponentFixture<ReportPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
