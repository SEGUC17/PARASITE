import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyChildEmailComponent } from './verify-child-email.component';

describe('VerifyChildEmailComponent', () => {
  let component: VerifyChildEmailComponent;
  let fixture: ComponentFixture<VerifyChildEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyChildEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyChildEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
