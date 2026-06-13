import React, { useState } from "react";
import { useBalanceEquation } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scale, Loader2, ArrowRight, CheckCircle2, XCircle, Copy, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function EquationBalancer() {
  const [equation, setEquation] = useState("");
  const balanceMutation = useBalanceEquation();
  const { toast } = useToast();

  const handleBalance = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!equation.trim()) return;
    balanceMutation.mutate({ data: { equation: equation.trim() } });
  };

  const handleExampleClick = (ex: string) => {
    setEquation(ex);
    balanceMutation.mutate({ data: { equation: ex } });
  };

  const handleCopy = () => {
    if (!balanceMutation.data) return;
    const eq = `${balanceMutation.data.reactants.map(r => `${r.coefficient > 1 ? r.coefficient : ""}${r.formula}`).join(" + ")} -> ${balanceMutation.data.products.map(p => `${p.coefficient > 1 ? p.coefficient : ""}${p.formula}`).join(" + ")}`;
    navigator.clipboard.writeText(eq);
    toast({ title: "Copiado", description: "Ecuación balanceada copiada al portapapeles." });
  };

  const examples = ["H2 + O2 -> H2O", "CH4 + O2 -> CO2 + H2O", "Fe + O2 -> Fe2O3", "N2 + H2 -> NH3"];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Balanceador de Ecuaciones</h1>
        <p className="text-muted-foreground mt-1">Balancea ecuaciones químicas complejas de forma instantánea.</p>
      </div>

      <Card className="glass border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="text-lg flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Ingresa la Reacción</CardTitle>
          <CardDescription>Escribe reactivos y productos sin balancear separados por una flecha</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleBalance} className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="ej. C6H12O6 + O2 -> CO2 + H2O"
              value={equation}
              onChange={e => setEquation(e.target.value)}
              className="font-mono text-xl py-7 flex-1 bg-secondary/30 border-border/60 focus-visible:ring-primary placeholder:opacity-30 tracking-widest"
            />
            <Button type="submit" className="h-auto py-7 px-8 font-bold" disabled={!equation.trim() || balanceMutation.isPending}>
              {balanceMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Balancear"}
            </Button>
          </form>

          {balanceMutation.isError && (
            <Alert variant="destructive" className="mt-4 bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No se pudo balancear la ecuación. Verifica la sintaxis y asegúrate de que todos los elementos estén en ambos lados.</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 pt-4 border-t border-border/40">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">Ejemplos Rápidos</p>
            <div className="flex flex-wrap gap-2">
              {examples.map(ex => (
                <button key={ex} onClick={() => handleExampleClick(ex)} className="px-3 py-1.5 rounded-md bg-secondary/40 border border-border/40 font-mono text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors text-muted-foreground">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {balanceMutation.data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className={`glass border-2 ${balanceMutation.data.isBalanced ? "border-primary/40" : "border-destructive/40"}`}>
            <CardHeader className="pb-0 border-b border-border/30 bg-black/20">
              <div className="flex items-center justify-between py-4">
                <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Resultado Final</CardTitle>
                <div className="flex items-center gap-3">
                  {balanceMutation.data.isBalanced ? (
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20 gap-1.5">
                      <CheckCircle2 className="h-3 w-3" /> Balanceada ✓
                    </div>
                  ) : (
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-destructive/10 text-destructive border-destructive/20 gap-1.5">
                      <XCircle className="h-3 w-3" /> No balanceada
                    </div>
                  )}
                  {balanceMutation.data.isBalanced && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}><Copy className="h-3.5 w-3.5" /></Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="py-12 flex flex-wrap items-center justify-center gap-6 text-center px-4">
                <div className="flex flex-wrap items-center gap-3">
                  {balanceMutation.data.reactants.map((r, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="font-mono text-2xl text-muted-foreground/50 mx-2">+</span>}
                      <span className="font-mono text-2xl flex items-baseline">
                        {r.coefficient > 1 && <span className="text-primary font-bold text-3xl mr-1">{r.coefficient}</span>}
                        <span className="text-white">{r.formula}</span>
                      </span>
                    </React.Fragment>
                  ))}
                </div>
                <ArrowRight className="h-8 w-8 text-primary mx-4 shrink-0" />
                <div className="flex flex-wrap items-center gap-3">
                  {balanceMutation.data.products.map((p, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="font-mono text-2xl text-muted-foreground/50 mx-2">+</span>}
                      <span className="font-mono text-2xl flex items-baseline">
                        {p.coefficient > 1 && <span className="text-primary font-bold text-3xl mr-1">{p.coefficient}</span>}
                        <span className="text-white">{p.formula}</span>
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {balanceMutation.data.steps && balanceMutation.data.steps.length > 0 && (
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Pasos de Solución</CardTitle>
                <CardDescription>Resolución matricial algebraica para balancear</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {balanceMutation.data.steps.map((step, i) => (
                    <AccordionItem value={`step-${i}`} key={i} className="border-border/50">
                      <AccordionTrigger className="text-sm hover:no-underline hover:text-primary font-mono text-muted-foreground">
                        <div className="flex gap-4 text-left">
                          <span className="text-primary opacity-70">[{i + 1}]</span>
                          <span>{step}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs font-mono text-muted-foreground bg-secondary/20 p-4 rounded-md mt-2 border border-border/40">
                        Transformación matricial para satisfacer la conservación de masa.
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
