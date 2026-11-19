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

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [activeProject, setActiveProject] = useState(null);
  const [interviewMode, setInterviewMode] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(() => emptyProjectForm(DEFAULT_PROJECT_TYPES[0]));
  const [isCustomTypeInForm, setIsCustomTypeInForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState(DEFAULT_PROFILE);
  const [showTypesModal, setShowTypesModal] = useState(false);
  const [newTypeInput, setNewTypeInput] = useState('');

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
    projects.forEach((p) => {
      const s = p.sector || 'Outros';
      bySectorMap[s] = (bySectorMap[s] || 0) + 1;
    });

    const bySector = Object.entries(bySectorMap)
      .map(([name, count], idx) => ({
        name,
        count,
        pct: totalCases > 0 ? Math.round((count / totalCases) * 100) : 0,
        color: sectorPalette[idx % sectorPalette.length],
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalCases,
      totalBudget,
      totalRoi,
      totalMonths,
      avgEfficiency,
      distinctCompanies,
      byType,
      bySector,
    };
  }, [projects]);

  const availableFilterTypes = useMemo(() => {
    const typesFromProjects = projects.map((p) => p.type).filter(Boolean);
    return ['Todos', ...Array.from(new Set([...projectTypes, ...typesFromProjects]))];
  }, [projects, projectTypes]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchType = selectedType === 'Todos' || p.type === selectedType;
      const matchSector = selectedSector === 'Todos' || p.sector === selectedSector;
      return matchType && matchSector;
    });
  }, [projects, selectedType, selectedSector]);

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'romulo123' || adminPasswordInput === 'radowitz2026') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setAdminPasswordInput('');
      setLoginError('');
      showToast('Modo Administrador ativado.');
    } else {
      setLoginError('Senha incorreta. (Dica inicial: romulo123)');
    }
  };

  const handleAddProjectType = (e) => {
    e.preventDefault();
    const cleaned = newTypeInput.trim();
    if (!cleaned) return;
    if (projectTypes.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      showToast('Esse tipo de projeto já está cadastrado.');
      return;
    }
    setProjectTypes([...projectTypes, cleaned]);
    setNewTypeInput('');
    showToast(`Tipo "${cleaned}" adicionado!`);
  };

  const handleDeleteProjectType = (typeToRemove) => {
    if (projectTypes.length <= 1) {
      showToast('Mantenha pelo menos 1 tipo de projeto cadastrado.');
      return;
    }
    setProjectTypes(projectTypes.filter((t) => t !== typeToRemove));
    if (selectedType === typeToRemove) setSelectedType('Todos');
    showToast(`Tipo "${typeToRemove}" removido.`);
  };

  const openNewProjectForm = () => {
    setIsCustomTypeInForm(false);
    setProjectForm(emptyProjectForm(projectTypes[0]));
    setEditingProject({ isNew: true });
  };

  const openEditProjectForm = (proj) => {
    const isCustom = !projectTypes.includes(proj.type);
    setIsCustomTypeInForm(isCustom);
    setProjectForm({
      ...proj,
      durationMonths: proj.durationMonths ?? '',
      budgetMillions: proj.budgetMillions ?? '',
      roiMillions: proj.roiMillions ?? '',
      efficiencyGainPct: proj.efficiencyGainPct ?? '',
      expectedQuestionsText: (proj.expectedQuestions || []).join('\n'),
    });
    setEditingProject(proj);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    const cleanType = (projectForm.type || projectTypes[0] || 'Geral').trim();

    if (cleanType && !projectTypes.includes(cleanType)) {
      setProjectTypes((prev) => [...prev, cleanType]);
    }

    const payload = {
      id: editingProject?.isNew ? `case-${Date.now()}` : editingProject.id,
      title: projectForm.title.trim(),
      company: projectForm.company.trim(),
      sector: projectForm.sector,
      type: cleanType,
      year: projectForm.year.trim(),
      durationMonths: Number(projectForm.durationMonths) || 0,
      budgetMillions: Number(projectForm.budgetMillions) || 0,
      roiMillions: Number(projectForm.roiMillions) || 0,
      efficiencyGainPct: Number(projectForm.efficiencyGainPct) || 0,
      headlineMetric: projectForm.headlineMetric.trim(),
      situation: projectForm.situation.trim(),
      task: projectForm.task.trim(),
      action: projectForm.action.trim(),
      result: projectForm.result.trim(),
      interviewNotes: projectForm.interviewNotes.trim(),
      expectedQuestions: projectForm.expectedQuestionsText
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean),
    };

    if (editingProject?.isNew) {
      setProjects((prev) => [payload, ...prev]);
      showToast('Case STAR cadastrado e estatísticas recalculadas!');
    } else {
      setProjects((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
      if (activeProject?.id === payload.id) setActiveProject(payload);
      showToast('Case STAR atualizado com sucesso!');
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    if (!window.confirm('Deseja realmente excluir este case STAR? As estatísticas serão recalculadas.')) return;
    setProjects((prev) => prev.filter((item) => item.id !== id));
    if (activeProject?.id === id) setActiveProject(null);
    showToast('Case removido.');
  };

  const handleLoadSamples = () => {
    setProjects(SAMPLE_PROJECTS);
    showToast('2 cases de referência carregados.');
  };

  const handleClearAllProjects = () => {
    if (!window.confirm('Isso apagará todos os cases atuais para você preencher do zero. Continuar?')) return;
    setProjects([]);
    setSelectedType('Todos');
    setSelectedSector('Todos');
    showToast('Portfólio zerado. Pronto para preencher seus cases!');
  };

  const handleExportBackup = () => {
    const data = { profile, projectTypes, projects, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `romuloradowitz-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup baixado com sucesso!');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.profile) setProfile(parsed.profile);
        if (Array.isArray(parsed.projectTypes)) setProjectTypes(parsed.projectTypes);
        if (Array.isArray(parsed.projects)) setProjects(parsed.projects);
        showToast('Backup restaurado com sucesso!');
      } catch {
        showToast('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({
      ...profileForm,
      yearsExperience: Number(profileForm.yearsExperience) || 20,
    });
    setShowProfileModal(false);
    showToast('Perfil executivo atualizado!');
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(profile.phoneDisplay);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const donutSegments = useMemo(() => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPct = 0;

    return stats.bySector.map((sec) => {
      const strokeDasharray = `${(sec.pct / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((accumulatedPct / 100) * circumference);
      accumulatedPct += sec.pct;
      return {
        ...sec,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [stats.bySector]);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-blue-500/[0.06] blur-[120px]" />
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isAdmin && (
        <div className="sticky top-0 z-40 bg-slate-900/95 border-b border-emerald-500/30 backdrop-blur-md print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <Unlock className="w-3.5 h-3.5" /> Modo Admin Ativo
              </span>
              <span className="text-xs text-slate-400 hidden lg:inline">
                Cada case preenchido alimenta os gráficos automaticamente
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={openNewProjectForm}
                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs px-3.5 py-2 rounded-lg transition shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" /> Novo Case STAR
              </button>

              <button
                onClick={() => setShowTypesModal(true)}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition"
              >
                <Tags className="w-3.5 h-3.5 text-blue-400" /> Tipos de Projeto
              </button>

              <button
                onClick={() => {
                  setProfileForm(profile);
                  setShowProfileModal(true);
                }}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Editar Perfil
              </button>

              <button
                onClick={handleExportBackup}
                title="Baixar arquivo de backup dos seus cases"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> Backup
              </button>

              <label
                title="Restaurar arquivo de backup JSON"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" /> Restaurar
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>

              {projects.length > 0 && (
                <button
                  onClick={handleClearAllProjects}
                  className="inline-flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-medium px-3 py-2 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Zerar
                </button>
              )}

              <button
                onClick={() => setIsAdmin(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-2 transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 border-b border-white/[0.06] bg-[#07090E]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20">
              RR
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight block leading-none">
                romuloradowitz.com.br
              </span>
              <span className="text-[11px] text-slate-400 tracking-wide">
                Executive Portfolio & STAR Track Record
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3.5 py-2 rounded-xl transition print:hidden"
            >
              <Printer className="w-3.5 h-3.5" /> Exportar Resumo
            </button>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-slate-950 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.08] p-7 sm:p-10 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {profile.availabilityBadge}
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                {profile.name}
              </h1>

              <p className="text-lg sm:text-xl font-medium text-emerald-400">
                {profile.role}
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {profile.tagline}
              </p>

              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                {profile.location}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-72">
              <a
                href={`https://wa.me/${profile.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/15 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80 block">
                      WhatsApp Direto
                    </span>
                    <span className="font-bold text-sm">{profile.phoneDisplay}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="flex gap-2">
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold transition"
                >
                  <Linkedin className="w-4 h-4 text-blue-400" /> Perfil LinkedIn
                </a>
                <button
                  onClick={copyPhone}
                  title="Copiar telefone"
                  className="px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition flex items-center justify-center"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Resumo Estatístico dos Cases Executados
              </h2>
              <p className="text-xs text-slate-400">
                Indicadores consolidados automaticamente a partir dos cases documentados abaixo
              </p>
            </div>
            {stats.totalCases > 0 && (
              <span className="text-xs text-slate-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                Base: {stats.totalCases} {stats.totalCases === 1 ? 'case documentado' : 'cases documentados'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Cases Documentados</span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalCases}</div>
              <p className="text-xs text-slate-400 mt-1.5">
                {stats.totalCases > 0
                  ? `${stats.distinctCompanies} ${stats.distinctCompanies === 1 ? 'organização' : 'organizações'} • ${stats.totalMonths} meses acumulados`
                  : 'Aguardando cadastro dos cases'}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Orçamento Gerenciado</span>
                <Briefcase className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white">
                {formatCurrencyMillions(stats.totalBudget)}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Soma do CAPEX/OPEX dos cases cadastrados
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Impacto & ROI Gerado</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-emerald-400">
                {formatCurrencyMillions(stats.totalRoi)}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Captura financeira e sinergias comprovadas
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Ganho Médio & Trajetória</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.avgEfficiency > 0 ? `+${stats.avgEfficiency}%` : `${profile.yearsExperience}+ anos`}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {stats.avgEfficiency > 0
                  ? `Eficiência média nos cases • ${profile.yearsExperience}+ anos exp.`
                  : 'Experiência executiva consolidada'}
              </p>
            </div>
          </div>

          {stats.totalCases > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Distribuição por Tipo de Projeto</h3>
                    <p className="text-xs text-slate-400">Clique em uma barra para filtrar os cases</p>
                  </div>
                  {selectedType !== 'Todos' && (
                    <button
                      onClick={() => setSelectedType('Todos')}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      Limpar filtro
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {stats.byType.map((item) => {
                    const isSelected = selectedType === item.name;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setSelectedType(isSelected ? 'Todos' : item.name)}
                        className={`w-full text-left p-3 rounded-xl border transition ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/40'
                            : 'bg-white/[0.02] border-white/[0.05] hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold text-slate-200">{item.name}</span>
                          <div className="flex items-center gap-3 text-slate-400">
                            {item.roi > 0 && (
                              <span className="text-emerald-400 font-medium">
                                ROI: {formatCurrencyMillions(item.roi)}
                              </span>
                            )}
                            <span className="font-semibold text-white">
                              {item.count} {item.count === 1 ? 'case' : 'cases'} ({item.pct}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Atuação por Setor</h3>
                    <p className="text-xs text-slate-400">Proporção baseada nos cases cadastrados</p>
                  </div>
                  {selectedSector !== 'Todos' && (
                    <button
                      onClick={() => setSelectedSector('Todos')}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      Todos
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
                  <div className="relative w-36 h-36 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 132 132">
                      <circle
                        cx="66"
                        cy="66"
                        r="54"
                        fill="transparent"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="14"
                      />
                      {donutSegments.map((seg) => (
                        <circle
                          key={seg.name}
                          cx="66"
                          cy="66"
                          r="54"
                          fill="transparent"
                          stroke={seg.color}
                          strokeWidth="14"
                          strokeDasharray={seg.strokeDasharray}
                          strokeDashoffset={seg.strokeDashoffset}
                          strokeLinecap="round"
                          className="cursor-pointer transition-opacity hover:opacity-80"
                          onClick={() =>
                            setSelectedSector(selectedSector === seg.name ? 'Todos' : seg.name)
                          }
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold text-white">{stats.totalCases}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">Cases</span>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2.5">
                    {stats.bySector.map((sec) => (
                      <button
                        key={sec.name}
                        onClick={() =>
                          setSelectedSector(selectedSector === sec.name ? 'Todos' : sec.name)
                        }
                        className={`w-full flex items-center justify-between text-xs p-2 rounded-lg transition ${
                          selectedSector === sec.name
                            ? 'bg-white/10 text-white'
                            : 'hover:bg-white/[0.04] text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: sec.color }}
                          />
                          <span className="truncate">{sec.name}</span>
                        </span>
                        <span className="font-semibold text-white ml-2">
                          {sec.count} ({sec.pct}%)
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Portfólio de Cases Executivos (Formato STAR)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Clique em qualquer projeto para abrir o detalhamento completo em Situação, Tarefa, Ação e Resultado
              </p>
            </div>

            {projects.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {availableFilterTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition border ${
                      selectedType === type
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-semibold'
                        : 'bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
                <Database className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  Pronto para cadastrar seus cases um a um
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Todos os indicadores estatísticos e gráficos do topo serão alimentados automaticamente à medida que você adicionar seus projetos no formato STAR.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {isAdmin ? (
                  <>
                    <button
                      onClick={openNewProjectForm}
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
                    >
                      <Plus className="w-4 h-4" /> Cadastrar Meu Primeiro Case
                    </button>
                    <button
                      onClick={() => setShowTypesModal(true)}
                      className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-sm font-medium px-4 py-2.5 rounded-xl transition"
                    >
                      <Tags className="w-4 h-4 text-blue-400" /> Configurar Tipos de Projeto
                    </button>
                    <button
                      onClick={handleLoadSamples}
                      className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 text-sm font-medium px-4 py-2.5 rounded-xl transition"
                    >
                      Carregar 2 Exemplos
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
                  >
                    <Lock className="w-4 h-4" /> Entrar como Administrador para Preencher
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setActiveProject(proj);
                    setInterviewMode(false);
                  }}
                  className="group cursor-pointer rounded-3xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.08] hover:border-emerald-500/40 p-6 transition-all flex flex-col justify-between backdrop-blur-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold">
                          {proj.type}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-300 text-[11px] font-medium">
                          {proj.sector}
                        </span>
                      </div>

                      {isAdmin && (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openEditProjectForm(proj)}
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 transition"
                            title="Editar case"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition"
                            title="Excluir case"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {proj.company} • {proj.year}
                        {proj.durationMonths > 0 ? ` (${proj.durationMonths} meses)` : ''}
                      </p>
                    </div>

                    {proj.headlineMetric && (
                      <div className="p-3 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>{proj.headlineMetric}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      <strong className="text-slate-200">Situação:</strong> {proj.situation}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/[0.07] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4 text-slate-400">
                      {proj.budgetMillions > 0 && (
                        <span>
                          Budget: <strong className="text-slate-200">{formatCurrencyMillions(proj.budgetMillions)}</strong>
                        </span>
                      )}
                      {proj.roiMillions > 0 && (
                        <span>
                          ROI: <strong className="text-emerald-400">{formatCurrencyMillions(proj.roiMillions)}</strong>
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      Abrir STAR <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-emerald-500/10 via-white/[0.03] to-blue-500/10 border border-white/10 p-7 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white">Contato Direto</h2>
              <p className="text-sm text-slate-300">
                Para posições executivas de Diretoria de PMO, Gerência de Projetos Estratégicos ou Transformação Corporativa:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${profile.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-5 py-3 rounded-2xl transition shadow-lg shadow-emerald-500/20"
              >
                <Phone className="w-4 h-4" />
                {profile.phoneDisplay}
              </a>

              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-white font-semibold text-sm px-5 py-3 rounded-2xl transition"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                linkedin.com/in/radowitz
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {profile.name} • Todos os direitos reservados.</span>
          <button
            onClick={() => (isAdmin ? setIsAdmin(false) : setShowLoginModal(true))}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition print:hidden"
          >
            {isAdmin ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isAdmin ? 'Encerrar Sessão Admin' : 'Área do Administrador'}
          </button>
        </div>
      </footer>

      {activeProject && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="bg-[#0D111A] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-semibold">
                    {activeProject.type}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-slate-300 text-xs">
                    {activeProject.sector}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeProject.company} • {activeProject.year}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{activeProject.title}</h3>
              </div>

              <button
                onClick={() => setActiveProject(null)}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <span className="text-[11px] text-slate-400 block">Orçamento</span>
                <span className="text-sm font-bold text-white">
                  {activeProject.budgetMillions > 0 ? formatCurrencyMillions(activeProject.budgetMillions) : '—'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <span className="text-[11px] text-slate-400 block">ROI / Economia</span>
                <span className="text-sm font-bold text-emerald-400">
                  {activeProject.roiMillions > 0 ? formatCurrencyMillions(activeProject.roiMillions) : '—'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <span className="text-[11px] text-slate-400 block">Ganho / Eficiência</span>
                <span className="text-sm font-bold text-blue-400">
                  {activeProject.efficiencyGainPct > 0 ? `+${activeProject.efficiencyGainPct}%` : '—'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <span className="text-[11px] text-slate-400 block">Duração</span>
                <span className="text-sm font-bold text-white">
                  {activeProject.durationMonths > 0 ? `${activeProject.durationMonths} meses` : '—'}
                </span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2.5 text-xs text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Modo Preparação de Entrevista:</strong> exibe suas notas privadas de storytelling e perguntas prováveis.
                  </span>
                </div>
                <button
                  onClick={() => setInterviewMode(!interviewMode)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    interviewMode
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-white/10 text-amber-300 hover:bg-white/15'
                  }`}
                >
                  {interviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {interviewMode ? 'Ocultar Cola' : 'Ativar Cola'}
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">S</span>
                  Situação (Contexto & Desafio)
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{activeProject.situation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">T</span>
                  Tarefa (Responsabilidade & Objetivo)
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{activeProject.task}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">A</span>
                  Ação (Execução & Liderança)
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{activeProject.action}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/[0.07] border border-emerald-500/25">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">R</span>
                  Resultado (Impacto Mensurável)
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">{activeProject.result}</p>
              </div>
            </div>

            {isAdmin && interviewMode && (
              <div className="p-5 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> Cola Privada para Entrevista (Invisível para Visitantes)
                </h4>

                {activeProject.interviewNotes && (
                  <div>
                    <span className="text-xs font-semibold text-amber-200 block mb-1">
                      Pontos-chave de Storytelling:
                    </span>
                    <p className="text-sm text-slate-200 leading-relaxed">{activeProject.interviewNotes}</p>
                  </div>
                )}

                {activeProject.expectedQuestions?.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-amber-200 block mb-1.5">
                      Perguntas Prováveis do Board / Headhunter:
                    </span>
                    <ul className="space-y-1.5 text-sm text-slate-200 list-disc list-inside">
                      {activeProject.expectedQuestions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProject}
            className="bg-[#0D111A] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingProject.isNew ? 'Cadastrar Novo Case STAR' : 'Editar Case STAR'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Título Executivo do Projeto *</label>
                <input
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Ex: Implantação de PMO Corporativo & Integração Pós-M&A"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Empresa / Organização *</label>
                <input
                  required
                  value={projectForm.company}
                  onChange={(e) => setProjectForm({ ...projectForm, company: e.target.value })}
                  placeholder="Ex: Hapvida NotreDame Intermédica"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Período / Ano *</label>
                <input
                  required
                  value={projectForm.year}
                  onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                  placeholder="Ex: 2023 - 2025"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Setor de Atuação</label>
                <select
                  value={projectForm.sector}
                  onChange={(e) => setProjectForm({ ...projectForm, sector: e.target.value })}
                  className="w-full rounded-xl bg-[#151B28] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">Tipo de Projeto</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomTypeInForm(!isCustomTypeInForm);
                      if (isCustomTypeInForm) {
                        setProjectForm({ ...projectForm, type: projectTypes[0] });
                      } else {
                        setProjectForm({ ...projectForm, type: '' });
                      }
                    }}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    {isCustomTypeInForm ? 'Escolher da lista' : '+ Criar novo tipo'}
                  </button>
                </div>

                {isCustomTypeInForm ? (
                  <input
                    required
                    value={projectForm.type}
                    onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                    placeholder="Digite o novo tipo de projeto..."
                    className="w-full rounded-xl bg-white/[0.05] border border-emerald-500/40 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <select
                    value={projectForm.type}
                    onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                    className="w-full rounded-xl bg-[#151B28] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-3">
              <span className="text-xs font-semibold text-emerald-300 block">
                Indicadores Numéricos (Alimentam o Dashboard Estatístico)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Orçamento (R$ Mi)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={projectForm.budgetMillions}
                    onChange={(e) => setProjectForm({ ...projectForm, budgetMillions: e.target.value })}
                    placeholder="Ex: 25.5"
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">ROI / Economia (R$ Mi)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={projectForm.roiMillions}
                    onChange={(e) => setProjectForm({ ...projectForm, roiMillions: e.target.value })}
                    placeholder="Ex: 14.0"
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Ganho Eficiência (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={projectForm.efficiencyGainPct}
                    onChange={(e) => setProjectForm({ ...projectForm, efficiencyGainPct: e.target.value })}
                    placeholder="Ex: 35"
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Duração (Meses)</label>
                  <input
                    type="number"
                    min="1"
                    value={projectForm.durationMonths}
                    onChange={(e) => setProjectForm({ ...projectForm, durationMonths: e.target.value })}
                    placeholder="Ex: 18"
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Frase-Destaque de Impacto (Card)</label>
                <input
                  value={projectForm.headlineMetric}
                  onChange={(e) => setProjectForm({ ...projectForm, headlineMetric: e.target.value })}
                  placeholder="Ex: Redução de 35% no prazo de entrega e R$ 14 Mi em economia anual"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-blue-400 mb-1">S — Situação *</label>
                <textarea
                  required
                  rows={2}
                  value={projectForm.situation}
                  onChange={(e) => setProjectForm({ ...projectForm, situation: e.target.value })}
                  placeholder="Qual era o cenário, problema ou dor do negócio?"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-400 mb-1">T — Tarefa *</label>
                <textarea
                  required
                  rows={2}
                  value={projectForm.task}
                  onChange={(e) => setProjectForm({ ...projectForm, task: e.target.value })}
                  placeholder="Qual era a sua missão ou meta como líder?"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-400 mb-1">A — Ação *</label>
                <textarea
                  required
                  rows={3}
                  value={projectForm.action}
                  onChange={(e) => setProjectForm({ ...projectForm, action: e.target.value })}
                  placeholder="O que você implementou, como conduziu stakeholders, governança e equipes?"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1">R — Resultado *</label>
                <textarea
                  required
                  rows={2}
                  value={projectForm.result}
                  onChange={(e) => setProjectForm({ ...projectForm, result: e.target.value })}
                  placeholder="Quais foram os resultados concretos, indicadores e legado?"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 space-y-3">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Cola Privada para Entrevista (Opcional • Só você vê)
              </span>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Notas de Storytelling / Lições Aprendidas</label>
                <textarea
                  rows={2}
                  value={projectForm.interviewNotes}
                  onChange={(e) => setProjectForm({ ...projectForm, interviewNotes: e.target.value })}
                  placeholder="Pontos estratégicos para destacar na conversa com o entrevistador..."
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Perguntas Prováveis (uma por linha)</label>
                <textarea
                  rows={2}
                  value={projectForm.expectedQuestionsText}
                  onChange={(e) => setProjectForm({ ...projectForm, expectedQuestionsText: e.target.value })}
                  placeholder="Como você lidou com conflitos de prioridade entre áreas?"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] text-slate-300 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition"
              >
                Salvar Case STAR
              </button>
            </div>
          </form>
        </div>
      )}

      {showTypesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D111A] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-blue-400" />
                Tipos de Projeto
              </h3>
              <button
                onClick={() => setShowTypesModal(false)}
                className="p-1.5 rounded-lg bg-white/[0.06] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProjectType} className="flex gap-2">
              <input
                value={newTypeInput}
                onChange={(e) => setNewTypeInput(e.target.value)}
                placeholder="Ex: Fusões & Aquisições (M&A)"
                className="flex-1 rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition"
              >
                Adicionar
              </button>
            </form>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {projectTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-slate-200"
                >
                  <span>{type}</span>
                  <button
                    onClick={() => handleDeleteProjectType(type)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition"
                    title="Remover tipo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProfile}
            className="bg-[#0D111A] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Editar Perfil Executivo</h3>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-lg bg-white/[0.06] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Nome Completo</label>
              <input
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Posicionamento / Cargo Alvo</label>
              <input
                required
                value={profileForm.role}
                onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Resumo Executivo (Pitch)</label>
              <textarea
                rows={3}
                value={profileForm.tagline}
                onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Anos de Experiência</label>
                <input
                  type="number"
                  value={profileForm.yearsExperience}
                  onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: e.target.value })}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Telefone Exibição</label>
                <input
                  value={profileForm.phoneDisplay}
                  onChange={(e) => setProfileForm({ ...profileForm, phoneDisplay: e.target.value })}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Localização / Disponibilidade</label>
              <input
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-sm font-bold"
              >
                Salvar Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D111A] border border-white/15 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" /> Acesso Administrativo
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-1.5 rounded-lg bg-white/[0.06] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Senha do Administrador</label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Digite sua senha..."
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                {loginError && <p className="text-xs text-red-400 mt-1.5">{loginError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
              >
                Entrar e Editar Portfólio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
