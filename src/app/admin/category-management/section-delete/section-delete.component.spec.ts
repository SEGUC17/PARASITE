import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDeleteComponent } from './section-delete.component';

describe('SectionDeleteComponent', () => {
  let component: SectionDeleteComponent;
  let fixture: ComponentFixture<SectionDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
