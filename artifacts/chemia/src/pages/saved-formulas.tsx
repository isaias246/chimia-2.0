import React from "react";
import { useListFormulas, useDeleteFormula, getListFormulasQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertCircle, Plus, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";

export default function SavedFormulas() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: formulas, isLoading } = useListFormulas({
    query: { enabled: !!user }
  });
  const deleteMutation = useDeleteFormula();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          <FlaskConical className="h-20 w-20 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Saved Formulas</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your personal library of molecular structures and calculations. Sign in to access.
          </p>
        </div>
        <Link href="/login">
          <Button className="h-12 px-8 font-semibold tracking-wide">Sign In to Library</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      id,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFormulasQueryKey() });
        }
      }
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Formulas</h1>
          <p className="text-muted-foreground mt-1">Your personal library of molecular structures.</p>
        </div>
        <Link href="/molecular-mass">
          <Button className="font-semibold tracking-wide">
            <Plus className="h-4 w-4 mr-2" /> Add Formula
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse border-border/30 bg-secondary/10 h-48">
              <CardHeader className="h-20 bg-secondary/20" />
              <CardContent className="h-full" />
            </Card>
          ))}
        </div>
      ) : formulas?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-xl border-dashed border-border/50 mt-10">
          <div className="p-5 bg-secondary/30 rounded-full mb-6">
            <FlaskConical className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No saved formulas yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">Use the Molecular Mass calculator to analyze compounds and save them to your library.</p>
          <Link href="/molecular-mass">
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">Go to Calculator</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formulas?.map((formula) => (
            <Card key={formula.id} className="glass border-border/40 flex flex-col group relative overflow-hidden hover:border-primary/40 transition-colors duration-300">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="h-8 w-8 bg-destructive/80 hover:bg-destructive shadow-md" 
                  onClick={() => handleDelete(formula.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <CardHeader className="pb-4 border-b border-border/30 bg-black/10 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-mono text-3xl font-bold text-white drop-shadow-sm">{formula.formula}</CardTitle>
                  </div>
                  <div className="px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-semibold bg-primary/10 text-primary border border-primary/20">
                    {formula.type}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pt-5 relative z-10">
                {formula.molecularMass && (
                  <div className="mb-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold block mb-1">Molar Mass</span>
                    <p className="font-mono text-xl text-foreground/90">{formula.molecularMass.toFixed(3)} <span className="text-sm text-muted-foreground">g/mol</span></p>
                  </div>
                )}
                <div className="mt-auto pt-4 border-t border-border/30 flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Added {format(new Date(formula.createdAt), "MMM d, yyyy")}</span>
                  <Link href={`/molecular-mass?formula=${formula.formula}`}>
                    <span className="text-xs text-primary hover:underline cursor-pointer font-medium">View Details →</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
