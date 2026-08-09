export interface SprintResponse {
  id: number;
  name: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  projectId: number;
  projectName: string;
}

export interface CreateSprintRequest {
  name: string;
  startDate: string;
  endDate: string;
  projectId: number;
}

export interface UpdateSprintRequest {
  name: string;
  startDate: string;
  endDate: string;
  projectId: number;
}
