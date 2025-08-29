
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SplitWorkLogo } from "@/components/split-work-logo";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
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
          <CardTitle>Enter Your Details</CardTitle>
          <CardDescription>
            You've been invited to join a team. Please enter your name and email to continue.
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
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jane.doe@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Join Team
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
    