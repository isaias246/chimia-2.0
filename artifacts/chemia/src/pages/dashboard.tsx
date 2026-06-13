import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetElementStats, useListCalculationHistory } from "@workspace/api-client-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";
import { Activity, Beaker, Calculator, Grid, MessageSquare, Scale, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user ? `, ${user.username}` : ""}
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="hover-elevate cursor-pointer transition-colors hover:border-primary/50 h-full border-border/50">
              <CardHeader className="pb-2">
                <tool.icon className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Element Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isStatsLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats || []} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" width={120} fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {(stats || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : !user ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground space-y-4">
                <Clock className="h-8 w-8 opacity-20" />
                <p>Sign in to view your calculation history.</p>
                <Link href="/login">
                  <span className="text-primary hover:underline">Log in</span>
                </Link>
              </div>
            ) : history && history.length > 0 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {history.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex flex-col gap-1 p-3 rounded-md bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">{record.type.replace('_', ' ')}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(record.createdAt), "MMM d, HH:mm")}</span>
                    </div>
                    <div className="font-mono text-sm">{record.input}</div>
                    <div className="font-mono text-xs text-muted-foreground truncate">{record.result}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                <p>No recent activity.</p>
                <p className="text-sm">Use the tools above to start exploring.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}