import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueListComponent } from './issue-list';
import { IssueService } from '../../../core/services/issue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('IssueListComponent', () => {
  let component: IssueListComponent;
  let fixture: ComponentFixture<IssueListComponent>;
  let mockIssueService: jasmine.SpyObj<IssueService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockIssueService = jasmine.createSpyObj('IssueService', ['search', 'delete']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => '123'
        }
      }
    };

    // Default mock behavior
    mockIssueService.search.and.returnValue(of({
      data: {
        content: [{ id: 1, title: 'Test Issue 1' }, { id: 2, title: 'Test Issue 2' }],
        totalPages: 2,
        totalElements: 20
      }
    }));
    mockIssueService.delete.and.returnValue(of({}));

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'role') return 'ADMIN';
      if (key === 'current_user_id') return '42';
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [IssueListComponent],
      providers: [
        { provide: IssueService, useValue: mockIssueService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IssueListComponent);
    component = fixture.componentInstance;
  });

  it('should load issues and user details on ngOnInit', () => {
    fixture.detectChanges(); // triggers ngOnInit

    expect(component.projectId).toBe(123);
    expect(component.role).toBe('ADMIN');
    expect(component.currentUserId).toBe(42);
    expect(mockIssueService.search).toHaveBeenCalledWith(123, undefined, undefined, undefined, undefined, 0, 10, 'id', 'desc');
    expect(component.issues.length).toBe(2);
    expect(component.issues[0].title).toBe('Test Issue 1');
    expect(component.totalPages).toBe(2);
    expect(component.totalElements).toBe(20);
  });

  it('should call delete on service when deleting an issue and reload list', () => {
    fixture.detectChanges();
    mockIssueService.search.calls.reset();

    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteIssue(10);

    expect(window.confirm).toHaveBeenCalledWith('Delete issue?');
    expect(mockIssueService.delete).toHaveBeenCalledWith(10);
    expect(mockIssueService.search).toHaveBeenCalled();
  });

  it('should not call delete on service if delete confirm is rejected', () => {
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteIssue(10);

    expect(window.confirm).toHaveBeenCalledWith('Delete issue?');
    expect(mockIssueService.delete).not.toHaveBeenCalled();
  });

  it('should handle search error gracefully without crashing', () => {
    mockIssueService.search.and.returnValue(throwError(() => new Error('Search failed')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalled();
    expect(component.issues).toEqual([]);
  });
});
