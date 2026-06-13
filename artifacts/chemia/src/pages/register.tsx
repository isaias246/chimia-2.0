import React, { useState } from "react";
import { useRegister } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Beaker, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const registerMutation = useRegister();
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) return;

    registerMutation.mutate(
      { data: { email, username, password } },
      {
        onSuccess: (data) => {
          login(data.token);
          setLocation("/");
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <Beaker className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
        <span className="font-bold text-2xl tracking-wider text-primary">CHEMIA</span>
      </Link>

      <Card className="w-full max-w-md border-border/50 shadow-xl bg-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Set up your scientific workspace</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {registerMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {registerMutation.error?.message || "Failed to create account. Please try again."}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="scientist@lab.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="jdoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={registerMutation.isPending || !email || !password || !username}
            >
              {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Account
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}