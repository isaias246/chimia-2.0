import React, { useState } from "react";
import { useListElements, useBuildCompound } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Beaker } from "lucide-react";
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
    // Parse "2, 3, 4" into array of numbers
    return el.oxidationStates.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  };

  const oxStates1 = getOxidationStates(el1);
  const oxStates2 = getOxidationStates(el2);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compound Builder</h1>
        <p className="text-muted-foreground">Build ionic compounds by balancing oxidation states.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Element 1 (Cation)</CardTitle>
            <CardDescription>Select a metal or element with positive oxidation state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Element</Label>
              <Select value={el1} onValueChange={(v) => { setEl1(v); setOx1(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select element" />
                </SelectTrigger>
                <SelectContent>
                  {elements?.filter(e => e.category.includes('metal') || e.category.includes('metalloid')).map(e => (
                    <SelectItem key={e.symbol} value={e.symbol}>
                      {e.symbol} - {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Oxidation State</Label>
              <Select value={ox1} onValueChange={setOx1} disabled={!el1 || oxStates1.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select oxidation state" />
                </SelectTrigger>
                <SelectContent>
                  {oxStates1.map(ox => (
                    <SelectItem key={ox} value={ox.toString()}>
                      {ox > 0 ? `+${ox}` : ox}
                    </SelectItem>
                  ))}
                  {oxStates1.length === 0 && el1 && (
                    <SelectItem value="1">+1 (Fallback)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Element 2 (Anion)</CardTitle>
            <CardDescription>Select a nonmetal with negative oxidation state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Element</Label>
              <Select value={el2} onValueChange={(v) => { setEl2(v); setOx2(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select element" />
                </SelectTrigger>
                <SelectContent>
                  {elements?.filter(e => e.category.includes('nonmetal') || e.category.includes('halogen')).map(e => (
                    <SelectItem key={e.symbol} value={e.symbol}>
                      {e.symbol} - {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Oxidation State</Label>
              <Select value={ox2} onValueChange={setOx2} disabled={!el2 || oxStates2.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select oxidation state" />
                </SelectTrigger>
                <SelectContent>
                  {oxStates2.map(ox => (
                    <SelectItem key={ox} value={ox.toString()}>
                      {ox > 0 ? `+${ox}` : ox}
                    </SelectItem>
                  ))}
                  {oxStates2.length === 0 && el2 && (
                    <SelectItem value="-1">-1 (Fallback)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleBuild}
          disabled={!el1 || !ox1 || !el2 || !ox2 || buildMutation.isPending}
          className="w-full md:w-auto px-12"
        >
          {buildMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Beaker className="h-5 w-5 mr-2" />}
          Build Compound
        </Button>
      </div>

      {buildMutation.data && (
        <Card className="mt-8 border-primary/30 bg-primary/5">
          <CardHeader className="text-center">
            <CardDescription>Resulting Compound</CardDescription>
            <CardTitle className="text-4xl font-mono text-primary mt-2">
              {buildMutation.data.formula}
            </CardTitle>
            <h3 className="text-xl font-semibold mt-2">{buildMutation.data.name}</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground uppercase">Molecular Mass</div>
                <div className="text-xl font-mono mt-1">{buildMutation.data.molecularMass.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground uppercase">{buildMutation.data.element1.name}</div>
                <div className="text-xl font-mono mt-1">{buildMutation.data.element1.count} atoms</div>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground uppercase">{buildMutation.data.element2.name}</div>
                <div className="text-xl font-mono mt-1">{buildMutation.data.element2.count} atoms</div>
              </div>
            </div>
            <p className="text-center mt-6 text-muted-foreground">
              {buildMutation.data.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}