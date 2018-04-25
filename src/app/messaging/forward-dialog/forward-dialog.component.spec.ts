import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardDialogComponent } from './forward-dialog.component';

describe('ForwardDialogComponent', () => {
  let component: ForwardDialogComponent;
  let fixture: ComponentFixture<ForwardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
