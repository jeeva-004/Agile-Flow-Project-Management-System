import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintEditComponent } from './sprint-edit';

describe('SprintEditComponent', () => {
  let component: SprintEditComponent;
  let fixture: ComponentFixture<SprintEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintEditComponent],
      providers: [provideHttpClient(), provideRouter([])]})
    .compileComponents();

    fixture = TestBed.createComponent(SprintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
