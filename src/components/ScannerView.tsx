import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fragment } from '../types';
import { Smartphone, Upload } from 'lucide-react';

interface ScannerViewProps {
  onAddFragment: (newFragment: Fragment) => void;
  onCancel?: () => void;
}

export function ScannerView({ onAddFragment, onCancel }: ScannerViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'FOTO' | 'VÍDEO'>('FOTO');

  // Register Form States
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [origem, setOrigem] = useState('');
  const [testemunho, setTestemunho] = useState('');
  const [ruptura, setRuptura] = useState('');
  const [legado, setLegado] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [presetImage, setPresetImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAxH6ZfU2CfmLh9g-Sc1a2wASeNhg2WQ9JMnBsjA6J0vHmCDciN0R2ThAuoKrDt0VUs0aCDmPId4kHJ70gk0kuopmgECzQcPlu-3N2CxykhNm4P2DMOibBiZ0i-l7KDpL9ZMm5sx56Ujjdcq2TVeb7Y0kvpwQchywSH6B0zCnp2Tgx9TFQla-sjCH5mguJGU3eYxlQJey2LHo6G5adhyBsHuV6wjx19ClCZAQlxjaewirksDVUPSUGhBEk6Fyz4_siGjY3m3QiZ5A');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setUploadedImage(event.target.result);
          setPresetImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Multi-session steps / wizard state: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);

  // Presets of beautiful black & white grayscale images
  const presetImages = [
    { name: 'Void Reflection', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxH6ZfU2CfmLh9g-Sc1a2wASeNhg2WQ9JMnBsjA6J0vHmCDciN0R2ThAuoKrDt0VUs0aCDmPId4kHJ70gk0kuopmgECzQcPlu-3N2CxykhNm4P2DMOibBiZ0i-l7KDpL9ZMm5sx56Ujjdcq2TVeb7Y0kvpwQchywSH6B0zCnp2Tgx9TFQla-sjCH5mguJGU3eYxlQJey2LHo6G5adhyBsHuV6wjx19ClCZAQlxjaewirksDVUPSUGhBEk6Fyz4_siGjY3m3QiZ5A' },
    { name: 'Charcoal graphite sketch study', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNHGPHe0ZRSPc9ayYGHuKYGF2TiDYHWDRckUrhEX5DQIpnWAx9_noY-5h79LL7yOP4bw32kkSDEw0Xt2KG0khsLTwQLoa26hpYkl9FSQHa_guYFNk33oEgh9fiDWAKM3bRlbtsKXiRxDmgKIabHFzsguVHyF35GEB9K6_1DbRSgMfzNg-Z2zqY-3B_I2Pv6Qh3qSbciQAprRYTnqJr99trexw9tQ1bpchKtBwCkHSnAVqQCodO79FtWJ2u1K72XaRQu_ChX9e4dh_4' },
    { name: 'Broken Mirror', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mechanical Gears', url: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=600&q=80' }
  ];

  // Synthesize custom sound for camera shutter
  const playCaptureSnd = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // White noise for shutter snap
      const bufferSize = audioCtx.sampleRate * 0.15; // 150ms
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.14);

      noise.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();

      // Low pitch tone for feedback
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
      oscGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Ignored if browser blocks audio
    }
  };

  const handleCaptureClick = () => {
    playCaptureSnd();
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      setIsFormOpen(true);
    }, 1200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isAllFieldsFilled = 
      title.trim().length > 0 &&
      descriptionText.trim().length > 0 &&
      origem.trim().length > 0 &&
      testemunho.trim().length > 0 &&
      ruptura.trim().length > 0 &&
      legado.trim().length > 0;

    const finalTitle = title.trim() || 'Habilidade Sensorial';
    const finalDescription = descriptionText.trim() || 'Uma habilidade essencial que está sumindo diante do avanço das automações.';
    const finalTag = tag.trim().toUpperCase() || `LOST SKILL: ${finalTitle.toUpperCase()}`;

    const newFragment: Fragment = {
      id: Math.random().toString(36).substring(2, 9),
      title: finalTitle,
      skillName: finalTag,
      status: 'Lost',
      dateLost: new Date().toLocaleDateString('pt-BR'),
      imageUrl: presetImage,
      origemTitle: 'qual a raiz desta habilidade?',
      origemContent: origem.trim() || 'A semente original desta habilidade prática foi estabelecida através da experimentação física constante.',
      testemunhoTitle: 'um momento de conexão real?',
      testemunhoContent: testemunho.trim() || 'Uma lembrança significativa de um momento onde a autoria tátil foi de vital importância no ofício criativo.',
      rupturaTitle: 'fique de olho na ferramenta',
      rupturaContent: ruptura.trim() || 'Impactos sofridos pela transição automatizada e digitalização completa das ferramentas.',
      legadoTitle: 'o que resta do que foi vivo?',
      legadoContent: legado.trim() || 'Um remanescente expressivo de autoria que anseia por novas formas de reabilitação analógica.',
      description: finalDescription,
      isIncomplete: !isAllFieldsFilled
    };

    onAddFragment(newFragment);
    setIsFormOpen(false);
    setCurrentStep(1);

    // Reset Form
    setTitle('');
    setTag('');
    setDescriptionText('');
    setOrigem('');
    setTestemunho('');
    setRuptura('');
    setLegado('');
  };

  const isCurrentStepValid = () => {
    return true; // All steps optionally validated to allow free workflow navigation
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-white h-[calc(100vh-80px)] md:h-[calc(100vh-64px)] relative overflow-hidden bg-black flex flex-col items-center justify-center">
      
      {/* Global Noise/Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines z-10 mix-blend-overlay"></div>
      
      {/* Absolute Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 charcoal-corner-tl pointer-events-none z-0 opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 charcoal-corner-br pointer-events-none z-0 opacity-40"></div>

      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col justify-between items-center relative"
          >
            {/* Mirror / Camera Feed Container */}
            <div className="relative w-full flex-1 overflow-hidden group">
              
              {/* Feed Background (Dark, grainy silhouette placeholder) */}
              <div className="absolute inset-0 bg-surface-container-low mix-blend-luminosity grayscale opacity-60">
                <img 
                  alt="Silent void avatar scan" 
                  className="w-full h-full object-cover object-center filter contrast-[1.2] brightness-50 sepia-[0.1]" 
                  src={presetImage}
                />
              </div>

              {/* Scanning Laser Line */}
              <motion.div 
                animate={{
                  top: ['0%', '100%', '0%']
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute left-0 w-full h-[1.5px] bg-white/50 z-30 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              ></motion.div>

              {/* Biometric Tracers */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 mix-blend-screen z-20"></div>
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10 mix-blend-screen z-20"></div>

              {/* Center Biome Target Ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/20 z-20 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-28 h-28 rounded-full border border-white/5 border-dashed"
                ></motion.div>
              </div>

              {/* Dynamic Telemetry Crosshair markers */}
              <div className="absolute top-12 left-6 w-4 h-4 border-t border-l border-white/60 z-20"></div>
              <div className="absolute top-12 right-6 w-4 h-4 border-t border-r border-white/60 z-20"></div>
              <div className="absolute bottom-16 left-6 w-4 h-4 border-b border-l border-white/60 z-20"></div>
              <div className="absolute bottom-16 right-6 w-4 h-4 border-b border-r border-white/60 z-20"></div>

              {/* Technical readout text (tiny) */}
              <div className="absolute bottom-16 left-8 font-mono text-[9px] text-outline z-20 opacity-60 leading-relaxed">
                SYS.REQ // NULL<br />
                INIT: ARCHIVE
              </div>

              {/* Minimalist Overlay Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 px-6 w-full max-w-sm text-center mix-blend-difference pointer-events-none select-none">
                <h2 className="font-headline text-[32px] sm:text-4xl text-white tracking-tighter leading-none drop-shadow-md py-4 uppercase font-extrabold">
                  Você está aqui porque algo te substituiu
                </h2>
              </div>

              {/* Flash effect on capture */}
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white z-50"
                ></motion.div>
              )}
            </div>

            {/* Bottom Controls / Mode selection */}
            <div className="w-full bg-black/95 border-t border-white/10 p-4 flex flex-col items-center justify-end z-20">
              
              {/* Photo / Video Switch */}
              <div className="flex space-x-6 mb-4">
                <button 
                  onClick={() => setSelectedMode('FOTO')}
                  className={`font-mono text-[10px] uppercase font-bold tracking-widest transition-colors focus:outline-none cursor-pointer ${selectedMode === 'FOTO' ? 'text-white border-b border-white pb-0.5' : 'text-white/40 hover:text-white'}`}
                >
                  FOTO
                </button>
                <button 
                  onClick={() => setSelectedMode('VÍDEO')}
                  className={`font-mono text-[10px] uppercase font-bold tracking-widest transition-colors focus:outline-none cursor-pointer ${selectedMode === 'VÍDEO' ? 'text-white border-b border-white pb-0.5' : 'text-white/40 hover:text-white'}`}
                >
                  VÍDEO
                </button>
              </div>

              {/* Shutter Sensor Button */}
              <div className="relative w-20 h-20 flex items-center justify-center mb-4">
                {/* Outter Ring */}
                <span className="absolute inset-0 rounded-full border border-white/30"></span>
                <button 
                  onClick={handleCaptureClick}
                  disabled={isScanning}
                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center focus:outline-none hover:bg-white/90 active:scale-95 transition-all outline-none"
                  id="shutter-button"
                  title="Capturar evidência de perda"
                >
                  <span className="material-symbols-outlined text-black font-semibold text-2xl">
                    {isScanning ? 'sync' : 'photo_camera'}
                  </span>
                </button>
              </div>

              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/50">
                REGISTRE A EVIDÊNCIA DA PERDA
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="register-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full h-full overflow-y-auto px-6 py-6 flex flex-col justify-start bg-[#0a0a0a] z-30"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                ARQUIVAR NOVA PERDA // QUESTIONÁRIO
              </span>
              <button 
                onClick={() => { 
                  if (onCancel) {
                    onCancel();
                  } else {
                    setIsFormOpen(false); 
                    setCurrentStep(1); 
                  }
                }}
                className="text-white/50 hover:text-white cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Segmented Progress Tracker */}
            <div className="flex flex-col mb-5 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-zinc-500">
                <span className="uppercase text-white font-bold">Sessão {currentStep} de 5</span>
                <span className="uppercase tracking-[0.1em] text-zinc-400 font-bold">
                  {currentStep === 1 && '1. Perda'}
                  {currentStep === 2 && '2. Origem'}
                  {currentStep === 3 && '3. Testemunho'}
                  {currentStep === 4 && '4. Ruptura'}
                  {currentStep === 5 && '5. Legado'}
                </span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`h-0.5 flex-1 transition-all duration-300 ${
                      idx < currentStep 
                        ? 'bg-zinc-500' 
                        : idx === currentStep 
                          ? 'bg-white' 
                          : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between pb-10 space-y-5">
              
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block font-bold">
                          Dê um nome ou título curto para a habilidade:
                        </label>
                        <input 
                          type="text" 
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            setTag(`HABILIDADE PERDIDA: ${e.target.value.toUpperCase()}`);
                          }}
                          placeholder="EX: Desenho à mão, Protólise de Grid"
                          className="bg-zinc-950 border border-zinc-900 text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-white transition-all w-full placeholder:text-zinc-700 font-mono"
                        />
                        <span className="font-sans text-[10px] text-zinc-500 block leading-tight">
                          Este nome será exibido nos cartões de visualização rápida do Vault.
                        </span>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block font-bold">
                          Sessão 1 — Perda
                        </label>
                        <h2 className="font-headline text-[15px] sm:text-base font-extrabold tracking-tight text-white leading-relaxed">
                          Que capacidade ligada ao seu trabalho de design você sente que está perdendo ou já perdeu?
                        </h2>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed italic">
                          Pode ser algo técnico (desenho, tipografia) ou algo mais amplo, como tomar decisões, explorar alternativas, ouvir usuários, argumentar sobre suas escolhas. A primeira que vier à mente costuma ser a mais honesta.
                        </p>
                        <textarea 
                          value={descriptionText}
                          onChange={(e) => setDescriptionText(e.target.value)}
                          placeholder="O que está sumindo de seus processos ou sentimentos diários diante das ferramentas automatizadas?"
                          rows={4}
                          className="bg-zinc-950 border border-zinc-90 w-full border-zinc-900 text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-white transition-all placeholder:text-zinc-700 font-sans leading-relaxed min-h-[100px]"
                        />
                      </div>

                      {/* Image Preset selection (Moved from session 5 with added mobile upload support) */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <label className="font-mono text-[9px] text-zinc-500 uppercase block tracking-wider font-bold">
                          ESCOLHA UMA VISÃO DA PERDA TRACEJADA
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {presetImages.map((img) => (
                            <button
                              type="button"
                              key={img.name}
                              onClick={() => setPresetImage(img.url)}
                              className={`h-11 border ${presetImage === img.url ? 'border-white' : 'border-white/10 hover:border-white/20'} overflow-hidden focus:outline-none transition-all cursor-pointer`}
                              title={img.name}
                            >
                              <img src={img.url} className="w-full h-full object-cover filter grayscale" alt="" />
                            </button>
                          ))}
                          
                          {/* 5th element: Upload image from computer/mobile */}
                          <label 
                            className={`h-11 border ${presetImage === uploadedImage && uploadedImage ? 'border-white' : 'border-white/10 hover:border-white/25'} overflow-hidden focus:outline-none transition-all flex flex-col items-center justify-center bg-zinc-950/40 hover:bg-zinc-900 group cursor-pointer text-center px-1 relative`} 
                            title="Fazer upload do celular / Selecionar Imagem"
                          >
                            <input 
                              type="file" 
                              id="mobile-upload-input"
                              accept="image/*" 
                              onChange={handleFileChange} 
                              className="hidden" 
                            />
                            {uploadedImage ? (
                              <img src={uploadedImage} className="w-full h-full object-cover filter grayscale" alt="Uploaded device loss" />
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <Smartphone className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white mb-0.5 transition-colors" />
                                <span className="font-mono text-[7px] text-zinc-500 group-hover:text-zinc-300 uppercase tracking-tight block">Celular</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block font-bold">
                          Sessão 2 — Origem
                        </label>
                        <h2 className="font-headline text-[15px] sm:text-base font-extrabold tracking-tight text-white leading-relaxed">
                          Como você aprendeu essa habilidade? Conte em poucas palavras.
                        </h2>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed italic">
                          Pense na origem: uma pessoa, um lugar, uma necessidade. Não precisa ser uma história longa.
                        </p>
                        <textarea 
                          value={origem}
                          onChange={(e) => setOrigem(e.target.value)}
                          placeholder="Quem te passou essa tradição ou qual foi a necessidade técnica inicial?"
                          rows={5}
                          className="bg-zinc-950 border border-zinc-900 border-solid text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-white transition-all w-full placeholder:text-zinc-700 font-sans leading-relaxed min-h-[140px]"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block font-bold">
                          Sessão 3 — Testemunho
                        </label>
                        <h2 className="font-headline text-[15px] sm:text-base font-extrabold tracking-tight text-white leading-relaxed">
                          Lembre de uma situação — pode ser um trabalho, um projeto pessoal, uma troca com alguém, ou qualquer momento — em que essa capacidade foi importante de verdade.
                        </h2>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed italic">
                          O que você fez e quem estava envolvido? Não importa se foi algo informal ou profissional; importa que tenha sido significativo para você.
                        </p>
                        <textarea 
                          value={testemunho}
                          onChange={(e) => setTestemunho(e.target.value)}
                          placeholder="Uma data, uma memória tátil, um abraço ou crítica honesta no seu ofício..."
                          rows={5}
                          className="bg-zinc-950 border border-zinc-900 text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-white transition-all w-full placeholder:text-zinc-700 font-sans leading-relaxed min-h-[140px]"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block font-bold">
                          Sessão 4 — Ruptura
                        </label>
                        <h2 className="font-headline text-[15px] sm:text-base font-extrabold tracking-tight text-white leading-relaxed">
                          Com que ferramenta, tecnologia ou material você exercia essa habilidade? Quando foi a última vez que você a usou com segurança?
                        </h2>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed italic">
                          Ferramenta pode ser um software, um instrumento físico, um caderno, uma técnica. A data é aproximada — mês e ano, ou só o ano.
                        </p>
                        <textarea 
                          value={ruptura}
                          onChange={(e) => setRuptura(e.target.value)}
                          placeholder="EX: Caderno de rascunhos Canson, caneta nanquim calibrada. Outubro de 2022..."
                          rows={5}
                          className="bg-zinc-950 border border-zinc-900 text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-white transition-all w-full placeholder:text-zinc-700 font-sans leading-relaxed min-h-[140px]"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block font-bold">
                          Sessão 5 — Legado
                        </label>
                        <h2 className="font-headline text-[15px] sm:text-base font-extrabold tracking-tight text-white leading-relaxed">
                          O que essa capacidade representa para você hoje?
                        </h2>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed italic">
                          Feche os olhos por um instante, se quiser. Lembre de como era quando ela estava viva em você. Escreva o que vier — uma lembrança, um agradecimento, um lamento, uma frase solta. Ou nada. Este campo é só seu.
                        </p>
                        <textarea 
                          value={legado}
                          onChange={(e) => setLegado(e.target.value)}
                          placeholder="Escreva livremente seus medos ou conexões remanescentes..."
                          rows={4}
                          className="bg-zinc-950 border border-zinc-900 text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-white transition-all w-full placeholder:text-zinc-700 font-sans leading-relaxed min-h-[80px]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto min-h-[56px] text-xs gap-3">
                <button
                  type="button"
                  onClick={() => { 
                    if (onCancel) {
                      onCancel();
                    } else {
                      setIsFormOpen(false); 
                      setCurrentStep(1); 
                    }
                  }}
                  className="px-3.5 py-2 border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all font-mono text-[9.5px] uppercase tracking-widest cursor-pointer"
                >
                  Cancelar
                </button>

                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-3.5 py-2 border border-white/25 hover:border-white text-white transition-all font-mono text-[9.5px] uppercase tracking-widest cursor-pointer mr-1"
                    >
                      Voltar
                    </button>
                  )}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-white text-black hover:bg-neutral-200 transition-all font-mono text-[9.5px] uppercase tracking-widest font-black cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    >
                      Avançar
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-black hover:bg-neutral-200 transition-all font-mono text-[9.5px] uppercase tracking-widest font-black cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                    >
                      Autenticar no Vault
                    </button>
                  )}
                </div>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
