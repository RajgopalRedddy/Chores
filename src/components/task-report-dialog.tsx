"use client";

import { useState, useMemo } from "react";
import type { Member, Task } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChartHorizontal, CheckCircle, ListTodo } from "lucide-react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

type Granularity = "Daily" | "Weekly" | "Monthly";

interface TaskReportDialogProps {
  members: Member[];
  tasks: Task[];
}

interface Report {
  completedTasks: Task[];
  pendingTasks: Task[];
}

export function TaskReportDialog({ members, tasks }: TaskReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [granularity, setGranularity] = useState<Granularity>("Weekly");

  const report = useMemo<Report | null>(() => {
    if (!selectedMemberId) return null;

    const now = new Date();
    let interval: Interval;

    switch (granularity) {
      case "Daily":
        interval = { start: startOfDay(now), end: endOfDay(now) };
        break;
      case "Weekly":
        interval = { start: startOfWeek(now), end: endOfWeek(now) };
        break;
      case "Monthly":
        interval = { start: startOfMonth(now), end: endOfMonth(now) };
        break;
    }

    const memberTasks = tasks.filter((t) => t.assigneeId === selectedMemberId);
    
    const completedTasks = tasks.filter(
      (t) => t.completed && t.completedAt && t.assigneeId === selectedMemberId && isWithinInterval(t.completedAt, interval)
    );
      
    const pendingTasks = tasks.filter((t) => !t.completed);

    return { completedTasks, pendingTasks };
  }, [selectedMemberId, granularity, tasks]);
  
  const allTimeCompleted = useMemo(() => {
     if(!selectedMemberId) return [];
     return tasks.filter(t => t.completed && t.assigneeId === selectedMemberId);
  }, [selectedMemberId, tasks]);

  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BarChartHorizontal className="mr-2 h-4 w-4" /> Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Task Report</DialogTitle>
          <DialogDescription>
            Generate a task summary for a group member.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Select onValueChange={setSelectedMemberId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={granularity}
            onValueChange={(v) => setGranularity(v as Granularity)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {report && selectedMember && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-headline">
                Report for {selectedMember.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-accent">{report.completedTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Completed ({granularity})</p>
                </div>
                 <div>
                  <p className="text-2xl font-bold">{allTimeCompleted.length}</p>
                  <p className="text-sm text-muted-foreground">Completed (All Time)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{report.pendingTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Pending (Group)</p>
                </div>
              </div>
              <Separator />
                <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="text-accent size-5"/> Completed Tasks ({granularity})</h4>
                    {report.completedTasks.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {report.completedTasks.map(task => <li key={task.id}>{task.title}</li>)}
                        </ul>
                    ) : <p className="text-sm text-muted-foreground">No tasks completed in this period.</p>}
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><ListTodo className="text-primary size-5"/> All Pending Group Tasks</h4>
                     {report.pendingTasks.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {report.pendingTasks.map(task => <li key={task.id}>{task.title}</li>)}
                        </ul>
                    ) : <p className="text-sm text-muted-foreground">No pending tasks. All clear!</p>}
                </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
