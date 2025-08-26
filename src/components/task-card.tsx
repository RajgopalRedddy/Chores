"use client";

import type { Task, Member } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface TaskCardProps {
  task: Task;
  assignee?: Member;
  onToggleCompletion: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, assignee, onToggleCompletion, onDelete }: TaskCardProps) {
  const isOverdue = !task.completed && isPast(task.dueDate);

  return (
    <Card
      className={cn(
        "flex flex-col transition-all duration-300",
        task.completed ? "bg-card/60" : "bg-card",
        isOverdue && "border-destructive/50 ring-2 ring-destructive/20"
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className={cn("text-lg font-headline leading-tight", task.completed && "line-through text-muted-foreground")}>
                {task.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => onToggleCompletion(task.id)}
                    className="size-5"
                />
            </div>
        </div>
        <CardDescription className={cn(task.completed && "line-through text-muted-foreground/80")}>
            {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {assignee && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint="person portrait" />
              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{assignee.name}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-4" />
          <span className={cn(isOverdue && "text-destructive font-semibold")}>
            {format(task.dueDate, "MMM d, yyyy")}
          </span>
          {isOverdue && <Badge variant="destructive">Overdue</Badge>}
        </div>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(task.id)}>
          <Trash2 className="size-4" />
          <span className="sr-only">Delete task</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
