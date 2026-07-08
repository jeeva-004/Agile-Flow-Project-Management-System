import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkLogCreateComponent } from './worklog-create';

describe('WorkLogCreateComponent', () => {
  let component: WorkLogCreateComponent;
  let fixture: ComponentFixture<WorkLogCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogCreateComponent],
      providers: [provideHttpClient(), provideRouter([])]})
    .compileComponents();

    fixture = TestBed.createComponent(WorkLogCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
