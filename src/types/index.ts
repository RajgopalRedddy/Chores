export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  completedAt: Date | null;
}
