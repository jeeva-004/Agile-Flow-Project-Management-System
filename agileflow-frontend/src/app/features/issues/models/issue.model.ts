export enum IssueStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IssueType {
  STORY = 'STORY',
  TASK = 'TASK',
  BUG = 'BUG',
  EPIC = 'EPIC'
}

export interface IssueResponse {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  estimateHours?: number;
  dueDate?: string; // ISO Date String
  projectId: number;
  projectName: string;
  sprintId?: number;
  sprintName?: string;
  assigneeId?: number;
  assigneeName?: string;
  createdById: number;
  createdByName: string;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  priority: IssuePriority;
  type: IssueType;
  estimateHours?: number;
  dueDate?: string;
  projectId: number;
  sprintId?: number;
  assigneeId?: number;
}

export interface UpdateIssueRequest {
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  estimateHours?: number;
  dueDate?: string;
  projectId: number;
  sprintId?: number;
  assigneeId?: number;
}
