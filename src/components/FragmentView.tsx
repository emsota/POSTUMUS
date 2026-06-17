import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fragment } from '../types';
import { CharcoalDivider } from './CharcoalDivider';

interface FragmentViewProps {
  fragment: Fragment;
  onBack: () => void;
}

export function FragmentView({ fragment, onBack }: FragmentViewProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  // States for "Hold to Reveal" gesture
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);

  const toggleTab = (tabName: string) => {
    setActiveTab(activeTab === tabName ? null : tabName);
  };

  // Hanlde hold trigger
  const startHolding = () => {
    if (isRevealed) return;
    setIsHolding(true);
  };

  const stopHolding = () => {
    setIsHolding(false);
  };

  useEffect(() => {
    if (isHolding) {
      holdIntervalRef.current = window.setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(holdIntervalRef.current!);
            setIsRevealed(true);
            setIsHolding(false);
            // Dynamic Web Audio hum sound on success
            playHumSuccess();
            return 100;
          }
          return prev + 4; // Faster transition (under 2 seconds overall)
        });
      }, 50);
    } else {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
      if (!isRevealed) {
        // Slowly decay back to 0
        holdIntervalRef.current = window.setInterval(() => {
          setHoldProgress((prev) => {
            if (prev <= 0) {
              clearInterval(holdIntervalRef.current!);
              return 0;
            }
            return prev - 8;
          });
        }, 30);
      }
    }

    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [isHolding, isRevealed]);

  // Audio synthesize feedback
  const playHumSuccess = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime); // low hum
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      // Ignored if browser blocks audio
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-24 text-white relative">
      {/* Back Button & Top Meta */}
      <div className="flex items-center justify-between py-4 mb-4 border-b border-white/10">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-on-surface-variant hover:text-white transition-colors cursor-pointer group"
          id="btn-back-fragment"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
          <span className="font-sans text-[13px] uppercase tracking-widest font-medium">Voltar</span>
        </button>
        <span className="font-headline text-[13px] tracking-[0.2em] uppercase font-bold text-white/40">POSTUMUS</span>
        <div className="w-8"></div>
      </div>

      {/* Media section */}
      <section className="mb-8">
        <CharcoalDivider width="w-1/4" className="my-2" />
        <h1 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tighter leading-none text-white my-3">
          {fragment.title}
        </h1>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="inline-flex items-center px-3 py-1 border border-white/30 text-white font-mono text-[10px] tracking-widest uppercase">
            {fragment.skillName}
          </div>
          {fragment.isIncomplete && (
            <div className="inline-flex items-center px-3 py-1 bg-red-950/40 text-red-400 border border-red-900/40 font-mono text-[10px] tracking-widest uppercase font-bold rounded-sm animate-pulse">
              Incompleto (Não Publicado)
            </div>
          )}
        </div>
        {fragment.description && (
          <p className="font-sans text-[13px] text-zinc-400 leading-relaxed mt-4 italic border-l border-white/20 pl-4">
            {fragment.description}
          </p>
        )}
      </section>

      {/* Grayscale noir illustration container */}
      <section className="w-full flex flex-col gap-2 relative mb-8">
        <div className="w-full h-64 sm:h-[350px] relative overflow-hidden bg-surface-container-low border border-white/10 group">
          <div className="absolute inset-0 halftone-bg opacity-30 pointer-events-none z-10"></div>
          <img 
            alt={fragment.title} 
            className="w-full h-full object-cover img-noir opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
            src={fragment.imageUrl}
          />
          <div className="absolute bottom-4 left-4 font-mono text-[10px] bg-black/80 px-3 py-1 border border-white/10 text-on-surface tracking-wider">
            FIG. 01 — EVIDÊNCIA DA PERDA
          </div>
        </div>
      </section>

      {/* Interactive Accordion Panels */}
      <section className="w-full flex flex-col space-y-4 border-t border-white/10 pt-4">
        
        {/* Accordion Item: Origem */}
        <div className="w-full border-b border-white/10 pb-4">
          <button 
            onClick={() => toggleTab('origem')}
            className="w-full text-left py-2 flex justify-between items-center group transition-colors focus:outline-none"
            id="acc-origem"
          >
            <div className="flex flex-col items-start">
              <span className="font-mono text-[10px] text-on-surface-variant block uppercase tracking-widest mb-1 opacity-70">
                {fragment.origemTitle}
              </span>
              <h3 className="font-sans text-[15px] text-white font-bold tracking-wider uppercase">Origem</h3>
            </div>
            <motion.span 
              animate={{ rotate: activeTab === 'origem' ? 45 : 0 }}
              className="material-symbols-outlined text-white text-lg"
            >
              add
            </motion.span>
          </button>
          
          <AnimatePresence initial={false}>
            {activeTab === 'origem' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-surface-container p-6 border border-white/10 mt-3">
                  <p className="font-mono text-[10px] text-on-surface-variant mb-3 uppercase tracking-wider block">
                    COMO VOCÊ APRENDEU ESSA CAPACIDADE? CONTE EM POUCAS PALAVRAS.
                  </p>
                  <p className="font-sans text-[14px] text-on-surface leading-relaxed whitespace-pre-line">
                    {fragment.origemContent}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item: Testemunho */}
        <div className="w-full border-b border-white/10 pb-4">
          <button 
            onClick={() => toggleTab('testemunho')}
            className="w-full text-left py-2 flex justify-between items-center group transition-colors focus:outline-none"
            id="acc-testemunho"
          >
            <div className="flex flex-col items-start">
              <span className="font-mono text-[10px] text-on-surface-variant block uppercase tracking-widest mb-1 opacity-70">
                {fragment.testemunhoTitle}
              </span>
              <h3 className="font-sans text-[15px] text-white font-bold tracking-wider uppercase">Testemunho</h3>
            </div>
            <motion.span 
              animate={{ rotate: activeTab === 'testemunho' ? 45 : 0 }}
              className="material-symbols-outlined text-white text-lg"
            >
              add
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {activeTab === 'testemunho' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-surface-container p-6 border border-white/10 mt-3">
                  <p className="font-mono text-[10px] text-on-surface-variant mb-3 uppercase tracking-wider block">
                    UM MOMENTO DE CONEXÃO REAL? INDIQUE UMA SITUAÇÃO EM QUE ISSO FEZ SENTIDO.
                  </p>
                  <p className="font-sans text-[14px] text-on-surface leading-relaxed whitespace-pre-line">
                    {fragment.testemunhoContent}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item: Ruptura */}
        <div className="w-full border-b border-white/10 pb-4">
          <button 
            onClick={() => toggleTab('ruptura')}
            className="w-full text-left py-2 flex justify-between items-center group transition-colors focus:outline-none"
            id="acc-ruptura"
          >
            <div className="flex flex-col items-start">
              <span className="font-mono text-[10px] text-on-surface-variant block uppercase tracking-widest mb-1 opacity-70">
                {fragment.rupturaTitle}
              </span>
              <h3 className="font-sans text-[15px] text-white font-bold tracking-wider uppercase">Ruptura</h3>
            </div>
            <motion.span 
              animate={{ rotate: activeTab === 'ruptura' ? 45 : 0 }}
              className="material-symbols-outlined text-white text-lg"
            >
              add
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {activeTab === 'ruptura' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-surface-container p-6 border border-white/10 mt-3">
                  <p className="font-mono text-[10px] text-on-surface-variant mb-3 uppercase tracking-wider block">
                    QUANDO O TRAÇO OU EXPERIMENTO SE PERDEU? RELEMBRE O MOMENTO EXATO.
                  </p>
                  <p className="font-sans text-[14px] text-on-surface leading-relaxed whitespace-pre-line">
                    {fragment.rupturaContent}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item: Legado (HOLD TO REVEAL) */}
        <div className="w-full border-b border-white/10 pb-4">
          <button 
            onClick={() => toggleTab('legado')}
            className="w-full text-left py-2 flex justify-between items-center group transition-colors focus:outline-none"
            id="acc-legado"
          >
            <div className="flex flex-col items-start">
              <span className="font-mono text-[10px] text-on-surface-variant block uppercase tracking-widest mb-1 opacity-70">
                {fragment.legadoTitle}
              </span>
              <h3 className="font-sans text-[15px] text-white font-bold tracking-wider uppercase font-semibold">Legado</h3>
            </div>
            <motion.span 
              animate={{ rotate: activeTab === 'legado' ? 45 : 0 }}
              className="material-symbols-outlined text-white text-lg"
            >
              add
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {activeTab === 'legado' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-surface-container p-6 border border-white/10 mt-3 flex flex-col items-center">
                  <span className="font-mono text-[10px] text-on-surface-variant mb-4 uppercase tracking-wider block font-bold text-center">
                    O QUE RESTA DO QUE FOI VIVO?
                  </span>

                  {/* Tactile interaction module */}
                  <div className="charcoal-border p-6 md:p-8 max-w-lg bg-black relative overflow-hidden group transition-all duration-500 w-full select-none">
                    
                    {/* Diagnostic Matrix Grid (Design Element) */}
                    <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none z-0"></div>
                    
                    <AnimatePresence>
                      {!isRevealed && (
                        <motion.div 
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-surface-container/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 border-2 border-double border-white/20"
                        >
                          {/* Hold Interaction Area */}
                          <div 
                            className="flex flex-col items-center justify-center cursor-pointer select-none w-full h-full text-center relative py-4"
                            onMouseDown={startHolding}
                            onMouseUp={stopHolding}
                            onMouseLeave={stopHolding}
                            onTouchStart={startHolding}
                            onTouchEnd={stopHolding}
                          >
                            {/* Radial Loading Indicator */}
                            <div className="relative w-16 h-16 flex items-center justify-center mb-3">
                              {/* progress ring outline */}
                              <svg className="absolute w-full h-full transform -rotate-90">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="26"
                                  stroke="rgba(255,255,255,0.1)"
                                  strokeWidth="2"
                                  fill="transparent"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="26"
                                  stroke="#ffffff"
                                  strokeWidth="3"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 26}`}
                                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - holdProgress / 100)}`}
                                  className="transition-all duration-75"
                                />
                              </svg>
                              <span className="material-symbols-outlined text-white text-2xl animate-pulse">
                                touch_app
                              </span>
                            </div>

                            <span className="font-sans text-[11px] tracking-widest text-white uppercase font-bold leading-relaxed">
                              {isHolding ? 'RESTRUTURANDO FRAGMENTO...' : 'SEGURE PARA REVELAR'}
                            </span>
                            <span className="font-mono text-[9px] text-white/50 uppercase mt-2">
                              {holdProgress}% COMPLETO
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Revealed Content */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isRevealed ? 1 : 0 }}
                      transition={{ duration: 0.8 }}
                      className="relative z-10 text-center"
                    >
                      <p className="font-headline text-[16px] sm:text-[18px] text-white italic leading-relaxed font-light">
                        "{fragment.legadoContent}"
                      </p>
                      
                      <div className="mt-4 flex justify-center">
                        <span className="px-2 py-0.5 bg-white text-black font-mono text-[9px] uppercase tracking-widest font-semibold">
                          FRAGMENTO RESGATADO
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>

      {/* Decorative Signature Grid */}
      <div className="w-full mt-12 flex justify-center">
        <CharcoalDivider width="w-1/2" className="opacity-10" />
      </div>
    </div>
  );
}
