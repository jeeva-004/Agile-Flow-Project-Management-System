import { ActivityResponse } from '../../projects/models/activity.model';

export interface ProjectCard {
  id: number;
  name: string;
  description?: string;
  ownerName?: string;
  totalIssues: number;
  completedIssues: number;
  totalSprints: number;
  completedSprints: number;
  totalWorkLogHours: number;
  totalMembers: number;
}

export interface AdminDashboardResponse {
  totalUsers: number;
  totalProjects: number;
  totalIssues: number;
  openIssues: number;
  completedIssues: number;
  totalWorkLogs: number;
  activeProjects: ProjectCard[];
  recentActivities: ActivityResponse[];
}

export interface DeveloperDashboardResponse {
  assignedIssues: number;
  completedIssues: number;
  myComments: number;
  myWorkLogs: number;
  activeProjects: ProjectCard[];
  recentActivities: ActivityResponse[];
}

export interface ProjectManagerDashboardResponse {
  managedProjects: number;
  teamMembers: number;
  activeSprints: number;
  openIssues: number;
  completedIssues: number;
  activeProjects: ProjectCard[];
  recentActivities: ActivityResponse[];
}
