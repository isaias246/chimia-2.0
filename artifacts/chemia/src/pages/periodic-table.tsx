import React, { useState } from "react";
import { useListElements, Element } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Search, X, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const CATEGORY_COLORS: Record<string, string> = {
  "diatomic nonmetal": "bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/40",
  "polyatomic nonmetal": "bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/40",
  "noble gas": "bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/40",
  "alkali metal": "bg-[#f87171]/15 text-[#f87171] border-[#f87171]/40",
  "alkaline earth metal": "bg-[#fb923c]/15 text-[#fb923c] border-[#fb923c]/40",
  "metalloid": "bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/40",
  "halogen": "bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/40",
  "transition metal": "bg-[#60a5fa]/15 text-[#60a5fa] border-[#60a5fa]/40",
  "post-transition metal": "bg-[#94a3b8]/15 text-[#94a3b8] border-[#94a3b8]/40",
  "lanthanide": "bg-[#f472b6]/15 text-[#f472b6] border-[#f472b6]/40",
  "actinide": "bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/40",
  "unknown, probably transition metal": "bg-gray-600/15 text-gray-400 border-gray-600/40",
  "unknown, probably post-transition metal": "bg-gray-600/15 text-gray-400 border-gray-600/40",
  "unknown, probably metalloid": "bg-gray-600/15 text-gray-400 border-gray-600/40",
  "unknown, predicted to be noble gas": "bg-gray-600/15 text-gray-400 border-gray-600/40",
  "unknown, but predicted to be an alkali metal": "bg-gray-600/15 text-gray-400 border-gray-600/40",
};

const LEGEND_CATEGORIES = [
  { name: "Metal Alcalino", key: "alkali metal" },
  { name: "Alcalinotérreo", key: "alkaline earth metal" },
  { name: "Metal Transición", key: "transition metal" },
  { name: "Post-Transición", key: "post-transition metal" },
  { name: "Metaloide", key: "metalloid" },
  { name: "No Metal", key: "nonmetal" },
  { name: "Halógeno", key: "halogen" },
  { name: "Gas Noble", key: "noble gas" },
  { name: "Lantánido", key: "lanthanide" },
  { name: "Actínido", key: "actinide" },
];

function getCategoryColor(category: string): string {
  const normalized = category.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_COLORS)) {
    if (normalized.includes(key)) return value;
  }
  return "bg-secondary text-foreground border-border";
}

export default function PeriodicTable() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: elements, isLoading } = useListElements({ search: search || undefined });
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const displayElements = elements || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tabla Periódica</h1>
          <p className="text-muted-foreground mt-1 text-sm">Mapa interactivo de los 118 elementos.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar por nombre, símbolo o número..."
            className="pl-9 pr-9 h-10 bg-secondary/30 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all font-mono text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
          />
          {search && (
            <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => setSearch("")} />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 py-2">
        {LEGEND_CATEGORIES.map(cat => {
          const colorClass = CATEGORY_COLORS[cat.key] || CATEGORY_COLORS["diatomic nonmetal"];
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(isActive ? null : cat.key); if (search) setSearch(""); }}
              className={`text-[10px] px-2.5 py-1 rounded-sm border uppercase tracking-wider font-semibold transition-all ${
                isActive ? colorClass + " ring-1 ring-white/20 scale-105" :
                activeCategory ? "opacity-30 bg-transparent border-transparent text-muted-foreground" :
                colorClass + " hover:opacity-80"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="glass rounded-xl p-6 overflow-x-auto">
        {isLoading ? (
          <div className="grid grid-cols-18 gap-1.5 min-w-[1100px]">
            {Array.from({ length: 118 }).map((_, i) => <Skeleton key={i} className="h-[72px] w-full opacity-10" />)}
          </div>
        ) : (
          <div className="min-w-[1100px] flex flex-col gap-4">
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))", gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
              {displayElements
                .filter(e => !e.category.toLowerCase().includes("lanthanide") && !e.category.toLowerCase().includes("actinide"))
                .map(el => {
                  const isFaded = (search && !el.name.toLowerCase().includes(search.toLowerCase()) && !el.symbol.toLowerCase().includes(search.toLowerCase()) && el.atomicNumber.toString() !== search) ||
                    (activeCategory && !el.category.toLowerCase().includes(activeCategory));
                  return (
                    <div
                      key={el.atomicNumber}
                      onClick={() => setSelectedElement(el)}
                      className={`relative flex flex-col items-center justify-center p-1 border rounded-md cursor-pointer h-[72px] element-cell-hover ${getCategoryColor(el.category)} ${isFaded ? "opacity-10 grayscale scale-95" : "opacity-90 hover:opacity-100 shadow-sm"}`}
                      style={{ gridColumn: el.group || "auto", gridRow: el.period }}
                      title={el.name}
                    >
                      <span className="absolute top-1 left-1.5 text-[9px] font-mono opacity-70">{el.atomicNumber}</span>
                      <span className="font-bold text-[17px] leading-tight text-white drop-shadow-md">{el.symbol}</span>
                      <span className="absolute bottom-1 w-full text-center text-[9px] font-mono opacity-70">{el.atomicMass.toFixed(2)}</span>
                    </div>
                  );
                })}
            </div>

            <div className="flex flex-col gap-1.5 mt-6 ml-[16.6%]">
              {["lanthanide", "actinide"].map(type => (
                <div key={type} className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
                  {displayElements.filter(e => e.category.toLowerCase().includes(type)).map(el => {
                    const isFaded = (search && !el.name.toLowerCase().includes(search.toLowerCase()) && !el.symbol.toLowerCase().includes(search.toLowerCase()) && el.atomicNumber.toString() !== search) ||
                      (activeCategory && !el.category.toLowerCase().includes(activeCategory));
                    return (
                      <div
                        key={el.atomicNumber}
                        onClick={() => setSelectedElement(el)}
                        className={`relative flex flex-col items-center justify-center p-1 border rounded-md cursor-pointer h-[72px] element-cell-hover ${getCategoryColor(el.category)} ${isFaded ? "opacity-10 grayscale scale-95" : "opacity-90 hover:opacity-100 shadow-sm"}`}
                        title={el.name}
                      >
                        <span className="absolute top-1 left-1.5 text-[9px] font-mono opacity-70">{el.atomicNumber}</span>
                        <span className="font-bold text-[17px] leading-tight text-white drop-shadow-md">{el.symbol}</span>
                        <span className="absolute bottom-1 w-full text-center text-[9px] font-mono opacity-70">{el.atomicMass.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedElement} onOpenChange={(open) => !open && setSelectedElement(null)}>
        <DialogContent className="sm:max-w-2xl border-border/50 bg-card p-0 overflow-hidden">
          {selectedElement && (
            <>
              <div className={`p-8 border-b relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80 z-0" />
                <div className="relative z-10 flex items-end gap-6">
                  <div className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center border shadow-xl ${getCategoryColor(selectedElement.category)}`}>
                    <span className="text-sm font-mono opacity-80 self-start ml-2 -mt-2">{selectedElement.atomicNumber}</span>
                    <span className="text-4xl font-bold text-white drop-shadow-md">{selectedElement.symbol}</span>
                  </div>
                  <div className="pb-1">
                    <DialogTitle className="text-3xl font-bold text-white">{selectedElement.name}</DialogTitle>
                    <DialogDescription className="text-white/70 uppercase tracking-widest text-xs font-semibold mt-1">{selectedElement.category}</DialogDescription>
                  </div>
                  <div className="ml-auto pb-2">
                    <Link href={`/molecular-mass?formula=${selectedElement.symbol}`}>
                      <button className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md backdrop-blur-sm transition-colors border border-white/10">
                        <Calculator className="h-3 w-3" /> Calcular Masa
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Número Atómico", value: String(selectedElement.atomicNumber) },
                    { label: "Masa Atómica", value: String(selectedElement.atomicMass) },
                    { label: "Grupo", value: selectedElement.group ? String(selectedElement.group) : "—" },
                    { label: "Período", value: String(selectedElement.period) },
                    { label: "Punto de Ebullición", value: selectedElement.boilingPoint ? `${selectedElement.boilingPoint} K` : "—" },
                    { label: "Punto de Fusión", value: selectedElement.meltingPoint ? `${selectedElement.meltingPoint} K` : "—" },
                    { label: "Densidad", value: selectedElement.density ? `${selectedElement.density} g/cm³` : "—" },
                    { label: "Fase", value: selectedElement.phase },
                    { label: "Descubierto por", value: selectedElement.discoveredBy || "Desconocido" },
                  ].map(s => (
                    <div key={s.label} className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{s.label}</span>
                      <p className="font-mono text-base capitalize">{s.value}</p>
                    </div>
                  ))}
                  <div className="col-span-1 md:col-span-3 space-y-1 mt-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Configuración Electrónica</span>
                    <div className="font-mono text-sm bg-secondary/50 p-3 rounded-md border border-border/50 text-primary">{selectedElement.electronConfiguration}</div>
                  </div>
                  <div className="col-span-1 md:col-span-3 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Estados de Oxidación</span>
                    <p className="font-mono text-sm px-1">{selectedElement.oxidationStates || "Desconocido"}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
