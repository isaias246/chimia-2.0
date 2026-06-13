import React, { useState } from "react";
import { useCalculateMolecularMass, useSaveFormula, getListFormulasQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Save, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { useAuth } from "@/lib/auth-context";

export default function MolecularMass() {
  const [formula, setFormula] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const calculateMutation = useCalculateMolecularMass();
  const saveMutation = useSaveFormula();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formula.trim()) return;

    calculateMutation.mutate(
      { data: { formula: formula.trim() } },
      {
        onError: (err: any) => {
          toast({
            title: "Calculation Failed",
            description: err?.message || "Invalid chemical formula",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleSave = () => {
    if (!calculateMutation.data) return;
    
    saveMutation.mutate(
      {
        data: {
          formula: calculateMutation.data.formula,
          name: calculateMutation.data.formula, // Default name to formula
          type: "molecule",
          molecularMass: calculateMutation.data.molecularMass
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFormulasQueryKey() });
          toast({
            title: "Formula Saved",
            description: "Successfully added to your saved formulas.",
          });
        },
        onError: () => {
          toast({
            title: "Failed to save",
            description: "Could not save formula. Are you logged in?",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Molecular Mass Calculator</h1>
        <p className="text-muted-foreground">Calculate molecular mass and percent composition.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Input Formula
            </CardTitle>
            <CardDescription>Enter a chemical formula like H2O or Ca(OH)2</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="e.g. C6H12O6"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="font-mono text-lg py-6"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!formula.trim() || calculateMutation.isPending}
              >
                {calculateMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...</>
                ) : (
                  "Calculate Mass"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {calculateMutation.data && (
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-border/50 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-mono">{calculateMutation.data.formula}</CardTitle>
                  <CardDescription>Molecular Properties</CardDescription>
                </div>
                {user && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="border-primary/50 hover:bg-primary/10"
                  >
                    {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Molecular Mass</div>
                    <div className="text-3xl font-mono">
                      {calculateMutation.data.molecularMass.toFixed(3)} <span className="text-lg text-muted-foreground">u</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Molar Mass</div>
                    <div className="text-3xl font-mono">
                      {calculateMutation.data.molarMass.toFixed(3)} <span className="text-lg text-muted-foreground">g/mol</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Percent Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="h-[250px] w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={calculateMutation.data.composition}
                          dataKey="percentComposition"
                          nameKey="symbol"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                        >
                          {calculateMutation.data.composition.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Composition']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <div className="rounded-md border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/50 border-b border-border">
                          <tr>
                            <th className="p-2 text-left font-medium">Element</th>
                            <th className="p-2 text-right font-medium">Count</th>
                            <th className="p-2 text-right font-medium">Total Mass</th>
                            <th className="p-2 text-right font-medium">%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {calculateMutation.data.composition.map((comp, idx) => (
                            <tr key={idx} className="hover:bg-muted/50">
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: `hsl(var(--chart-${(idx % 5) + 1}))` }} 
                                  />
                                  <span className="font-mono font-bold">{comp.symbol}</span>
                                  <span className="text-muted-foreground text-xs hidden sm:inline">({comp.name})</span>
                                </div>
                              </td>
                              <td className="p-2 text-right font-mono">{comp.count}</td>
                              <td className="p-2 text-right font-mono">{comp.totalMass.toFixed(3)}</td>
                              <td className="p-2 text-right font-mono">{comp.percentComposition.toFixed(2)}%</td>
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
        )}

        {!calculateMutation.data && !calculateMutation.isPending && (
          <div className="lg:col-span-8 flex items-center justify-center border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground h-[400px]">
            <div className="max-w-sm space-y-4">
              <Calculator className="h-12 w-12 mx-auto opacity-20" />
              <p>Enter a chemical formula to calculate its molecular mass and view its percent composition.</p>
              <div className="text-xs space-y-1 mt-4 opacity-70">
                <p>Supports parenthesis: Ca(OH)2</p>
                <p>Supports hydrates: CuSO4.5H2O</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}