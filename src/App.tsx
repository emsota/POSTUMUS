import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fragment, DiagnosticResult } from './types';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { ScannerView } from './components/ScannerView';
import { PriorityView } from './components/PriorityView';
import { FragmentView } from './components/FragmentView';

// Initial state data representing the foundational fragments of creative loss in the community
const INITIAL_FRAGMENTS: Fragment[] = [
  {
    id: '1',
    title: 'Desenho à mão',
    skillName: 'HABILIDADE PERDIDA: DESENHO À MÃO LIVRE',
    status: 'Lost',
    dateLost: '12/03/2021',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNHGPHe0ZRSPc9ayYGHuKYGF2TiDYHWDRckUrhEX5DQIpnWAx9_noY-5h79LL7yOP4bw32kkSDEw0Xt2KG0khsLTwQLoa26hpYkl9FSQHa_guYFNk33oEgh9fiDWAKM3bRlbtsKXiRxDmgKIabHFzsguVHyF35GEB9K6_1DbRSgMfzNg-Z2zqY-3B_I2Pv6Qh3qSbciQAprRYTnqJr99trexw9tQ1bpchKtBwCkHSnAVqQCodO79FtWJ2u1K72XaRQu_ChX9e4dh_4',
    origemTitle: 'QUAL A RAIZ DESTA HABILIDADE?',
    origemContent: 'Aprendi com meu avô, desenhista técnico aposentado. Ele me sentava na mesa da cozinha com papel manteiga e me ensinava a traçar linhas sem régua, só com o pulso firme. Na faculdade, uma professora me devolveu essa memória e disse que desenhar não era copiar o mundo, era pensar com a mão.',
    testemunhoTitle: 'UM MOMENTO DE CONEXÃO REAL?',
    testemunhoContent: `Foi num projeto pequeno para uma livraria de bairro. O cliente, seu Antônio, não entendia nada de briefing. Sentei no balcão, peguei um guardanapo e desenhei o logotipo enquanto ele falava. Ele olhou o guardanapo, bateu a mão no balcão e disse: 'É isso, menina. Agora eu vi.' A dona, o filho e um garçom se juntaram para olhar. Foi a última vez que senti que meu desenho servia para traduzir o que alguém sentia, não só para decorar uma tela.`,
    rupturaTitle: 'QUANDO O TRAÇO SE PERDEU?',
    rupturaContent: 'Lápis preto 6B (aquele macio, que suja a lateral da mão) e papel opaline 180g. A última vez que desenhei com segurança foi em março de 2021, num sketchbook que ainda tenho, mas não abro mais.',
    legadoTitle: 'O QUE RESTA DO QUE FOI VIVO?',
    legadoContent: 'É uma parte de mi que está em coma. Quando desenhava, o tempo desacelerava e eu me sentia inteira. Agora, tudo é rápido, gerado, limpo demais. Olho para um papel em branco e sinto medo. Tenho medo de não conseguir mais começar um traço, de descobrir que minha mão esqueceu. Mas ainda guardo aquele guardanapo do seu Antônio dobrado numa caixa de sapato. Não sei por quê. Talvez para provar que um dia eu soube.',
    author: 'Designer Anônimo',
    location: 'Recife, PE',
    likesCount: 42
  },
  {
    id: '2',
    title: 'Fotografia Analógica',
    skillName: 'HABILIDADE PERDIDA: FOTOGRAFIA ANALÓGICA',
    status: 'Lost',
    dateLost: '15/11/2020',
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80',
    origemTitle: 'QUAL A RAIZ DESTA HABILIDADE?',
    origemContent: 'Cresci em torno do estúdio do meu pai, cercado pelo odor penetrante de revelador e fixador de prata. Fotografar analógico era a busca deliberada pela imprecisão física e espera meditativa.',
    testemunhoTitle: 'UM MOMENTO DE CONEXÃO REAL?',
    testemunhoContent: 'Registrei o nascimento do meu afilhado em filme PB 120mm. Quando puxei o filme do tanque, a nitidez granulada de sua pequena mão emergindo da escuridão parecia milagre químico puro.',
    rupturaTitle: 'QUANDO O TRAÇO SE PERDEU?',
    rupturaContent: 'Por volta do fim de 2020. Os filmes Kodak Tri-X triplicaram de preço, as fendas mecânicas do meu laboratório vazaram luz, e migrar tudo para feeds digitais efêmeros acabou de vez com a prática física.',
    legadoTitle: 'O QUE RESTA DO QUE FOI VIVO?',
    legadoContent: 'Alquimia adormecida. Sentir a mola mecânica do obturador da Nikon FM2 engrenar na gaveta é um farol nostálgico de que fui alerta um dia.',
    author: 'Designer Anônimo',
    location: 'São Paulo, SP',
    likesCount: 28
  },
  {
    id: '3',
    title: 'Projeto Alpha Design',
    skillName: 'PROJETO PERDIDO: PLANTAS ARQUITETÔNICAS',
    status: 'Lost',
    dateLost: '10/06/2021',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=600&q=80',
    origemTitle: 'QUAL A RAIZ DESTA HABILIDADE?',
    origemContent: 'Nosso primeiro escritório, composto de cavaletes improvisados na sala de casa. Alpha representava nossa paixão por traçar plantas monumentais e detalhar cortes sem renders automáticos.',
    testemunhoTitle: 'UM MOMENTO DE CONEXÃO REAL?',
    testemunhoContent: 'Apresentar o plano preliminar do restauro de uma capela para os moradores idosos. Os croquis à lapiseira e carvão comunicaram o calor do projeto de forma visceral, muito além de simulações digitais frias.',
    rupturaTitle: 'QUANDO O TRAÇO SE PERDEU?',
    rupturaContent: 'No final do ciclo de 2021. Adotamos softwares procedurais que calculavam janelas sozinhos. Faturamos mais, contudo, a sensibilidade e a intenção estrutural desidrataram do meu peito.',
    legadoTitle: 'O QUE RESTA DO QUE FOI VIVO?',
    legadoContent: 'Cinzas digitais. O arquivo original foi marcado como corrompido nos servidores online após uma transição de servidores, restando apenas um esboço amassado.',
    author: 'Designer Anônimo',
    location: 'Curitiba, PR',
    likesCount: 19
  },
  {
    id: '4',
    title: 'Tipografia Manual',
    skillName: 'HABILIDADE PERDIDA: LETREIRAMENTO MANUAL E CARTAZES',
    status: 'Lost',
    dateLost: '29/08/2022',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
    origemTitle: 'COMO VOCÊ APRENDEU ESSA HABILIDADE?',
    origemContent: 'Iniciei na oficina de xilogravura do Centro de Artes. A pressão controlada da prensa manual me ensinou o peso real do espaço negativo e a nobreza de cada caractere talhado.',
    testemunhoTitle: 'UM MOMENTO EM QUE FOI IMPORTANTE DE VERDADE?',
    testemunhoContent: 'A confecção manual de cartazes para uma cooperativa de catadores locais. Os cartazes com letras fortes pintadas à trinchas dialogaram com a rua de uma forma que nenhuma fonte gratuita no Canva conseguiria imitar.',
    rupturaTitle: 'FERRAMENTA E ÚLTIMA PRÁTICA SEGURA?',
    rupturaContent: 'Uso de tinta guache preta, pincéis redondos de pelo de orelha de boi e rolos de linóleo. Minha última composição firme ocorreu em agosto de 2022, antes do estúdio digitalizar toda a produção.',
    legadoTitle: 'O QUE ESSA CAPACIDADE REPRESENTA HOJE?',
    legadoContent: 'Expressão ancestral soterrada por mockups pré-fabricados. Sinto falta da textura áspera sob a polpa dos dedos e do tempo de secagem.',
    author: 'Designer Anônimo',
    location: 'Belo Horizonte, MG',
    likesCount: 35
  },
  {
    id: '5',
    title: 'Olhar o Usuário nos Olhos',
    skillName: 'HABILIDADE PERDIDA: PESQUISA FÍSICA DE USUÁRIO',
    status: 'Lost',
    dateLost: '14/01/2023',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    origemTitle: 'COMO VOCÊ APRENDEU ESSA HABILIDADE?',
    origemContent: 'Orientado por uma socióloga incrível que me levou a calçadões públicos. Ela dizia que o comportamento humano real reside nos sapatos gastos, na pausa antes da frase e no suspiro espontâneo.',
    testemunhoTitle: 'UM MOMENTO EM QUE FOI IMPORTANTE DE VERDADE?',
    testemunhoContent: 'Passar uma tarde inteira conversando com cobradores de ônibus para reestruturar o sistema de recarga tarifário. Descobrir que suas dores eram térmicas e físicas, e não meras telas digitais mal desenhadas.',
    rupturaTitle: 'FERRAMENTA E ÚLTIMA PRÁTICA SEGURA?',
    rupturaContent: 'Prancheta plana de alumínio de 23cm, diário de campo manuscrito e câmera fotográfica de bolso. Migrei integralmente para questionários digitais anônimos em janeiro de 2023.',
    legadoTitle: 'O QUE ESSA CAPACIDADE REPRESENTA HOJE?',
    legadoContent: 'Uma frieza analítica que me incomoda. Hoje enxergamos dados quantitativos e percentuais abstratos, mas esquecemos o nome e o suor de quem opera nossos sistemas.',
    author: 'Designer Anônimo',
    location: 'Salvador, BA',
    likesCount: 51
  },
  {
    id: '6',
    title: 'Grelha e Grid Físico',
    skillName: 'HABILIDADE PERDIDA: DIAGRAMAÇÃO COGNITIVA TENSIONAL',
    status: 'Lost',
    dateLost: '05/03/2019',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    origemTitle: 'COMO VOCÊ APRENDEU ESSA HABILIDADE?',
    origemContent: 'Descobri estudando os mestres da Escola Suíça de design físico através de livros importados antigos, medindo suas margens manualmente com escalímetro e esquadros de acrílico.',
    testemunhoTitle: 'UM MOMENTO EM QUE FOI IMPORTANTE DE VERDADE?',
    testemunhoContent: 'O projeto gráfico de um livro de arquitetura de 300 páginas. Cada dupla de páginas foi desenhada no papel milimetrado para ajustar o peso gráfico das colunas e das fotografias de cimento.',
    rupturaTitle: 'FERRAMENTA E ÚLTIMA PRÁTICA SEGURA?',
    rupturaContent: 'Prancheta mecânica, lapiseira Pentel 0.3mm e réguas calibradas de aço flexível. Última vez usada em março de 2019 antes da transição da editora.',
    legadoTitle: 'O QUE ESSA CAPACIDADE REPRESENTA HOJE?',
    legadoContent: 'Uma nostalgia geométrica. O layout digitalizado é infinitamente ajustável porém carece do compromisso com as linhas inflexíveis das grelhas rígidas originais.',
    author: 'Designer Anônimo',
    location: 'Porto, PT',
    likesCount: 22
  }
];

export default function App() {
  const [fragments, setFragments] = useState<Fragment[]>(INITIAL_FRAGMENTS);
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'scanner' | 'priority' | 'archive'>('home');
  const [selectedFragment, setSelectedFragment] = useState<Fragment | null>(null);
  const [completenessFilter, setCompletenessFilter] = useState<'todos' | 'completos' | 'incompletos'>('todos');

  // Diagnostic State (calculated or default)
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult>({
    priority: 'CRUCIAL',
    description: 'Sua disponibilidade emocional e a relevância profissional indicam que este é o momento ideal para o resgate.',
    relevancia: { label: 'Relevância', value: 'Alto', percent: 90 },
    acessibilidade: { label: 'Acessibilidade', value: 'Médio', percent: 60 },
    disponibilidade: { label: 'Disponibilidade', value: 'Alto', percent: 85 }
  });

  const handleSelectFragment = (fragment: Fragment) => {
    setSelectedFragment(fragment);
  };

  const handleUpdateDiagnostic = (newMetrics: Partial<DiagnosticResult>) => {
    setDiagnostic(prev => ({
      ...prev,
      ...newMetrics
    }));
  };

  const handleAddFragment = (newFrag: Fragment) => {
    setFragments(prev => [newFrag, ...prev]);
    // Synthesize successful save notification
    playBellNotification();
    // Switch to archive to show the newly added fragment
    setActiveTab('archive');
  };

  const handleInitiateRescue = () => {
    // Modify any 'Lost' or selected fragment status to 'Rescuing'
    setFragments(prev => 
      prev.map(f => f.status === 'Lost' ? { ...f, status: 'Rescuing' } : f)
    );
    // Play sound feedback
    playRescueSuccess();
    // Navigate to profile dashboard
    setActiveTab('profile');
  };

  // Web Audio synthesizer definitions for responsive user feedback
  const playBellNotification = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // crystal high pitch bell
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.82);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.85);
    } catch (e) {}
  };

  const playRescueSuccess = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.35);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc2.start();
      osc.stop(audioCtx.currentTime + 0.7);
      osc2.stop(audioCtx.currentTime + 0.7);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-black text-white relative pb-[96px] md:pb-0 md:pl-[80px] overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* Ambient Visual Motif: Grain & Grid background */}
      <div className="noise-bg pointer-events-none absolute inset-0 z-0"></div>
      
      {/* Header and Content Canvas */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          {selectedFragment ? (
            <motion.div 
              key="fragment-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FragmentView 
                fragment={selectedFragment} 
                onBack={() => setSelectedFragment(null)} 
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              {activeTab === 'home' && (
                <HomeView 
                  fragments={fragments}
                  diagnostic={diagnostic}
                  onNavigate={(sec) => {
                    setActiveTab(sec);
                  }}
                  onSelectFragment={handleSelectFragment}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView 
                  fragments={fragments} 
                  onSelectFragment={handleSelectFragment}
                  onNavigateToSection={(sec) => {
                    setActiveTab(sec);
                  }}
                />
              )}

              {activeTab === 'scanner' && (
                <ScannerView 
                  onAddFragment={handleAddFragment} 
                  onCancel={() => setActiveTab('home')}
                />
              )}

              {activeTab === 'priority' && (
                <PriorityView 
                  fragments={fragments}
                  onTriggerRescue={handleInitiateRescue}
                  onUpdateMetrics={handleUpdateDiagnostic}
                  diagnostic={diagnostic}
                  onAddFragment={handleAddFragment}
                />
              )}

              {activeTab === 'archive' && (
                <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-28">
                  <header className="border-b border-white/10 pb-4 mb-6 flex justify-between items-center">
                    <h1 className="font-headline text-lg tracking-[0.2em] font-extrabold uppercase text-white">
                      ARQUIVO DE PERDAS
                    </h1>
                    
                    {/* Embedded call-to-scanner button so the scanner feature is seamlessly retainable! */}
                    <button 
                      onClick={() => setActiveTab('scanner')}
                      className="border border-white/20 hover:border-white px-3 py-1 flex items-center space-x-1.5 cursor-pointer text-xs font-mono uppercase bg-zinc-950 font-bold transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px]">add</span>
                      <span>Registrar Perda</span>
                    </button>
                  </header>

                  {/* Filtro de Completude de Perdas */}
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-2 py-2 border-b border-white/5">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                      Filtrar por completude:
                    </span>
                    <div className="flex bg-zinc-950 p-0.5 border border-white/10">
                      {(['todos', 'completos', 'incompletos'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setCompletenessFilter(opt)}
                          className={`px-3 py-1 text-[9px] font-mono uppercase transition-all focus:outline-none cursor-pointer ${
                            completenessFilter === opt
                              ? 'bg-white text-black font-extrabold'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {(() => {
                    const filteredArchive = fragments.filter((frag) => {
                      if (completenessFilter === 'completos') return !frag.isIncomplete;
                      if (completenessFilter === 'incompletos') return !!frag.isIncomplete;
                      return true;
                    });

                    if (filteredArchive.length === 0) {
                      return (
                        <div className="text-center py-12 border border-white/5 bg-[#121111]/30">
                          <p className="font-mono text-zinc-500 text-xs uppercase tracking-wider">
                            Nenhuma perda registrada nesta categoria ({completenessFilter})
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredArchive.map((frag) => (
                          <div 
                            key={frag.id}
                            onClick={() => handleSelectFragment(frag)}
                            className="bg-[#121111] border border-white/10 p-5 cursor-pointer hover:border-white transition-all group relative flex flex-col justify-between min-h-[160px]"
                          >
                            <div className="absolute top-0 right-0 p-2 opacity-15 group-hover:opacity-40 transition-opacity font-mono text-[9px] tracking-wider">
                              {frag.dateLost || 'RECUPERAÇÃO'}
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-mono text-[9px] text-outline uppercase block tracking-widest">{frag.skillName}</span>
                                {frag.isIncomplete && (
                                  <span className="px-1.5 py-0.5 font-mono text-[8px] bg-red-950/40 text-red-400 border border-red-900/40 uppercase tracking-widest font-black rounded-sm animate-pulse">
                                    Incompleto
                                  </span>
                                )}
                              </div>
                              <h3 className="font-headline text-lg font-bold text-white mt-0.5 group-hover:text-white">{frag.title}</h3>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                              <span className={`px-2 py-0.5 font-mono text-[9.5px] uppercase font-bold text-xs ${
                                frag.status === 'Archived' ? 'bg-zinc-850 text-zinc-300' :
                                frag.status === 'Rescuing' ? 'border border-white text-white' : 'bg-transparent text-white/50 border border-white/15'
                              }`}>
                                {frag.status === 'Archived' ? 'Arquivado' : frag.status === 'Rescuing' ? 'Resgatando' : 'Perdido'}
                              </span>
                              <span className="material-symbols-outlined text-[15px] opacity-0 group-hover:opacity-100 transition-opacity translate-x-3 group-hover:translate-x-0 transition-transform">
                                arrow_forward
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* BottomNavBar - Standard on Mobile (Hidden on md/Desktop) with EXACT items: Home, arquivos, trilhas, perfil */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-black/90 backdrop-blur-md border-t border-white/15">
        <div className="flex justify-around items-center h-[76px] px-2 w-full text-zinc-400">
          
          {/* Home tab */}
          <button 
            onClick={() => {
              setSelectedFragment(null);
              setActiveTab('home');
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-95 py-2 w-16 focus:outline-none ${activeTab === 'home' && !selectedFragment ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[22px] mb-1">
              home
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider">Início</span>
          </button>

          {/* Arquivos tab */}
          <button 
            onClick={() => {
              setSelectedFragment(null);
              setActiveTab('archive');
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-95 py-2 w-16 focus:outline-none ${activeTab === 'archive' && !selectedFragment ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[22px] mb-1">
              archive
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider">Arquivos</span>
          </button>

          {/* Trilhas tab */}
          <button 
            onClick={() => {
              setSelectedFragment(null);
              setActiveTab('priority');
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-95 py-2 w-16 focus:outline-none ${activeTab === 'priority' && !selectedFragment ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[22px] mb-1">
              alt_route
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider">Trilhas</span>
          </button>

          {/* Perfil tab */}
          <button 
            onClick={() => {
              setSelectedFragment(null);
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-95 py-2 w-16 focus:outline-none ${activeTab === 'profile' && !selectedFragment ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[22px] mb-1" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>
              person
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider">Perfil</span>
          </button>

        </div>
      </nav>

      {/* SideNav - Standard on Desktop (Hidden on Mobile) */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[80px] border-r border-white/10 bg-black/95 z-40 items-center py-8 gap-8">
        <div className="font-headline text-[11px] font-black uppercase text-center tracking-[0.1em] text-white bg-white/10 px-1 py-1 selection:bg-white selection:text-black">
          PÓSTUMO
        </div>

        <div className="flex flex-col gap-6 justify-center items-center flex-1">
          {/* Home side tab */}
          <button 
            onClick={() => {
              setSelectedFragment(null);
              setActiveTab('home');
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 p-2 w-[56px] h-[56px] relative rounded-none hover:bg-neutral-900 border ${activeTab === 'home' && !selectedFragment ? 'border-white border-dashed text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}
            title="Santuário inicial"
          >
            <span className="material-symbols-outlined text-[22px]">home</span>
          </button>

          {/* Archive side tab */}
          <button 
            onClick={() => {
              setSelectedFragment(null);
              setActiveTab('archive');
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 p-2 w-[56px] h-[56px] relative rounded-none hover:bg-neutral-900 border ${activeTab === 'archive' && !selectedFragment ? 'border-white border-dashed text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}
            title="Cofre de Arquivos"
          >
            <span className="material-symbols-outlined text-[22px]">archive</span>
          </button>

          {/* Trails side tab */}
          <button 
            onClick={() => {
              setSelectedFragment(null);
              setActiveTab('priority');
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 p-2 w-[56px] h-[56px] relative rounded-none hover:bg-neutral-900 border ${activeTab === 'priority' && !selectedFragment ? 'border-white border-dashed text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}
            title="Diretrizes de Trilhas"
          >
            <span className="material-symbols-outlined text-[22px]">alt_route</span>
          </button>

          {/* Profile side tab */}
          <button 
            onClick={() => {
              setSelectedFragment(null);
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 p-2 w-[56px] h-[56px] relative rounded-none hover:bg-neutral-900 border ${activeTab === 'profile' && !selectedFragment ? 'border-white border-dashed text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}
            title="Perfil do Usuário"
          >
            <span className="material-symbols-outlined text-[22px]" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
          </button>
        </div>

        <div className="font-mono text-[9px] text-[#555] select-none -rotate-90 origin-center truncate w-24">
          POSTUMUS V1.4
        </div>
      </nav>

    </div>
  );
}
