export interface ProjectMemberResponse {
  id: number;
  projectId: number;
  userId: number;
  userName: string;
  email: string;
}

export interface AddProjectMemberRequest {
  projectId: number;
  userId: number;
}
