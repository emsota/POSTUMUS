import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fragment, DiagnosticResult } from '../types';
import { CharcoalDivider } from './CharcoalDivider';
import { MapPin, Compass, Plus, ShieldAlert, Clock, Eye, Info, CheckCircle, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  fragments: Fragment[];
  diagnostic: DiagnosticResult;
  onNavigate: (tab: 'profile' | 'scanner' | 'priority' | 'archive') => void;
  onSelectFragment: (fragment: Fragment) => void;
}

export function HomeView({ fragments, diagnostic, onNavigate, onSelectFragment }: HomeViewProps) {
  // Live dynamic clock representing real-time system monitoring of cognitive memory decay
  const [systime, setSystime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [integrityRate, setIntegrityRate] = useState(74.23);
  const [hoveredFragment, setHoveredFragment] = useState<Fragment | null>(null);
  const [selectedNode, setSelectedNode] = useState<Fragment | null>(
    fragments.find(f => f.status === 'Lost') || fragments[0] || null
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSystime(new Date().toLocaleTimeString('pt-BR'));
      // Slowly fluctuate decimal value for tactical realistic simulation
      setIntegrityRate((prev) => {
        const delta = (Math.random() - 0.5) * 0.02;
        return parseFloat(Math.min(100, Math.max(10, prev + delta)).toFixed(2));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync selectedNode if fragments change (e.g. when a new loss is added)
  useEffect(() => {
    const lostFrags = fragments.filter(f => f.status === 'Lost' && !f.isIncomplete);
    if (lostFrags.length > 0 && (!selectedNode || selectedNode.status !== 'Lost' || selectedNode.isIncomplete)) {
      setSelectedNode(lostFrags[0]);
    } else if (fragments.length > 0 && !selectedNode) {
      const activeFrags = fragments.filter(f => !f.isIncomplete);
      setSelectedNode(activeFrags[0] || fragments[0]);
    }
  }, [fragments]);

  // Seed-based stable coordinate coordinate calculations for each fragment
  const getFragmentCoords = (fragment: Fragment) => {
    // Pre-configured coordinates for the initial 6 fragments so they form a beautiful, spacious constellation
    if (fragment.id === '1') return { x: 28, y: 35 }; // Mid Left
    if (fragment.id === '2') return { x: 74, y: 22 }; // Top Right
    if (fragment.id === '3') return { x: 48, y: 68 }; // Center Bottom
    if (fragment.id === '4') return { x: 18, y: 58 }; // Far Mid Left
    if (fragment.id === '5') return { x: 82, y: 64 }; // Far Right Bottom
    if (fragment.id === '6') return { x: 55, y: 15 }; // Top Mid
    
    // Stable procedural hash generator for newly registered fragments
    let hash = 0;
    for (let i = 0; i < fragment.id.length; i++) {
      hash = fragment.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Constrain coordinates within 15% - 85% to stay gracefully inside the grid frame
    const x = 18 + Math.abs((hash * 23) % 64);
    const y = 18 + Math.abs((hash * 37) % 64);
    return { x, y };
  };

  const filteredFragments = fragments.filter(f => f.status === 'Lost' && !f.isIncomplete);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 pt-4 pb-28 text-white relative">
      
      {/* Corner Overlays representing scanning borders */}
      <div className="absolute top-12 left-2 w-3 h-3 border-t border-l border-white/20"></div>
      <div className="absolute top-12 right-2 w-3 h-3 border-t border-r border-white/20"></div>

      {/* Brand Header */}
      <header className="w-full mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-[#aaa] uppercase tracking-[0.2em] font-bold">INTEGRIDADE: {integrityRate}%</span>
          <h1 className="font-headline text-2xl tracking-[0.25em] font-extrabold text-white text-center ml-4">
            POSTUMUS
          </h1>
          <span className="font-mono text-[9px] text-[#aaa] uppercase tracking-wider font-bold">{systime} UTC</span>
        </div>
      </header>

      {/* PRIMARY OUTSTANDING ACTION TRIGGER - REGISTRAR PERDA */}
      <section className="bg-zinc-950 border border-white/15 p-5 mb-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Ambient decorative lighting */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="space-y-1.5 text-center sm:text-left z-10">
          <h3 className="font-headline text-base font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> QUE CAPACIDADE VOCÊ PERDEU?
          </h3>
          <p className="font-sans text-[12px] text-zinc-400 max-w-sm leading-relaxed">
            Sua vivência corporal no design não pode ser automatizada. Registre sua perda em nosso questionário íntimo de 5 sessões.
          </p>
        </div>

        {/* The requested registrar button */}
        <button
          onClick={() => onNavigate('scanner')}
          className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-mono text-[10.5px] font-black uppercase tracking-widest px-5.5 py-4 flex items-center justify-center gap-2 group transition-all duration-300 ring-2 ring-white/10 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.07)]"
        >
          <Plus className="w-4 h-4 translate-y-[-0.5px] group-hover:rotate-90 transition-transform duration-300" />
          REGISTRAR MINHA PERDA
        </button>
      </section>

      {/* MAPA DE PERDAS (THE ABSOLUTE HERO SHUTTLE / MAIN HIGHLIGHT) */}
      <section className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 px-1">
          <div>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-zinc-400 font-extrabold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-white animate-pulse" /> MAPA DE COGNISSÃO EM DECLÍNIO // CONSTELAÇÃO
            </span>
          </div>


        </div>

        {/* Dynamic Spatial Radar Grid */}
        <div className="relative w-full h-[320px] sm:h-[380px] bg-zinc-950 border border-white/10 overflow-hidden flex flex-col justify-between">
          {/* Grid lines and coordinate markers */}
          <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
            {/* Fine Grid Layout */}
            <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
            {/* Radar Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dotted border-white" />
          </div>



          {/* SVG Constellation lines connecting near nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
            {filteredFragments.map((fragA, indexA) => {
              const coordsA = getFragmentCoords(fragA);
              return filteredFragments.slice(indexA + 1).map((fragB) => {
                const coordsB = getFragmentCoords(fragB);
                // Calculate distance between points
                const dist = Math.hypot(coordsA.x - coordsB.x, coordsA.y - coordsB.y);
                // Draw line if points are reasonably close to represent neural linkages
                if (dist < 45) {
                  return (
                    <line
                      key={`${fragA.id}-${fragB.id}`}
                      x1={`${coordsA.x}%`}
                      y1={`${coordsA.y}%`}
                      x2={`${coordsB.x}%`}
                      y2={`${coordsB.y}%`}
                      className="stroke-zinc-600 stroke-[1] stroke-dasharray-[3,3]"
                    />
                  );
                }
                return null;
              });
            })}
          </svg>

          {/* Dynamic Radar Sweep effect */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"
          />

          {/* Interactive Nodes */}
          <div className="absolute inset-0 z-20">
            {filteredFragments.map((frag) => {
              const { x, y } = getFragmentCoords(frag);
              const isSelected = selectedNode?.id === frag.id;
              const isHovered = hoveredFragment?.id === frag.id;

              // Color classes depending on status
              const statusColorClass = 
                frag.status === 'Archived' ? 'bg-zinc-300 border-zinc-100' :
                frag.status === 'Rescuing' ? 'bg-zinc-400 border-zinc-250 animate-pulse' :
                'bg-red-500 border-red-300';

              const glowColorClass =
                frag.status === 'Archived' ? 'bg-white/20' :
                frag.status === 'Rescuing' ? 'bg-zinc-100/30' :
                'bg-red-500/40';

              return (
                <div
                  key={frag.id}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  onClick={() => setSelectedNode(frag)}
                  onMouseEnter={() => setHoveredFragment(frag)}
                  onMouseLeave={() => setHoveredFragment(null)}
                >
                  {/* Glowing background ring */}
                  <div className={`absolute -inset-3.5 rounded-full filter blur-md transition-all duration-300 ${
                    isSelected ? 'opacity-80 scale-125' : isHovered ? 'opacity-50 scale-110' : 'opacity-0 scale-90'
                  } ${glowColorClass}`} />

                  {/* Multiple Concentric ripples for "Rescuing" state */}
                  {frag.status === 'Rescuing' && (
                    <div className="absolute -inset-3 border border-white/30 rounded-full animate-ping opacity-20 pointer-events-none" />
                  )}

                  {/* Anchor Point Point node */}
                  <div className={`w-3.5 h-3.5 rounded-none border-[1.5px] transform rotate-45 transition-all duration-300 ${statusColorClass} ${
                    isSelected ? 'scale-125 border-white ring-2 ring-white/10' : 'hover:scale-110'
                  }`} />


                </div>
              );
            })}
          </div>


        </div>

        {/* Selected Loss Detail Panel (Card display directly below map making it high priority) */}
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <div className="space-y-4">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="w-full bg-[#0a0a0a] border border-white/10 p-5 flex flex-col md:flex-row gap-5 justify-between relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[8px] text-zinc-500">
                  <span>COORD X:{getFragmentCoords(selectedNode).x} Y:{getFragmentCoords(selectedNode).y}</span>
                </div>

                {/* Photo preview of loss */}
                <div className="w-full md:w-36 h-28 bg-zinc-950 border border-white/10 overflow-hidden shrink-0 relative">
                  <img 
                    src={selectedNode.imageUrl} 
                    className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700" 
                    alt="" 
                  />
                  <div className="absolute bottom-1 right-1 px-1 bg-black/85 font-mono text-[7px] text-zinc-400 tracking-wider">
                    PRÉVIA_IMAGEM
                  </div>
                </div>

                {/* Loss Content summary */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-[#999] uppercase tracking-widest font-bold">
                        {selectedNode.skillName}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-mono font-extrabold uppercase border ${
                        selectedNode.status === 'Archived' ? 'bg-zinc-900 border-zinc-700 text-zinc-400' :
                        selectedNode.status === 'Rescuing' ? 'border-zinc-400 text-zinc-200' : 'border-red-950/40 text-red-400 bg-red-950/20'
                      }`}>
                        {selectedNode.status === 'Archived' ? 'SALVA' : selectedNode.status === 'Rescuing' ? 'RESGATANDO' : 'PERDIDA'}
                      </span>
                    </div>

                    <h3 className="font-headline text-lg font-bold text-white mt-1 group-hover:text-zinc-100 uppercase tracking-tight">
                      {selectedNode.title}
                    </h3>
                    
                    {/* Shows newly typed descriptionText or fallback legadoContent */}
                    <p className="font-sans text-[12px] text-zinc-400 leading-relaxed mt-2.5 line-clamp-3 italic">
                      "{selectedNode.description || selectedNode.legadoContent}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5 mt-4">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[9px] text-zinc-500">
                        REGISTRADO EM: {selectedNode.dateLost || '---'}
                      </span>
                    </div>
                    
                    {/* Trigger to see complete expanded legacy vault detail */}
                    <button
                      onClick={() => onSelectFragment(selectedNode)}
                      className="font-mono text-[9.5px] uppercase tracking-wider font-extrabold text-white flex items-center gap-1 hover:underline cursor-pointer group-hover:text-neutral-200 transition-colors"
                    >
                      Examinar Testemunho Completo <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* LIVE COMMUNITY FEED MODULE (Visual feed listing of other registered losses) */}
              <div className="border border-white/5 bg-zinc-950/20 p-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-zinc-400 font-extrabold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-400 animate-ping rounded-full inline-block" />
                    FEED DA COMUNIDADE // REGISTROS COLETIVOS RECENTES
                  </span>
                  <span className="font-mono text-[8.5px] text-zinc-500">CLIQUE PARA FOCAR NO MAPA</span>
                </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {filteredFragments.map((frag) => {
                    const isFocused = selectedNode.id === frag.id;

                    return (
                      <div
                        key={frag.id}
                        onClick={() => setSelectedNode(frag)}
                        className={`p-2.5 transition-all text-left cursor-pointer border ${
                          isFocused 
                            ? 'bg-zinc-950 border-white/20' 
                            : 'bg-[#060606] border-white/5 hover:border-white/10 hover:bg-zinc-950/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">{frag.skillName}</span>
                        </div>
                        <h4 className={`text-xs font-bold leading-tight uppercase tracking-tight mt-0.5 ${isFocused ? 'text-white' : 'text-zinc-300'}`}>
                          {frag.title}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-[8px] font-mono text-zinc-500">
                          <span>REGISTRO ANÔNIMO</span>
                          <span className="opacity-60">COORD X:{getFragmentCoords(frag).x} Y:{getFragmentCoords(frag).y}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-[#0a0a0a] border border-dashed border-white/10 p-8 text-center">
              <p className="font-mono text-xs text-zinc-500 uppercase">Selecione uma perda registrada no mapa para visualizar os detalhes</p>
            </div>
          )}
        </AnimatePresence>
      </section>


      {/* Footer warning message */}
      <footer className="border-t border-white/5 pt-6 mt-10 text-center">
        <p className="font-mono text-[9px] text-zinc-600 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
          Postumus do design ao fazer corporal. O toque físico não pode ser automatizado. Coordenadas sob protocolo de sigilo íntimo.
        </p>
      </footer>

    </div>
  );
}
