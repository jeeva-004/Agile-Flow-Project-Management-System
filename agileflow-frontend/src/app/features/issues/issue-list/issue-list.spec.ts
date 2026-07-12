import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueListComponent } from './issue-list';
import { IssueService } from '../../../core/services/issue.service';
import { DialogService } from '../../../core/services/dialog.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('IssueListComponent', () => {
  let component: IssueListComponent;
  let fixture: ComponentFixture<IssueListComponent>;
  let mockIssueService: jasmine.SpyObj<IssueService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockIssueService = jasmine.createSpyObj('IssueService', ['search', 'delete']);
    mockDialogService = jasmine.createSpyObj('DialogService', ['confirm']);
    mockToastService = jasmine.createSpyObj('ToastService', ['success', 'error']);
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
    mockDialogService.confirm.and.returnValue(of(true));

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'role') return 'ADMIN';
      if (key === 'current_user_id') return '42';
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [IssueListComponent],
      providers: [
        { provide: IssueService, useValue: mockIssueService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: ToastService, useValue: mockToastService },
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
    mockDialogService.confirm.and.returnValue(of(true));

    component.deleteIssue(10);

    expect(mockDialogService.confirm).toHaveBeenCalled();
    expect(mockIssueService.delete).toHaveBeenCalledWith(10);
    expect(mockIssueService.search).toHaveBeenCalled();
    expect(mockToastService.success).toHaveBeenCalled();
  });

  it('should not call delete on service if delete confirm is rejected', () => {
    fixture.detectChanges();
    mockDialogService.confirm.and.returnValue(of(false));

    component.deleteIssue(10);

    expect(mockDialogService.confirm).toHaveBeenCalled();
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
