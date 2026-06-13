import React from "react";
import { useListFormulas, useDeleteFormula, getListFormulasQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Library, Loader2, AlertCircle } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Library className="h-16 w-16 text-primary opacity-50" />
        <h2 className="text-2xl font-bold">Saved Formulas</h2>
        <p className="text-muted-foreground text-center">Sign in to save and view your important chemical formulas.</p>
        <Link href="/login">
          <Button>Log In</Button>
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Formulas</h1>
        <p className="text-muted-foreground">Your personal library of chemical formulas.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse border-border/50">
              <CardHeader className="h-24 bg-secondary/20" />
              <CardContent className="h-20" />
            </Card>
          ))}
        </div>
      ) : formulas?.length === 0 ? (
        <Card className="border-dashed border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
            <p>You haven't saved any formulas yet.</p>
            <Link href="/molecular-mass" className="mt-4">
              <Button variant="outline">Go to Calculator</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formulas?.map((formula) => (
            <Card key={formula.id} className="border-border/50 flex flex-col group relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="h-8 w-8" 
                  onClick={() => handleDelete(formula.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-2xl text-primary">{formula.formula}</CardTitle>
                <CardDescription className="capitalize">{formula.type}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {formula.molecularMass && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Mass</span>
                    <p className="font-mono text-lg">{formula.molecularMass.toFixed(3)} <span className="text-sm">g/mol</span></p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  Saved {format(new Date(formula.createdAt), "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}