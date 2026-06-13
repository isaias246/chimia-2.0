import { useState } from "react";
import { useListCompoundLibrary, useGetCompoundDetail } from "@workspace/api-client-react";
import type { CompoundSummary, CompoundDetail } from "@workspace/api-client-react";

// ── Color map ──────────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  cyan:   { bg: "bg-cyan-500/10",   border: "border-cyan-500/30",   text: "text-cyan-300",   glow: "shadow-cyan-500/10" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-300", glow: "shadow-violet-500/10" },
  green:  { bg: "bg-green-500/10",  border: "border-green-500/30",  text: "text-green-300",  glow: "shadow-green-500/10" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-300", glow: "shadow-orange-500/10" },
  red:    { bg: "bg-red-500/10",    border: "border-red-500/30",    text: "text-red-300",    glow: "shadow-red-500/10" },
  blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-300",   glow: "shadow-blue-500/10" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-300", glow: "shadow-yellow-500/10" },
  slate:  { bg: "bg-slate-500/10",  border: "border-slate-500/30",  text: "text-slate-300",  glow: "shadow-slate-500/10" },
};
const getColor = (c: string) => COLOR_MAP[c] ?? COLOR_MAP.slate;

// ── Category / state labels ────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  acid: "Acid", base: "Base", salt: "Salt", oxide: "Oxide",
  organic: "Organic", "element-molecule": "Element", other: "Other",
};
const STATE_ICONS: Record<string, string> = { solid: "◼", liquid: "◍", gas: "○" };
const HAZARD_ICONS: Record<string, { icon: string; label: string; color: string }> = {
  corrosive:    { icon: "⚗", label: "Corrosive",    color: "text-orange-400" },
  toxic:        { icon: "☠", label: "Toxic",         color: "text-red-400" },
  flammable:    { icon: "🔥", label: "Flammable",    color: "text-orange-400" },
  oxidizer:     { icon: "◉", label: "Oxidizer",      color: "text-yellow-400" },
  irritant:     { icon: "!", label: "Irritant",       color: "text-yellow-400" },
  environmental:{ icon: "🌿", label: "Environmental", color: "text-green-400" },
  none:         { icon: "✓", label: "Generally Safe", color: "text-green-400" },
};
const REACTION_TYPE_COLORS: Record<string, string> = {
  synthesis: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  decomposition: "bg-red-500/10 text-red-300 border-red-500/20",
  combustion: "bg-orange-500/10 text-orange-300 border-orange-500/20",
  "acid-base": "bg-green-500/10 text-green-300 border-green-500/20",
  redox: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  neutralization: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  other: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "acid", label: "Acids" },
  { id: "base", label: "Bases" },
  { id: "salt", label: "Salts" },
  { id: "oxide", label: "Oxides" },
  { id: "organic", label: "Organic" },
  { id: "element-molecule", label: "Elements" },
  { id: "other", label: "Other" },
];

// ── Compound card ──────────────────────────────────────────────────────────────
function CompoundCard({ compound, isSelected, onClick }: {
  compound: CompoundSummary;
  isSelected: boolean;
  onClick: () => void;
}) {
  const c = getColor(compound.color);
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-5 transition-all hover:scale-[1.02] hover:shadow-lg group ${
        isSelected
          ? `${c.bg} ${c.border} shadow-lg scale-[1.02]`
          : "border-border/30 bg-card/30 hover:border-border/60"
      }`}
    >
      {/* Formula */}
      <div className={`text-3xl font-bold font-mono mb-1 leading-tight transition-colors ${isSelected ? c.text : "text-foreground group-hover:" + c.text}`}>
        {compound.formula}
      </div>

      {/* Name */}
      <div className="text-sm font-semibold text-foreground mb-2">{compound.name}</div>

      {/* Tagline */}
      <div className="text-xs text-muted-foreground mb-3 line-clamp-1">{compound.tagline}</div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.bg} ${c.border} ${c.text}`}>
          {CATEGORY_LABELS[compound.category] ?? compound.category}
        </span>
        <span className="text-xs text-muted-foreground">
          {STATE_ICONS[compound.state]} {compound.state}
        </span>
        <span className="text-xs text-muted-foreground ml-auto font-mono">
          {compound.molarMass.toFixed(2)} g/mol
        </span>
      </div>
    </button>
  );
}

// ── Detail panel ───────────────────────────────────────────────────────────────
type DetailTab = "overview" | "properties" | "reactions" | "learn";

function DetailPanel({ detail }: { detail: CompoundDetail }) {
  const [tab, setTab] = useState<DetailTab>("overview");
  const [level, setLevel] = useState<"beginner" | "highschool" | "university">("highschool");
  const c = getColor(detail.color);

  const TABS: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "properties", label: "Properties" },
    { id: "reactions", label: "Reactions" },
    { id: "learn", label: "Learn" },
  ];

  return (
    <div className="rounded-2xl border border-border/30 bg-card/20 overflow-hidden">
      {/* Header */}
      <div className={`relative overflow-hidden p-6 bg-gradient-to-br ${c.bg} border-b border-border/20`}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "currentColor" }} />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className={`text-5xl font-bold font-mono mb-1 ${c.text}`}>{detail.formula}</div>
            <div className="text-xl font-semibold text-foreground">{detail.name}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{detail.iupacName}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {detail.commonNames.slice(1).map((n, i) => (
                <span key={i} className="text-xs text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full border border-border/20">
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${c.bg} ${c.border} ${c.text}`}>
              {CATEGORY_LABELS[detail.category]}
            </span>
            <span className="text-sm text-muted-foreground">{STATE_ICONS[detail.state]} {detail.state}</span>
            <span className={`text-2xl font-bold font-mono ${c.text}`}>{detail.molarMass.toFixed(3)}</span>
            <span className="text-xs text-muted-foreground">g/mol</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Geometry", value: detail.geometry.split(",")[0] },
            { label: "Bond", value: detail.bondType.split("(")[0].trim() },
            { label: "Polarity", value: detail.dipole ? "Polar" : "Nonpolar" },
          ].map(stat => (
            <div key={stat.label} className="bg-secondary/20 rounded-lg px-3 py-2 text-center border border-border/20">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              <div className="text-xs font-semibold text-foreground mt-0.5">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/20 bg-secondary/10">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-all ${
              tab === t.id
                ? `${c.text} border-b-2 border-current bg-primary/5`
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 overflow-y-auto max-h-[600px] space-y-5">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-5">
            {/* Hazards */}
            <div className="flex flex-wrap gap-2">
              {detail.hazards.map(h => {
                const hz = HAZARD_ICONS[h] ?? HAZARD_ICONS.none;
                return (
                  <span key={h} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/30 bg-secondary/20 ${hz.color}`}>
                    <span>{hz.icon}</span> {hz.label}
                  </span>
                );
              })}
            </div>

            {/* Appearance & smell */}
            <div className="grid grid-cols-1 gap-3">
              <InfoRow label="Appearance" value={detail.appearance} />
              <InfoRow label="Smell" value={detail.smell} />
              <InfoRow label="Bond type" value={detail.bondType} />
              <InfoRow label="Geometry" value={detail.geometry} />
              <InfoRow label="Solubility" value={detail.solubility} />
              {detail.phInWater && <InfoRow label="pH in water" value={detail.phInWater} />}
            </div>

            {/* Uses */}
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Real-World Uses</h4>
              <div className="space-y-1.5">
                {detail.uses.map((u, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`flex-shrink-0 mt-0.5 ${c.text}`}>▸</span>
                    <span>{u}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun facts */}
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">💡 Fun Facts</h4>
              <div className="space-y-2">
                {detail.funFacts.map((f, i) => (
                  <div key={i} className={`p-3 rounded-lg border text-sm ${c.bg} ${c.border} text-muted-foreground`}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROPERTIES ── */}
        {tab === "properties" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/30 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/20">
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Property</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Value</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.properties.map((p, i) => (
                    <tr key={i} className={`border-b border-border/20 last:border-0 ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                      <td className="px-4 py-3 text-muted-foreground">{p.label}</td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${c.text}`}>{p.value}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground text-xs">{p.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Structure summary */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Molecular formula", value: detail.formula },
                { label: "IUPAC name", value: detail.iupacName },
                { label: "Geometry", value: detail.geometry },
                { label: "Bond type", value: detail.bondType.split("(")[0].trim() },
                { label: "Dipole", value: detail.dipole ? "Polar (μ > 0)" : "Nonpolar (μ = 0)" },
                { label: "State (25°C)", value: detail.state.charAt(0).toUpperCase() + detail.state.slice(1) },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-lg border border-border/20 bg-secondary/10">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{s.label}</div>
                  <div className={`text-sm font-semibold font-mono ${c.text}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REACTIONS ── */}
        {tab === "reactions" && (
          <div className="space-y-4">
            {detail.reactions.map((r, i) => (
              <div key={i} className="rounded-xl border border-border/30 bg-secondary/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                  <span className="text-sm font-semibold text-foreground">{r.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${REACTION_TYPE_COLORS[r.type] ?? REACTION_TYPE_COLORS.other}`}>
                    {r.type}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className={`font-mono text-sm p-3 rounded-lg border ${c.bg} ${c.border} ${c.text} leading-relaxed`}>
                    {r.equation}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LEARN ── */}
        {tab === "learn" && (
          <div className="space-y-5">
            {/* Level selector */}
            <div className="flex rounded-xl border border-border/40 overflow-hidden bg-secondary/20">
              {(["beginner", "highschool", "university"] as const).map(lv => (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`flex-1 py-2.5 text-sm font-medium capitalize transition-all ${level === lv ? `bg-primary text-primary-foreground` : "text-muted-foreground hover:text-foreground"}`}
                >
                  {lv === "highschool" ? "High School" : lv.charAt(0).toUpperCase() + lv.slice(1)}
                </button>
              ))}
            </div>

            {/* Explanation */}
            <div className={`p-5 rounded-xl border ${c.bg} ${c.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>
                  {level === "highschool" ? "High School" : level.charAt(0).toUpperCase() + level.slice(1)} Explanation
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {detail.explanation[level]}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {detail.tags.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs border border-border/40 bg-secondary/20 text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-foreground flex-1">{value}</span>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CompoundLibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: compounds = [], isLoading } = useListCompoundLibrary(
    { search: search || undefined, category: category !== "all" ? category : undefined },
  );

  const { data: detail, isLoading: detailLoading } = useGetCompoundDetail(
    selectedId ?? "_none_"
  );

  const handleSelect = (id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-lg">⚗</div>
            <div>
              <div className="text-xs text-primary font-bold uppercase tracking-widest">CHEMIA</div>
              <h1 className="text-2xl font-bold text-foreground">Compound Library</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg">
            Deep-dive educational profiles for key compounds — properties, reactions, real-world uses, and multi-level explanations.
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" />{compounds.length} compounds</span>
            <span className="text-border">·</span>
            <span>Select any compound for a full profile</span>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, formula, or property…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-secondary/20 border border-border/40 rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setCategory(f.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                category === f.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/40 bg-secondary/20 text-muted-foreground hover:text-foreground hover:border-border/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className={`grid gap-6 ${selectedId ? "grid-cols-1 lg:grid-cols-[1fr_420px]" : "grid-cols-1"}`}>
        {/* Compounds grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl border border-border/20 bg-secondary/10 animate-pulse" />
              ))}
            </div>
          ) : compounds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-4">🔬</div>
              <p className="text-muted-foreground">No compounds found for "{search}"</p>
              <button onClick={() => { setSearch(""); setCategory("all"); }} className="mt-3 text-sm text-primary hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-3 ${selectedId ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"}`}>
              {(compounds as CompoundSummary[]).map(c => (
                <CompoundCard
                  key={c.id}
                  compound={c}
                  isSelected={selectedId === c.id}
                  onClick={() => handleSelect(c.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedId && (
          <div className="lg:sticky lg:top-6 self-start">
            {detailLoading ? (
              <div className="rounded-2xl border border-border/30 bg-card/20 h-96 animate-pulse" />
            ) : detail ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Compound Profile</span>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border/40 rounded-lg px-2 py-1 transition-colors"
                  >
                    ✕ Close
                  </button>
                </div>
                <DetailPanel detail={detail as CompoundDetail} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
