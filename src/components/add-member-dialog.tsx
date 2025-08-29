
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, UserPlus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddMemberDialogProps {
  onInviteMember: (email: string) => void;
}

export function AddMemberDialog({ onInviteMember }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShareLink = () => {
    const link = `${window.location.origin}/join`;
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link Copied",
        description: "Share this link with your new team member.",
      });
    });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onInviteMember(email.trim());
      toast({
        title: "Invitation Sent",
        description: `An invitation to join has been logged for ${email.trim()}. They can now register using the shared link.`,
      });
      setEmail("");
      setOpen(false);
    } else {
        toast({
            title: "Error",
            description: "Email cannot be empty.",
            variant: "destructive",
        })
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
          <DialogDescription>
            Authorize an email to join, then share the registration link.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email to Invite</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane.doe@example.com"
                  required
                />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4"/> Authorize & Invite
              </Button>
            </DialogFooter>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Then Share Link
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
              <Input
                  id="link"
                  defaultValue={isClient ? `${window.location.origin}/join` : ""}
                  readOnly
              />
              <Button type="button" size="sm" onClick={handleShareLink}>
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
              </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
