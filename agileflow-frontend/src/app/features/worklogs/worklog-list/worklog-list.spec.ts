import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklogList } from './worklog-list';

describe('WorklogList', () => {
  let component: WorklogList;
  let fixture: ComponentFixture<WorklogList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorklogList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorklogList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
