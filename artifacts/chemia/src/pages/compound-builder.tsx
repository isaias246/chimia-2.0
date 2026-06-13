import React, { useState } from "react";
import { useGenerarPerfilUniversal } from "@workspace/api-client-react";
import type { PerfilUniversal, PerfilFueraMVP } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Loader2, Search, Atom, FlaskConical, Triangle, Link2,
  TestTube2, BookOpen, AlertTriangle, ArrowRight, Zap,
  ChevronRight, Info, GraduationCap, RotateCcw,
} from "lucide-react";

// ── MVP compound registry ────────────────────────────────────────────────────
const MVP = [
  { formula: "H2O",     display: "H₂O",      nombre: "Agua",      color: "cyan"    },
  { formula: "CO2",     display: "CO₂",      nombre: "CO₂",       color: "gray"    },
  { formula: "NH3",     display: "NH₃",      nombre: "Amoníaco",  color: "blue"    },
  { formula: "CH4",     display: "CH₄",      nombre: "Metano",    color: "orange"  },
  { formula: "NaCl",    display: "NaCl",     nombre: "Sal",       color: "yellow"  },
  { formula: "HCl",     display: "HCl",      nombre: "HCl",       color: "green"   },
  { formula: "HNO3",    display: "HNO₃",     nombre: "Nítrico",   color: "red"     },
  { formula: "H2SO4",   display: "H₂SO₄",   nombre: "Sulfúrico", color: "rose"    },
  { formula: "Ca(OH)2", display: "Ca(OH)₂", nombre: "Cal",       color: "violet"  },
  { formula: "CH3COOH", display: "CH₃COOH", nombre: "Acético",   color: "emerald" },
  { formula: "MgS",     display: "MgS",      nombre: "MgS",       color: "purple"  },
] as const;

// ── Static color map (Tailwind needs full literal class strings) ─────────────
const C: Record<string, { text: string; border: string; bg: string; chip: string }> = {
  cyan:    { text: "text-cyan-400",    border: "border-cyan-500/40",    bg: "bg-cyan-500/10",    chip: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"    },
  gray:    { text: "text-slate-400",   border: "border-slate-500/40",   bg: "bg-slate-500/10",   chip: "border-slate-500/40 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20" },
  blue:    { text: "text-blue-400",    border: "border-blue-500/40",    bg: "bg-blue-500/10",    chip: "border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"    },
  orange:  { text: "text-orange-400",  border: "border-orange-500/40",  bg: "bg-orange-500/10",  chip: "border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20" },
  yellow:  { text: "text-yellow-400",  border: "border-yellow-500/40",  bg: "bg-yellow-500/10",  chip: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20" },
  green:   { text: "text-green-400",   border: "border-green-500/40",   bg: "bg-green-500/10",   chip: "border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20"  },
  red:     { text: "text-red-400",     border: "border-red-500/40",     bg: "bg-red-500/10",     chip: "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"        },
  rose:    { text: "text-rose-400",    border: "border-rose-500/40",    bg: "bg-rose-500/10",    chip: "border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"    },
  violet:  { text: "text-violet-400",  border: "border-violet-500/40",  bg: "bg-violet-500/10",  chip: "border-violet-500/40 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20" },
  emerald: { text: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/10", chip: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" },
  purple:  { text: "text-purple-400",  border: "border-purple-500/40",  bg: "bg-purple-500/10",  chip: "border-purple-500/40 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20" },
};
function col(color: string) { return C[color] ?? C.gray; }

// ── Reaction type badge colors ───────────────────────────────────────────────
const RX: Record<string, string> = {
  "síntesis":       "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "descomposición": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "ácido-base":     "bg-green-500/20 text-green-400 border-green-500/30",
  "neutralización": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "combustión":     "bg-red-500/20 text-red-400 border-red-500/30",
  "redox":          "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};
function rxBadge(tipo: string) { return RX[tipo] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30"; }

function formulaColor(formula: string) {
  return MVP.find(m => m.formula === formula)?.color ?? "gray";
}

// ─────────────────────────────────────────────────────────────────────────────
export default function PerfilUniversalPage() {
  const [inputVal, setInputVal]         = useState("");
  const [activeFormula, setActiveFormula] = useState<string | null>(null);
  const mutation = useGenerarPerfilUniversal();

  const trigger = (formula: string) => {
    setActiveFormula(formula);
    setInputVal(formula);
    mutation.mutate({ data: { formula } });
  };

  const perfil: PerfilUniversal | undefined = mutation.data;
  const fueraMVP: PerfilFueraMVP | null =
    mutation.error?.data &&
    typeof mutation.error.data === "object" &&
    "compuestosMVP" in (mutation.error.data as object)
      ? (mutation.error.data as PerfilFueraMVP)
      : null;

  const acColor = perfil ? formulaColor(perfil.formula) : "cyan";
  const ac = col(acColor);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Page header ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-9 h-9 rounded-lg ${ac.bg} ${ac.border} border flex items-center justify-center transition-colors duration-300`}>
            <Atom className={`h-5 w-5 ${ac.text} transition-colors duration-300`} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil Universal de Compuesto</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Motor determinístico · 11 compuestos MVP ·{" "}
          <span className="text-foreground/60">Datos de IUPAC 2021 + NIST WebBook · Sin datos inventados</span>
        </p>
      </div>

      {/* ── Compound selector ── */}
      <Card className="glass border-border/50">
        <CardContent className="pt-5 pb-5 space-y-4">
          {/* MVP chips */}
          <div className="flex flex-wrap gap-2">
            {MVP.map((m) => (
              <button
                key={m.formula}
                onClick={() => trigger(m.formula)}
                disabled={mutation.isPending}
                className={`px-3 py-1.5 rounded-full border text-xs font-mono font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeFormula === m.formula
                    ? `${col(m.color).bg} ${col(m.color).border} ${col(m.color).text} ring-1 ring-offset-1 ring-offset-background ring-current`
                    : `${col(m.color).chip} border`
                }`}
              >
                {m.display}
                <span className="ml-1.5 text-[10px] opacity-60 font-sans normal-case">{m.nombre}</span>
              </button>
            ))}
          </div>

          <Separator className="opacity-30" />

          {/* Text input + button */}
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 h-10 bg-secondary/40 border-border/60 font-mono"
                placeholder="H2O, CO2, NaCl…"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && inputVal.trim()) trigger(inputVal.trim()); }}
              />
            </div>
            <Button
              onClick={() => inputVal.trim() && trigger(inputVal.trim())}
              disabled={!inputVal.trim() || mutation.isPending}
              className="h-10 px-5 font-semibold"
            >
              {mutation.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <><FlaskConical className="h-4 w-4 mr-2" />Generar Perfil</>
              }
            </Button>
            {(perfil || fueraMVP || mutation.isError) && (
              <Button
                variant="ghost" size="icon"
                onClick={() => { mutation.reset(); setActiveFormula(null); setInputVal(""); }}
                className="h-10 w-10 text-muted-foreground hover:text-foreground"
                title="Limpiar"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Out-of-MVP ── */}
      {fueraMVP && (
        <Card className="glass border-yellow-500/30 bg-yellow-500/5 animate-in fade-in duration-300">
          <CardContent className="pt-6 pb-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-yellow-400">Compuesto fuera del alcance del MVP</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-mono text-foreground">{fueraMVP.formula}</span> no está
                  en la lista de los 11 compuestos fundamentales. El perfil detallado está disponible para:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {fueraMVP.compuestosMVP.map(f => {
                    const m = MVP.find(x => x.formula === f);
                    return (
                      <button
                        key={f}
                        onClick={() => trigger(f)}
                        className={`px-3 py-1 rounded-full border text-xs font-mono font-semibold transition-all cursor-pointer ${m ? col(m.color).chip : "bg-secondary text-foreground border-border"}`}
                      >
                        {m?.display ?? f}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Generic error ── */}
      {mutation.isError && !fueraMVP && (
        <Card className="glass border-destructive/30 bg-destructive/5 animate-in fade-in duration-300">
          <CardContent className="pt-5 pb-5 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-muted-foreground">Error al cargar el perfil. Verifica la fórmula e inténtalo de nuevo.</p>
          </CardContent>
        </Card>
      )}

      {/* ══ PERFIL COMPLETO ══════════════════════════════════════════════════ */}
      {perfil && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* ── Banner card ── */}
          <Card className={`glass ${ac.border} border relative overflow-hidden`}>
            <div className={`absolute inset-0 ${ac.bg} opacity-30`} />
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className={`text-5xl md:text-6xl font-bold font-mono ${ac.text}`}>
                      {perfil.formulaDisplay}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${ac.bg} ${ac.border} ${ac.text}`}>
                        {perfil.familia}
                      </span>
                      {perfil.polaridad.esPolar
                        ? <span className="px-3 py-1 rounded-full border text-xs font-semibold bg-primary/10 border-primary/30 text-primary">Polar</span>
                        : <span className="px-3 py-1 rounded-full border text-xs font-semibold bg-secondary/60 border-border/60 text-muted-foreground">Apolar</span>
                      }
                      <span className={`px-3 py-1 rounded-full border text-xs font-semibold bg-secondary/40 border-border/50 text-foreground/60`}>
                        {perfil.lewis.esIonico ? "Iónico" : "Covalente"}
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold mt-2 text-foreground/90">{perfil.nombre}</p>
                </div>
                <div className="flex gap-6 flex-wrap shrink-0">
                  <BannerStat label="Masa Molar" value={`${perfil.masaMolar.toFixed(3)}`} unit="g/mol" />
                  {perfil.formacion.entalpiaFormacion && (
                    <BannerStat label="ΔHf°" value={perfil.formacion.entalpiaFormacion} />
                  )}
                  <BannerStat label="e⁻ valencia" value={String(perfil.lewis.electronosValenciaTotal)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Row 1: Nomenclatura + Lewis + VSEPR ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Nomenclatura */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5" /> Nomenclatura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <NomRow label="Tradicional" value={perfil.nomenclatura.tradicional} strong />
                <NomRow label="Stock" value={perfil.nomenclatura.stock} />
                <NomRow label="Sistemática (IUPAC)" value={perfil.nomenclatura.sistematica} />
                <Separator className="opacity-20" />
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Tipo</div>
                  <p className="text-xs text-foreground/70 leading-relaxed">{perfil.nomenclatura.tipo}</p>
                </div>
                {perfil.nomenclatura.nota && (
                  <div className="flex gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border/40 mt-1">
                    <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{perfil.nomenclatura.nota}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lewis */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Atom className="h-3.5 w-3.5" /> Estructura de Lewis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground/80 leading-relaxed">{perfil.lewis.descripcion}</p>
                {perfil.lewis.notaResonancia && (
                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground/70 leading-relaxed">
                    <span className="font-semibold text-primary/80">Resonancia: </span>
                    {perfil.lewis.notaResonancia}
                  </div>
                )}
                <Separator className="opacity-20" />
                <div className="grid grid-cols-2 gap-2">
                  <SmallChip label="e⁻ totales" value={String(perfil.lewis.electronosValenciaTotal)} />
                  {perfil.lewis.atomoCentral && <SmallChip label="Átomo central" value={perfil.lewis.atomoCentral} mono />}
                  {perfil.lewis.paresLibresCentral !== undefined && (
                    <SmallChip label="Pares libres" value={String(perfil.lewis.paresLibresCentral)} />
                  )}
                  {(perfil.lewis.enlacesSimples ?? 0) > 0 && (
                    <SmallChip label="Simples" value={String(perfil.lewis.enlacesSimples)} />
                  )}
                  {(perfil.lewis.enlacesDobles ?? 0) > 0 && (
                    <SmallChip label="Dobles" value={String(perfil.lewis.enlacesDobles)} />
                  )}
                  {(perfil.lewis.enlacesTriples ?? 0) > 0 && (
                    <SmallChip label="Triples" value={String(perfil.lewis.enlacesTriples)} />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* VSEPR */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Triangle className="h-3.5 w-3.5" /> Geometría VSEPR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground/80 leading-relaxed">{perfil.vsepr.descripcion}</p>
                {!perfil.vsepr.esIonico && (
                  <>
                    <Separator className="opacity-20" />
                    <div className="grid grid-cols-2 gap-2">
                      {perfil.vsepr.notacionAXE && <SmallChip label="Notación AXE" value={perfil.vsepr.notacionAXE} />}
                      {perfil.vsepr.hibridacion && <SmallChip label="Hibridación" value={perfil.vsepr.hibridacion} mono />}
                      {perfil.vsepr.geometriaMolecular && (
                        <div className="col-span-2">
                          <SmallChip label="Geometría molecular" value={perfil.vsepr.geometriaMolecular} highlight />
                        </div>
                      )}
                      {perfil.vsepr.geometriaElectronica && (
                        <div className="col-span-2">
                          <SmallChip label="Geometría electrónica" value={perfil.vsepr.geometriaElectronica} />
                        </div>
                      )}
                      {perfil.vsepr.anguloEnlace && (
                        <div className="col-span-2">
                          <SmallChip label="Ángulo de enlace" value={perfil.vsepr.anguloEnlace} />
                        </div>
                      )}
                    </div>
                  </>
                )}
                {perfil.vsepr.esIonico && perfil.vsepr.geometriaMolecular && (
                  <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/40 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/60">Red cristalina: </span>
                    {perfil.vsepr.geometriaMolecular}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Row 2: Polaridad + Formación ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Polaridad */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> Polaridad y Enlace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className={`text-3xl font-bold tracking-tight ${ac.text}`}>
                    {perfil.polaridad.esPolar ? "POLAR" : "APOLAR"}
                  </span>
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tipo de enlace</div>
                    <div className="text-sm text-foreground/80 mt-0.5">{perfil.polaridad.tipoEnlace}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MetricBox label="ΔEN máx" value={perfil.polaridad.diferenciaEN.toFixed(2)} sub="Pauling" />
                  <MetricBox label="Dipolo (μ)" value={perfil.polaridad.momentoDipolar} />
                </div>
                <Separator className="opacity-20" />
                <p className="text-sm text-foreground/75 leading-relaxed">{perfil.polaridad.explicacion}</p>
              </CardContent>
            </Card>

            {/* Formación */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5" /> Formación y Síntesis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-3 rounded-lg ${ac.bg} ${ac.border} border font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap`}>
                  {perfil.formacion.ecuacion}
                </div>
                <p className="text-sm text-foreground/75 leading-relaxed">{perfil.formacion.proceso}</p>
                <Separator className="opacity-20" />
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Estados de Oxidación</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(perfil.formacion.estadosOxidacion).map(([atom, ox]) => (
                      <span
                        key={atom}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/50 border border-border/50 text-xs font-mono"
                      >
                        <span className="font-bold text-foreground/90">{atom}</span>
                        <span className="text-primary font-semibold">{ox}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/50">Enlace formado: </span>
                  {perfil.formacion.tipoEnlaceFormado}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ── Row 3: Reacciones (full width) ── */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <TestTube2 className="h-3.5 w-3.5" /> Reacciones Clave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/30">
                {perfil.reacciones.map((rx, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground/90">{rx.nombre}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${rxBadge(rx.tipo)}`}>
                        {rx.tipo}
                      </span>
                    </div>
                    <div className={`px-3 py-2 rounded-lg ${ac.bg} border ${ac.border} font-mono text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap`}>
                      {rx.ecuacion}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/50" />
                      {rx.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Row 4: Educación (tabs) ── */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5" /> Guía Educativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="teoria">
                <TabsList className="bg-secondary/40 h-9 mb-5">
                  <TabsTrigger value="teoria" className="text-xs">Teoría</TabsTrigger>
                  <TabsTrigger value="errores" className="text-xs">Errores Comunes</TabsTrigger>
                  <TabsTrigger value="ejercicios" className="text-xs">Ejercicios</TabsTrigger>
                </TabsList>

                <TabsContent value="teoria" className="mt-0">
                  <div className={`p-4 rounded-lg ${ac.bg} ${ac.border} border`}>
                    <p className="text-sm leading-relaxed text-foreground/85">{perfil.educacion.teoriaResumida}</p>
                  </div>
                </TabsContent>

                <TabsContent value="errores" className="mt-0">
                  <ul className="space-y-3">
                    {perfil.educacion.erroresComunes.map((e, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-[10px] font-bold mt-0.5">!</span>
                        <span className="text-sm text-foreground/80 leading-relaxed">{e}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="ejercicios" className="mt-0">
                  <Tabs defaultValue="principiante">
                    <TabsList className="bg-secondary/30 h-8 mb-4">
                      <TabsTrigger value="principiante" className="text-[11px]">Principiante</TabsTrigger>
                      <TabsTrigger value="secundario" className="text-[11px]">Secundaria</TabsTrigger>
                      <TabsTrigger value="universitario" className="text-[11px]">Universidad</TabsTrigger>
                    </TabsList>
                    <TabsContent value="principiante" className="mt-0">
                      <ExerciseList items={perfil.educacion.ejerciciosPrincipiante} />
                    </TabsContent>
                    <TabsContent value="secundario" className="mt-0">
                      <ExerciseList items={perfil.educacion.ejerciciosSecundario} />
                    </TabsContent>
                    <TabsContent value="universitario" className="mt-0">
                      <ExerciseList items={perfil.educacion.ejerciciosUniversitario} />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

        </div>
      )}

      {/* ── Empty state ── */}
      {!perfil && !mutation.isError && !mutation.isPending && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Atom className="h-8 w-8 text-primary/60" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground/70">Selecciona un compuesto</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Haz clic en cualquiera de los 11 chips del MVP o escribe una fórmula para ver el análisis completo.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Nomenclatura · Lewis · VSEPR · Polaridad · Formación · Reacciones · Educación</span>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BannerStat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="text-right">
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-base font-bold font-mono text-foreground/90 mt-0.5">{value}{unit ? <span className="text-xs font-normal ml-1 text-muted-foreground">{unit}</span> : null}</div>
    </div>
  );
}

function NomRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</div>
      <div className={`text-sm ${strong ? "font-semibold text-foreground" : "text-foreground/80"}`}>{value}</div>
    </div>
  );
}

function SmallChip({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className={`rounded-lg px-2.5 py-1.5 border ${highlight ? "bg-primary/10 border-primary/20" : "bg-secondary/30 border-border/40"}`}>
      <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-xs font-semibold mt-0.5 ${highlight ? "text-primary" : "text-foreground/85"} ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function MetricBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-secondary/30 rounded-xl px-3 py-2.5 border border-border/40">
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold font-mono text-foreground/90 mt-1">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</div>}
    </div>
  );
}

function ExerciseList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((ex, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="shrink-0 w-5 h-5 rounded bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold mt-0.5">{i + 1}</span>
          <span className="text-sm text-foreground/80 leading-relaxed">{ex}</span>
        </li>
      ))}
    </ul>
  );
}
