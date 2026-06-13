import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetElementStats, useListCalculationHistory } from "@workspace/api-client-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";
import { Activity, Beaker, Calculator, Grid, MessageSquare, Scale, Clock, Lock, ArrowRight, Brain, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats, isLoading: isStatsLoading } = useGetElementStats();
  const { data: history, isLoading: isHistoryLoading } = useListCalculationHistory({
    query: {
      enabled: !!user,
    }
  });

  const tools = [
    { title: "Periodic Table", href: "/periodic-table", icon: Grid, description: "Explore elements and their properties" },
    { title: "Molecular Mass", href: "/molecular-mass", icon: Calculator, description: "Calculate mass and percent composition" },
    { title: "Compound Builder", href: "/compound-builder", icon: Beaker, description: "Build compounds from elements" },
    { title: "Equation Balancer", href: "/equation-balancer", icon: Scale, description: "Balance chemical equations automatically" },
    { title: "AI Tutor", href: "/ai-tutor", icon: MessageSquare, description: "Get help with chemistry concepts" },
    { title: "Saved Formulas", href: "/saved-formulas", icon: Beaker, description: "View your personal formula library" },
  ];

  const totalCalculations = history ? history.length : "—";

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-cyan-950/30 via-transparent to-purple-950/20 border border-cyan-500/10 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {user ? `Welcome back, ${user.username}` : "CHEMIA"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass glow-primary-hover transition-all">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">118 Elements</span>
              <Grid className="h-4 w-4 text-primary opacity-80" />
            </div>
            <div className="text-3xl font-bold text-primary">118</div>
            <p className="text-xs text-muted-foreground mt-1">In the periodic table</p>
          </CardContent>
        </Card>
        
        <Card className="glass glow-primary-hover transition-all">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">10 Topics</span>
              <Brain className="h-4 w-4 text-primary opacity-80" />
            </div>
            <div className="text-3xl font-bold text-primary">10</div>
            <p className="text-xs text-muted-foreground mt-1">AI tutor coverage</p>
          </CardContent>
        </Card>
        
        <Card className="glass glow-primary-hover transition-all">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">History</span>
              <Calculator className="h-4 w-4 text-primary opacity-80" />
            </div>
            <div className="text-3xl font-bold text-primary">{totalCalculations}</div>
            <p className="text-xs text-muted-foreground mt-1">Total calculations</p>
          </CardContent>
        </Card>
        
        <Card className="glass glow-primary-hover transition-all">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">6 Tools</span>
              <Wrench className="h-4 w-4 text-primary opacity-80" />
            </div>
            <div className="text-3xl font-bold text-primary">6</div>
            <p className="text-xs text-muted-foreground mt-1">Chemistry modules</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" /> Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Card className="group glass cursor-pointer transition-all hover:border-primary/50 hover:bg-white/5 h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <tool.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                  </div>
                  <CardTitle className="text-lg mt-4">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Element Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {isStatsLoading ? (
              <Skeleton className="w-full h-full bg-secondary/50" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats || []} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" width={140} fontSize={12} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                    {(stats || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full bg-secondary/50" />
                <Skeleton className="h-16 w-full bg-secondary/50" />
                <Skeleton className="h-16 w-full bg-secondary/50" />
              </div>
            ) : !user ? (
              <div className="flex flex-col items-center justify-center h-[280px] text-center text-muted-foreground space-y-4 bg-secondary/20 rounded-lg border border-dashed border-border/50">
                <div className="p-4 bg-primary/10 rounded-full glow-primary">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Sign in to track your work</h3>
                  <p className="text-sm">Your calculation history is saved securely.</p>
                </div>
                <Link href="/login">
                  <Button size="sm" className="mt-2">Sign In</Button>
                </Link>
              </div>
            ) : history && history.length > 0 ? (
              <div className="space-y-3 h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {history.slice(0, 6).map((record) => (
                  <div key={record.id} className="flex flex-col gap-1.5 p-3 rounded-md bg-secondary/30 border border-border/40 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/10 rounded-sm">
                        {record.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{format(new Date(record.createdAt), "MMM d, HH:mm")}</span>
                    </div>
                    <div className="font-mono text-sm text-foreground mt-1">{record.input}</div>
                    <div className="font-mono text-xs text-muted-foreground truncate border-t border-border/40 pt-1 mt-1">{record.result}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-center text-muted-foreground bg-secondary/10 rounded-lg border border-dashed border-border/50">
                <Clock className="h-8 w-8 opacity-20 mb-3" />
                <p>No recent activity.</p>
                <p className="text-sm mt-1">Use the tools to start exploring.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
