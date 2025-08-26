"use client";

import { useState, useEffect, useMemo } from "react";
import type { Member, Task } from "@/types";
import { Button } from "@/components/ui/button";
import { SplitWorkLogo } from "@/components/split-work-logo";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { AiAssignmentDialog } from "@/components/ai-assignment-dialog";
import { TaskReportDialog } from "@/components/task-report-dialog";
import { TaskCard } from "@/components/task-card";
import { PlusCircle, UserPlus, BrainCircuit, BarChartHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initialMembers: Member[] = [
      { id: "1", name: "Alice", avatarUrl: "https://picsum.photos/seed/alice/100/100" },
      { id: "2", name: "Bob", avatarUrl: "https://picsum.photos/seed/bob/100/100" },
      { id: "3", name: "Charlie", avatarUrl: "https://picsum.photos/seed/charlie/100/100" },
      { id: '4', name: 'Diana', avatarUrl: 'https://picsum.photos/seed/diana/100/100' },
    ];

    const today = new Date();
    const initialTasks: Task[] = [
      { id: 't1', title: 'Design new landing page', description: 'Create a Figma mockup.', assigneeId: '1', dueDate: new Date(new Date().setDate(today.getDate() + 3)), completed: false, createdAt: new Date(), completedAt: null },
      { id: 't2', title: 'Develop API for user auth', description: 'Setup endpoints for registration, login, logout.', assigneeId: '2', dueDate: new Date(new Date().setDate(today.getDate() + 5)), completed: false, createdAt: new Date(), completedAt: null },
      { id: 't3', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions.', assigneeId: '3', dueDate: new Date(new Date().setDate(today.getDate() - 1)), completed: true, createdAt: new Date(new Date().setDate(today.getDate() - 2)), completedAt: new Date(new Date().setDate(today.getDate() - 1)) },
      { id: 't4', title: 'Write API documentation', description: 'Document all endpoints.', assigneeId: '1', dueDate: new Date(new Date().setDate(today.getDate() + 7)), completed: false, createdAt: new Date(), completedAt: null },
      { id: 't5', title: 'Deploy staging environment', description: 'Setup a staging server on Vercel.', assigneeId: '4', dueDate: new Date(new Date().setDate(today.getDate() + 1)), completed: false, createdAt: new Date(), completedAt: null },
      { id: 't6', title: 'Test payment flow', description: 'End-to-end testing of the payment gateway integration.', assigneeId: '2', dueDate: new Date(new Date().setDate(today.getDate() - 3)), completed: true, createdAt: new Date(new Date().setDate(today.getDate() - 5)), completedAt: new Date(new Date().setDate(today.getDate() - 3)) },
    ];
    setMembers(initialMembers);
    setTasks(initialTasks);
  }, []);

  const handleAddMember = (name: string) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name,
      avatarUrl: `https://picsum.photos/seed/${name}/100/100`,
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleAddTask = (taskData: Omit<Task, "id" | "completed" | "createdAt" | "completedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
      completedAt: null,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : null }
          : task
      )
    );
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };


  const { completedTasks, todoTasks } = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));
    const todo = tasks.filter((task) => !task.completed).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    return { completedTasks: completed, todoTasks: todo };
  }, [tasks]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <SplitWorkLogo />
              <h1 className="text-2xl font-bold font-headline text-foreground">
                SplitWork
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <AddMemberDialog onAddMember={handleAddMember} />
              <AddTaskDialog members={members} onAddTask={handleAddTask} />
            </div>
          </div>
          <div className="pb-4 flex flex-wrap gap-2">
              <AiAssignmentDialog members={members} tasks={tasks} />
              <TaskReportDialog members={members} tasks={tasks} />
          </div>
        </div>
        <Separator />
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          <section id="todo">
            <h2 className="text-3xl font-headline font-bold mb-6">To-Do</h2>
            {todoTasks.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    assignee={members.find((m) => m.id === task.assigneeId)}
                    onToggleCompletion={handleToggleTaskCompletion}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">All tasks completed. Great job, team!</p>
            )}
          </section>

          <section id="completed">
            <h2 className="text-3xl font-headline font-bold mb-6">Completed</h2>
            {completedTasks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignee={members.find((m) => m.id === task.assigneeId)}
                  onToggleCompletion={handleToggleTaskCompletion}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            ) : (
                <p className="text-muted-foreground">No tasks completed yet. Let's get to work!</p>
            )}
          </section>
        </div>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} SplitWork. All rights reserved.</p>
      </footer>
    </div>
  );
}
