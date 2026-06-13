import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetElementStats, useListCalculationHistory } from "@workspace/api-client-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";
import { Activity, Beaker, Calculator, Grid, MessageSquare, Scale, Clock, ArrowRight, Brain, Wrench, Sparkles, BookOpen, FlaskConical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const tools = [
  { title: "Resolutor Inteligente", href: "/smart-solver", icon: Sparkles, description: "Resuelve cualquier problema de química paso a paso", featured: true },
  { title: "Tutor de Química", href: "/ai-tutor", icon: MessageSquare, description: "Pregunta cualquier duda — conceptos, ecuaciones, teoría" },
  { title: "Tabla Periódica", href: "/periodic-table", icon: Grid, description: "Explora los 118 elementos y sus propiedades" },
  { title: "Biblioteca de Compuestos", href: "/compound-library", icon: BookOpen, description: "Perfiles educativos detallados de compuestos clave" },
  { title: "Masa Molecular", href: "/molecular-mass", icon: Calculator, description: "Calcula la masa y composición porcentual" },
  { title: "Constructor de Compuestos", href: "/compound-builder", icon: Beaker, description: "Sintetiza compuestos iónicos por carga" },
  { title: "Balanceador de Ecuaciones", href: "/equation-balancer", icon: Scale, description: "Balancea ecuaciones químicas automáticamente" },
  { title: "Estequiometría", href: "/stoichiometry", icon: FlaskConical, description: "Moles, reactivo limitante y rendimiento teórico" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: isStatsLoading } = useGetElementStats();
  const { data: history, isLoading: isHistoryLoading } = useListCalculationHistory();

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-950/40 via-background to-purple-950/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">Plataforma Educativa</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {user ? `Bienvenido/a, ${user.username}` : "Aprende Química"}
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            {user
              ? format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
              : "Herramientas de química accesibles para todos. Sin registro requerido."}
          </p>
          {!user && (
            <p className="text-sm text-primary/70 font-mono italic mt-1">
              "Valor primero, cuenta después."
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Elementos", value: "118", sub: "En la tabla periódica", icon: Grid },
          { label: "Temas del Tutor", value: "10", sub: "Cobertura de IA", icon: Brain },
          { label: "Herramientas", value: "8", sub: "Módulos de química", icon: Wrench },
          { label: "Cálculos", value: history ? String(history.length) : "—", sub: "Totales realizados", icon: Activity },
        ].map(s => (
          <Card key={s.label} className="glass glow-primary-hover transition-all">
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-primary opacity-70" />
              </div>
              <div className="text-3xl font-bold text-primary font-mono">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" /> Herramientas de Química
          <span className="ml-2 text-xs text-muted-foreground font-normal">— acceso libre, sin cuenta</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Card className={`group glass cursor-pointer transition-all h-full ${tool.featured ? "border-primary/30 bg-primary/5 hover:border-primary/60" : "hover:border-primary/40 hover:bg-white/5"}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg ${tool.featured ? "bg-primary/20" : "bg-primary/10"}`}>
                      <tool.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                  </div>
                  <CardTitle className={`text-base mt-3 ${tool.featured ? "text-primary" : ""}`}>{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs text-muted-foreground">{tool.description}</CardDescription>
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
              <Activity className="h-5 w-5 text-primary" /> Categorías de Elementos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isStatsLoading ? (
              <Skeleton className="w-full h-full bg-secondary/50" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats || []} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" width={145} fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} cursor={{ fill: "hsl(var(--secondary))" }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                    {(stats || []).map((_, i) => <Cell key={i} fill={`hsl(var(--chart-${(i % 5) + 1}))`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full bg-secondary/50" />
                <Skeleton className="h-16 w-full bg-secondary/50" />
              </div>
            ) : history && history.length > 0 ? (
              <div className="space-y-3 h-[260px] overflow-y-auto pr-1">
                {history.slice(0, 6).map((record) => (
                  <div key={record.id} className="flex flex-col gap-1.5 p-3 rounded-md bg-secondary/30 border border-border/40 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/10 rounded-sm">
                        {record.type.replace("_", " ")}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {format(new Date(record.createdAt), "d MMM, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-foreground">{record.input}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[260px] text-center text-muted-foreground bg-secondary/10 rounded-lg border border-dashed border-border/50">
                <Clock className="h-8 w-8 opacity-20 mb-3" />
                <p>Sin actividad reciente.</p>
                <p className="text-sm mt-1">Usa cualquier herramienta para empezar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
