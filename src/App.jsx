import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  TrendingUp,
  Award,
  Layers,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  Phone,
  Linkedin,
  Eye,
  EyeOff,
  FileText,
  Sparkles,
  Copy,
  Check,
  Printer,
  ArrowUpRight,
  RotateCcw,
  Database,
  Download,
  Upload,
  Tags,
  FolderPlus
} from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'romulo_portfolio_profile_v2',
  PROJECTS: 'romulo_portfolio_projects_v2',
  TYPES: 'romulo_portfolio_types_v2',
};

const DEFAULT_PROFILE = {
  name: 'Rômulo Radowitz',
  role: 'Diretor Corporativo de PMO & Líder de Projetos Estratégicos',
  tagline: 'Transformando desafios complexos em Saúde Suplementar, Telecom e TI em eficiência operacional, governança e resultados financeiros mensuráveis.',
  yearsExperience: 20,
  location: 'Fortaleza / Florianópolis • Disponível para posições Executivas',
  phoneDisplay: '+55 (48) 99989-3782',
  whatsappNumber: '5548999893782',
  linkedinUrl: 'https://www.linkedin.com/in/radowitz/',
  availabilityBadge: 'Disponível para Desafios Executivos',
};

const DEFAULT_PROJECT_TYPES = [
  'Governança & PMO',
  'Transformação Digital & TI',
  'Eficiência Operacional & M&A',
  'Infraestrutura & Telecom'
];

const SECTORS = ['Saúde Suplementar', 'Telecom', 'TI & Digital', 'Corporativo / Multi-setor'];

const SAMPLE_PROJECTS = [
  {
    id: 'sample-1',
    title: 'Estruturação de PMO Corporativo & Integração Pós-M&A',
    company: 'Hapvida NotreDame Intermédica',
    sector: 'Saúde Suplementar',
    type: 'Governança & PMO',
    year: '2022 - 2025',
    durationMonths: 36,
    budgetMillions: 85.0,
    roiMillions: 42.5,
    efficiencyGainPct: 32,
    headlineMetric: 'R$ 42,5 Mi em sinergias e redução de 32% no lead time',
    situation: 'Após movimentos acelerados de expansão e fusão na saúde suplementar, havia dezenas de projetos estratégicos concorrentes, baixa visibilidade executiva sobre prazos e duplicidade de esforços entre áreas de operações, TI e assistencial.',
    task: 'Estruturar e liderar o Escritório de Projetos Corporativos (PMO), estabelecendo ritos de governança C-Level, priorização baseada em valor e metodologia híbrida para destravar sinergias operacionais.',
    action: 'Implantei portfólio único com critérios objetivos de ROI, instituí comitês executivos quinzenais com indicadores de saúde (faróis e alertas antecipados) e capacitei líderes de frente em gestão ágil e Lean Six Sigma.',
    result: 'Aumento da taxa de entrega no prazo de 54% para 88%, captura de R$ 42,5 milhões em sinergias operacionais e redução de 32% no ciclo médio de implantação de projetos críticos.',
    interviewNotes: 'Enfatizar o alinhamento político entre diretorias de operações e TI. Destacar como a governança deixou de ser burocrática para virar ferramenta de tomada de decisão rápida do board.',
    expectedQuestions: [
      'Como você lidou com a resistência das áreas de negócio à nova governança do PMO?',
      'Qual critério você utilizou para priorizar projetos quando o orçamento era restrito?'
    ],
  },
  {
    id: 'sample-2',
    title: 'Automação da Jornada Assistencial & Autorizações',
    company: 'Operadora de Saúde Nacional',
    sector: 'TI & Digital',
    type: 'Transformação Digital & TI',
    year: '2023 - 2024',
    durationMonths: 14,
    budgetMillions: 18.5,
    roiMillions: 24.0,
    efficiencyGainPct: 68,
    headlineMetric: '68% das guias automatizadas e economia anual de R$ 24 Mi',
    situation: 'O alto volume de análise manual de procedimentos e autorizações gerava gargalos no atendimento ao beneficiário, aumento de glosas e elevado custo administrativo operacional.',
    task: 'Liderar o programa multidisciplinar de digitalização e automação de regras de negócio para reduzir o tempo de resposta sem comprometer a auditoria técnica.',
    action: 'Conduzi o mapeamento ponta a ponta dos fluxos de maior volume, coordenei squads integrados (TI, Auditoria Médica e Operações) e implantei motores de decisão automatizados com monitoramento em tempo real.',
    result: '68% das solicitações passaram a ser aprovadas em segundos, o SLA médio caiu de 48h para menos de 15 minutos e a operação economizou R$ 24 milhões/ano em retrabalho e sinistralidade evitada.',
    interviewNotes: 'Conectar tecnologia com resultado financeiro e experiência do cliente. Mostrar domínio tanto de indicadores de TI quanto de sinistralidade/auditoria médica.',
    expectedQuestions: [
      'Como você garantiu que a automação não aumentasse o risco de fraudes ou sinistralidade?',
      'Como foi a gestão dos fornecedores externos de tecnologia nesse programa?'
    ],
  }
];

const emptyProjectForm = (defaultType) => ({
  title: '',
  company: '',
  sector: 'Saúde Suplementar',
  type: defaultType || 'Governança & PMO',
  year: String(new Date().getFullYear()),
  durationMonths: '',
  budgetMillions: '',
  roiMillions: '',
  efficiencyGainPct: '',
  headlineMetric: '',
  situation: '',
  task: '',
  action: '',
  result: '',
  interviewNotes: '',
  expectedQuestionsText: '',
});

const formatCurrencyMillions = (val) => {
  if (!val || val <= 0) return 'R$ 0';
  if (val >= 1000) {
    return `R$ ${(val / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Bi`;
  }
  return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Mi`;
};

export default function App() {
  // Data State (LocalStorage persistence)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [projectTypes, setProjectTypes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TYPES);
      return saved ? JSON.parse(saved) : DEFAULT_PROJECT_TYPES;
    } catch {
      return DEFAULT_PROJECT_TYPES;
    }
  });

  // Admin & UI State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Filtering & Modals
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [activeProject, setActiveProject] = useState(null);
  const [interviewMode, setInterviewMode] = useState(false);

  // Forms & Managers
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(() => emptyProjectForm(DEFAULT_PROJECT_TYPES[0]));
  const [isCustomTypeInForm, setIsCustomTypeInForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState(DEFAULT_PROFILE);
  const [showTypesModal, setShowTypesModal] = useState(false);
  const [newTypeInput, setNewTypeInput] = useState('');

  // Feedback
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persist changes automatically
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TYPES, JSON.stringify(projectTypes));
  }, [projectTypes]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Strict 1:1 Statistics computed from entered STAR cases
  const stats = useMemo(() => {
    const totalCases = projects.length;
    const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budgetMillions) || 0), 0);
    const totalRoi = projects.reduce((acc, p) => acc + (Number(p.roiMillions) || 0), 0);
    const totalMonths = projects.reduce((acc, p) => acc + (Number(p.durationMonths) || 0), 0);

    const casesWithEfficiency = projects.filter((p) => Number(p.efficiencyGainPct) > 0);
    const avgEfficiency = casesWithEfficiency.length > 0
      ? Math.round(
          casesWithEfficiency.reduce((acc, p) => acc + Number(p.efficiencyGainPct), 0) /
            casesWithEfficiency.length
        )
      : 0;

    const distinctCompanies = new Set(
      projects.map((p) => (p.company || '').trim()).filter(Boolean)
    ).size;

    const byTypeMap = {};
    projects.forEach((p) => {
      const t = p.type || 'Outros';
      if (!byTypeMap[t]) {
        byTypeMap[t] = { name: t, count: 0, budget: 0, roi: 0 };
      }
      byTypeMap[t].count += 1;
      byTypeMap[t].budget += Number(p.budgetMillions) || 0;
      byTypeMap[t].roi += Number(p.roiMillions) || 0;
    });

    const byType = Object.values(byTypeMap)
      .map((item) => ({
        ...item,
        pct: totalCases > 0 ? Math.round((item.count / totalCases) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const sectorPalette = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
    const bySectorMap = {};
    projects.
