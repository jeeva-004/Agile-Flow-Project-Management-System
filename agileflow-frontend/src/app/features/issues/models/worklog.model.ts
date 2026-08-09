export interface WorkLogResponse {
  id: number;
  issueId: number;
  userId: number;
  userName: string;
  hoursSpent: number;
  description: string;
  workDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkLogRequest {
  hoursSpent: number;
  description: string;
  workDate: string; // ISO date string
}

export interface UpdateWorkLogRequest {
  hoursSpent: number;
  description: string;
  workDate: string;
}
