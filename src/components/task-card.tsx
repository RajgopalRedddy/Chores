"use client";

import * as React from "react";
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
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar, Trash2, Check, User, Users } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  members: Member[];
  onToggleCompletion: (taskId: string, memberId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, members, onToggleCompletion, onDelete }: TaskCardProps) {
  const isOverdue = !task.completed && isPast(task.dueDate);
  const completer = task.completed && task.assigneeId ? members.find(m => m.id === task.assigneeId) : null;

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
            <CardTitle className={cn("text-lg font-headline leading-tight pr-2", task.completed && "line-through text-muted-foreground")}>
                {task.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
                {!task.completed ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Check className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <div className="px-2 py-1.5 text-sm font-semibold">Completed by...</div>
                      {members.map(member => (
                        <DropdownMenuItem key={member.id} onSelect={() => onToggleCompletion(task.id, member.id)}>
                           <Avatar className="mr-2 h-5 w-5">
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait"/>
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                   <Button variant="outline" size="sm" className="h-8" onClick={() => onToggleCompletion(task.id, task.assigneeId!)}>
                      Undo
                   </Button>
                )}
            </div>
        </div>
        <CardDescription className={cn(task.completed && "line-through text-muted-foreground/80")}>
            {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
           {completer ? (
             <>
                <Avatar className="h-6 w-6">
                    <AvatarImage src={completer.avatarUrl} alt={completer.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{completer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{completer.name}</span>
             </>
           ) : (
            <>
              <Users className="size-4" />
              <span className="font-medium">Group Task</span>
            </>
           )}
        </div>
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
