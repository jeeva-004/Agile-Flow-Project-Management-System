import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectMemberService } from '../../services/project-member.service';
import { ProjectMemberResponse } from '../../models/project-member.model';
import { UserService } from '../../../users/services/user.service';
import { UserResponse } from '../../../users/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-members',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-members.component.html',
  styleUrl: './project-members.component.css'
})
export class ProjectMembersComponent implements OnInit {
  private projectMemberService = inject(ProjectMemberService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);

  projectId!: number;
  members: ProjectMemberResponse[] = [];
  availableUsers: UserResponse[] = [];
  private rawAvailableUsers: UserResponse[] = [];
  
  addMemberForm!: FormGroup;
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = true;
  error = '';
  isAdminOrPM = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = +idParam;
      this.initForm();
      this.checkRole();
      this.loadMembers();
      this.loadAvailableUsers();
    } else {
      this.error = 'Invalid project ID';
    }
  }

  private checkRole(): void {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user) {
        this.isAdminOrPM = user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER';
      }
    });
  }

  private initForm(): void {
    this.addMemberForm = this.fb.group({
      userId: [null, Validators.required]
    });
  }

  loadMembers(): void {
    this.isLoading = true;
    this.projectMemberService.getMembersByProject(this.projectId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.members = res.data.content;
          this.totalElements = res.data.totalElements;
          this.filterAvailableUsers();
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load project members';
        this.isLoading = false;
      }
    });
  }

  loadAvailableUsers(): void {
    this.userService.getUsers(0, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rawAvailableUsers = res.data.content;
          this.filterAvailableUsers();
        }
      }
    });
  }

  private filterAvailableUsers(): void {
    if (!this.rawAvailableUsers) return;
    const memberUserIds = new Set(this.members.map(m => m.userId));
    this.availableUsers = this.rawAvailableUsers.filter(u => !memberUserIds.has(u.id));
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < Math.ceil(this.totalElements / this.pageSize)) {
      this.pageIndex = newPage;
      this.loadMembers();
    }
  }

  addMember(): void {
    if (this.addMemberForm.invalid) return;

    this.isLoading = true;
    this.error = '';
    const userId = Number(this.addMemberForm.value.userId);
    
    this.projectMemberService.addMember({ projectId: this.projectId, userId }).subscribe({
      next: (res) => {
        if (res.success) {
          this.addMemberForm.reset();
          this.confirmationService.success('Success', 'Member added to project successfully.');
          this.loadMembers();
        } else {
          this.error = res.message || 'Failed to add member';
          this.confirmationService.error('Action Failed', this.error);
          this.isLoading = false;
        }
      },
      error: (err) => {
        if (err.error?.errors && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
          this.error = err.error.errors.join(', ');
        } else {
          this.error = err.error?.message || 'Failed to add member';
        }
        this.confirmationService.error('Action Failed', this.error);
        this.isLoading = false;
      }
    });
  }

  removeMember(memberId: number): void {
    const member = this.members.find(m => m.id === memberId);
    const memberName = member ? member.userName : 'this member';
    this.confirmationService.confirm({
      title: 'Remove Member',
      message: `Are you sure you want to remove "${memberName}" from the project?`,
      confirmText: 'Remove',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.projectMemberService.removeMember(memberId).subscribe({
          next: (res) => {
            if (res.success) {
              this.confirmationService.success('Success', 'Member removed successfully.');
              this.loadMembers();
            }
          },
          error: (err) => {
            const message = err.error?.message || 'Failed to remove member';
            if (message.includes('owner') || message.includes('Owner') || message.includes('Transfer ownership')) {
              this.confirmationService.info(
                'Cannot Remove Project Owner',
                'Cannot remove project owner while other members exist in the project. Please transfer ownership to another member before removing the owner.'
              );
            } else {
              this.confirmationService.error('Action Failed', message);
            }
          }
        });
      }
    });
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
