import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPostsCardComponent } from './no-posts-card.component';

describe('NoPostsCardComponent', () => {
  let component: NoPostsCardComponent;
  let fixture: ComponentFixture<NoPostsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoPostsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPostsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
