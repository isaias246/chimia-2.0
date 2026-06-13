import { useState } from "react";
import { useCalculateStoichiometry, StoichiometryResult } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Plus, Trash2, ChevronDown, ChevronRight, ArrowRight, Lightbulb, AlertTriangle, CheckCircle, BookOpen, Zap } from "lucide-react";

const AVOGADRO = 6.022e23;

interface ReagentRow {
  id: number;
  formula: string;
  amount: string;
  unit: "grams" | "moles";
}

const EXAMPLES = [
  { label: "H₂ + O₂ → H₂O", equation: "H2 + O2 -> H2O", reactants: [{ formula: "H2", amount: "4", unit: "grams" as const }], target: "H2O" },
  { label: "Combustión CH₄", equation: "CH4 + O2 -> CO2 + H2O", reactants: [{ formula: "CH4", amount: "2", unit: "moles" as const }], target: "CO2" },
  { label: "Reactivo limitante", equation: "N2 + H2 -> NH3", reactants: [{ formula: "N2", amount: "28", unit: "grams" as const }, { formula: "H2", amount: "6", unit: "grams" as const }], target: "NH3" },
  { label: "Rendimiento porcentual", equation: "Fe + O2 -> Fe2O3", reactants: [{ formula: "Fe", amount: "10", unit: "grams" as const }], target: "Fe2O3" },
];

const CONCEPTS = [
  { icon: FlaskConical, title: "Relación Molar", body: "Los coeficientes de una ecuación balanceada dan la relación molar entre reactivos y productos. Si 2H₂ + O₂ → 2H₂O, entonces 2 mol H₂ produce exactamente 2 mol H₂O." },
  { icon: AlertTriangle, title: "Reactivo Limitante", body: "El reactivo que se agota primero y limita cuánto producto puede formarse. Todos los demás reactivos están 'en exceso'. Encuéntralo convirtiendo todos los reactivos a moles de producto — el valor menor gana." },
  { icon: Zap, title: "Rendimiento Teórico", body: "La cantidad máxima de producto que podría formarse si la reacción llega al 100% de completitud. Se calcula a partir del reactivo limitante." },
  { icon: CheckCircle, title: "Rendimiento Porcentual", body: "¿Qué tan eficiente fue la reacción real? Rendimiento % = (rendimiento real ÷ rendimiento teórico) × 100. Las reacciones reales raramente alcanzan el 100% por reacciones secundarias y pérdidas." },
];

let rowCounter = 2;

export default function Stoichiometry() {
  const [equation, setEquation] = useState("");
  const [targetFormula, setTargetFormula] = useState("");
  const [actualYield, setActualYield] = useState("");
  const [reactants, setReactants] = useState<ReagentRow[]>([{ id: 1, formula: "", amount: "", unit: "grams" }]);
  const [openSteps, setOpenSteps] = useState(false);
  const [educationalMode, setEducationalMode] = useState(true);
  const [result, setResult] = useState<StoichiometryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useCalculateStoichiometry();

  const addReactant = () => setReactants(prev => [...prev, { id: rowCounter++, formula: "", amount: "", unit: "grams" }]);
  const removeReactant = (id: number) => setReactants(prev => prev.filter(r => r.id !== id));
  const updateReactant = (id: number, field: keyof ReagentRow, value: string) => setReactants(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setEquation(ex.equation); setTargetFormula(ex.target); setActualYield(""); setResult(null); setError(null);
    rowCounter += ex.reactants.length;
    setReactants(ex.reactants.map((r, i) => ({ ...r, id: rowCounter - ex.reactants.length + i })));
  };

  const handleCalculate = () => {
    setError(null); setResult(null);
    const valid = reactants.filter(r => r.formula.trim() && r.amount.trim());
    if (!equation.trim()) { setError("Por favor ingresa una ecuación química."); return; }
    if (!targetFormula.trim()) { setError("Por favor ingresa la fórmula del producto deseado."); return; }
    if (valid.length === 0) { setError("Por favor ingresa al menos un reactivo con cantidad."); return; }

    mutation.mutate(
      { data: { equation: equation.trim(), reactantAmounts: valid.map(r => ({ formula: r.formula.trim(), amount: parseFloat(r.amount), unit: r.unit })), targetFormula: targetFormula.trim(), actualYieldGrams: actualYield.trim() ? parseFloat(actualYield) : null } },
      {
        onSuccess: (data) => { setResult(data); setOpenSteps(false); },
        onError: (err: unknown) => {
          const msg = err && typeof err === "object" && "response" in err ? (err as { response?: { data?: { error?: string } } }).response?.data?.error : "Cálculo fallido. Verifica los datos.";
          setError(msg || "Cálculo fallido. Verifica los datos.");
        },
      }
    );
  };

  const percentColor = (pct: number) => pct >= 90 ? "text-green-400" : pct >= 70 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estequiometría</h1>
          <p className="text-muted-foreground mt-1">Cálculos de moles, reactivo limitante, rendimiento teórico y porcentual.</p>
        </div>
        <button onClick={() => setEducationalMode(e => !e)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${educationalMode ? "bg-primary/10 border-primary/30 text-primary" : "border-border/50 text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
          <BookOpen className="h-4 w-4" />
          Modo Educativo {educationalMode ? "Activo" : "Inactivo"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center mr-1 uppercase tracking-wider">Ejemplos:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} onClick={() => loadExample(ex)} className="px-3 py-1.5 text-xs font-mono border border-border/50 rounded-md hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors">{ex.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Configurar la Reacción</h2>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Ecuación Química</Label>
              <Input placeholder="ej. 2H2 + O2 -> 2H2O" value={equation} onChange={e => setEquation(e.target.value)} className="font-mono bg-background border-border/60 h-11" />
              <p className="text-[11px] text-muted-foreground">Usa <span className="font-mono text-primary/70">-&gt;</span> o <span className="font-mono text-primary/70">→</span> como flecha. Se balanceará automáticamente si es necesario.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Producto Deseado</Label>
              <Input placeholder="ej. H2O" value={targetFormula} onChange={e => setTargetFormula(e.target.value)} className="font-mono bg-background border-border/60 h-11 max-w-[200px]" />
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Cantidades Dadas</h2>
              <button onClick={addReactant} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                <Plus className="h-3 w-3" /> Agregar Reactivo
              </button>
            </div>
            <div className="space-y-3">
              {reactants.map((r, idx) => (
                <div key={r.id} className="flex gap-2 items-center">
                  <div className="w-6 text-center text-xs text-muted-foreground shrink-0">{idx + 1}.</div>
                  <Input placeholder="Fórmula (ej. H2)" value={r.formula} onChange={e => updateReactant(r.id, "formula", e.target.value)} className="font-mono bg-background border-border/60 h-9 w-28" />
                  <Input placeholder="Cantidad" type="number" min="0" value={r.amount} onChange={e => updateReactant(r.id, "amount", e.target.value)} className="bg-background border-border/60 h-9 w-28" />
                  <select value={r.unit} onChange={e => updateReactant(r.id, "unit", e.target.value)} className="h-9 px-2 text-sm bg-background border border-border/60 rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option value="grams">g</option>
                    <option value="moles">mol</option>
                  </select>
                  {reactants.length > 1 && <button onClick={() => removeReactant(r.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>}
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border/30">
              <div className="flex gap-2 items-center">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">Rendimiento Real (opcional)</Label>
                <Input placeholder="gramos" type="number" min="0" value={actualYield} onChange={e => setActualYield(e.target.value)} className="bg-background border-border/60 h-9 w-28" />
                <span className="text-xs text-muted-foreground">g — para rendimiento %</span>
              </div>
            </div>
          </div>

          <Button onClick={handleCalculate} disabled={mutation.isPending} className="w-full h-11 font-semibold tracking-wide">
            {mutation.isPending ? "Calculando..." : "Calcular Estequiometría"}
          </Button>

          {error && (
            <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />{error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {result ? (
            <>
              <div className="bg-card border border-border/50 rounded-xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Ecuación Balanceada</p>
                <p className="font-mono text-lg text-foreground leading-relaxed">
                  {result.balancedEquation.split("→").map((part, i, arr) => (
                    <span key={i}>
                      {part.trim().split(/(\d+)(?=[A-Z(])/).map((seg, j) =>
                        /^\d+$/.test(seg) ? <span key={j} className="text-primary font-bold">{seg}</span> : <span key={j}>{seg}</span>
                      )}
                      {i < arr.length - 1 && <span className="text-primary/60 mx-3">→</span>}
                    </span>
                  ))}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Rendimiento Teórico</p>
                  <p className="font-mono text-2xl font-bold text-primary">{result.theoreticalYieldGrams.toFixed(4)} <span className="text-sm text-muted-foreground ml-1">g</span></p>
                  <p className="text-xs text-muted-foreground font-mono">{result.theoreticalYieldMoles.toFixed(4)} mol {result.targetFormula}</p>
                </div>
                <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {result.isLimitingReagentCalculation ? "Reactivo Limitante" : "Masa Molar (producto)"}
                  </p>
                  {result.isLimitingReagentCalculation ? (
                    <>
                      <p className="font-mono text-2xl font-bold text-yellow-400">{result.limitingReagent}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.excessReagents.map(r => <Badge key={r} variant="outline" className="text-[10px] border-green-500/30 text-green-400">{r} exceso</Badge>)}
                      </div>
                    </>
                  ) : (
                    <p className="font-mono text-2xl font-bold text-foreground">{result.targetMolarMass.toFixed(3)} <span className="text-sm text-muted-foreground">g/mol</span></p>
                  )}
                </div>
                {result.percentYield != null && (
                  <div className="col-span-2 bg-card border border-border/50 rounded-xl p-4 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Rendimiento Porcentual</p>
                    <div className="flex items-end gap-3">
                      <p className={`font-mono text-3xl font-bold ${percentColor(result.percentYield as number)}`}>{(result.percentYield as number).toFixed(2)}%</p>
                      <div className="mb-1 flex-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${(result.percentYield as number) >= 90 ? "bg-green-400" : (result.percentYield as number) >= 70 ? "bg-yellow-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(result.percentYield as number, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{result.actualYieldGrams} g real ÷ {result.theoreticalYieldGrams.toFixed(4)} g teórico</p>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border/50">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Detalles de Reactivos</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2 text-left">Compuesto</th>
                      <th className="px-4 py-2 text-right">Dado</th>
                      <th className="px-4 py-2 text-right">Moles</th>
                      <th className="px-4 py-2 text-right">Masa Molar</th>
                      <th className="px-4 py-2 text-right">→ mol producto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.reagentDetails.map((r, i) => (
                      <tr key={i} className={`border-b border-border/20 ${r.formula === result.limitingReagent && result.isLimitingReagentCalculation ? "bg-yellow-500/5" : i % 2 === 0 ? "bg-transparent" : "bg-secondary/20"}`}>
                        <td className="px-4 py-2.5">
                          <span className="font-mono font-medium">{r.formula}</span>
                          {r.formula === result.limitingReagent && result.isLimitingReagentCalculation && (
                            <Badge className="ml-2 text-[9px] bg-yellow-500/10 text-yellow-400 border-yellow-500/20">limitante</Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{r.amountGiven} {r.unit === "grams" ? "g" : "mol"}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{r.molesGiven.toFixed(4)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{r.molarMass.toFixed(3)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-primary">{r.molesOfTargetProduced.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 text-[10px] text-muted-foreground border-t border-border/30">
                  Nº de Avogadro: 6.022 × 10²³ partículas/mol
                  {" · "}
                  {result.theoreticalYieldMoles.toFixed(4)} mol × {AVOGADRO.toExponential(3)} = {(result.theoreticalYieldMoles * AVOGADRO).toExponential(3)} moléculas de {result.targetFormula}
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <button onClick={() => setOpenSteps(v => !v)} className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-white/3 transition-colors">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Solución Paso a Paso</span>
                  {openSteps ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>
                {openSteps && (
                  <div className="border-t border-border/50 divide-y divide-border/20">
                    {result.steps.map((step, i) => (
                      <div key={i} className="px-5 py-3 flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] text-primary font-bold">{i + 1}</span>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground leading-relaxed">{step.replace(/^Step \d+: /, "").replace(/^Paso \d+: /, "")}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-card border border-border/50 rounded-xl flex flex-col items-center justify-center py-20 text-center space-y-4">
              <FlaskConical className="h-12 w-12 text-primary/20" />
              <p className="text-muted-foreground font-medium">Ingresa los detalles de la reacción y calcula</p>
              <p className="text-sm text-muted-foreground/60 max-w-xs">Los resultados mostrarán rendimiento teórico, reactivo limitante, relaciones molares y solución paso a paso.</p>
              <div className="flex items-center gap-2 text-xs text-primary/60 mt-2">
                <ArrowRight className="h-3 w-3" /> Prueba un ejemplo de arriba para empezar
              </div>
            </div>
          )}
        </div>
      </div>

      {educationalMode && (
        <div className="border-t border-border/30 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Conceptos de Estequiometría</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {CONCEPTS.map((c) => (
              <div key={c.title} className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <c.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-sm">{c.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-primary/5 border border-primary/15 rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">La Hoja de Ruta de la Estequiometría</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
              {["Masa dada (g)", "÷ Masa molar", "Moles del dado", "× Relación molar", "Moles del producto", "× Masa molar", "Masa del producto (g)"].map((step, i, arr) => (
                <span key={i} className={i % 2 === 0 ? "text-foreground" : "text-primary/60"}>{step}{i < arr.length - 1 && " →"}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
