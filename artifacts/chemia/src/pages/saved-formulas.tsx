import React from "react";
import { useListFormulas, useDeleteFormula, getListFormulasQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, FlaskConical, Lock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";

export default function SavedFormulas() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: formulas, isLoading } = useListFormulas();
  const deleteMutation = useDeleteFormula();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFormulasQueryKey() }) }
    );
  };

  if (!user) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fórmulas Guardadas</h1>
            <p className="text-muted-foreground mt-1">Tu biblioteca personal de estructuras moleculares.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-xl border border-dashed border-border/50">
          <div className="p-4 bg-primary/10 rounded-full mb-6">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Inicia sesión para guardar fórmulas</h3>
          <p className="text-muted-foreground max-w-sm mb-6 text-sm">
            Las fórmulas guardadas son una función de cuenta. Toda la química de CHEMIA es accesible sin cuenta.
          </p>
          <div className="flex gap-3">
            <Link href="/login"><Button>Iniciar Sesión</Button></Link>
            <Link href="/register"><Button variant="outline">Crear Cuenta</Button></Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6 italic">"Valor primero, cuenta después."</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fórmulas Guardadas</h1>
          <p className="text-muted-foreground mt-1">Tu biblioteca personal de estructuras moleculares.</p>
        </div>
        <Link href="/molecular-mass">
          <Button className="font-semibold tracking-wide">
            <Plus className="h-4 w-4 mr-2" /> Agregar Fórmula
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse h-48 bg-secondary/10" />)}
        </div>
      ) : formulas?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-xl border-dashed border-border/50">
          <FlaskConical className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aún no hay fórmulas guardadas</h3>
          <p className="text-muted-foreground max-w-sm mb-6 text-sm">
            Usa la Calculadora de Masa Molecular para analizar compuestos y guardarlos aquí.
          </p>
          <Link href="/molecular-mass">
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
              Ir a la Calculadora
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formulas?.map((formula) => (
            <Card key={formula.id} className="glass border-border/40 flex flex-col group relative overflow-hidden hover:border-primary/40 transition-colors">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(formula.id)} disabled={deleteMutation.isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-4 border-b border-border/30 bg-black/10">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-mono text-3xl font-bold text-white">{formula.formula}</CardTitle>
                  <div className="px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-semibold bg-primary/10 text-primary border border-primary/20">{formula.type}</div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-5">
                {formula.molecularMass && (
                  <div className="mb-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold block mb-1">Masa Molar</span>
                    <p className="font-mono text-xl">{formula.molecularMass.toFixed(3)} <span className="text-sm text-muted-foreground">g/mol</span></p>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-border/30 pt-4">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {format(new Date(formula.createdAt), "d MMM, yyyy", { locale: es })}
                  </span>
                  <Link href={`/molecular-mass?formula=${formula.formula}`}>
                    <span className="text-xs text-primary hover:underline cursor-pointer font-medium">Ver Detalles →</span>
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
