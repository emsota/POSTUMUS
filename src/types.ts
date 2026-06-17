export type FragmentStatus = 'Archived' | 'Rescuing' | 'Lost';

export interface Fragment {
  id: string;
  title: string;
  skillName: string;
  status: FragmentStatus;
  dateLost: string;
  imageUrl: string;
  origemTitle: string;
  origemContent: string;
  testemunhoTitle: string;
  testemunhoContent: string;
  rupturaTitle: string;
  rupturaContent: string;
  legadoTitle: string;
  legadoContent: string;
  description?: string;
  author?: string;
  location?: string;
  likesCount?: number;
  isIncomplete?: boolean;
}

export interface Metric {
  label: string;
  value: string; // 'Alto', 'Médio', 'Baixo'
  percent: number; // For rendering progress bar
}

export interface DiagnosticResult {
  priority: 'CRUCIAL' | 'MODERADO' | 'LATENTE';
  description: string;
  relevancia: Metric;
  acessibilidade: Metric;
  disponibilidade: Metric;
}
