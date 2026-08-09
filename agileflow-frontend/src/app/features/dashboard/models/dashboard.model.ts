export interface AdminDashboardResponse {
  totalUsers: number;
  totalProjects: number;
  totalIssues: number;
  openIssues: number;
  completedIssues: number;
  totalWorkLogs: number;
}

export interface DeveloperDashboardResponse {
  assignedIssues: number;
  completedIssues: number;
  myComments: number;
  myWorkLogs: number;
}

export interface ProjectManagerDashboardResponse {
  managedProjects: number;
  teamMembers: number;
  activeSprints: number;
  openIssues: number;
  completedIssues: number;
}
