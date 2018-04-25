import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionUpdateComponent } from './section-update.component';

describe('SectionUpdateComponent', () => {
  let component: SectionUpdateComponent;
  let fixture: ComponentFixture<SectionUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
