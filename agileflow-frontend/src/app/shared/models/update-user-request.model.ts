export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roleIds: number[];
}