import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiagnosticResult, Metric, Fragment } from '../types';
import { CharcoalDivider } from './CharcoalDivider';
import { 
  Sparkles, 
  ShieldCheck, 
  Network, 
  GitFork, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  ListChecks, 
  Undo2, 
  CheckSquare, 
  Square,
  Activity,
  Compass,
  FileText,
  Hammer,
  RotateCcw,
  Plus
} from 'lucide-react';

interface PriorityViewProps {
  fragments: Fragment[];
  onTriggerRescue: () => void;
  onUpdateMetrics: (newMetrics: Partial<DiagnosticResult>) => void;
  diagnostic: DiagnosticResult;
  onAddFragment: (fragment: Fragment) => void;
}

interface DecisionNode {
  id: string;
  label: string;
  description: string;
  choices: { text: string; nextNodeId: string }[];
  advice?: string;
}

interface UserTrail {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  tasks: { id: string; text: string; completed: boolean }[];
  accentColor: string;
}

export function PriorityView({ fragments, onTriggerRescue, onUpdateMetrics, diagnostic, onAddFragment }: PriorityViewProps) {
  // Inline Priority Quiz Step State:
  // Starts with 0 (Step 1) of the priority quiz! Once completed, it becomes null.
  const [inlineQuizStep, setInlineQuizStep] = useState<number | null>(0);

  // Skill Mapping Form State
  const [isMappingActive, setIsMappingActive] = useState(false);
  const [mappedSkillName, setMappedSkillName] = useState('');
  
  // The four questions:
  const [mappedQuestion1, setMappedQuestion1] = useState('Design Gráfico e Visual\n(identidade, editorial, cartaz, tipografia, embalagem)');
  const [mappedQuestion2, setMappedQuestion2] = useState('A técnica — o domínio do gesto, da ferramenta, do método.');
  const [mappedQuestion3, setMappedQuestion3] = useState('Não consigo começar — a tela ou o papel em branco me paralisa.');
  const [mappedQuestion4, setMappedQuestion4] = useState('Conseguir produzir algo específico que hoje não faço (um cartaz, uma entrevista, um protótipo, uma animação curta).');

  const [mappingSuccess, setMappingSuccess] = useState(false);

  // Temporary buffers during current live priority evaluation run
  const [tempRelevancia, setTempRelevancia] = useState<Metric>({ label: 'Alto', value: 'Alto', percent: 90 });
  const [tempAcessibilidade, setTempAcessibilidade] = useState<Metric>({ label: 'Médio', value: 'Médio', percent: 60 });
  const [tempDisponibilidade, setTempDisponibilidade] = useState<Metric>({ label: 'Alto', value: 'Alto', percent: 85 });
  
  // Custom audio synth feedback
  const playAudioCue = (frequency = 280, duration = 0.15, type: 'sine' | 'triangle' | 'sawtooth' = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  // State: Decision Tree (Recursive advice browsing)
  const [currentDecisionId, setCurrentDecisionId] = useState<string>('root');
  
  const decisionTree: Record<string, DecisionNode> = {
    root: {
      id: 'root',
      label: 'Qual o maior divisor de foco na sua mesa de trabalho?',
      description: 'Escolha o ponto de atrito mental que interrompe seu tempo físico analógico.',
      choices: [
        { text: 'Atrito Material (Soterrado de fios, telas e sem espaço livre)', nextNodeId: 'material' },
        { text: 'Bloqueio de Cobrança (Urgência comercial de produzir rápido)', nextNodeId: 'guilt' }
      ]
    },
    material: {
      id: 'material',
      label: 'Sua bancada física tem algum papel visível sobre ela?',
      description: 'O cérebro busca atalhos eletrônicos se houver atrito na pegada física.',
      choices: [
        { text: 'Tem, mas me sinto intimidado pela página em branco', nextNodeId: 'clean_lack' },
        { text: 'Não tem, resta apenas teclado, mouse e monitores acesos', nextNodeId: 'cluttered' }
      ]
    },
    guilt: {
      id: 'guilt',
      label: 'De onde vem a ansiedade de interromper o desenho manual?',
      description: 'O algoritmo exige fluxo constante de dados, mas o gesto exige repouso.',
      choices: [
        { text: 'Sinto que desenhar ou fazer sem monetizar é tempo desperdiçado', nextNodeId: 'advice_market_guilt' },
        { text: 'Sinto que meu traço não está "perfeito" para salvar', nextNodeId: 'advice_impostor_guilt' }
      ]
    },
    clean_lack: {
      id: 'clean_lack',
      label: 'Desafio Proposto',
      description: 'A página em branco desafia a mente tática calculista.',
      choices: [{ text: 'Voltar ao início', nextNodeId: 'root' }],
      advice: 'EXERCÍCIO DE TRAÇADO CONTÍNUO: Pegue uma caneta barata. Trace 100 círculos seguidos sem retirar a ponta da folha por 5 minutos. Não se preocupe em criar uma forma simétrica. Relaxe o ombro.'
    },
    cluttered: {
      id: 'cluttered',
      label: 'Desafio Proposto',
      description: 'O excesso de estímulos eletrônicos na mesa desvia o tato.',
      choices: [{ text: 'Voltar ao início', nextNodeId: 'root' }],
      advice: 'DEPORTE COMPUTACIONAL: Desligue e guarde mouse e teclado na gaveta. Coloque uma única folha de papel branca sobre seu mesa física. Deixe o lápis repousar em cima dela por 15 minutos.'
    },
    advice_market_guilt: {
      id: 'advice_market_guilt',
      label: 'Desafio Proposto',
      description: 'A utilidade corporativa rotula o prazer primitivo como tempo perdido.',
      choices: [{ text: 'Voltar ao início', nextNodeId: 'root' }],
      advice: 'DESENHO ANTISSISTEMA: Use uma embalagem velha de entrega ou papel de pão rasgado. Use um material absolutamente precário no qual tentar desenhar comercialmente seria impossível.'
    },
    advice_impostor_guilt: {
      id: 'advice_impostor_guilt',
      label: 'Desafio Proposto',
      description: 'O toque tátil tenciona quando tentamos emular a precisão fria do vetor digital.',
      choices: [{ text: 'Voltar ao início', nextNodeId: 'root' }],
      advice: 'CONTORNO CEGO TOTAL: Fixe o olho em um pequeno objeto na sua mão (ex: uma chave). Sem olhar nenhuma vez para a folha branca de papel, trace o objeto usando movimentos lentos.'
    }
  };

  const currentNode = decisionTree[currentDecisionId] || decisionTree.root;

  const navigateDecisionNode = (id: string) => {
    playAudioCue(210, 0.15, 'triangle');
    setCurrentDecisionId(id);
  };

  // State: Interactive User Trails with Checklist Progress
  const [userTrails, setUserTrails] = useState<UserTrail[]>(() => {
    const saved = localStorage.getItem('postumus_user_trails');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing user trails from localStorage', e);
      }
    }
    return [
      {
        id: 'trail_movement',
        title: 'Controle Muscular Fino',
        subtitle: 'Alinhamento mecânico do pulso e do compasso corporal.',
        role: 'FISIOLÓGICO',
        accentColor: 'border-emerald-500 text-emerald-400',
        tasks: [
          { id: 'tm_1', text: 'Tracejar 40 retas paralelas sem réguas ou gabaritos', completed: true },
          { id: 'tm_2', text: 'Tensionar a pressão do grafite 2B ao 6B sobre o sulfite', completed: true },
          { id: 'tm_3', text: 'Passar 10 minutos focados exclusivamente no barulho da ponta', completed: false }
        ]
      },
      {
        id: 'trail_mental_decontamination',
        title: 'Amortecimento de Notificações',
        subtitle: 'Isolamento ativo contra ruídos corporativos virtuais.',
        role: 'COGNITIVO',
        accentColor: 'border-sky-500 text-sky-400',
        tasks: [
          { id: 'tmd_1', text: 'Desligar celular ou modo avião por no mínimo 60 minutos', completed: true },
          { id: 'tmd_2', text: 'Resgatar um rascunho de gaveta e escrever sua raiz de origem', completed: false }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('postumus_user_trails', JSON.stringify(userTrails));
  }, [userTrails]);

  const toggleTask = (trailId: string, taskId: string) => {
    playAudioCue(380, 0.1, 'sine');
    setUserTrails(prev => prev.map(trail => {
      if (trail.id === trailId) {
        return {
          ...trail,
          tasks: trail.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed };
            }
            return task;
          })
        };
      }
      return trail;
    }));
  };

  const getTrailProgress = (trail: UserTrail) => {
    const completedCount = trail.tasks.filter(t => t.completed).length;
    return Math.round((completedCount / trail.tasks.length) * 100);
  };

  // Handle choice submission of the Priority Quiz (Formulário Inicial) inline
  const handleQuizChoice = (step: number, percent: number, text: 'Alto' | 'Médio' | 'Baixo') => {
    playAudioCue(330 + step * 40, 0.12, 'sine');
    if (step === 0) {
      setTempRelevancia({ label: 'Relevância', value: text, percent });
      setInlineQuizStep(1);
    } else if (step === 1) {
      setTempAcessibilidade({ label: 'Acessibilidade', value: text, percent });
      setInlineQuizStep(2);
    } else if (step === 2) {
      const dispMetric = { label: 'Disponibilidade', value: text, percent };
      setTempDisponibilidade(dispMetric);
      
      // Compute priority outcome based on user results
      let calculatedPriority: 'CRUCIAL' | 'MODERADO' | 'LATENTE' = 'MODERADO';
      let calculatedDesc = 'Sua disponibilidade emocional e acessibilidade estão equilibradas ou ativas.';

      if (tempRelevancia.percent >= 80 && percent >= 80) {
        calculatedPriority = 'CRUCIAL';
        calculatedDesc = 'Alto sentimento de substituição mecânica aliado à urgência de retomar espaço analógico.';
      } else if (tempRelevancia.percent <= 40 && percent <= 40) {
        calculatedPriority = 'LATENTE';
        calculatedDesc = 'Sua prioridade permanece latente no momento. Configure uma nova trégua de ansiedade.';
      }

      onUpdateMetrics({
        priority: calculatedPriority,
        description: calculatedDesc,
        relevancia: tempRelevancia,
        acessibilidade: tempAcessibilidade,
        disponibilidade: dispMetric
      });

      // Generate a personalized trail based on these three answers!
      const priorityTrailId = `priority_trail_${Date.now()}`;
      const priorityTasks = [];

      // Task 1 based on Relevância (Step 1 choice)
      if (tempRelevancia.value === 'Alto') {
        priorityTasks.push({
          id: `${priorityTrailId}_rev_1`,
          text: 'Fazer rascunho livre de 5 minutos antes de ligar o monitor para resgatar a autoria tátil.',
          completed: false
        });
      } else {
        priorityTasks.push({
          id: `${priorityTrailId}_rev_1`,
          text: 'Efetuar rabiscos geométricos livres sem preocupação estética por 5 minutos.',
          completed: false
        });
      }

      // Task 2 based on Acessibilidade (Step 2 choice)
      if (tempAcessibilidade?.value === 'Baixo' || tempAcessibilidade?.value === 'Médio') {
        priorityTasks.push({
          id: `${priorityTrailId}_ac_1`,
          text: 'Limpar e organizar uma bancada ou mesa livre de 40cm x 40cm para operar papéis crus.',
          completed: false
        });
      } else {
        priorityTasks.push({
          id: `${priorityTrailId}_ac_1`,
          text: 'Organizar um estojo ou gaveta com lápis de gradação macia (2B-6B) para o seu dia a dia.',
          completed: false
        });
      }

      // Task 3 based on Disponibilidade (Step 3 choice)
      if (dispMetric.value === 'Baixo' || dispMetric.value === 'Médio') {
        priorityTasks.push({
          id: `${priorityTrailId}_disp_1`,
          text: 'Treino de Contorno Cego: Escolher um pequeno objeto da sua mesa e tracejá-lo sem olhar para o papel.',
          completed: false
        });
        priorityTasks.push({
          id: `${priorityTrailId}_disp_2`,
          text: 'Desenhar ou escrever sobre um papel rústico e descartável (ex: papel de pão ou embalagem) sem pressão de refinar.',
          completed: false
        });
      } else {
        priorityTasks.push({
          id: `${priorityTrailId}_disp_1`,
          text: 'Dedicatória Analógica: Tracejar 40 retas paralelas firmes com grafite para calibragem de pulso.',
          completed: false
        });
      }

      const newPriorityTrail: UserTrail = {
        id: priorityTrailId,
        title: `Trilha: Calibragem de Foco (${calculatedPriority})`,
        subtitle: `Diretrizes automáticas baseadas em sua autopercepção de espaço e atrito.`,
        role: 'DIAGNÓSTICO',
        accentColor: calculatedPriority === 'CRUCIAL' ? 'border-red-500 text-red-500' : 'border-zinc-500 text-zinc-400',
        tasks: priorityTasks
      };

      setUserTrails(prev => [newPriorityTrail, ...prev]);

      // Show results inside the cockpit container! (step null evaluates to showing results)
      setInlineQuizStep(null);
    }
  };

  const handleFinishMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mappedSkillName.trim()) return;

    playAudioCue(520, 0.35, 'triangle');
    
    // Create new custom initiated trail based on mapped form inputs!
    const newTrailId = `mapped_${Date.now()}`;
    const categoryLabel = mappedQuestion1;
    
    // Custom tasks calculated from user responses
    let customTask1 = "Exercício de abertura focado no ponto de bloqueio.";
    if (mappedQuestion3.includes("começar")) {
      customTask1 = "Ritual de Abertura: Riscados analógicos e livres por 5 minutos para afastar o medo do papel ou tela em branco.";
    } else if (mappedQuestion3.includes("meio")) {
      customTask1 = "Ritual de Sustentação: Divida em 3 micro-etapas e complete a primeira sem se cobrar em terminar tudo.";
    } else if (mappedQuestion3.includes("ruim")) {
      customTask1 = "Exercício de Tolerância extrema: Desenhe/escreva sem usar borracha ou Ctrl+Z; valorize o rascunho torto.";
    } else if (mappedQuestion3.includes("Evito")) {
      customTask1 = "Oficina em Silêncio: Desligue as telas digitais por 15 minutos e dedique-se apenas ao contato manual.";
    } else if (mappedQuestion3.includes("sentido")) {
      customTask1 = "Resgate de Alma: Escreva um manifesto manual de uma única linha explicando por que esse ofício importa para você.";
    }

    let customTask2 = "Treino tático diário focado em recuperar a essência.";
    if (mappedQuestion2.includes("técnica")) {
      customTask2 = "Refino Técnico: Pratique movimentos repetitivos de controle de pressão ou precisão por 10 minutos.";
    } else if (mappedQuestion2.includes("confiança")) {
      customTask2 = "Segurança Operacional: Realize um rabisco analógico que você intencionalmente não vai salvar ou postar.";
    } else if (mappedQuestion2.includes("fluência")) {
      customTask2 = "Fluxo Contínuo: Desenhe ou execute com rapidez proposital, sem interromper o ritmo até o cronômetro zerar.";
    } else if (mappedQuestion2.includes("autonomia")) {
      customTask2 = "Oficina Independente: Inicie a criação do absoluto zero, sem consultar assistentes ou referências automáticas.";
    } else if (mappedQuestion2.includes("identidade")) {
      customTask2 = "Assinatura Autoral: Exagere em algum traço ou escolha conceitual que represente o seu estilo único.";
    }

    let customTask3 = "Validação de progresso sintonizando a âncora.";
    if (mappedQuestion4.includes("específico")) {
      customTask3 = "Âncora Prática: Tente esboçar o rascunho de um projeto pequeno do início ao fim.";
    } else if (mappedQuestion4.includes("menos ansiedade")) {
      customTask3 = "Autoavaliação de Calma: Perceba a diminuição do peso mental e registre em uma nota física.";
    } else if (mappedQuestion4.includes("reconhecimento")) {
      customTask3 = "Avaliação Compartilhada: Apresente o rascunho ou resultado bruto para alguém do seu ofício.";
    } else if (mappedQuestion4.includes("esforço consciente")) {
      customTask3 = "Marca de Hábito: Repita o exercício no dia seguinte e marque o progresso sem peso.";
    } else if (mappedQuestion4.includes("Não preciso")) {
      customTask3 = "Tentativa Livre: Apenas marque como concluído se desfrutou do tempo sem nenhuma cobrança.";
    }

    const cleanCategoryText = categoryLabel.split('\n')[0].replace('e Visual', '').toUpperCase();

    const newTrail: UserTrail = {
      id: newTrailId,
      title: `Resgate de ${mappedSkillName}`,
      subtitle: `Foco: ${mappedQuestion2.split(' — ')[0]}. Bloqueio: ${mappedQuestion3.split(' — ')[0]}`,
      role: cleanCategoryText,
      accentColor: categoryLabel.includes('Visual') || categoryLabel.includes('Gráfico') ? 'border-emerald-500 text-emerald-400' :
                   categoryLabel.includes('UX/UI') || categoryLabel.includes('Produto') ? 'border-sky-500 text-sky-400' :
                   categoryLabel.includes('Pesquisa') || categoryLabel.includes('Estratégia') ? 'border-amber-500 text-amber-400' :
                   categoryLabel.includes('Serviço') || categoryLabel.includes('Inovação') ? 'border-purple-500 text-purple-400' :
                   categoryLabel.includes('Motion') || categoryLabel.includes('Animação') ? 'border-pink-500 text-pink-400' :
                   categoryLabel.includes('Instrucional') || categoryLabel.includes('Conteúdo') ? 'border-blue-500 text-blue-400' :
                   categoryLabel.includes('Direção') || categoryLabel.includes('Liderança') ? 'border-rose-500 text-rose-400' :
                   'border-zinc-500 text-zinc-400',
      tasks: [
        { id: `${newTrailId}_1`, text: customTask1, completed: false },
        { id: `${newTrailId}_2`, text: customTask2, completed: false },
        { id: `${newTrailId}_3`, text: customTask3, completed: false }
      ]
    };

    // Prepend trail to local list
    setUserTrails(prev => [newTrail, ...prev]);

    // Add a corresponding Fragment in App.tsx
    const newFrag: Fragment = {
      id: `frag_${Date.now()}`,
      title: mappedSkillName,
      status: 'Rescuing',
      dateLost: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      skillName: cleanCategoryText,
      origemTitle: 'RECONEXÃO COM CONTEXTO',
      origemContent: `Associação: ${categoryLabel}. Foco principal de recuperação tática armado: ${mappedQuestion2}`,
      testemunhoTitle: 'PONTO DE BLOQUEIO ATACADO',
      testemunhoContent: `Atribulado ou travado devido a: ${mappedQuestion3}`,
      rupturaTitle: 'MÉTRICA DE PERSISTÊNCIA (ÂNCORA)',
      rupturaContent: `Como o usuário reconhecerá o resgate: ${mappedQuestion4}`,
      legadoTitle: 'ESTÁGIO ATUAL DO REGISTRO',
      legadoContent: `Mapeado no Wizard de Habilidade. Trilha ativa iniciada para reabilitação do tato.`,
      imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80'
    };

    onAddFragment(newFrag);

    // Show inline success message
    setMappingSuccess(true);
    setMappedSkillName('');

    setTimeout(() => {
      setIsMappingActive(false);
      setMappingSuccess(false);
    }, 1000);
  };

  const handleGenerateTrailFromAdvice = (node: DecisionNode) => {
    if (!node.advice) return;
    playAudioCue(480, 0.25, 'triangle');

    const trailId = `decision_advice_${node.id}_${Date.now()}`;
    
    let tasks = [];
    if (node.id === 'clean_lack') {
      tasks = [
        { id: `${trailId}_1`, text: 'Tracejar 100 círculos seguidos sem tirar a ponta por 5 minutos.', completed: false },
        { id: `${trailId}_2`, text: 'Manter a caneta em movimento contínuo acalmando o pulso.', completed: false },
        { id: `${trailId}_3`, text: 'Guardar o papel desenhado em uma caixa livre.', completed: false }
      ];
    } else if (node.id === 'cluttered') {
      tasks = [
        { id: `${trailId}_1`, text: 'Desligar e guardar teclado e mouse na gaveta física.', completed: false },
        { id: `${trailId}_2`, text: 'Colocar uma única folha de papel branca na mesa.', completed: false },
        { id: `${trailId}_3`, text: 'Repousar o lápis e focar no espaço vazio por 15 minutos.', completed: false }
      ];
    } else if (node.id === 'advice_market_guilt') {
      tasks = [
        { id: `${trailId}_1`, text: 'Rasgar um pedaço rústico de papel de pão ou embalagem.', completed: false },
        { id: `${trailId}_2`, text: 'Desenhar ou riscar com total desapego comercial por 10 minutos.', completed: false },
        { id: `${trailId}_3`, text: 'Celebrar a imperfeição física do traço e a autoria rústica.', completed: false }
      ];
    } else if (node.id === 'advice_impostor_guilt') {
      tasks = [
        { id: `${trailId}_1`, text: 'Segurar um pequeno objeto (ex: chave) na mão não-dominante.', completed: false },
        { id: `${trailId}_2`, text: 'Desenhar os contornos do objeto lentamente no papel.', completed: false },
        { id: `${trailId}_3`, text: 'Manter os olhos no objeto sem olhar para a folha (Contorno Cego).', completed: false }
      ];
    } else {
      tasks = [
        { id: `${trailId}_1`, text: `Praticar recomendação: ${node.advice}`, completed: false }
      ];
    }

    const newTrail: UserTrail = {
      id: trailId,
      title: `Desafio: ${node.label.includes('?') ? 'Foco Analógico' : node.label}`,
      subtitle: `Tática de tomada de decisão para romper o atrito material/mental.`,
      role: 'TOMADA DE DECISÃO',
      accentColor: 'border-purple-500 text-purple-400',
      tasks: tasks
    };

    setUserTrails(prev => {
      // Avoid duplicate trails for the same advice node
      if (prev.some(t => t.id.startsWith(`decision_advice_${node.id}`))) {
        return prev;
      }
      return [newTrail, ...prev];
    });
    
    // Switch decision tree id back to root to finish
    setCurrentDecisionId('root');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 pt-4 pb-28 text-white relative">
      
      {/* Background Graphic Patterns */}
      <div className="absolute top-12 left-4 w-4 h-4 border-t border-l border-white/10 pointer-events-none" />
      <div className="absolute top-12 right-4 w-4 h-4 border-t border-r border-white/10 pointer-events-none" />

      {/* Title Header */}
      <header className="w-full mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">NÓ DE RECUPERAÇÃO</span>
          <h1 className="font-headline text-lg tracking-[0.25em] font-extrabold text-white text-center">
            DIRETRIZES DE TRILHAS
          </h1>
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wide">POSTUMUS_SEC</span>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* SEÇÃO PRINCIPAL: ÁRVORE DE DECISÕES DO FAZER                */}
      {/* ------------------------------------------------------------- */}
      <section className="mb-10 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-zinc-400" />
            <h3 className="font-sans text-[11px] font-semibold text-white uppercase tracking-[0.18em]">
              ÁRVORE DE DECISÕES DO FAZER
            </h3>
          </div>
          <span className="font-mono text-[9px] text-[#888] uppercase">COCKPIT ATIVO</span>
        </div>
        <p className="font-sans text-[12.5px] text-zinc-400 mb-6 leading-relaxed">
          Navegue pelas rotas de atrito e preencha as avaliações no painel abaixo para armar táticas de cura de ofício.
        </p>

        {/* CONTAINER MAIS POLIDO DO FLUXO (Formulário Inicial -> Resultado -> Mapeamento) */}
        <div className="bg-zinc-950 border border-white/10 p-5 md:p-6 relative overflow-hidden mb-8">
          
          {/* Diagnostic Monitor Top Bar Decorative Layout */}
          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-6 font-mono text-[9px]">
            <span className="text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-white animate-pulse rounded-full"></span>
              SISTEMA INTEGRADO DE AUTO-DIAGNÓSTICO
            </span>
            <span className="text-zinc-500">SYS_RUN: ATIVO</span>
          </div>

          <AnimatePresence mode="wait">
            {/* ETAPA A: INLINE QUIZ - FORMULÁRIO INICIAL DE PRIORIDADE */}
            {inlineQuizStep !== null && (
              <motion.div
                key="priority-quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest block mb-1">
                    FORMULÁRIO INICIAL DE PRIORIDADE // ETAPA {inlineQuizStep + 1} DE 3
                  </span>
                  <div className="w-32 h-[2px] bg-white/20 relative">
                    <div 
                      className="absolute left-0 top-0 h-full bg-white transition-all duration-300" 
                      style={{ width: `${((inlineQuizStep + 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {inlineQuizStep === 0 && (
                  <div className="space-y-4">
                    <h4 className="font-headline text-lg font-bold text-white uppercase leading-snug">
                      Como você percebe a substituição mecânica tátil no seu dia a dia profissional hoje?
                    </h4>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleQuizChoice(0, 95, 'Alto')}
                        className="w-full text-left p-4 border border-white/15 bg-zinc-950 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        A. Perda severa de autoria de ofício. Viciados na rapidez do iPad/vetores. (Alto)
                      </button>
                      <button 
                        onClick={() => handleQuizChoice(0, 60, 'Médio')}
                        className="w-full text-left p-4 border border-white/10 bg-zinc-950/40 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        B. Sentimento moderado, mas ainda sinto saudades da sujeira do lápis na mão. (Médio)
                      </button>
                      <button 
                        onClick={() => handleQuizChoice(0, 25, 'Baixo')}
                        className="w-full text-left p-4 border border-white/10 bg-zinc-950/20 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        C. Sem grande fardo profissional focado em interfaces. (Baixo)
                      </button>
                    </div>
                  </div>
                )}

                {inlineQuizStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="font-headline text-lg font-bold text-white uppercase leading-snug">
                      Qual o seu nível de facilidade mecânica para obter lápis, papéis ou resgates tátis agora?
                    </h4>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleQuizChoice(1, 95, 'Alto')}
                        className="w-full text-left p-4 border border-white/15 bg-zinc-950 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        A. Imediata. Tenho folhas brancas, grafites ou estiletes fáceis de gaveta. (Alto)
                      </button>
                      <button 
                        onClick={() => handleQuizChoice(1, 60, 'Médio')}
                        className="w-full text-left p-4 border border-white/10 bg-zinc-950/40 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        B. Requer reorganização ativa do meu espaço de trabalho físico. (Médio)
                      </button>
                      <button 
                        onClick={() => handleQuizChoice(1, 20, 'Baixo')}
                        className="w-full text-left p-4 border border-white/10 bg-zinc-950/20 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        C. Sem mesa, sem materiais de papel ou recursos neste momento. (Baixo)
                      </button>
                    </div>
                  </div>
                )}

                {inlineQuizStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="font-headline text-lg font-bold text-white uppercase leading-snug">
                      Você consegue desfrutar de 15 minutos em desconexão absoluta de telas digitais sem ansiedade?
                    </h4>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleQuizChoice(2, 90, 'Alto')}
                        className="w-full text-left p-4 border border-white/15 bg-zinc-950 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        A. Consigo de forma plena silenciar o fardo mercantil tático. (Alto)
                      </button>
                      <button 
                        onClick={() => handleQuizChoice(2, 55, 'Médio')}
                        className="w-full text-left p-4 border border-white/10 bg-zinc-950/40 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        B. Sinto culpa produtiva, sabendo que preciso postar ou criar interfaces eletrônicas. (Médio)
                      </button>
                      <button 
                        onClick={() => handleQuizChoice(2, 15, 'Baixo')}
                        className="w-full text-left p-4 border border-white/10 bg-zinc-950/20 hover:bg-zinc-900 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                      >
                        C. Nenhuma capacidade meditativa tátil por culpa rígida. (Baixo)
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ETAPA B: RESULTADO DO DIAGNÓSTICO + BOTÃO PARA MAPEAMENTO DE HABILIDADE E FORMULÁRIO */}
            {inlineQuizStep === null && !isMappingActive && (
              <motion.div
                key="diagnostic-result-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Result Block Header */}
                <div className="bg-white/5 border border-white/10 p-4 relative">
                  <span className="font-mono text-[9px] text-zinc-400 block uppercase tracking-wider">
                    RESULTADO DO DIAGNÓSTICO VIVO
                  </span>
                  <div className="flex justify-between items-baseline mt-2">
                    <h4 className="font-headline text-3xl font-black text-white tracking-tight uppercase">
                      PRIORIDADE: {diagnostic.priority}
                    </h4>
                    <span className="font-mono text-xs text-white/50">DADOS DE PERDA MENTAL</span>
                  </div>
                  <p className="font-sans text-[12px] text-zinc-300 mt-2 leading-relaxed">
                    {diagnostic.description}
                  </p>
                </div>

                {/* Vertical detailed bars */}
                <div className="space-y-3.5">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      <span>RELEVÂNCIA EMOCIONAL</span>
                      <span className="text-white">{diagnostic.relevancia.value} ({diagnostic.relevancia.percent}%)</span>
                    </div>
                    <div className="w-full h-[3px] bg-zinc-800">
                      <div className="h-full bg-white transition-all duration-500" style={{ width: `${diagnostic.relevancia.percent}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      <span>ACESSIBILIDADE MATÉRIA CRUA</span>
                      <span className="text-white">{diagnostic.acessibilidade.value} ({diagnostic.acessibilidade.percent}%)</span>
                    </div>
                    <div className="w-full h-[3px] bg-zinc-800">
                      <div className="h-full bg-white transition-all duration-500" style={{ width: `${diagnostic.acessibilidade.percent}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      <span>DISPONIBILIDADE SEM CULPA</span>
                      <span className="text-white">{diagnostic.disponibilidade.value} ({diagnostic.disponibilidade.percent}%)</span>
                    </div>
                    <div className="w-full h-[3px] bg-zinc-800">
                      <div className="h-full bg-white transition-all duration-500" style={{ width: `${diagnostic.disponibilidade.percent}%` }} />
                    </div>
                  </div>
                </div>

                {/* THE BUTTON TO MAP A SKILL (O botão solicitado) */}
                <div className="bg-white/5 border border-white/15 p-5 flex flex-col items-center text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-zinc-300">healing</span>
                  <p className="font-sans text-[11.5px] text-zinc-300 max-w-md">
                    Identifique uma habilidade corporal/analógica que você sente que perdeu e configure uma trilha de reabilitação.
                  </p>
                  
                  <button
                    onClick={() => {
                      playAudioCue(440, 0.2, 'sine');
                      setIsMappingActive(true);
                    }}
                    className="w-full max-w-sm bg-white text-black font-sans text-xs font-bold py-3 uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Mapear Habilidade para Recuperar ⚡
                  </button>
                  
                  <button 
                    onClick={() => setInlineQuizStep(0)}
                    className="font-mono text-[9px] text-[#888] hover:text-white underline uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Refazer Formulário de Prioridade
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA C: FORMULÁRIO DE MAPEAMENTO DE HABILIDADE */}
            {inlineQuizStep === null && isMappingActive && (
              <motion.div
                key="mapping-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-mono text-[9px] text-[#888] uppercase tracking-widest flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 animate-spin" />
                    WIZARD DE MAPEAMENTO DE HABILIDADE
                  </span>
                  <button 
                    onClick={() => setIsMappingActive(false)}
                    className="text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-tighter"
                  >
                    Cancelar
                  </button>
                </div>

                {mappingSuccess ? (
                  <div className="p-6 bg-zinc-950 border border-white/20 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-white mx-auto animate-bounce" />
                    <h5 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
                      RECONEXÃO ARMADA COM SUCESSO!
                    </h5>
                    <p className="font-sans text-[12px] text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      A habilidade foi devidamente catalogada no seu santuário interno e uma nova Trilha Iniciada já está disponível para progresso e exercícios.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFinishMapping} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 block uppercase font-bold tracking-wider">
                        Qual Habilidade você sente que perdeu e quer resgatar?
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Desenho técnico 6B, Caligrafia Cursiva, Tear manual de lã"
                        value={mappedSkillName}
                        onChange={(e) => setMappedSkillName(e.target.value)}
                        className="w-full bg-[#121111] border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 block uppercase font-bold tracking-wider">
                        1. A qual área do design essa capacidade pertence?
                      </label>
                      <p className="text-zinc-500 font-sans text-[11px] leading-relaxed mb-1 lowercase">
                        Escolha a que mais se aproxima do contexto onde ela vivia.
                      </p>
                      <select
                        value={mappedQuestion1}
                        onChange={(e) => setMappedQuestion1(e.target.value)}
                        className="w-full bg-[#121111] border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors normal-case font-mono text-[11px]"
                      >
                        <option value="Design Gráfico e Visual (identidade, editorial, cartaz, tipografia, embalagem)">
                          Design Gráfico e Visual (identidade, editorial, cartaz, tipografia, embalagem)
                        </option>
                        <option value="UX/UI e Produto Digital (interfaces, fluxos, sistemas de design, prototipagem)">
                          UX/UI e Produto Digital (interfaces, fluxos, sistemas de design, prototipagem)
                        </option>
                        <option value="Pesquisa e Estratégia de Design (entrevistas, etnografia, testes, síntese, recomendações)">
                          Pesquisa e Estratégia de Design (entrevistas, etnografia, testes, síntese, recomendações)
                        </option>
                        <option value="Design de Serviço e Inovação Social (facilitação, co-criação, projetos comunitários)">
                          Design de Serviço e Inovação Social (facilitação, co-criação, projetos comunitários)
                        </option>
                        <option value="Motion, Animação e Digital Art (animação, ilustração digital, 3D, arte generativa manual)">
                          Motion, Animação e Digital Art (animação, ilustração digital, 3D, arte generativa manual)
                        </option>
                        <option value="Design Instrucional e Conteúdo (infográficos, documentação, storytelling visual)">
                          Design Instrucional e Conteúdo (infográficos, documentação, storytelling visual)
                        </option>
                        <option value="Direção Criativa e Liderança de Design (mentoria, visão criativa, defesa de projeto, gestão de equipe)">
                          Direção Criativa e Liderança de Design (mentoria, visão criativa, defesa de projeto, gestão de equipe)
                        </option>
                      </select>
                      <span className="font-sans text-[10px] text-zinc-500 block italic leading-snug">
                        Métrica interna: Área da Oficina. Define o conjunto de desafios-base e o tipo de material/restrição usado na trilha.
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 block uppercase font-bold tracking-wider">
                        2. O que você mais quer recuperar nessa capacidade?
                      </label>
                      <p className="text-zinc-500 font-sans text-[11px] leading-relaxed mb-1 lowercase">
                        Escolha o foco principal. Os outros aspectos podem voltar depois, mas a trilha precisa de um ponto de partida.
                      </p>
                      <select
                        value={mappedQuestion2}
                        onChange={(e) => setMappedQuestion2(e.target.value)}
                        className="w-full bg-[#121111] border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors normal-case font-mono text-[11px]"
                      >
                        <option value="A técnica — o domínio do gesto, da ferramenta, do método.">
                          A técnica — o domínio do gesto, da ferramenta, do método.
                        </option>
                        <option value="A confiança — a segurança de fazer sem pedir validação ou refino automático.">
                          A confiança — a segurança de fazer sem pedir validação ou refino automático.
                        </option>
                        <option value="A fluência — a naturalidade, a velocidade sem ansiedade, o ritmo que eu tinha.">
                          A fluência — a naturalidade, a velocidade sem ansiedade, o ritmo que eu tinha.
                        </option>
                        <option value="A autonomia — começar do zero e sustentar o processo sem depender de assistentes.">
                          A autonomia — começar do zero e sustentar o processo sem depender de assistentes.
                        </option>
                        <option value="A identidade — minha voz, meu estilo, minha assinatura reconhecível.">
                          A identidade — minha voz, meu estilo, minha assinatura reconhecível.
                        </option>
                      </select>
                      <span className="font-sans text-[10px] text-zinc-500 block italic leading-snug">
                        Métrica interna: Foco da Recuperação. Define o tom dos desafios e o tipo de &quot;sucesso&quot; que o app vai acompanhar silenciosamente.
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 block uppercase font-bold tracking-wider">
                        3. Quando você tenta usar essa capacidade, o que trava?
                      </label>
                      <p className="text-zinc-500 font-sans text-[11px] leading-relaxed mb-1 lowercase">
                        Escolha a barreira mais frequente. A trilha vai atacá-la primeiro.
                      </p>
                      <select
                        value={mappedQuestion3}
                        onChange={(e) => setMappedQuestion3(e.target.value)}
                        className="w-full bg-[#121111] border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors normal-case font-mono text-[11px]"
                      >
                        <option value="Não consigo começar — a tela ou o papel em branco me paralisa.">
                          Não consigo começar — a tela ou o papel em branco me paralisa.
                        </option>
                        <option value="Travo no meio — começo, mas perco o rumo e desisto antes de terminar.">
                          Travo no meio — começo, mas perco o rumo e desisto antes de terminar.
                        </option>
                        <option value="Acho ruim e apago — me comparo com a IA ou com o que eu fazia antes e julgo que não presta.">
                          Acho ruim e apago — me comparo com a IA ou com o que eu fazia antes e julgo que não presta.
                        </option>
                        <option value="Evito fazer — nem tento mais, porque a IA entrega mais rápido e sem esforço.">
                          Evito fazer — nem tento mais, porque a IA entrega mais rápido e sem esforço.
                        </option>
                        <option value="Faço sem sentido — até executo, mas virou tarefa mecânica, sem propósito, sem alma.">
                          Faço sem sentido — até executo, mas virou tarefa mecânica, sem propósito, sem alma.
                        </option>
                      </select>
                      <span className="font-sans text-[10px] text-zinc-500 block italic leading-snug">
                        Métrica interna: Ponto de Bloqueio. Define a progressão dos desafios na trilha (ex.: se é &quot;começar&quot;, o primeiro desafio será um ritual de abertura; se é &quot;achar ruim&quot;, o foco será em tolerância e suspensão de julgamento).
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 block uppercase font-bold tracking-wider">
                        4. Como você vai saber que recuperou algo importante?
                      </label>
                      <p className="text-zinc-500 font-sans text-[11px] leading-relaxed mb-1 lowercase">
                        Escolha uma âncora. Não é uma meta rígida — é um jeito de reconhecer a mudança quando ela acontecer.
                      </p>
                      <select
                        value={mappedQuestion4}
                        onChange={(e) => setMappedQuestion4(e.target.value)}
                        className="w-full bg-[#121111] border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors normal-case font-mono text-[11px]"
                      >
                        <option value="Conseguir produzir algo específico que hoje não faço (um cartaz, uma entrevista, um protótipo, uma animação curta).">
                          Conseguir produzir algo específico que hoje não faço (um cartaz, uma entrevista, um protótipo, uma animação curta).
                        </option>
                        <option value="Sentir menos ansiedade ao abrir uma tela ou um papel em branco.">
                          Sentir menos ansiedade ao abrir uma tela ou um papel em branco.
                        </option>
                        <option value="Receber um olhar de reconhecimento de alguém que entende do ofício.">
                          Receber um olhar de reconhecimento de alguém que entende do ofício.
                        </option>
                        <option value="Perceber que fiz de novo sem esforço consciente — e só me dar conta depois.">
                          Perceber que fiz de novo sem esforço consciente — e só me dar conta depois.
                        </option>
                        <option value="Não preciso de indicador — só quero tentar, no meu tempo, sem pressão.">
                          Não preciso de indicador — só quero tentar, no meu tempo, sem pressão.
                        </option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white text-black font-sans text-xs font-bold py-3 uppercase tracking-widest hover:bg-zinc-200 transition-colors mt-2 cursor-pointer"
                    >
                      Salvar Mapeamento e Armar Trilha
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DECISION NODE ADVICE NAVIGATOR (Auxiliary branches below) */}
        {inlineQuizStep === null && (
          <div className="bg-zinc-950/40 border border-white/15 p-4 rounded-none space-y-3">
            <span className="font-mono text-[9px] text-zinc-500 uppercase block tracking-widest">
              Dicas Rápidas de Atrito Geral do Fazer
            </span>
            <div className="flex justify-between items-baseline">
              <h5 className="font-headline text-sm font-bold uppercase text-white">
                {currentNode.label}
              </h5>
              {currentDecisionId !== 'root' && (
                <button 
                  onClick={() => navigateDecisionNode('root')}
                  className="font-mono text-[8px] text-zinc-400 hover:text-white uppercase font-bold underline"
                >
                  Resetar rotas
                </button>
              )}
            </div>
            
            <p className="font-sans text-[11px] text-zinc-400 leading-normal">
              {currentNode.description}
            </p>

            {currentNode.advice && (
              <div className="space-y-2">
                <div className="bg-white/5 border-l border-white p-3 font-sans text-[11px] text-white leading-relaxed italic">
                  {currentNode.advice}
                </div>
                <button
                  onClick={() => handleGenerateTrailFromAdvice(currentNode)}
                  className="w-full bg-white/10 hover:bg-white hover:text-black border border-white/20 transition-all font-mono text-[9px] uppercase tracking-wider py-2.5 font-black cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Gerar Trilha Personalizada com base neste conselho ⚡</span>
                </button>
              </div>
            )}

            {currentNode.choices.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-1">
                {currentNode.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateDecisionNode(choice.nextNodeId)}
                    className="w-full text-left p-2.5 border border-white/5 bg-zinc-950 hover:bg-zinc-900 text-[10px] font-mono text-zinc-300 uppercase tracking-wide flex justify-between items-center group cursor-pointer"
                  >
                    <span>{choice.text}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </section>

      <CharcoalDivider width="w-full" className="my-8" />

      {/* ------------------------------------------------------------- */}
      {/* SEÇÃO: TRILHAS INICIADAS PELO USUÁRIO com progresso real      */}
      {/* ------------------------------------------------------------- */}
      <section className="mb-10 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-zinc-400" />
            <h3 className="font-sans text-[11px] font-semibold text-white uppercase tracking-[0.18em]">
              TRILHAS DE TRABALHO EM FUNÇÃO
            </h3>
          </div>
          <span className="font-mono text-[9px] text-zinc-500 uppercase">SUAS REABILITAÇÕES</span>
        </div>
        
        <p className="font-sans text-[12.5px] text-zinc-400 mb-6 leading-relaxed">
          Sua musculatura e foco analógico ativo. Complete os rituais práticos delineados no seu espaço de ato físico real e marque os passos concluídos para computar o progresso.
        </p>

        <div className="space-y-5">
          {userTrails.map((trail) => {
            const progress = getTrailProgress(trail);
            return (
              <div 
                key={trail.id}
                className="bg-zinc-950 border border-white/10 p-5 md:p-6 flex flex-col justify-between transition-all hover:border-white/20 group relative overflow-hidden"
              >
                {/* Trail Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono text-[8px] text-white/50 uppercase tracking-widest font-bold">
                      {trail.role}
                    </span>
                    <h4 className="font-headline text-lg font-bold text-white group-hover:text-white mt-0.5">
                      {trail.title}
                    </h4>
                    <p className="font-sans text-[12px] text-zinc-400 mt-0.5">
                      {trail.subtitle}
                    </p>
                  </div>
                  
                  {/* Progress display INSIDE card (progresso dentro do card!) */}
                  <div className="text-right shrink-0 bg-white/5 p-2 border border-white/5">
                    <span className="font-mono text-xl font-bold text-white block tracking-tighter">
                      {progress}%
                    </span>
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-wider block">
                      PROG_TÁTIL
                    </span>
                  </div>
                </div>

                {/* Progress bar INSIDE card */}
                <div className="w-full h-[4px] bg-white/5 relative mb-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 80 }}
                    className="h-full bg-white absolute left-0 top-0 saturate-150"
                  />
                </div>

                {/* Task list inside card */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block mb-2">
                    RITUAIS DE ATIVIDADE COGNITIVA:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {trail.tasks.map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => toggleTask(trail.id, task.id)}
                        className={`p-3 bg-zinc-950 border border-white/5 hover:border-white/20 flex items-start gap-2.5 cursor-pointer select-none transition-all ${
                          task.completed ? 'opacity-55' : ''
                        }`}
                      >
                        <div className="shrink-0 mt-0.5 text-zinc-400 hover:text-white transition-colors">
                          {task.completed ? (
                            <CheckSquare className="w-4 h-4 text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-white/30" />
                          )}
                        </div>
                        <span className={`font-sans text-[11px] leading-tight ${
                          task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                        }`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer warning message */}
      <footer className="border-t border-white/10 pt-6 mt-12 text-center">
        <p className="font-mono text-[10px] text-zinc-500 max-w-sm mx-auto leading-relaxed uppercase">
          POSTUMUS SISTEMA CLASSIFICADO DE MÉTRICAS V1.4. O TATO NÃO MENTE E NÃO TEM BACKUP. RECUPERE O SEU GRAFITE.
        </p>
      </footer>

    </div>
  );
}
