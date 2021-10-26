import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedPostCardComponent } from './expanded-post-card.component';

describe('ExpandedPostCardComponent', () => {
  let component: ExpandedPostCardComponent;
  let fixture: ComponentFixture<ExpandedPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandedPostCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandedPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
