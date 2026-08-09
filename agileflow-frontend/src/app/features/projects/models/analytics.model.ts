export interface IssueStatusBreakdown {
  status: string;
  count: number;
}

export interface IssuePriorityBreakdown {
  priority: string;
  count: number;
}

export interface SprintVelocity {
  sprintId: number;
  sprintName: string;
  completedIssues: number;
  totalIssues: number;
}

export interface WorklogSummary {
  userId: number;
  userName: string;
  totalHours: number;
}

export interface ProjectSummaryReport {
  totalIssues: number;
  completedIssues: number;
  completionPercentage: number;
  totalWorklogHours: number;
  memberContribution: MemberContribution[];
}

export interface MemberContribution {
  userId: number;
  userName: string;
  assignedIssueCount: number;
  totalLoggedHours: number;
}
