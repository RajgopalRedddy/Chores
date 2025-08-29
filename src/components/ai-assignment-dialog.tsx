"use client";

import { useState } from "react";
import type { Member, Task } from "@/types";
import {
  suggestTaskAssignments,
  type SuggestTaskAssignmentsOutput,
} from "@/ai/flows/suggest-task-assignments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Loader2, UserCheck } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AiAssignmentDialogProps {
  members: Member[];
  tasks: Task[];
}

export function AiAssignmentDialog({ members, tasks }: AiAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    SuggestTaskAssignmentsOutput["suggestedAssignments"] | null
  >(null);
  const { toast } = useToast();

  const handleSuggestion = async () => {
    if (!taskDescription.trim()) {
      toast({
        title: "Task description is missing.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSuggestions(null);

    try {
      const membersWithWorkload = members.map((member) => ({
        name: member.name,
        currentWorkload: tasks.filter(
          (t) => t.assigneeId === member.id && !t.completed
        ).length,
      }));

      const result = await suggestTaskAssignments({
        taskDescription,
        groupMembers: membersWithWorkload,
      });

      setSuggestions(result.suggestedAssignments);
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        title: "AI Suggestion Failed",
        description: "Could not get suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BrainCircuit className="mr-2 h-4 w-4" /> AI Suggest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Task Suggestions</DialogTitle>
          <DialogDescription>
            Describe a task and let AI suggest suitable members based on their current workload. The task will be created for the whole group.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ai-task-description" className="sr-only">
              Task Description
            </Label>
            <Textarea
              id="ai-task-description"
              placeholder="e.g., 'Refactor the authentication service to improve performance and security.'"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={4}
            />
          </div>
          {suggestions && (
            <div className="space-y-4">
              <h4 className="font-medium">Suggestions:</h4>
              <Card>
                <CardContent className="pt-6 space-y-4">
                {suggestions.map((suggestion) => {
                    const member = members.find(m => m.name === suggestion.memberName);
                    return (
                        <div key={suggestion.memberName} className="flex items-start space-x-4 p-2 rounded-lg bg-accent/20">
                            <UserCheck className="size-5 mt-1 text-accent" />
                            <div>
                                <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={member?.avatarUrl} alt={member?.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold">{suggestion.memberName}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{suggestion.rationale}</p>
                            </div>
                        </div>
                    );
                })}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSuggestion}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Thinking..." : "Get Suggestions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
