import React from 'react';
import { motion } from 'motion/react';
import { Fragment } from '../types';
import { CharcoalDivider } from './CharcoalDivider';

interface ProfileViewProps {
  fragments: Fragment[];
  onSelectFragment: (fragment: Fragment) => void;
  onNavigateToSection: (section: 'scanner' | 'priority' | 'archive') => void;
}

export function ProfileView({ fragments, onSelectFragment, onNavigateToSection }: ProfileViewProps) {
  // Compute metrics from fragments list
  const totalLosses = fragments.length + 9; // Adding base placeholder offset for realism
  const activeTrails = fragments.filter(f => f.status === 'Rescuing').length;
  const capabilitiesRescued = fragments.filter(f => f.status === 'Archived').length + 7;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 pt-4 pb-28 text-white relative">
      
      {/* Top Header */}
      <header className="w-full mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center justify-center">
          <h1 className="font-headline text-xl tracking-[0.2em] font-extrabold text-white text-center">
            POSTUMUS
          </h1>
        </div>
      </header>

      {/* User Info Section */}
      <section className="flex flex-col mb-8 relative">
        {/* Profile portrait frame */}
        <div className="w-24 h-24 bg-surface-container-low border border-white/20 flex items-center justify-center mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 halftone-bg group-hover:opacity-30 transition-opacity pointer-events-none"></div>
          <img 
            alt="Portrait" 
            className="w-full h-full object-cover filter grayscale contrast-125 opacity-80" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr37zwNK_KoTugGd839393PanUQc7ZOxltTyKRYKketdURLysmY1er8ec67iFbCt1ThjoviMoA7i4gssXO69oX785NpHGKk2kDpywbZendMPPrTJ7BywDioWgnuy_Ih_QPZv7LPWfGDL7M77FyMNaEgbchXXKEErQwnEFcdhXsrAp6-knuA9q1Bj5iYBPyQHoF6X6o3KglA4TwVS4VVFSOXUlr8q5oLdPllbcvurhAbBkVlkaIzQWNojcBkOhVTYfV3DYtdThQhA"
          />
        </div>

        <h2 className="font-headline text-4xl font-extrabold mb-2 tracking-tighter text-white">
          A. Walker
        </h2>
        
        <p className="font-sans text-[14px] text-on-surface-variant max-w-[85%] leading-relaxed">
          Arquivando os fragmentos. Reconstruindo através do vazio. 4 épocas completas.
        </p>
      </section>

      {/* Charcoal Divider */}
      <CharcoalDivider width="w-[75%]" className="my-6" />

      {/* Stats Grid */}
      <section className="grid grid-cols-3 gap-4 my-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigateToSection('archive')}
          className="flex flex-col group cursor-pointer border-l-2 border-white/10 pl-3 py-1 hover:border-white transition-colors"
        >
          <span className="font-sans text-[10px] text-outline uppercase tracking-widest leading-snug font-semibold block group-hover:text-white transition-colors">
            PERDAS ARQUIVADAS
          </span>
          <span className="font-headline text-3xl font-extrabold mt-1 text-white">
            {totalLosses}
          </span>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigateToSection('priority')}
          className="flex flex-col group cursor-pointer border-l-2 border-white/10 pl-3 py-1 hover:border-white transition-colors"
        >
          <span className="font-sans text-[10px] text-outline uppercase tracking-widest leading-snug font-semibold block group-hover:text-white transition-colors">
            TRILHAS ATIVAS
          </span>
          <span className="font-headline text-3xl font-extrabold mt-1 text-white">
            {activeTrails}
          </span>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex flex-col group cursor-pointer border-l-2 border-white/10 pl-3 py-1 hover:border-white transition-colors"
        >
          <span className="font-sans text-[10px] text-outline uppercase tracking-widest leading-snug font-semibold block group-hover:text-white transition-colors">
            CAPACIDADES RESGATADAS
          </span>
          <span className="font-headline text-3xl font-extrabold mt-1 text-white">
            {capabilitiesRescued}
          </span>
        </motion.div>
      </section>

      {/* Charcoal Divider */}
      <div className="flex justify-end">
        <CharcoalDivider width="w-[60%]" className="my-6 ml-auto" />
      </div>

      {/* Memory Vault / Recent Activity */}
      <section className="flex flex-col my-8">
        <h3 className="font-sans text-[11px] font-semibold text-white uppercase tracking-[0.2em] mb-4">
          COFRE DE MEMÓRIAS
        </h3>

        <div className="flex flex-col space-y-3">
          {fragments.map((fragment, idx) => {
            // Distinct widths matching the sketchy asymmetric design
            const widths = ["w-[90%]", "w-[85%] ml-auto", "w-[95%]"];
            const currentWidth = widths[idx % widths.length];

            return (
              <motion.div
                key={fragment.id}
                whileHover={{ x: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                onClick={() => onSelectFragment(fragment)}
                className={`py-3 px-2 border-b border-white/10 flex items-center justify-between group cursor-pointer transition-all duration-300 ${currentWidth}`}
              >
                <div className="flex items-center space-x-4">
                  <span className="font-headline text-lg text-white group-hover:text-[#ffffff] group-hover:pl-2 transition-all duration-300">
                    {fragment.title}
                  </span>
                </div>
                
                {fragment.status === 'Archived' && (
                  <div className="px-2 py-0.5 bg-surface-container border border-white/20">
                    <span className="font-mono text-[10px] text-on-surface-variant font-medium">Arquivado</span>
                  </div>
                )}
                {fragment.status === 'Rescuing' && (
                  <div className="px-2 py-0.5 border border-white text-white bg-transparent">
                    <span className="font-mono text-[10px] font-bold">Resgatando</span>
                  </div>
                )}
                {fragment.status === 'Lost' && (
                  <div className="px-2 py-0.5 bg-transparent border border-white/10 text-on-surface-variant">
                    <span className="font-mono text-[10px]">Perdido</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-8 flex">
          <button 
            onClick={() => onNavigateToSection('priority')}
            className="flex items-center space-x-2 text-on-surface-variant hover:text-white transition-colors border-b border-on-surface-variant hover:border-white pb-1 group focus:outline-none cursor-pointer"
          >
            <span className="font-mono text-[11px] tracking-wider font-semibold">VER TODOS OS FRAGEMENTOS</span>
            <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </section>

      {/* Embedded Ambient Technical Indicator */}
      <div className="text-center text-[10px] font-mono text-outline opacity-30 mt-16 pointer-events-none">
        A MEMÓRIA DO PÓSTUMO DECAI CONSTANTEMENTE. CAPTURE SUAS TRILHAS DE RESGATE IMEDIATAMENTE.
      </div>
    </div>
  );
}
