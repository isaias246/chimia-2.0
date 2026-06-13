import { useState } from "react";
import { useCalculateStoichiometry, StoichiometryResult } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Zap,
} from "lucide-react";

const AVOGADRO = 6.022e23;

interface ReagentRow {
  id: number;
  formula: string;
  amount: string;
  unit: "grams" | "moles";
}

const EXAMPLES = [
  {
    label: "H₂ + O₂ → H₂O",
    equation: "H2 + O2 -> H2O",
    reactants: [{ formula: "H2", amount: "4", unit: "grams" as const }],
    target: "H2O",
  },
  {
    label: "CH₄ combustion",
    equation: "CH4 + O2 -> CO2 + H2O",
    reactants: [{ formula: "CH4", amount: "2", unit: "moles" as const }],
    target: "CO2",
  },
  {
    label: "Limiting reagent",
    equation: "N2 + H2 -> NH3",
    reactants: [
      { formula: "N2", amount: "28", unit: "grams" as const },
      { formula: "H2", amount: "6", unit: "grams" as const },
    ],
    target: "NH3",
  },
  {
    label: "Percent yield",
    equation: "Fe + O2 -> Fe2O3",
    reactants: [{ formula: "Fe", amount: "10", unit: "grams" as const }],
    target: "Fe2O3",
  },
];

const CONCEPTS = [
  {
    icon: FlaskConical,
    title: "Mole Ratio",
    body: "Coefficients in a balanced equation give the mole ratio between reactants and products. If 2H₂ + O₂ → 2H₂O, then 2 mol H₂ produces exactly 2 mol H₂O.",
  },
  {
    icon: AlertTriangle,
    title: "Limiting Reagent",
    body: "The reactant that runs out first and limits how much product can form. All other reactants are 'in excess'. Find it by converting all reactants to moles of product — the smallest value wins.",
  },
  {
    icon: Zap,
    title: "Theoretical Yield",
    body: "The maximum amount of product that could form if the reaction goes to 100% completion. Calculated from the limiting reagent.",
  },
  {
    icon: CheckCircle,
    title: "Percent Yield",
    body: "How efficient was the actual reaction? Percent yield = (actual yield ÷ theoretical yield) × 100. Real reactions rarely reach 100% due to side reactions, losses, and incomplete reactions.",
  },
];

let rowCounter = 2;

export default function Stoichiometry() {
  const [equation, setEquation] = useState("");
  const [targetFormula, setTargetFormula] = useState("");
  const [actualYield, setActualYield] = useState("");
  const [reactants, setReactants] = useState<ReagentRow[]>([
    { id: 1, formula: "", amount: "", unit: "grams" },
  ]);
  const [openSteps, setOpenSteps] = useState(false);
  const [educationalMode, setEducationalMode] = useState(true);
  const [result, setResult] = useState<StoichiometryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useCalculateStoichiometry();

  const addReactant = () => {
    setReactants(prev => [...prev, { id: rowCounter++, formula: "", amount: "", unit: "grams" }]);
  };

  const removeReactant = (id: number) => {
    setReactants(prev => prev.filter(r => r.id !== id));
  };

  const updateReactant = (id: number, field: keyof ReagentRow, value: string) => {
    setReactants(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setEquation(ex.equation);
    setTargetFormula(ex.target);
    setActualYield("");
    setResult(null);
    setError(null);
    rowCounter += ex.reactants.length;
    setReactants(ex.reactants.map((r, i) => ({ ...r, id: rowCounter - ex.reactants.length + i })));
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const validReactants = reactants.filter(r => r.formula.trim() && r.amount.trim());
    if (!equation.trim()) { setError("Please enter a chemical equation."); return; }
    if (!targetFormula.trim()) { setError("Please enter the target product formula."); return; }
    if (validReactants.length === 0) { setError("Please enter at least one reactant with an amount."); return; }

    mutation.mutate(
      {
        data: {
          equation: equation.trim(),
          reactantAmounts: validReactants.map(r => ({
            formula: r.formula.trim(),
            amount: parseFloat(r.amount),
            unit: r.unit,
          })),
          targetFormula: targetFormula.trim(),
          actualYieldGrams: actualYield.trim() ? parseFloat(actualYield) : null,
        },
      },
      {
        onSuccess: (data) => {
          setResult(data);
          setOpenSteps(false);
        },
        onError: (err: unknown) => {
          const msg = err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
            : "Calculation failed. Please check your inputs.";
          setError(msg || "Calculation failed. Please check your inputs.");
        },
      },
    );
  };

  const percentColor = (pct: number) => {
    if (pct >= 90) return "text-green-400";
    if (pct >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stoichiometry</h1>
          <p className="text-muted-foreground mt-1">
            Mole calculations, limiting reagent, theoretical and percent yield.
          </p>
        </div>
        <button
          onClick={() => setEducationalMode(e => !e)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            educationalMode
              ? "bg-primary/10 border-primary/30 text-primary"
              : "border-border/50 text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Educational Mode {educationalMode ? "On" : "Off"}
        </button>
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center mr-1 uppercase tracking-wider">Examples:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => loadExample(ex)}
            className="px-3 py-1.5 text-xs font-mono border border-border/50 rounded-md hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          {/* Equation */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Reaction Setup
            </h2>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Chemical Equation</Label>
              <Input
                placeholder="e.g. 2H2 + O2 -> 2H2O"
                value={equation}
                onChange={e => setEquation(e.target.value)}
                className="font-mono bg-background border-border/60 focus-visible:ring-primary/50 h-11"
              />
              <p className="text-[11px] text-muted-foreground">
                Use <span className="font-mono text-primary/70">-&gt;</span> or <span className="font-mono text-primary/70">→</span> as the arrow. The equation will be auto-balanced if needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target Product</Label>
              <Input
                placeholder="e.g. H2O"
                value={targetFormula}
                onChange={e => setTargetFormula(e.target.value)}
                className="font-mono bg-background border-border/60 focus-visible:ring-primary/50 h-11 max-w-[200px]"
              />
            </div>
          </div>

          {/* Reactant Amounts */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Given Amounts
              </h2>
              <button
                onClick={addReactant}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Reactant
              </button>
            </div>

            <div className="space-y-3">
              {reactants.map((r, idx) => (
                <div key={r.id} className="flex gap-2 items-center">
                  <div className="w-6 text-center text-xs text-muted-foreground shrink-0">{idx + 1}.</div>
                  <Input
                    placeholder="Formula (e.g. H2)"
                    value={r.formula}
                    onChange={e => updateReactant(r.id, "formula", e.target.value)}
                    className="font-mono bg-background border-border/60 focus-visible:ring-primary/50 h-9 w-28"
                  />
                  <Input
                    placeholder="Amount"
                    type="number"
                    min="0"
                    value={r.amount}
                    onChange={e => updateReactant(r.id, "amount", e.target.value)}
                    className="bg-background border-border/60 focus-visible:ring-primary/50 h-9 w-28"
                  />
                  <select
                    value={r.unit}
                    onChange={e => updateReactant(r.id, "unit", e.target.value)}
                    className="h-9 px-2 text-sm bg-background border border-border/60 rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="grams">g</option>
                    <option value="moles">mol</option>
                  </select>
                  {reactants.length > 1 && (
                    <button
                      onClick={() => removeReactant(r.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border/30">
              <div className="flex gap-2 items-center">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Actual Yield (optional)
                </Label>
                <Input
                  placeholder="grams"
                  type="number"
                  min="0"
                  value={actualYield}
                  onChange={e => setActualYield(e.target.value)}
                  className="bg-background border-border/60 focus-visible:ring-primary/50 h-9 w-28"
                />
                <span className="text-xs text-muted-foreground">g — for percent yield</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={mutation.isPending}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wide"
          >
            {mutation.isPending ? "Calculating..." : "Calculate Stoichiometry"}
          </Button>

          {error && (
            <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Balanced equation display */}
              <div className="bg-card border border-border/50 rounded-xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Balanced Equation</p>
                <p className="font-mono text-lg text-foreground leading-relaxed">
                  {result.balancedEquation.split("→").map((part, i, arr) => (
                    <span key={i}>
                      {part.trim().split(/(\d+)(?=[A-Z(])/).map((segment, j) =>
                        /^\d+$/.test(segment) ? (
                          <span key={j} className="text-primary font-bold">{segment}</span>
                        ) : (
                          <span key={j}>{segment}</span>
                        )
                      )}
                      {i < arr.length - 1 && (
                        <span className="text-primary/60 mx-3">→</span>
                      )}
                    </span>
                  ))}
                </p>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Theoretical Yield</p>
                  <p className="font-mono text-2xl font-bold text-primary">
                    {result.theoreticalYieldGrams.toFixed(4)}
                    <span className="text-sm text-muted-foreground ml-1">g</span>
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {result.theoreticalYieldMoles.toFixed(4)} mol {result.targetFormula}
                  </p>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {result.isLimitingReagentCalculation ? "Limiting Reagent" : "Molar Mass (target)"}
                  </p>
                  {result.isLimitingReagentCalculation ? (
                    <>
                      <p className="font-mono text-2xl font-bold text-yellow-400">{result.limitingReagent}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.excessReagents.map(r => (
                          <Badge key={r} variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                            {r} excess
                          </Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="font-mono text-2xl font-bold text-foreground">{result.targetMolarMass.toFixed(3)} <span className="text-sm text-muted-foreground">g/mol</span></p>
                  )}
                </div>

                {result.percentYield != null && (
                  <div className="col-span-2 bg-card border border-border/50 rounded-xl p-4 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Percent Yield</p>
                    <div className="flex items-end gap-3">
                      <p className={`font-mono text-3xl font-bold ${percentColor(result.percentYield as number)}`}>
                        {(result.percentYield as number).toFixed(2)}%
                      </p>
                      <div className="mb-1 flex-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              (result.percentYield as number) >= 90 ? "bg-green-400" :
                              (result.percentYield as number) >= 70 ? "bg-yellow-400" : "bg-red-400"
                            }`}
                            style={{ width: `${Math.min(result.percentYield as number, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.actualYieldGrams} g actual ÷ {result.theoreticalYieldGrams.toFixed(4)} g theoretical
                    </p>
                  </div>
                )}
              </div>

              {/* Reagent details table */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border/50">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Reagent Details</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2 text-left">Compound</th>
                      <th className="px-4 py-2 text-right">Given</th>
                      <th className="px-4 py-2 text-right">Moles</th>
                      <th className="px-4 py-2 text-right">Molar Mass</th>
                      <th className="px-4 py-2 text-right">→ Target mol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.reagentDetails.map((r, i) => (
                      <tr
                        key={i}
                        className={`border-b border-border/20 ${
                          r.formula === result.limitingReagent && result.isLimitingReagentCalculation
                            ? "bg-yellow-500/5"
                            : i % 2 === 0 ? "bg-transparent" : "bg-secondary/20"
                        }`}
                      >
                        <td className="px-4 py-2.5">
                          <span className="font-mono font-medium">{r.formula}</span>
                          {r.formula === result.limitingReagent && result.isLimitingReagentCalculation && (
                            <Badge className="ml-2 text-[9px] bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                              limiting
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                          {r.amountGiven} {r.unit === "grams" ? "g" : "mol"}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono">{r.molesGiven.toFixed(4)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                          {r.molarMass.toFixed(3)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-primary">
                          {r.molesOfTargetProduced.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 text-[10px] text-muted-foreground border-t border-border/30">
                  Avogadro's number: 6.022 × 10²³ particles/mol
                  {" · "}
                  {result.theoreticalYieldMoles.toFixed(4)} mol × {AVOGADRO.toExponential(3)} = {(result.theoreticalYieldMoles * AVOGADRO).toExponential(3)} molecules of {result.targetFormula}
                </div>
              </div>

              {/* Step-by-step */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenSteps(v => !v)}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-white/3 transition-colors"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Step-by-Step Solution
                  </span>
                  {openSteps ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>
                {openSteps && (
                  <div className="border-t border-border/50 divide-y divide-border/20">
                    {result.steps.map((step, i) => (
                      <div key={i} className="px-5 py-3 flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] text-primary font-bold">{i + 1}</span>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground leading-relaxed">{step.replace(/^Step \d+: /, "")}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-card border border-border/50 rounded-xl flex flex-col items-center justify-center py-20 text-center space-y-4">
              <FlaskConical className="h-12 w-12 text-primary/20" />
              <p className="text-muted-foreground font-medium">Enter your reaction details and calculate</p>
              <p className="text-sm text-muted-foreground/60 max-w-xs">
                Results will show theoretical yield, limiting reagent, mole ratios, and step-by-step solution.
              </p>
              <div className="flex items-center gap-2 text-xs text-primary/60 mt-2">
                <ArrowRight className="h-3 w-3" />
                Try an example above to get started
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Mode */}
      {educationalMode && (
        <div className="border-t border-border/30 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Stoichiometry Concepts
            </h2>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">The Stoichiometry Roadmap</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {[
                "Write balanced equation",
                "Find molar masses",
                "Convert given → moles",
                "Apply mole ratio",
                "Find limiting reagent",
                "Calculate theoretical yield",
                "Compute percent yield",
              ].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-card border border-border/50 rounded text-xs font-mono">
                    {step}
                  </span>
                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-primary/40 shrink-0" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
