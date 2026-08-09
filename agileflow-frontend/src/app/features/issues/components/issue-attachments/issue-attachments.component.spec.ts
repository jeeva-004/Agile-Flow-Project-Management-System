import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueAttachmentsComponent } from './issue-attachments.component';

describe('IssueAttachmentsComponent', () => {
  let component: IssueAttachmentsComponent;
  let fixture: ComponentFixture<IssueAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueAttachmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
