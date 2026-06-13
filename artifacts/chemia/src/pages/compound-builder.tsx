import React, { useState } from "react";
import { useListElements, useBuildCompound } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Beaker, Plus, Equal, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CompoundBuilder() {
  const { data: elements, isLoading: isLoadingElements } = useListElements();
  const buildMutation = useBuildCompound();

  const [el1, setEl1] = useState("");
  const [ox1, setOx1] = useState("");
  const [el2, setEl2] = useState("");
  const [ox2, setOx2] = useState("");

  const handleBuild = () => {
    if (!el1 || !ox1 || !el2 || !ox2) return;
    buildMutation.mutate({
      data: {
        element1Symbol: el1,
        element1Oxidation: parseInt(ox1),
        element2Symbol: el2,
        element2Oxidation: parseInt(ox2)
      }
    });
  };

  const getOxidationStates = (symbol: string) => {
    const el = elements?.find(e => e.symbol === symbol);
    if (!el || !el.oxidationStates) return [];
    return el.oxidationStates.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  };

  const oxStates1 = getOxidationStates(el1);
  const oxStates2 = getOxidationStates(el2);

  const formatOxidationState = (ox: number | string) => {
    const num = typeof ox === 'string' ? parseInt(ox) : ox;
    if (isNaN(num)) return '';
    return num > 0 ? `+${num}` : `${num}`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compound Builder</h1>
        <p className="text-muted-foreground mt-1">Synthesize ionic compounds by balancing cation and anion charges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">+</div>
              Cation (Metal)
            </CardTitle>
            <CardDescription>Select an element with a positive oxidation state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Element</Label>
              <Select value={el1} onValueChange={(v) => { setEl1(v); setOx1(""); }}>
                <SelectTrigger className="h-12 bg-secondary/40 border-border/60 font-mono">
                  <SelectValue placeholder="Select metal..." />
                </SelectTrigger>
                <SelectContent>
                  {elements?.filter(e => e.category.includes('metal') || e.category.includes('metalloid')).map(e => (
                    <SelectItem key={e.symbol} value={e.symbol} className="font-mono">
                      <span className="inline-block w-8 font-bold">{e.symbol}</span> <span className="text-muted-foreground">{e.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Charge State</Label>
              <Select value={ox1} onValueChange={setOx1} disabled={!el1 || oxStates1.length === 0}>
                <SelectTrigger className="h-12 bg-secondary/40 border-border/60 font-mono">
                  <SelectValue placeholder="Select oxidation state..." />
                </SelectTrigger>
                <SelectContent>
                  {oxStates1.filter(ox => ox > 0).map(ox => (
                    <SelectItem key={ox} value={ox.toString()} className="font-mono">
                      {formatOxidationState(ox)}
                    </SelectItem>
                  ))}
                  {oxStates1.length === 0 && el1 && (
                    <SelectItem value="1" className="font-mono">+1 (Fallback)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-destructive/5 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2"></div>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-destructive/20 flex items-center justify-center text-destructive font-bold text-xs">-</div>
              Anion (Nonmetal)
            </CardTitle>
            <CardDescription>Select an element with a negative oxidation state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Element</Label>
              <Select value={el2} onValueChange={(v) => { setEl2(v); setOx2(""); }}>
                <SelectTrigger className="h-12 bg-secondary/40 border-border/60 font-mono">
                  <SelectValue placeholder="Select nonmetal..." />
                </SelectTrigger>
                <SelectContent>
                  {elements?.filter(e => e.category.includes('nonmetal') || e.category.includes('halogen')).map(e => (
                    <SelectItem key={e.symbol} value={e.symbol} className="font-mono">
                      <span className="inline-block w-8 font-bold">{e.symbol}</span> <span className="text-muted-foreground">{e.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Charge State</Label>
              <Select value={ox2} onValueChange={setOx2} disabled={!el2 || oxStates2.length === 0}>
                <SelectTrigger className="h-12 bg-secondary/40 border-border/60 font-mono">
                  <SelectValue placeholder="Select oxidation state..." />
                </SelectTrigger>
                <SelectContent>
                  {oxStates2.filter(ox => ox < 0).map(ox => (
                    <SelectItem key={ox} value={ox.toString()} className="font-mono">
                      {formatOxidationState(ox)}
                    </SelectItem>
                  ))}
                  {oxStates2.length === 0 && el2 && (
                    <SelectItem value="-1" className="font-mono">-1 (Fallback)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center -my-2 relative z-20">
        <Button 
          size="lg" 
          onClick={handleBuild}
          disabled={!el1 || !ox1 || !el2 || !ox2 || buildMutation.isPending}
          className="h-14 px-12 rounded-full shadow-lg border border-primary/20 glow-primary-hover font-semibold tracking-wide"
        >
          {buildMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Beaker className="h-5 w-5 mr-2" />}
          Synthesize Compound
        </Button>
      </div>

      {buildMutation.data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <Card className="glass border-primary/30 relative overflow-hidden mt-6">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50"></div>
            <CardContent className="pt-10 pb-12 relative z-10 flex flex-col items-center">
              
              {/* Balance Beam Preview */}
              <div className="flex items-center justify-center gap-4 md:gap-8 mb-10 w-full max-w-2xl mx-auto">
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-xl border border-border/50 min-w-[120px]">
                  <span className="text-4xl font-bold font-mono">{buildMutation.data.element1.symbol}</span>
                  <span className="mt-2 text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-sm font-semibold">{formatOxidationState(ox1)}</span>
                  <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{buildMutation.data.element1.count} atoms</span>
                </div>
                
                <Plus className="h-6 w-6 text-muted-foreground opacity-50" />
                
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-xl border border-border/50 min-w-[120px]">
                  <span className="text-4xl font-bold font-mono">{buildMutation.data.element2.symbol}</span>
                  <span className="mt-2 text-destructive font-mono bg-destructive/10 px-2 py-0.5 rounded text-sm font-semibold">{formatOxidationState(ox2)}</span>
                  <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{buildMutation.data.element2.count} atoms</span>
                </div>

                <Equal className="h-6 w-6 text-muted-foreground opacity-50" />

                <div className="flex flex-col items-center p-4 bg-primary/10 rounded-xl border border-primary/30 min-w-[160px] glow-primary">
                  <span className="text-4xl font-bold font-mono text-white">{buildMutation.data.formula}</span>
                  <span className="mt-2 text-muted-foreground font-mono bg-background/50 px-2 py-0.5 rounded text-sm">Neutral (0)</span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{buildMutation.data.name}</h3>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border text-sm font-mono text-muted-foreground">
                  Mass: <span className="text-foreground">{buildMutation.data.molecularMass.toFixed(3)} u</span>
                </div>
                <p className="mt-6 max-w-lg text-muted-foreground text-sm leading-relaxed">
                  {buildMutation.data.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest font-semibold flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" /> Educational Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-foreground/80 list-disc pl-5 marker:text-primary">
                <li>Ionic compounds are formed when metals transfer electrons to nonmetals, creating oppositely charged ions that attract each other.</li>
                <li>The total positive charge from cations must perfectly balance the total negative charge from anions, resulting in a neutral compound.</li>
                <li>The formula uses subscripts (like the {buildMutation.data.element1.count > 1 ? buildMutation.data.element1.count : 'implied 1'} in {buildMutation.data.formula}) to indicate the smallest whole-number ratio of ions needed for balance.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
