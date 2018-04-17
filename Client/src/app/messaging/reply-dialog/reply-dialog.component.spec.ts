import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyDialogComponent } from './reply-dialog.component';

describe('ReplyDialogComponent', () => {
  let component: ReplyDialogComponent;
  let fixture: ComponentFixture<ReplyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
