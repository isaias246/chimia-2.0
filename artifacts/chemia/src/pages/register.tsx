import React, { useState } from "react";
import { useRegister } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Hexagon, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center gap-4 mb-8 group cursor-pointer">
          <Hexagon className="h-12 w-12 text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.6)] group-hover:scale-105 transition-transform" />
          <div className="text-center">
            <span className="font-bold text-3xl tracking-widest text-gradient-cyan">CHEMIA</span>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mt-1 font-semibold">Chemistry, precisely.</p>
          </div>
        </Link>

        <Card className="w-full glass border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Initialize Workspace</CardTitle>
            <CardDescription>Create your scientific profile</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {registerMutation.isError && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {registerMutation.error?.message || "Failed to create account. Please try again."}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="scientist@lab.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-secondary/30 border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all px-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="e.g. curie_1867"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11 bg-secondary/30 border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all px-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-secondary/30 border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all px-4"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 pt-2 pb-8">
              <Button 
                type="submit" 
                className="w-full h-11 rounded-md font-semibold tracking-wide"
                disabled={registerMutation.isPending || !email || !password || !username}
              >
                {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Account
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <span className="opacity-70">Already active?</span>{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold tracking-wide ml-1">
                  Authenticate
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
