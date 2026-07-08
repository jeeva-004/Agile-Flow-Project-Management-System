import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFeed } from './activity-feed';

describe('ActivityFeed', () => {
  let component: ActivityFeed;
  let fixture: ComponentFixture<ActivityFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityFeed],
      providers: [provideHttpClient(), provideRouter([])]})
    .compileComponents();

    fixture = TestBed.createComponent(ActivityFeed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
