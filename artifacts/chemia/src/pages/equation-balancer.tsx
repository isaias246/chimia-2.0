import React, { useState } from "react";
import { useBalanceEquation } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scale, Loader2, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EquationBalancer() {
  const [equation, setEquation] = useState("");
  const balanceMutation = useBalanceEquation();

  const handleBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equation.trim()) return;
    balanceMutation.mutate({ data: { equation: equation.trim() } });
  };

  const renderFormulaWithHighlight = (formula: string, coefficient: number) => {
    return (
      <span className="font-mono text-lg">
        {coefficient > 1 && <span className="text-primary font-bold mr-1">{coefficient}</span>}
        <span>{formula}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equation Balancer</h1>
        <p className="text-muted-foreground">Automatically balance chemical equations.</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Input Equation
          </CardTitle>
          <CardDescription>Enter unbalanced equation (e.g. H2 + O2 -{'>'} H2O or H2 + O2 = H2O)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBalance} className="flex gap-4">
            <Input
              placeholder="e.g. CH4 + O2 -> CO2 + H2O"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="font-mono text-lg py-6"
            />
            <Button 
              type="submit" 
              size="lg"
              className="px-8 h-auto"
              disabled={!equation.trim() || balanceMutation.isPending}
            >
              {balanceMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Balance"}
            </Button>
          </form>
          {balanceMutation.isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to balance equation. Please check your syntax.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {balanceMutation.data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className={`border-2 ${balanceMutation.data.isBalanced ? 'border-green-500/50' : 'border-destructive/50'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Result</CardTitle>
                {balanceMutation.data.isBalanced ? (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Balanced
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                    <XCircle className="h-3 w-3" /> Could not balance
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-6 flex flex-wrap items-center justify-center gap-4 text-center bg-secondary/30 rounded-lg">
                <div className="flex flex-wrap items-center gap-2">
                  {balanceMutation.data.reactants.map((r, i) => (
                    <React.Fragment key={`r-${i}`}>
                      {i > 0 && <span className="font-mono text-muted-foreground">+</span>}
                      {renderFormulaWithHighlight(r.formula, r.coefficient)}
                    </React.Fragment>
                  ))}
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground mx-4" />
                <div className="flex flex-wrap items-center gap-2">
                  {balanceMutation.data.products.map((p, i) => (
                    <React.Fragment key={`p-${i}`}>
                      {i > 0 && <span className="font-mono text-muted-foreground">+</span>}
                      {renderFormulaWithHighlight(p.formula, p.coefficient)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded bg-background border border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Original</h4>
                <div className="font-mono text-sm opacity-70">{balanceMutation.data.original}</div>
              </div>
            </CardContent>
          </Card>

          {balanceMutation.data.steps && balanceMutation.data.steps.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {balanceMutation.data.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm p-2 rounded hover:bg-secondary/50 transition-colors">
                      <span className="text-primary font-mono">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// Inline badge component to save an import if it's missing, but it's likely available.
function Badge({ children, className, variant = "default" }: any) {
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</div>;
}
