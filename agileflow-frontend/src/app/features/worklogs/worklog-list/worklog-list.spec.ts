import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkLogListComponent } from './worklog-list';

describe('WorkLogListComponent', () => {
  let component: WorkLogListComponent;
  let fixture: ComponentFixture<WorkLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogListComponent],
      providers: [provideHttpClient(), provideRouter([])]})
    .compileComponents();

    fixture = TestBed.createComponent(WorkLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
