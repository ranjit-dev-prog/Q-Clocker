export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SYSTEM_ADMINISTRATOR'
  | 'HR_MANAGER'
  | 'HR_ADMINISTRATOR'
  | 'HR_EXECUTIVE'
  | 'IT_MANAGER'
  | 'IT_EXECUTIVE'
  | 'DEPARTMENT_MANAGER'
  | 'TEAM_LEAD'
  | 'EMPLOYEE'
  | 'AUDITOR'
  | 'READ_ONLY'
  | 'VIEWER';

export interface User {
  id: string;
  referenceId?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  departmentId?: string | null;
  teamId?: string | null;
  jobTitle?: string | null;
  avatarUrl?: string | null;
  permissions?: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: User;
}

