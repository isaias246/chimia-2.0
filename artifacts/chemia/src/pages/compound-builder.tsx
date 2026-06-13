import React, { useState } from "react";
import { useListElements, useBuildCompound } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Beaker, Plus, Equal, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CompoundBuilder() {
  const { data: elements } = useListElements();
  const buildMutation = useBuildCompound();
  const [el1, setEl1] = useState(""); const [ox1, setOx1] = useState("");
  const [el2, setEl2] = useState(""); const [ox2, setOx2] = useState("");

  const getOxidationStates = (symbol: string) => {
    const el = elements?.find(e => e.symbol === symbol);
    if (!el?.oxidationStates) return [];
    return el.oxidationStates.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  };

  const fmt = (ox: number | string) => {
    const n = typeof ox === "string" ? parseInt(ox) : ox;
    return isNaN(n) ? "" : n > 0 ? `+${n}` : `${n}`;
  };

  const oxStates1 = getOxidationStates(el1);
  const oxStates2 = getOxidationStates(el2);

  const handleBuild = () => {
    if (!el1 || !ox1 || !el2 || !ox2) return;
    buildMutation.mutate({ data: { element1Symbol: el1, element1Oxidation: parseInt(ox1), element2Symbol: el2, element2Oxidation: parseInt(ox2) } });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Constructor de Compuestos</h1>
        <p className="text-muted-foreground mt-1">Sintetiza compuestos iónicos balanceando las cargas del catión y el anión.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">+</div>
              Catión (Metal)
            </CardTitle>
            <CardDescription>Selecciona un elemento con estado de oxidación positivo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Elemento</Label>
              <Select value={el1} onValueChange={v => { setEl1(v); setOx1(""); }}>
                <SelectTrigger className="h-12 bg-secondary/40 border-border/60 font-mono"><SelectValue placeholder="Seleccionar metal..." /></SelectTrigger>
                <SelectContent>
                  {elements?.filter(e => e.category.includes("metal") || e.category.includes("metalloid")).map(e => (
                    <SelectItem key={e.symbol} value={e.symbol} className="font-mono">
                      <span className="inline-block w-8 font-bold">{e.symbol}</span>
                      <span className="text-muted-foreground"> {e.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Estado de Carga</Label>
              <Select value={ox1} onValueChange={setOx1} disabled={!el1}>
                <SelectTrigger className="h-12 bg-secondary/40 border-border/60 font-mono"><SelectValue placeholder="Seleccionar estado de oxidación..." /></SelectTrigger>
                <SelectContent>
                  {oxStates1.filter(ox => ox > 0).map(ox => <SelectItem key={ox} value={String(ox)} className="font-mono">{fmt(ox)}</SelectItem>)}
                  {oxStates1.length === 0 && el1 && <SelectItem value="1" className="font-mono">+1 (Predeterminado)</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-destructive/5 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2" />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-destructive/20 flex items-center justify-center text-destructive font-bold text-xs">-</div>
              Anión (No Metal)
            </CardTitle>
            <CardDescription>Selecciona un elemento con estado de oxidación negativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Elemento</Label>
              <Select value={el2} onValueChange={v => { setEl2(v); setOx2(""); }}>
                <SelectTrigger className="h-12 bg-secondary/40 border-border/60 font-mono"><SelectValue placeholder="Seleccionar no metal..." /></SelectTrigger>
                <SelectContent>
                  {elements?.filter(e => e.category.includes("nonmetal") || e.category.includes("halogen")).map(e => (
                    <SelectItem key={e.symbol} value={e.symbol} className="font-mono">
                      <span className="inline-block w-8 font-bold">{e.symbol}</span>
                      <span className="text-muted-foreground"> {e.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Estado de Carga</Label>
              <Select value={ox2} onValueChange={setOx2} disabled={!el2}>
                <SelectTrigger className="h-12 bg-secondary/40 border-border/60 font-mono"><SelectValue placeholder="Seleccionar estado de oxidación..." /></SelectTrigger>
                <SelectContent>
                  {oxStates2.filter(ox => ox < 0).map(ox => <SelectItem key={ox} value={String(ox)} className="font-mono">{fmt(ox)}</SelectItem>)}
                  {oxStates2.length === 0 && el2 && <SelectItem value="-1" className="font-mono">-1 (Predeterminado)</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={handleBuild} disabled={!el1 || !ox1 || !el2 || !ox2 || buildMutation.isPending} className="h-14 px-12 rounded-full font-semibold tracking-wide">
          {buildMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Beaker className="h-5 w-5 mr-2" />}
          Sintetizar Compuesto
        </Button>
      </div>

      {buildMutation.data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <Card className="glass border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
            <CardContent className="pt-10 pb-12 relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-center gap-4 md:gap-8 mb-10 w-full max-w-2xl mx-auto">
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-xl border border-border/50 min-w-[120px]">
                  <span className="text-4xl font-bold font-mono">{buildMutation.data.element1.symbol}</span>
                  <span className="mt-2 text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-sm font-semibold">{fmt(ox1)}</span>
                  <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{buildMutation.data.element1.count} átomos</span>
                </div>
                <Plus className="h-6 w-6 text-muted-foreground opacity-50" />
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-xl border border-border/50 min-w-[120px]">
                  <span className="text-4xl font-bold font-mono">{buildMutation.data.element2.symbol}</span>
                  <span className="mt-2 text-destructive font-mono bg-destructive/10 px-2 py-0.5 rounded text-sm font-semibold">{fmt(ox2)}</span>
                  <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{buildMutation.data.element2.count} átomos</span>
                </div>
                <Equal className="h-6 w-6 text-muted-foreground opacity-50" />
                <div className="flex flex-col items-center p-4 bg-primary/10 rounded-xl border border-primary/30 min-w-[160px]">
                  <span className="text-4xl font-bold font-mono text-white">{buildMutation.data.formula}</span>
                  <span className="mt-2 text-muted-foreground font-mono bg-background/50 px-2 py-0.5 rounded text-sm">Neutro (0)</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{buildMutation.data.name}</h3>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border text-sm font-mono text-muted-foreground mb-4">
                  Masa: <span className="text-foreground">{buildMutation.data.molecularMass.toFixed(3)} u</span>
                </div>
                <p className="max-w-lg text-muted-foreground text-sm leading-relaxed">{buildMutation.data.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest font-semibold flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" /> Nota Educativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-foreground/80 list-disc pl-5 marker:text-primary">
                <li>Los compuestos iónicos se forman cuando los metales transfieren electrones a los no metales, creando iones de carga opuesta que se atraen electrostáticamente.</li>
                <li>La carga positiva total de los cationes debe equilibrar perfectamente la carga negativa total de los aniones, resultando en un compuesto neutro.</li>
                <li>La fórmula usa subíndices para indicar la relación de enteros mínima de iones necesaria para el equilibrio de carga.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
