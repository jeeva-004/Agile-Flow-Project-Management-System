export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  roles: string[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roleIds: number[];
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  roleIds: number[];
}

// Used for pagination from Spring Data Page
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
