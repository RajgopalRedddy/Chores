
"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from 'next/navigation'
import type { Member, Task } from "@/types";
import { Button } from "@/components/ui/button";
import { SplitWorkLogo } from "@/components/split-work-logo";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { AiAssignmentDialog } from "@/components/ai-assignment-dialog";
import { TaskReportDialog } from "@/components/task-report-dialog";
import { TaskCard } from "@/components/task-card";
import { PlusCircle, UserPlus, BrainCircuit, BarChartHorizontal, Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function HomeComponent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    const initialMembers: Member[] = [
      { id: "1", name: "Alice", avatarUrl: "https://picsum.photos/seed/alice/100/100", status: 'approved' },
      { id: "2", name: "Bob", avatarUrl: "https://picsum.photos/seed/bob/100/100", status: 'approved' },
      { id: "3", name: "Charlie", avatarUrl: "https://picsum.photos/seed/charlie/100/100", status: 'approved' },
      { id: '4', name: 'Diana', avatarUrl: 'https://picsum.photos/seed/diana/100/100', status: 'approved' },
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

  const handleAddMember = (name: string, fromUrl = false) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name,
      avatarUrl: `https://picsum.photos/seed/${name}/100/100`,
      status: fromUrl ? 'pending' : 'approved',
    };
    setMembers((prev) => [...prev, newMember]);
  };
  
  useEffect(() => {
    const newMemberName = searchParams.get('newMember');
    if (newMemberName) {
      const decodedName = decodeURIComponent(newMemberName);
      if (!members.some(m => m.name === decodedName)) {
        handleAddMember(decodedName, true);
      }
      // This is a bit of a hack to remove the query param from the URL without a full page reload.
      // It keeps the URL clean after the member is added.
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams, members]);

  
  const handleApproveMember = (memberId: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'approved' } : m));
  };
  
  const handleDeclineMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
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

  const { approvedMembers, pendingMembers } = useMemo(() => {
    const approved = members.filter(m => m.status === 'approved');
    const pending = members.filter(m => m.status === 'pending');
    return { approvedMembers: approved, pendingMembers: pending };
  }, [members]);


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
              <AddTaskDialog members={approvedMembers} onAddTask={handleAddTask} />
            </div>
          </div>
          <div className="pb-4 flex flex-wrap gap-2">
              <AiAssignmentDialog members={approvedMembers} tasks={tasks} />
              <TaskReportDialog members={approvedMembers} tasks={tasks} />
          </div>
        </div>
        <Separator />
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">

        {pendingMembers.length > 0 && (
          <section id="pending-requests">
            <h2 className="text-3xl font-headline font-bold mb-6">Pending Requests</h2>
            <Card>
                <CardContent className="p-4 space-y-4">
                {pendingMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{member.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeclineMember(member.id)}>
                                <X className="size-4" />
                                <span className="sr-only">Decline</span>
                            </Button>
                            <Button size="icon" variant="outline" className="text-accent hover:bg-accent/10 hover:text-accent" onClick={() => handleApproveMember(member.id)}>
                                <Check className="size-4" />
                                <span className="sr-only">Approve</span>
                            </Button>
                        </div>
                    </div>
                ))}
                </CardContent>
            </Card>
          </section>
          )}

          <section id="todo">
            <h2 className="text-3xl font-headline font-bold mb-6">To-Do</h2>
            {todoTasks.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    assignee={approvedMembers.find((m) => m.id === task.assigneeId)}
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
                  assignee={approvedMembers.find((m) => m.id === task.assigneeId)}
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


export default function Home() {
  return (
    <Suspense>
      <HomeComponent />
    </Suspense>
  )
}
    
    