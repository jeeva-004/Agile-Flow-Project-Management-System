import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklogEdit } from './worklog-edit';

describe('WorklogEdit', () => {
  let component: WorklogEdit;
  let fixture: ComponentFixture<WorklogEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorklogEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorklogEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
