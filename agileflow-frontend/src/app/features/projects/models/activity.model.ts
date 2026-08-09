export interface ActivityResponse {
  id: number;
  action: string;
  message: string;
  entityType: string;
  entityId: number;
  userId: number;
  userName: string;
  projectId: number;
  createdAt: string;
}
