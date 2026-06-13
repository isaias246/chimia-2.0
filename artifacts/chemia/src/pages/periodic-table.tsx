import React, { useState } from "react";
import { useListElements, Element } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const CATEGORY_COLORS: Record<string, string> = {
  "diatomic nonmetal": "bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/30",
  "polyatomic nonmetal": "bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/30",
  "noble gas": "bg-[#c084fc]/20 text-[#c084fc] border-[#c084fc]/30",
  "alkali metal": "bg-[#f87171]/20 text-[#f87171] border-[#f87171]/30",
  "alkaline earth metal": "bg-[#fb923c]/20 text-[#fb923c] border-[#fb923c]/30",
  "metalloid": "bg-[#facc15]/20 text-[#facc15] border-[#facc15]/30",
  "halogen": "bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/30",
  "transition metal": "bg-[#60a5fa]/20 text-[#60a5fa] border-[#60a5fa]/30",
  "post-transition metal": "bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/30",
  "lanthanide": "bg-[#f472b6]/20 text-[#f472b6] border-[#f472b6]/30",
  "actinide": "bg-[#fb7185]/20 text-[#fb7185] border-[#fb7185]/30",
  "unknown, probably transition metal": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  "unknown, probably post-transition metal": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  "unknown, probably metalloid": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  "unknown, predicted to be noble gas": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  "unknown, but predicted to be an alkali metal": "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

function getCategoryColor(category: string): string {
  const normalized = category.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_COLORS)) {
    if (normalized.includes(key)) return value;
  }
  return "bg-secondary text-foreground border-border";
}

export default function PeriodicTable() {
  const [search, setSearch] = useState("");
  const { data: elements, isLoading } = useListElements({ search: search || undefined });
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  // Filter elements to only show those that match search if active
  const displayElements = elements || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Periodic Table</h1>
          <p className="text-muted-foreground">Interactive map of all 118 elements.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search elements..."
            className="pl-9 bg-card border-border/50 focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <X 
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
              onClick={() => setSearch("")}
            />
          )}
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-4 overflow-x-auto">
        {isLoading ? (
           <div className="grid grid-cols-18 gap-1 min-w-[1000px]">
            {Array.from({ length: 118 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full opacity-20" />
            ))}
           </div>
        ) : (
          <div className="min-w-[1000px] flex flex-col gap-4">
             {/* Main grid (periods 1-7) */}
             <div 
               className="grid gap-1" 
               style={{ 
                 gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                 gridTemplateRows: 'repeat(7, minmax(0, 1fr))'
               }}
             >
                {displayElements
                  .filter(e => !e.category.toLowerCase().includes('lanthanide') && !e.category.toLowerCase().includes('actinide'))
                  .map(el => {
                    const isFaded = search && !el.name.toLowerCase().includes(search.toLowerCase()) && 
                                             !el.symbol.toLowerCase().includes(search.toLowerCase()) && 
                                             el.atomicNumber.toString() !== search;
                    
                    return (
                      <div 
                        key={el.atomicNumber}
                        onClick={() => setSelectedElement(el)}
                        className={`
                          relative flex flex-col items-center justify-center p-1 
                          border rounded-sm cursor-pointer transition-all duration-200 h-16
                          ${getCategoryColor(el.category)}
                          ${isFaded ? 'opacity-10 grayscale' : 'hover:scale-110 hover:z-10 hover:shadow-lg opacity-90 hover:opacity-100'}
                        `}
                        style={{
                          gridColumn: el.group || 'auto',
                          gridRow: el.period
                        }}
                        title={el.name}
                      >
                        <span className="absolute top-0.5 left-1 text-[8px] font-mono opacity-80">{el.atomicNumber}</span>
                        <span className="font-bold text-lg leading-tight mt-1">{el.symbol}</span>
                        <span className="text-[8px] font-mono opacity-80 truncate w-full text-center">{el.atomicMass.toFixed(2)}</span>
                      </div>
                    );
                })}
             </div>

             {/* Lanthanides and Actinides */}
             <div className="flex flex-col gap-1 mt-4 ml-[16.6%]"> {/* Offset to align with group 3 */}
                {/* Lanthanides */}
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                  {displayElements
                    .filter(e => e.category.toLowerCase().includes('lanthanide'))
                    .map(el => {
                      const isFaded = search && !el.name.toLowerCase().includes(search.toLowerCase()) && 
                                              !el.symbol.toLowerCase().includes(search.toLowerCase()) && 
                                              el.atomicNumber.toString() !== search;
                      
                      return (
                        <div 
                          key={el.atomicNumber}
                          onClick={() => setSelectedElement(el)}
                          className={`
                            relative flex flex-col items-center justify-center p-1 
                            border rounded-sm cursor-pointer transition-all duration-200 h-16
                            ${getCategoryColor(el.category)}
                            ${isFaded ? 'opacity-10 grayscale' : 'hover:scale-110 hover:z-10 hover:shadow-lg opacity-90 hover:opacity-100'}
                          `}
                          title={el.name}
                        >
                          <span className="absolute top-0.5 left-1 text-[8px] font-mono opacity-80">{el.atomicNumber}</span>
                          <span className="font-bold text-lg leading-tight mt-1">{el.symbol}</span>
                          <span className="text-[8px] font-mono opacity-80 truncate w-full text-center">{el.atomicMass.toFixed(2)}</span>
                        </div>
                      );
                  })}
                </div>
                {/* Actinides */}
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                  {displayElements
                    .filter(e => e.category.toLowerCase().includes('actinide'))
                    .map(el => {
                      const isFaded = search && !el.name.toLowerCase().includes(search.toLowerCase()) && 
                                              !el.symbol.toLowerCase().includes(search.toLowerCase()) && 
                                              el.atomicNumber.toString() !== search;
                      
                      return (
                        <div 
                          key={el.atomicNumber}
                          onClick={() => setSelectedElement(el)}
                          className={`
                            relative flex flex-col items-center justify-center p-1 
                            border rounded-sm cursor-pointer transition-all duration-200 h-16
                            ${getCategoryColor(el.category)}
                            ${isFaded ? 'opacity-10 grayscale' : 'hover:scale-110 hover:z-10 hover:shadow-lg opacity-90 hover:opacity-100'}
                          `}
                          title={el.name}
                        >
                          <span className="absolute top-0.5 left-1 text-[8px] font-mono opacity-80">{el.atomicNumber}</span>
                          <span className="font-bold text-lg leading-tight mt-1">{el.symbol}</span>
                          <span className="text-[8px] font-mono opacity-80 truncate w-full text-center">{el.atomicMass.toFixed(2)}</span>
                        </div>
                      );
                  })}
                </div>
             </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedElement} onOpenChange={(open) => !open && setSelectedElement(null)}>
        <DialogContent className="sm:max-w-md border-border/50 bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded flex items-center justify-center text-2xl font-bold border ${selectedElement ? getCategoryColor(selectedElement.category) : ''}`}>
                {selectedElement?.symbol}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">{selectedElement?.name}</span>
                <span className="text-sm text-muted-foreground capitalize">{selectedElement?.category}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedElement && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Atomic Number</span>
                <p className="font-mono text-lg">{selectedElement.atomicNumber}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Atomic Mass</span>
                <p className="font-mono text-lg">{selectedElement.atomicMass}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Group / Period</span>
                <p className="font-mono text-lg">{selectedElement.group || '-'} / {selectedElement.period}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Phase</span>
                <p className="font-mono text-lg capitalize">{selectedElement.phase}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Electron Configuration</span>
                <p className="font-mono text-sm bg-secondary p-2 rounded border border-border/50">{selectedElement.electronConfiguration}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Oxidation States</span>
                <p className="font-mono text-sm">{selectedElement.oxidationStates || 'Unknown'}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Discovered By</span>
                <p className="text-sm">{selectedElement.discoveredBy || 'Unknown'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}