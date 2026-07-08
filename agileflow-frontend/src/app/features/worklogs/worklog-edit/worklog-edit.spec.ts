import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkLogEditComponent } from './worklog-edit';

describe('WorkLogEditComponent', () => {
  let component: WorkLogEditComponent;
  let fixture: ComponentFixture<WorkLogEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogEditComponent],
      providers: [provideHttpClient(), provideRouter([])]})
    .compileComponents();

    fixture = TestBed.createComponent(WorkLogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
