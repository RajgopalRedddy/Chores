export interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: 'pending' | 'approved';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null; // This is now who completed the task
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  completedAt: Date | null;
}
