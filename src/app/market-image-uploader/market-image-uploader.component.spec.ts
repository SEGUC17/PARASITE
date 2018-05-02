import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketImageUploaderComponent } from './market-image-uploader.component';

describe('MarketImageUploaderComponent', () => {
  let component: MarketImageUploaderComponent;
  let fixture: ComponentFixture<MarketImageUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketImageUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
