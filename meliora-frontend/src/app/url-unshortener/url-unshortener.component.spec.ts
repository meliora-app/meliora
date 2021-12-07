import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlUnshortenerComponent } from './url-unshortener.component';

describe('UrlUnshortenerComponent', () => {
  let component: UrlUnshortenerComponent;
  let fixture: ComponentFixture<UrlUnshortenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlUnshortenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlUnshortenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
