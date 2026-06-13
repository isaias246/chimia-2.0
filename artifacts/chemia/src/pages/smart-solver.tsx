import { useState, useRef } from "react";
import { useSmartSolve } from "@workspace/api-client-react";
import type { SmartSolverInput, SmartSolverResult, SolverStep } from "@workspace/api-client-react";

type Topic = SmartSolverInput["topic"];
type Level = SmartSolverInput["level"];
type Action = SmartSolverInput["action"];

const TOPICS: { id: Topic; label: string; icon: string; color: string; examples: string[] }[] = [
  {
    id: "molecular-mass", label: "Masa Molecular", icon: "⚗️",
    color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
    examples: ["Masa molecular de H2O", "Masa molar de NaCl", "Calcular M de C6H12O6", "¿Cuántos gramos en 2 mol de CO2?"],
  },
  {
    id: "stoichiometry", label: "Estequiometría", icon: "⚖️",
    color: "from-violet-500/20 to-violet-600/10 border-violet-500/30",
    examples: ["¿Cuántos moles hay en 36 g de H2O?", "Masa de 0.5 mol de NaCl", "Reactivo limitante en N2 + H2", "Cálculo de rendimiento porcentual"],
  },
  {
    id: "gas-laws", label: "Leyes de Gases", icon: "🌡️",
    color: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    examples: ["Ley del gas ideal PV = nRT", "P = 2 atm, V = 5 L, T = 300 K, hallar n", "Problema con la Ley de Boyle", "¿Qué volumen ocupa 1 mol a CNPT?"],
  },
  {
    id: "acids-bases", label: "Ácidos y Bases", icon: "🧪",
    color: "from-green-500/20 to-green-600/10 border-green-500/30",
    examples: ["pH de HCl 0.01 M", "[H+] = 1e-4 M, hallar pH", "pOH = 3, hallar pH", "¿Qué significa pH = 7.4?"],
  },
  {
    id: "equilibrium", label: "Equilibrio", icon: "⇌",
    color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    examples: ["Escribe Kc para N2 + 3H2 ⇌ 2NH3", "Principio de Le Chatelier", "Efecto de presión en el equilibrio", "Q vs K y dirección de la reacción"],
  },
  {
    id: "thermodynamics", label: "Termodinámica", icon: "🔥",
    color: "from-red-500/20 to-red-600/10 border-red-500/30",
    examples: ["Energía libre de Gibbs ΔG = ΔH - TΔS", "¿Es espontánea la combustión de CH4?", "¿Qué es la Ley de Hess?", "Entalpía de formación"],
  },
  {
    id: "electrochemistry", label: "Electroquímica", icon: "⚡",
    color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
    examples: ["Celda galvánica Zn/Cu E°", "E°celda = E°cátodo - E°ánodo", "Ecuación de Nernst", "Energía de Gibbs desde potencial de celda"],
  },
  {
    id: "general", label: "General", icon: "🔬",
    color: "from-slate-500/20 to-slate-600/10 border-slate-500/30",
    examples: ["¿Qué es el enlace iónico?", "Explica la configuración electrónica", "Diferencia entre enlace iónico y covalente", "¿Qué es la teoría VSEPR?"],
  },
];

const LEVELS: { id: Level; label: string; description: string }[] = [
  { id: "beginner", label: "Principiante", description: "Lenguaje simple, analogías del mundo real" },
  { id: "highschool", label: "Bachillerato", description: "Fórmulas completas y paso a paso" },
  { id: "university", label: "Universidad", description: "Riguroso, con teoría y derivaciones" },
];

const ACTION_BUTTONS: { id: Action; label: string; icon: string; description: string }[] = [
  { id: "solve", label: "Resolver", icon: "▶", description: "Solución completa paso a paso" },
  { id: "simplify", label: "Simplificar", icon: "💡", description: "Explicación más sencilla" },
  { id: "example", label: "Ejemplo Similar", icon: "📝", description: "Problema resuelto similar" },
  { id: "practice", label: "Ejercicio", icon: "✏️", description: "Prácticalo tú mismo" },
  { id: "formula", label: "Ver Fórmulas", icon: "∑", description: "Fórmulas clave del tema" },
  { id: "mistakes", label: "Errores Comunes", icon: "⚠", description: "Qué errores evitar" },
];

function StepCard({ step }: { step: SolverStep }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border/30 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm">
      <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors" onClick={() => setOpen(o => !o)}>
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold font-mono">{step.number}</span>
        <span className="flex-1 font-semibold text-foreground">{step.title}</span>
        <span className="text-muted-foreground text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/20 pt-3">
          {step.content && <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{step.content}</p>}
          {step.formula && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
              <div className="text-xs text-primary/70 uppercase tracking-wider mb-1">Fórmula</div>
              <code className="text-primary font-mono text-sm">{step.formula}</code>
            </div>
          )}
          {step.substitution && (
            <div className="bg-secondary/30 border border-border/30 rounded-lg px-4 py-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Sustitución</div>
              <code className="text-foreground font-mono text-sm">{step.substitution}</code>
            </div>
          )}
          {step.result && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg px-4 py-3 flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <div>
                <div className="text-xs text-green-400/70 uppercase tracking-wider mb-0.5">Resultado</div>
                <code className="text-green-300 font-mono text-sm font-bold">{step.result} {step.unit && <span className="text-green-400/70">{step.unit}</span>}</code>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultPanel({ result, onAction, loading }: { result: SmartSolverResult; onAction: (a: Action) => void; loading: boolean }) {
  const [activeLevel, setActiveLevel] = useState<Level>(result.level as Level);
  const [showPractice, setShowPractice] = useState(false);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [expandMistakes, setExpandMistakes] = useState(false);

  const hasDatos = result.datosExtraidos && Object.keys(result.datosExtraidos).length > 0;
  const hasVariables = result.variables && Object.keys(result.variables).length > 0;

  return (
    <div className="space-y-5">
      {/* ── Answer ── */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Respuesta</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{result.topic}</span>
            {result.canCompute && <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">Calculado</span>}
          </div>
          <p className="text-xl font-bold text-foreground font-mono">{result.answer}</p>
          {result.interpretacion && result.canCompute && (
            <p className="text-sm text-muted-foreground leading-relaxed border-t border-primary/10 pt-3 italic">{result.interpretacion}</p>
          )}
        </div>
      </div>

      {/* ── Datos extraídos + Variables ── */}
      {(hasDatos || hasVariables) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hasDatos && (
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">🔍 Datos del Problema</span>
              </div>
              <p className="text-[10px] text-cyan-400/60 mb-2">Esto es lo que CHEMIA extrajo de tu enunciado</p>
              <div className="space-y-1.5">
                {Object.entries(result.datosExtraidos).map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-2">
                    <span className="text-xs font-mono font-semibold text-cyan-300 shrink-0">{k}</span>
                    <span className="text-[10px] text-cyan-400/50">→</span>
                    <span className="text-xs text-foreground/80 font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hasVariables && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">∑ Leyenda de Variables</span>
              </div>
              <p className="text-[10px] text-violet-400/60 mb-2">Significado de cada símbolo usado en la solución</p>
              <div className="space-y-1.5">
                {Object.entries(result.variables).map(([sym, def]) => (
                  <div key={sym} className="flex items-baseline gap-2">
                    <code className="text-xs font-mono font-bold text-violet-300 shrink-0">{sym}</code>
                    <span className="text-[10px] text-violet-400/50">=</span>
                    <span className="text-xs text-muted-foreground">{def}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {ACTION_BUTTONS.filter(b => b.id !== "solve").map(btn => (
          <button key={btn.id} onClick={() => onAction(btn.id)} disabled={loading} title={btn.description}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-border/40 bg-secondary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-40">
            <span className="text-base leading-none">{btn.icon}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border/30 bg-card/30 overflow-hidden">
        <div className="flex border-b border-border/30 bg-secondary/10">
          {LEVELS.map(lv => (
            <button key={lv.id} onClick={() => setActiveLevel(lv.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${activeLevel === lv.id ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
              {lv.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.levelExplanations[activeLevel]}</p>
        </div>
      </div>

      {result.formulas.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Fórmulas Clave</h4>
          <div className="space-y-2">
            {result.formulas.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-primary/40 text-xs">▸</span>
                <code className="text-sm text-primary font-mono">{f}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.steps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Solución Paso a Paso</h4>
          <div className="space-y-2">
            {result.steps.map((step, i) => <StepCard key={i} step={step} />)}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
        <button className="w-full flex items-center justify-between text-left" onClick={() => { setShowPractice(p => !p); setRevealAnswer(false); }}>
          <h4 className="text-sm font-bold text-violet-400 uppercase tracking-wider">✏ Ejercicio de Práctica</h4>
          <span className="text-violet-400 text-sm">{showPractice ? "▲" : "▼"}</span>
        </button>
        {showPractice && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-foreground font-medium">{result.practiceExercise.problem}</p>
            <div className="bg-violet-500/10 rounded-lg px-4 py-3 border border-violet-500/20">
              <span className="text-xs text-violet-400/70 uppercase tracking-wider">Pista: </span>
              <span className="text-sm text-violet-300">{result.practiceExercise.hint}</span>
            </div>
            {!revealAnswer ? (
              <button onClick={() => setRevealAnswer(true)} className="text-sm text-violet-400 hover:text-violet-300 underline transition-colors">Ver Respuesta</button>
            ) : (
              <div className="bg-green-500/10 rounded-lg px-4 py-3 border border-green-500/20">
                <div className="text-xs text-green-400/70 uppercase tracking-wider mb-1">Respuesta</div>
                <code className="text-sm text-green-300 font-mono">{result.practiceExercise.answer}</code>
              </div>
            )}
          </div>
        )}
      </div>

      {result.commonMistakes.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <button className="w-full flex items-center justify-between text-left" onClick={() => setExpandMistakes(m => !m)}>
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">⚠ Errores Comunes</h4>
            <span className="text-amber-400 text-sm">{expandMistakes ? "▲" : "▼"}</span>
          </button>
          {expandMistakes && (
            <ul className="mt-4 space-y-2">
              {result.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex-shrink-0 text-amber-400 mt-0.5">✗</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {result.relatedTopics.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Temas Relacionados</h4>
          <div className="flex flex-wrap gap-2">
            {result.relatedTopics.map((t, i) => (
              <span key={i} className="px-3 py-1 rounded-full border border-border/40 bg-secondary/20 text-xs text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SmartSolverPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>("stoichiometry");
  const [level, setLevel] = useState<Level>("highschool");
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState<SmartSolverResult | null>(null);
  const [lastAction, setLastAction] = useState<Action>("solve");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const mutation = useSmartSolve({
    mutation: { onSuccess: (data) => { setResult(data); setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); } },
  });

  const handleSolve = (action: Action = "solve") => {
    if (!problem.trim()) return;
    setLastAction(action);
    mutation.mutate({ data: { problem: problem.trim(), topic: selectedTopic, level, action } });
  };

  const handleExample = (ex: string) => {
    setProblem(ex);
    setLastAction("solve");
    mutation.mutate({ data: { problem: ex, topic: selectedTopic, level, action: "solve" } });
    textareaRef.current?.focus();
  };

  const currentTopic = TOPICS.find(t => t.id === selectedTopic)!;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-xl">🧠</div>
              <div>
                <div className="text-xs text-primary font-bold uppercase tracking-widest">CHEMIA</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Resolutor Inteligente</h1>
              </div>
            </div>
            <p className="text-muted-foreground max-w-lg">
              La respuesta de la química a Photomath. Ingresa cualquier problema y obtén solución paso a paso con fórmulas, sustituciones, explicaciones por nivel y ejercicios de práctica.
            </p>
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nivel de Explicación</div>
            <div className="flex rounded-xl border border-border/40 overflow-hidden bg-secondary/20">
              {LEVELS.map(lv => (
                <button key={lv.id} onClick={() => setLevel(lv.id)} title={lv.description}
                  className={`px-4 py-2 text-sm font-medium transition-all ${level === lv.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {lv.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Seleccionar Tema</h2>
            <div className="grid grid-cols-2 gap-2">
              {TOPICS.map(topic => (
                <button key={topic.id} onClick={() => setSelectedTopic(topic.id)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl border bg-gradient-to-br text-left transition-all ${selectedTopic === topic.id ? `${topic.color} text-foreground ring-1 ring-primary/40 scale-[1.02]` : "border-border/30 bg-card/30 text-muted-foreground hover:border-border/60 hover:text-foreground"}`}>
                  <span className="text-xl leading-none">{topic.icon}</span>
                  <span className="text-xs font-semibold leading-tight">{topic.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tu Problema</h2>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={problem}
                onChange={e => setProblem(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSolve(); }}
                placeholder={`Escribe tu problema de ${currentTopic.label.toLowerCase()} aquí...\n\nEjemplos:\n• ${currentTopic.examples[0]}\n• ${currentTopic.examples[1]}`}
                rows={6}
                className="w-full bg-secondary/20 border border-border/40 rounded-xl px-4 py-3 text-sm placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none font-mono leading-relaxed transition-all"
              />
              <div className="absolute bottom-2 right-3 text-xs text-muted-foreground/40">⌘↵ para resolver</div>
            </div>
            <button onClick={() => handleSolve("solve")} disabled={!problem.trim() || mutation.isPending}
              className="w-full py-3 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Resolviendo...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2"><span>▶</span> Resolver Paso a Paso</span>
              )}
            </button>
          </div>

          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Ejemplos Rápidos</h2>
            <div className="space-y-1">
              {currentTopic.examples.map((ex, i) => (
                <button key={i} onClick={() => handleExample(ex)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent hover:border-border/30 transition-all font-mono">
                  → {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={resultRef}>
          {result ? (
            <ResultPanel result={result} onAction={(a) => handleSolve(a)} loading={mutation.isPending} />
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 bg-card/20 p-12">
              <div className="w-24 h-24 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-5xl mb-6">🧠</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Listo para Resolver</h3>
              <p className="text-muted-foreground text-center max-w-sm text-sm leading-relaxed">
                Ingresa un problema de química a la izquierda y haz clic en <strong>Resolver Paso a Paso</strong>. Obtendrás la respuesta, cada paso del cálculo, las fórmulas usadas y un ejercicio de práctica.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
                {[
                  { icon: "📐", label: "Solución paso a paso" },
                  { icon: "📚", label: "3 niveles de explicación" },
                  { icon: "🧮", label: "Fórmulas detalladas" },
                  { icon: "✏️", label: "Ejercicios de práctica" },
                  { icon: "⚠", label: "Errores comunes" },
                  { icon: "💡", label: "Ejemplos resueltos" },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-base">{feat.icon}</span>
                    <span>{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
