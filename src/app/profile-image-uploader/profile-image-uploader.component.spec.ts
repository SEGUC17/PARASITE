import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageUploaderComponent } from './profile-image-uploader.component';

describe('ProfileImageUploaderComponent', () => {
  let component: ProfileImageUploaderComponent;
  let fixture: ComponentFixture<ProfileImageUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImageUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
