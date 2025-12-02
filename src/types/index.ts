export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: Date;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigned_to: string | null;
  created_at: Date;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  message: string;
  created_at: Date;
}

export interface TaskWithDetails extends Task {
  project_name?: string;
  project_description?: string;
  assigned_user_name?: string;
  assigned_user_email?: string;
  latest_comment?: string;
  latest_comment_user?: string;
  latest_comment_at?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface TaskFilters {
  project_id?: string;
  status?: TaskStatus;
  assigned_to?: string;
}
