import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueEdit } from './issue-edit';

describe('IssueEdit', () => {
  let component: IssueEdit;
  let fixture: ComponentFixture<IssueEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueEdit],
      providers: [provideHttpClient(), provideRouter([])]})
    .compileComponents();

    fixture = TestBed.createComponent(IssueEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
