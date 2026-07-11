import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectListComponent } from './project-list';
import { ProjectService } from '../../../core/services/project.service';
import { ActivityService } from '../../../core/services/activity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let mockProjectService: jasmine.SpyObj<ProjectService>;
  let mockActivityService: jasmine.SpyObj<ActivityService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockProjectService = jasmine.createSpyObj('ProjectService', ['findAll', 'delete']);
    mockActivityService = jasmine.createSpyObj('ActivityService', ['findByProject']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => null
        }
      }
    };

    // Default mock behaviors
    mockProjectService.findAll.and.returnValue(of({
      data: {
        content: [{ id: 1, name: 'Project One' }, { id: 2, name: 'Project Two' }],
        totalPages: 1,
        totalElements: 2
      }
    }));
    mockProjectService.delete.and.returnValue(of({}));
    mockActivityService.findByProject.and.returnValue(of({ data: [] }));

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'role') return 'PROJECT_MANAGER';
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        { provide: ProjectService, useValue: mockProjectService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
  });

  it('should load projects on ngOnInit', () => {
    fixture.detectChanges(); // ngOnInit -> loadProjects()

    expect(component.role).toBe('PROJECT_MANAGER');
    expect(mockProjectService.findAll).toHaveBeenCalledWith(0, 10, 'id', 'desc');
    expect(component.projects.length).toBe(2);
    expect(component.projects[0].name).toBe('Project One');
    expect(component.totalPages).toBe(1);
    expect(component.totalElements).toBe(2);
  });

  it('should navigate to project edit on editProject', () => {
    component.editProject(5);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects', 5, 'edit']);
  });

  it('should delete project when confirmed', () => {
    fixture.detectChanges();
    mockProjectService.findAll.calls.reset();
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteProject(5);

    expect(window.confirm).toHaveBeenCalledWith('Delete this project?');
    expect(mockProjectService.delete).toHaveBeenCalledWith(5);
    expect(mockProjectService.findAll).toHaveBeenCalled();
  });

  it('should not delete project when confirm is rejected', () => {
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteProject(5);

    expect(window.confirm).toHaveBeenCalledWith('Delete this project?');
    expect(mockProjectService.delete).not.toHaveBeenCalled();
  });

  it('should handle delete error gracefully', () => {
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(true);
    mockProjectService.delete.and.returnValue(throwError(() => new Error('Delete failed')));
    spyOn(console, 'error');

    expect(() => {
      component.deleteProject(5);
    }).not.toThrow();

    expect(console.error).toHaveBeenCalled();
  });
});
