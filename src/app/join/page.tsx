
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SplitWorkLogo } from "@/components/split-work-logo";
import { useToast } from "@/hooks/use-toast";
import type { InvitedEmail } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<InvitedEmail[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedInvitedEmails = localStorage.getItem("splitwork_invited_emails");
      if(storedInvitedEmails) {
        setInvitedEmails(JSON.parse(storedInvitedEmails).map((invited: InvitedEmail) => ({...invited, invitedAt: new Date(invited.invitedAt)})));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setInvitedEmails([]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      const isInvited = invitedEmails.some(i => i.email.toLowerCase() === email.trim().toLowerCase());
      
      if (!isInvited) {
        toast({
          variant: "destructive",
          title: "Not Invited",
          description: "This email address has not been invited to join the team.",
        });
        return;
      }
      
      const encodedName = encodeURIComponent(name.trim());
      const encodedEmail = encodeURIComponent(email.trim());
      router.push(`/?newMember=${encodedName}&email=${encodedEmail}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center space-x-4 mb-8">
        <SplitWorkLogo />
        <h1 className="text-3xl font-bold font-headline text-foreground">
          Join a Team on SplitWork
        </h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register Your Account</CardTitle>
          <CardDescription>
            Enter your name and the email address that was invited. Your request will be sent for approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Invited Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jane.doe@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={!isClient}>
              Request to Join
            </Button>
          </form>
        </CardContent>
      </Card>
      {isClient && invitedEmails.length === 0 && (
         <Alert variant="destructive" className="mt-4 max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No one has been invited yet!</AlertTitle>
            <AlertDescription>
              Make sure the team admin has invited you before you try to register.
            </AlertDescription>
          </Alert>
      )}
    </div>
  );
}

    