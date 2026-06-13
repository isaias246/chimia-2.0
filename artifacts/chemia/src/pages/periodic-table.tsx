import React, { useState } from "react";
import { useListElements, Element } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Search, X, ExternalLink, Calculator } from "lucide-react";
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
  { name: "Alkali Metal", key: "alkali metal" },
  { name: "Alkaline Earth", key: "alkaline earth metal" },
  { name: "Transition Metal", key: "transition metal" },
  { name: "Post-Transition", key: "post-transition metal" },
  { name: "Metalloid", key: "metalloid" },
  { name: "Nonmetal", key: "nonmetal" },
  { name: "Halogen", key: "halogen" },
  { name: "Noble Gas", key: "noble gas" },
  { name: "Lanthanide", key: "lanthanide" },
  { name: "Actinide", key: "actinide" },
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
          <h1 className="text-3xl font-bold tracking-tight">Periodic Table</h1>
          <p className="text-muted-foreground mt-1 text-sm">Interactive map of all 118 elements.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search elements by name, symbol, or number..."
            className="pl-9 pr-9 h-10 bg-secondary/30 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all font-mono text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
          />
          {search && (
            <X 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
              onClick={() => setSearch("")}
            />
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
              onClick={() => {
                setActiveCategory(isActive ? null : cat.key);
                if (search) setSearch("");
              }}
              className={`text-[10px] px-2.5 py-1 rounded-sm border uppercase tracking-wider font-semibold transition-all ${
                isActive ? colorClass + " ring-1 ring-white/20 scale-105" : 
                activeCategory ? "opacity-30 bg-transparent border-transparent text-muted-foreground" : 
                colorClass + " hover:opacity-80"
              }`}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      <div className="glass rounded-xl p-6 overflow-x-auto">
        {isLoading ? (
           <div className="grid grid-cols-18 gap-1.5 min-w-[1100px]">
            {Array.from({ length: 118 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] w-full opacity-10" />
            ))}
           </div>
        ) : (
          <div className="min-w-[1100px] flex flex-col gap-4">
             {/* Main grid (periods 1-7) */}
             <div 
               className="grid gap-1.5" 
               style={{ 
                 gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                 gridTemplateRows: 'repeat(7, minmax(0, 1fr))'
               }}
             >
                {displayElements
                  .filter(e => !e.category.toLowerCase().includes('lanthanide') && !e.category.toLowerCase().includes('actinide'))
                  .map(el => {
                    const isFadedBySearch = search && !el.name.toLowerCase().includes(search.toLowerCase()) && 
                                             !el.symbol.toLowerCase().includes(search.toLowerCase()) && 
                                             el.atomicNumber.toString() !== search;
                    const isFadedByCategory = activeCategory && !el.category.toLowerCase().includes(activeCategory);
                    const isFaded = isFadedBySearch || isFadedByCategory;
                    
                    return (
                      <div 
                        key={el.atomicNumber}
                        onClick={() => setSelectedElement(el)}
                        className={`
                          relative flex flex-col items-center justify-center p-1 
                          border rounded-md cursor-pointer h-[72px] element-cell-hover
                          ${getCategoryColor(el.category)}
                          ${isFaded ? 'opacity-10 grayscale scale-95' : 'opacity-90 hover:opacity-100 shadow-sm'}
                        `}
                        style={{
                          gridColumn: el.group || 'auto',
                          gridRow: el.period
                        }}
                        title={el.name}
                      >
                        <span className="absolute top-1 left-1.5 text-[9px] font-mono opacity-70">{el.atomicNumber}</span>
                        <span className="font-bold text-[17px] leading-tight text-white drop-shadow-md">{el.symbol}</span>
                        <span className="absolute bottom-1 w-full text-center text-[9px] font-mono opacity-70">{el.atomicMass.toFixed(2)}</span>
                      </div>
                    );
                })}
             </div>

             {/* Lanthanides and Actinides */}
             <div className="flex flex-col gap-1.5 mt-6 ml-[16.6%]"> {/* Offset to align with group 3 */}
                {/* Lanthanides */}
                <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                  {displayElements
                    .filter(e => e.category.toLowerCase().includes('lanthanide'))
                    .map(el => {
                      const isFadedBySearch = search && !el.name.toLowerCase().includes(search.toLowerCase()) && 
                                             !el.symbol.toLowerCase().includes(search.toLowerCase()) && 
                                             el.atomicNumber.toString() !== search;
                      const isFadedByCategory = activeCategory && !el.category.toLowerCase().includes(activeCategory);
                      const isFaded = isFadedBySearch || isFadedByCategory;
                      
                      return (
                        <div 
                          key={el.atomicNumber}
                          onClick={() => setSelectedElement(el)}
                          className={`
                            relative flex flex-col items-center justify-center p-1 
                            border rounded-md cursor-pointer h-[72px] element-cell-hover
                            ${getCategoryColor(el.category)}
                            ${isFaded ? 'opacity-10 grayscale scale-95' : 'opacity-90 hover:opacity-100 shadow-sm'}
                          `}
                          title={el.name}
                        >
                          <span className="absolute top-1 left-1.5 text-[9px] font-mono opacity-70">{el.atomicNumber}</span>
                          <span className="font-bold text-[17px] leading-tight text-white drop-shadow-md">{el.symbol}</span>
                          <span className="absolute bottom-1 w-full text-center text-[9px] font-mono opacity-70">{el.atomicMass.toFixed(2)}</span>
                        </div>
                      );
                  })}
                </div>
                {/* Actinides */}
                <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                  {displayElements
                    .filter(e => e.category.toLowerCase().includes('actinide'))
                    .map(el => {
                      const isFadedBySearch = search && !el.name.toLowerCase().includes(search.toLowerCase()) && 
                                             !el.symbol.toLowerCase().includes(search.toLowerCase()) && 
                                             el.atomicNumber.toString() !== search;
                      const isFadedByCategory = activeCategory && !el.category.toLowerCase().includes(activeCategory);
                      const isFaded = isFadedBySearch || isFadedByCategory;
                      
                      return (
                        <div 
                          key={el.atomicNumber}
                          onClick={() => setSelectedElement(el)}
                          className={`
                            relative flex flex-col items-center justify-center p-1 
                            border rounded-md cursor-pointer h-[72px] element-cell-hover
                            ${getCategoryColor(el.category)}
                            ${isFaded ? 'opacity-10 grayscale scale-95' : 'opacity-90 hover:opacity-100 shadow-sm'}
                          `}
                          title={el.name}
                        >
                          <span className="absolute top-1 left-1.5 text-[9px] font-mono opacity-70">{el.atomicNumber}</span>
                          <span className="font-bold text-[17px] leading-tight text-white drop-shadow-md">{el.symbol}</span>
                          <span className="absolute bottom-1 w-full text-center text-[9px] font-mono opacity-70">{el.atomicMass.toFixed(2)}</span>
                        </div>
                      );
                  })}
                </div>
             </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedElement} onOpenChange={(open) => !open && setSelectedElement(null)}>
        <DialogContent className="sm:max-w-2xl border-border/50 bg-card p-0 overflow-hidden">
          {selectedElement && (
            <>
              <div className={`p-8 border-b ${getCategoryColor(selectedElement.category).replace('text-', 'text-white border-b-')} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80 z-0"></div>
                <div className="relative z-10 flex items-end gap-6">
                  <div className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center border shadow-xl ${getCategoryColor(selectedElement.category)}`}>
                    <span className="text-sm font-mono opacity-80 self-start ml-2 -mt-2">{selectedElement.atomicNumber}</span>
                    <span className="text-4xl font-bold text-white drop-shadow-md">{selectedElement.symbol}</span>
                  </div>
                  <div className="pb-1">
                    <DialogTitle className="text-3xl font-bold text-white">{selectedElement.name}</DialogTitle>
                    <DialogDescription className="text-white/70 uppercase tracking-widest text-xs font-semibold mt-1">
                      {selectedElement.category}
                    </DialogDescription>
                  </div>
                  <div className="ml-auto pb-2">
                    <Link href={`/molecular-mass?formula=${selectedElement.symbol}`}>
                      <button className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md backdrop-blur-sm transition-colors border border-white/10">
                        <Calculator className="h-3 w-3" />
                        Calculate Mass
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Atomic Number</span>
                    <p className="font-mono text-lg">{selectedElement.atomicNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Atomic Mass</span>
                    <p className="font-mono text-lg">{selectedElement.atomicMass}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Density</span>
                    <p className="font-mono text-lg">{selectedElement.density || '-'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Group</span>
                    <p className="font-mono text-lg">{selectedElement.group || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Period</span>
                    <p className="font-mono text-lg">{selectedElement.period}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Phase</span>
                    <p className="font-mono text-lg capitalize">{selectedElement.phase}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Boiling Point</span>
                    <p className="font-mono text-lg">{selectedElement.boil ? `${selectedElement.boil} K` : '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Melting Point</span>
                    <p className="font-mono text-lg">{selectedElement.melt ? `${selectedElement.melt} K` : '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Molar Heat</span>
                    <p className="font-mono text-lg">{selectedElement.molarHeat || '-'}</p>
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 space-y-1 mt-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Electron Configuration</span>
                    <div className="font-mono text-sm bg-secondary/50 p-3 rounded-md border border-border/50 text-primary">
                      {selectedElement.electronConfiguration}
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 space-y-1 mt-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Oxidation States</span>
                    <p className="font-mono text-sm px-1">{selectedElement.oxidationStates || 'Unknown'}</p>
                  </div>

                  <div className="col-span-1 md:col-span-3 space-y-1 mt-2 border-t border-border/50 pt-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Summary</span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{selectedElement.summary}</p>
                    <a href={selectedElement.source} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-2 inline-flex">
                      Read more on Wikipedia <ExternalLink className="h-3 w-3" />
                    </a>
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
