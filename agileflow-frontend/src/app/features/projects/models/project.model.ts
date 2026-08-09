export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  startDate: string; // ISO Date String 'YYYY-MM-DD'
  endDate: string;
  ownerId: number;
  ownerName: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  ownerId: number;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  ownerId: number;
}
