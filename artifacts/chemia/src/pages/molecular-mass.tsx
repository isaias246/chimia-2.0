import React, { useState, useEffect } from "react";
import { useCalculateMolecularMass, useSaveFormula, getListFormulasQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Save, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useAuth } from "@/lib/auth-context";

export default function MolecularMass() {
  const [formula, setFormula] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const calculateMutation = useCalculateMolecularMass();
  const saveMutation = useSaveFormula();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("formula");
    if (f) {
      setFormula(f);
      calculateMutation.mutate({ data: { formula: f } });
    }
  }, []);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formula.trim()) return;
    calculateMutation.mutate(
      { data: { formula: formula.trim() } },
      { onError: () => toast({ title: "Error de Cálculo", description: "Fórmula química inválida. Revisa los símbolos de elementos.", variant: "destructive" }) }
    );
  };

  const handleExampleClick = (ex: string) => {
    setFormula(ex);
    calculateMutation.mutate({ data: { formula: ex } });
  };

  const handleSave = () => {
    if (!calculateMutation.data) return;
    saveMutation.mutate(
      { data: { formula: calculateMutation.data.formula, name: calculateMutation.data.formula, type: "molecule", molecularMass: calculateMutation.data.molecularMass } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFormulasQueryKey() });
          toast({ title: "Fórmula Guardada", description: "Agregada a tus fórmulas guardadas." });
        },
        onError: () => toast({ title: "Error al Guardar", description: "Inicia sesión para guardar fórmulas.", variant: "destructive" }),
      }
    );
  };

  const examples = ["H2O", "CO2", "NaCl", "C6H12O6", "Ca(OH)2", "CH3COOH"];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calculadora de Masa Molecular</h1>
        <p className="text-muted-foreground mt-1">Calcula la masa molecular y la composición porcentual de los elementos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 glass border-border/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" /> Fórmula Química
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCalculate} className="space-y-4">
              <Input
                placeholder="ej. C6H12O6"
                value={formula}
                onChange={e => setFormula(e.target.value)}
                className="font-mono text-2xl py-7 text-center tracking-wider bg-secondary/30 border-border/60 focus-visible:ring-primary placeholder:opacity-30"
              />
              <Button type="submit" className="w-full h-12 font-semibold" disabled={!formula.trim() || calculateMutation.isPending}>
                {calculateMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculando...</> : "Calcular Masa"}
              </Button>
            </form>
            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-3 text-center">Ejemplos Rápidos</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {examples.map(ex => (
                  <button key={ex} onClick={() => handleExampleClick(ex)} className="px-3 py-1.5 rounded bg-secondary/40 border border-border/40 font-mono text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors">
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {calculateMutation.data ? (
          <div className="lg:col-span-8 space-y-6">
            <Card className="glass border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardDescription className="uppercase tracking-widest text-[10px] font-semibold text-primary">Resultado</CardDescription>
                  <CardTitle className="text-4xl font-mono mt-1 text-white">{calculateMutation.data.formula}</CardTitle>
                </div>
                {user && (
                  <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending} className="bg-secondary/80 hover:bg-primary border border-border">
                    {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Guardar
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6 mt-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Masa Molecular</div>
                    <div className="text-4xl font-mono text-white">{calculateMutation.data.molecularMass.toFixed(3)} <span className="text-xl text-white/40">u</span></div>
                  </div>
                  <div className="w-px bg-border/50 hidden sm:block" />
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Masa Molar</div>
                    <div className="text-4xl font-mono text-white">{calculateMutation.data.molarMass.toFixed(3)} <span className="text-xl text-white/40">g/mol</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardHeader><CardTitle className="text-lg">Composición Porcentual</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="h-[240px] w-full lg:w-[40%] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={calculateMutation.data.composition} dataKey="percentComposition" nameKey="symbol" cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={2} stroke="none">
                          {calculateMutation.data.composition.map((_, i) => <Cell key={i} fill={`hsl(var(--chart-${(i % 5) + 1}))`} />)}
                        </Pie>
                        <RechartsTooltip formatter={(v: number) => [`${v.toFixed(2)}%`, "Composición"]} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Elementos</span>
                      <span className="text-2xl font-mono font-bold">{calculateMutation.data.composition.length}</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-[60%]">
                    <div className="rounded-lg border border-border/50 overflow-hidden bg-secondary/20">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/40 border-b border-border/50">
                          <tr>
                            {["Elemento", "Cant.", "Masa Total", "%"].map(h => <th key={h} className="p-3 text-right first:text-left font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {calculateMutation.data.composition.map((comp, i) => (
                            <tr key={i} className="hover:bg-white/5">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))` }} />
                                  <span className="font-mono font-bold text-base">{comp.symbol}</span>
                                  <span className="text-muted-foreground text-xs hidden sm:inline">({comp.name})</span>
                                </div>
                              </td>
                              <td className="p-3 text-right font-mono text-muted-foreground">{comp.count}</td>
                              <td className="p-3 text-right font-mono text-muted-foreground">{comp.totalMass.toFixed(3)}</td>
                              <td className="p-3 text-right font-mono font-bold text-white">{comp.percentComposition.toFixed(2)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !calculateMutation.isPending && (
          <div className="lg:col-span-8 flex items-center justify-center border border-dashed border-border/50 rounded-xl p-8 text-center text-muted-foreground min-h-[400px] bg-secondary/10">
            <div className="max-w-sm space-y-4">
              <Calculator className="h-12 w-12 mx-auto opacity-20" />
              <h3 className="text-lg font-medium text-foreground">Esperando Entrada</h3>
              <p className="text-sm">Ingresa una fórmula química a la izquierda para calcular su masa molecular y ver la composición porcentual.</p>
              <div className="text-xs space-y-2 mt-6 opacity-70 p-4 bg-secondary/30 rounded-lg text-left inline-block">
                <div className="font-semibold mb-2">Formatos Soportados:</div>
                <div className="font-mono flex items-center gap-2"><ArrowRight className="h-3 w-3"/> Ca(OH)2 <span className="font-sans opacity-50 ml-2">Paréntesis</span></div>
                <div className="font-mono flex items-center gap-2"><ArrowRight className="h-3 w-3"/> CuSO4·5H2O <span className="font-sans opacity-50 ml-2">Hidratos</span></div>
                <div className="font-mono flex items-center gap-2"><ArrowRight className="h-3 w-3"/> CH3COOH <span className="font-sans opacity-50 ml-2">Orgánicos</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
