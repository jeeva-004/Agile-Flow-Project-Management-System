import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklogCreate } from './worklog-create';

describe('WorklogCreate', () => {
  let component: WorklogCreate;
  let fixture: ComponentFixture<WorklogCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorklogCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorklogCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
