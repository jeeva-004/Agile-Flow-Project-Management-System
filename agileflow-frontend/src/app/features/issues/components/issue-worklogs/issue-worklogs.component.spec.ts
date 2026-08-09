import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueWorklogsComponent } from './issue-worklogs.component';

describe('IssueWorklogsComponent', () => {
  let component: IssueWorklogsComponent;
  let fixture: ComponentFixture<IssueWorklogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueWorklogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueWorklogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
