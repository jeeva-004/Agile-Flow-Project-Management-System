import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, Login],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize form controls empty with required validation', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();

    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');

    component.form.get('email')?.setValue('invalid-email');
    expect(component.form.get('email')?.valid).toBeFalse();

    component.form.get('email')?.setValue('user@example.com');
    expect(component.form.get('email')?.valid).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    component.form.get('email')?.setValue('');
    component.form.get('password')?.setValue('');

    component.submit();

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should submit credentials and navigate to PM dashboard on PM login success', () => {
    component.form.get('email')?.setValue('pm@example.com');
    component.form.get('password')?.setValue('password123');

    mockAuthService.login.and.returnValue(of({
      data: {
        token: 'mock-jwt-token',
        role: 'PROJECT_MANAGER'
      }
    } as any));

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'pm@example.com',
      password: 'password123'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/pm']);
  });

  it('should submit credentials and navigate to Admin dashboard on Admin login success', () => {
    component.form.get('email')?.setValue('admin@example.com');
    component.form.get('password')?.setValue('password123');

    mockAuthService.login.and.returnValue(of({
      data: {
        token: 'mock-jwt-token',
        role: 'ADMIN'
      }
    } as any));

    component.submit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/admin']);
  });

  it('should submit credentials and navigate to Developer dashboard on Developer/other login success', () => {
    component.form.get('email')?.setValue('dev@example.com');
    component.form.get('password')?.setValue('password123');

    mockAuthService.login.and.returnValue(of({
      data: {
        token: 'mock-jwt-token',
        role: 'DEVELOPER'
      }
    } as any));

    component.submit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/developer']);
  });

  it('should handle login error gracefully without crashing', () => {
    component.form.get('email')?.setValue('error@example.com');
    component.form.get('password')?.setValue('password123');

    mockAuthService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));
    spyOn(console, 'error');

    expect(() => {
      component.submit();
    }).not.toThrow();

    expect(console.error).toHaveBeenCalled();
  });
});
