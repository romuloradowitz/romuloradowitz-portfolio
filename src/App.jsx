import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Award,
  Plus,
  Edit3,
  Trash2,
  LogOut,
  Lock,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  X,
  Filter,
  Linkedin,
  Mail,
  ChevronRight,
  Globe,
  Cpu,
  Layers,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  FolderKanban
} from 'lucide-react';
import { supabase } from './supabaseClient';

const DEFAULT_SECTORS = ['Saúde Suplementar', 'Telecomunicações', 'TI & Transformação Digital', 'Operações & PMO'];
const DEFAULT_TYPES = ['Transformação Organizacional', 'Implantação de PMO', 'Eficiência Operacional', 'Integração M&A'];

const TRANSLATIONS = {
  pt: {
    heroBadge: 'Portfólio Executivo & Track Record STAR',
    heroRole: 'Diretor Corporativo de PMO & Líder de Projetos Estratégicos',
    heroSubtitle:
      'Mais de 16 anos e +133 projetos e programas liderados de alta complexidade, governança corporativa e transformação digital nos setores de Saúde Suplementar, Telecomunicações e Tecnologia da Informação.',
    navTrajectoryBtn: 'Trajetória',
    navProjectsBtn: 'Projetos',
    linkedinBtn: 'Conectar no LinkedIn',
    contactBtn: 'Contato Executivo',
    kpi1Label: 'Track Record Total',
    kpi1Value: '+133',
    kpi1Sub: 'Projetos e Programas liderados',
    kpi2Label: 'Orçamento Gerido (Cases)',
    kpi2Sub: 'Capex/Opex sob governança STAR',
    kpi3Label: 'ROI / Ganho Médio',
    kpi3Sub: 'Retorno e eficiência capturados',
    kpi4Label: 'Setores de Atuação',
    kpi4Sub: 'Indústrias de alta complexidade',
    aboutBadge: 'Trajetória & Formação Executiva',
    aboutTitle: 'Da Engenharia de Sistemas à Estratégia Corporativa',
    aboutP1:
      'Com mais de 133 projetos e programas liderados ao longo da carreira, minha atuação une profundidade técnica, rigor metodológico e visão de negócios para transformar objetivos estratégicos em resultados tangíveis.',
    aboutP2:
      'Essa jornada começou com uma base sólida em tecnologia como Bacharel em Sistemas de Informação pela UFSC, permitindo dialogar de igual para igual com equipes de engenharia, dados e arquitetura. Para escalar essa entrega no ambiente corporativo, especializei-me na execução com o MBA em Gerenciamento de Projetos pela FGV, consolidando o domínio sobre governança, controle financeiro e gestão de riscos.',
    aboutP3:
      'Entendendo que projetos bem executados só geram valor quando apontam para a direção certa, concluí a Pós-Graduação em Administração Estratégica, conectando o portfólio diretamente às metas do C-level e ao ROI da companhia. Esse conhecimento é validado globalmente pela Certificação Internacional PMP® (alinhada ao PMBOK® 8) e potencializado pelas especializações em Inteligência Artificial aplicada a Projetos pelo PMI, aplicando IA na análise preditiva de riscos, automação de PMO e tomada de decisão.',
    aboutP4:
      'Na prática, desenho a governança sob medida para cada desafio, transitando com fluidez entre abordagens preditivas, ágeis (adaptativas) e híbridas.',
    credentialsTitle: 'Credenciais & Especializações',
    credentials: [
      { title: 'Certificação Internacional PMP®', subtitle: 'PMI • Alinhado ao PMBOK® 8ª Edição', icon: 'shield' },
      { title: 'IA Aplicada a Projetos', subtitle: 'Especializações Executivas • PMI', icon: 'cpu' },
      { title: 'MBA em Gerenciamento de Projetos', subtitle: 'Fundação Getulio Vargas (FGV)', icon: 'award' },
      { title: 'Pós-Graduação em Administração Estratégica', subtitle: 'Alinhamento Corporativo & ROI', icon: 'trending' },
      { title: 'Bacharel em Sistemas de Informação', subtitle: 'Universidade Federal de Santa Catarina (UFSC)', icon: 'grad' }
    ],
    methodologiesTitle: 'Abordagens Metodológicas',
    methodologies: ['Preditiva', 'Ágil (Adaptativa)', 'Híbrida'],
    casesTitle: 'Cases Executivos (Metodologia STAR)',
    casesSubtitle:
      'Classificados por relevância financeira (orçamento) e ano mais recente. Situação, Tarefa, Ação e Resultados mensuráveis.',
    filterAll: 'Todos',
    filterSectorPrefix: 'Setor',
    filterTypePrefix: 'Frente',
    loadingCases: 'Carregando portfólio executivo...',
    emptyCases: 'Nenhum case STAR publicado para este filtro ainda.',
    budgetLabel: 'Orçamento',
    roiLabel: 'Impacto / ROI',
    starS: 'S — Situação & Contexto',
    starT: 'T — Tarefa & Desafio Executivo',
    starA: 'A — Ação & Governança Aplicada',
    starR: 'R — Resultados Mensuráveis',
    footerRights: 'Todos os direitos reservados.',
    adminArea: 'Área do Administrador',
    authenticated: 'Autenticado'
  },
  en: {
    heroBadge: 'Executive Portfolio & STAR Track Record',
    heroRole: 'Corporate PMO Director & Strategic Portfolio Leader',
    heroSubtitle:
      'Over 16 years and 133+ high-complexity projects and programs led across corporate governance and digital transformation in Healthcare, Telecommunications, and Information Technology.',
    navTrajectoryBtn: 'Background',
    navProjectsBtn: 'Projects',
    linkedinBtn: 'Connect on LinkedIn',
    contactBtn: 'Executive Contact',
    kpi1Label: 'Total Track Record',
    kpi1Value: '133+',
    kpi1Sub: 'Projects & Programs led',
    kpi2Label: 'Managed Budget (Cases)',
    kpi2Sub: 'Capex/Opex under STAR governance',
    kpi3Label: 'Average ROI / Gain',
    kpi3Sub: 'Captured return & efficiency',
    kpi4Label: 'Industry Sectors',
    kpi4Sub: 'High-complexity environments',
    aboutBadge: 'Executive Background & Credentials',
    aboutTitle: 'From Systems Engineering to Corporate Strategy',
    aboutP1:
      'With over 133 projects and programs led throughout my career, my leadership bridges technical depth, methodological rigor, and business acumen to turn strategic objectives into measurable outcomes.',
    aboutP2:
      'My journey began with a strong technological foundation as a B.S. in Information Systems from UFSC, enabling seamless alignment with engineering, data, and architecture teams. To scale delivery in enterprise environments, I earned an MBA in Project Management from FGV, mastering governance, financial control, and risk management.',
    aboutP3:
      'Recognizing that well-executed projects only create value when aligned with the right direction, I completed a Postgraduate degree in Strategic Management, directly linking portfolio execution to C-level goals and corporate ROI. This expertise is globally validated by the PMP® International Certification (aligned with PMBOK® 8) and amplified by PMI specializations in Artificial Intelligence for Project Management, leveraging AI for predictive risk analysis, PMO automation, and executive decision-making.',
    aboutP4:
      'In practice, I tailor governance frameworks to each business challenge, operating seamlessly across predictive, agile (adaptive), and hybrid approaches.',
    credentialsTitle: 'Credentials & Specializations',
    credentials: [
      { title: 'PMP® International Certification', subtitle: 'PMI • Aligned with PMBOK® 8th Edition', icon: 'shield' },
      { title: 'AI in Project Management', subtitle: 'Executive Specializations • PMI', icon: 'cpu' },
      { title: 'MBA in Project Management', subtitle: 'Fundação Getulio Vargas (FGV)', icon: 'award' },
      { title: 'Postgraduate in Strategic Management', subtitle: 'Corporate Strategy & ROI Alignment', icon: 'trending' },
      { title: 'B.S. in Information Systems', subtitle: 'Federal University of Santa Catarina (UFSC)', icon: 'grad' }
    ],
    methodologiesTitle: 'Methodological Approaches',
    methodologies: ['Predictive', 'Agile (Adaptive)', 'Hybrid'],
    casesTitle: 'Executive Cases (STAR Methodology)',
    casesSubtitle:
      'Ranked by financial relevance (budget) and most recent year. Situation, Task, Action, and measurable Results.',
    filterAll: 'All',
    filterSectorPrefix: 'Sector',
    filterTypePrefix: 'Track',
    loadingCases: 'Loading executive portfolio...',
    emptyCases: 'No STAR cases published for this filter yet.',
    budgetLabel: 'Budget',
    roiLabel: 'Impact / ROI',
    starS: 'S — Situation & Context',
    starT: 'T — Task & Executive Challenge',
    starA: 'A — Action & Applied Governance',
    starR: 'R — Measurable Results',
    footerRights: 'All rights reserved.',
    adminArea: 'Administrator Area',
    authenticated: 'Authenticated'
  },
  it: {
    heroBadge: 'Portafoglio Esecutivo & Track Record STAR',
    heroRole: 'Direttore PMO Corporate & Leader di Progetti Strategici',
    heroSubtitle:
      'Oltre 16 anni e più di 133 progetti e programmi guidati ad alta complessità, governance aziendale e trasformazione digitale nei settori Sanità Integrativa, Telecomunicazioni e Information Technology.',
    navTrajectoryBtn: 'Percorso',
    navProjectsBtn: 'Progetti',
    linkedinBtn: 'Connetti su LinkedIn',
    contactBtn: 'Contatto Esecutivo',
    kpi1Label: 'Track Record Totale',
    kpi1Value: '+133',
    kpi1Sub: 'Progetti e Programmi guidati',
    kpi2Label: 'Budget Gestito (Casi)',
    kpi2Sub: 'Capex/Opex sotto governance STAR',
    kpi3Label: 'ROI / Guadagno Medio',
    kpi3Sub: 'Ritorno ed efficienza acquisiti',
    kpi4Label: 'Settori di Attività',
    kpi4Sub: 'Industrie ad alta complessità',
    aboutBadge: 'Percorso & Formazione Esecutiva',
    aboutTitle: "Dall'Ingegneria dei Sistemi alla Strategia Aziendale",
    aboutP1:
      'Con oltre 133 progetti e programmi guidati nel corso della mia carriera, unisco profondità tecnica, rigore metodologico e visione di business per trasformare gli obiettivi strategici in risultati concreti.',
    aboutP2:
      "Questo percorso è iniziato con una solida base tecnologica grazie alla Laurea in Sistemi Informativi presso l'UFSC, che mi consente di dialogare allo stesso livello con i team di ingegneria, dati e architettura. Per scalare la delivery in contesti aziendali complessi, ho conseguito un MBA in Project Management presso la FGV, consolidando la padronanza di governance, controllo finanziario e gestione dei rischi.",
    aboutP3:
      "Consapevole che i progetti ben eseguiti generano valore solo se orientati nella giusta direzione, ho completato una Specializzazione post-laurea in Amministrazione Strategica, collegando il portafoglio direttamente agli obiettivi del C-level e al ROI aziendale. Queste competenze sono validate a livello globale dalla Certificazione Internazionale PMP® (allineata al PMBOK® 8) e potenziate dalle specializzazioni in Intelligenza Artificiale applicata ai Progetti del PMI, utilizzando l'IA per l'analisi predittiva dei rischi, l'automazione del PMO e il supporto decisionale.",
    aboutP4:
      'Nella pratica, progetto una governance su misura per ogni sfida, operando con fluidità tra approcci predittivi, agili (adattivi) e ibridi.',
    credentialsTitle: 'Credenziali & Specializzazioni',
    credentials: [
      { title: 'Certificazione Internazionale PMP®', subtitle: 'PMI • Allineato al PMBOK® 8ª Edizione', icon: 'shield' },
      { title: 'IA Applicata ai Progetti', subtitle: 'Specializzazioni Esecutive • PMI', icon: 'cpu' },
      { title: 'MBA in Project Management', subtitle: 'Fundação Getulio Vargas (FGV)', icon: 'award' },
      { title: 'Specializzazione in Amministrazione Strategica', subtitle: 'Allineamento Strategico & ROI', icon: 'trending' },
      { title: 'Laurea in Sistemi Informativi', subtitle: 'Università Federale di Santa Catarina (UFSC)', icon: 'grad' }
    ],
    methodologiesTitle: 'Approcci Metodologici',
    methodologies: ['Predittivo', 'Agile (Adattivo)', 'Ibrido'],
    casesTitle: 'Casi Esecutivi (Metodologia STAR)',
    casesSubtitle:
      'Classificati per rilevanza finanziaria (budget) e anno più recente. Situazione, Compito, Azione e Risultati misurabili.',
    filterAll: 'Tutti',
    filterSectorPrefix: 'Settore',
    filterTypePrefix: 'Area',
    loadingCases: 'Caricamento portafoglio esecutivo...',
    emptyCases: 'Nessun caso STAR pubblicato per questo filtro.',
    budgetLabel: 'Budget',
    roiLabel: 'Impatto / ROI',
    starS: 'S — Situazione & Contesto',
    starT: 'T — Compito & Sfida Esecutiva',
    starA: 'A — Azione & Governance Applicata',
    starR: 'R — Risultati Misurabili',
    footerRights: 'Tutti i diritti riservati.',
    adminArea: 'Area Amministratore',
    authenticated: 'Autenticato'
  },
  de: {
    heroBadge: 'Executive Portfolio & STAR Track Record',
    heroRole: 'Corporate PMO Director & Strategischer Portfoliomanager',
    heroSubtitle:
      'Über 16 Jahre Erfahrung und mehr als 133 geleitete hochkomplexe Projekte und Programme in Corporate Governance und digitaler Transformation in den Bereichen Gesundheitswesen, Telekommunikation und IT.',
    navTrajectoryBtn: 'Werdegang',
    navProjectsBtn: 'Projekte',
    linkedinBtn: 'Auf LinkedIn vernetzen',
    contactBtn: 'Executive Kontakt',
    kpi1Label: 'Gesamter Track Record',
    kpi1Value: '133+',
    kpi1Sub: 'Geleitete Projekte & Programme',
    kpi2Label: 'Verwaltetes Budget (Cases)',
    kpi2Sub: 'Capex/Opex unter STAR-Governance',
    kpi3Label: 'Durchschnittlicher ROI',
    kpi3Sub: 'Erzielte Rendite & Effizienz',
    kpi4Label: 'Branchensektoren',
    kpi4Sub: 'Hochkomplexe Industrien',
    aboutBadge: 'Werdegang & Executive-Qualifikationen',
    aboutTitle: 'Von der Systemtechnik zur Unternehmensstrategie',
    aboutP1:
      'Mit über 133 geleiteten Projekten und Programmen im Laufe meiner Karriere verbinde ich technische Tiefe, methodische Präzision und unternehmerisches Denken, um strategische Ziele in messbare Ergebnisse umzusetzen.',
    aboutP2:
      'Dieser Weg begann mit einem fundierten technologischen Fundament als Bachelor of Science in Wirtschaftsinformatik (Sistemas de Informação) an der UFSC, was mir eine Kommunikation auf Augenhöhe mit Engineering-, Daten- und Architekturteams ermöglicht. Um diese Umsetzungskraft im Konzernumfeld zu skalieren, absolvierte ich einen MBA in Projektmanagement an der FGV und festigte meine Expertise in Governance, Finanzcontrolling und Risikomanagement.',
    aboutP3:
      'In dem Bewusstsein, dass gut umgesetzte Projekte nur dann Wert schaffen, wenn sie in die richtige Richtung zielen, schloss ich ein Aufbaustudium in Strategischem Management ab, um das Projektportfolio direkt mit den C-Level-Zielen und dem ROI des Unternehmens zu verknüpfen. Dieses Wissen ist weltweit durch die PMP®-Zertifizierung (ausgerichtet am PMBOK® 8) validiert und wird durch PMI-Spezialisierungen im Bereich Künstliche Intelligenz im Projektmanagement erweitert – für prädiktive Risikoanalysen, PMO-Automatisierung und datengestützte Entscheidungen.',
    aboutP4:
      'In der Praxis gestalte ich maßgeschneiderte Governance-Strukturen für jede Herausforderung und bewege mich souverän zwischen prädiktiven, agilen (adaptiven) und hybriden Vorgehensweisen.',
    credentialsTitle: 'Zertifizierungen & Abschlüsse',
    credentials: [
      { title: 'Internationale PMP®-Zertifizierung', subtitle: 'PMI • Ausgerichtet am PMBOK® 8. Ausgabe', icon: 'shield' },
      { title: 'KI im Projektmanagement', subtitle: 'Executive-Spezialisierungen • PMI', icon: 'cpu' },
      { title: 'MBA in Projektmanagement', subtitle: 'Fundação Getulio Vargas (FGV)', icon: 'award' },
      { title: 'Aufbaustudium Strategisches Management', subtitle: 'Unternehmensstrategie & ROI', icon: 'trending' },
      { title: 'B.Sc. in Wirtschaftsinformatik', subtitle: 'Bundesuniversität von Santa Catarina (UFSC)', icon: 'grad' }
    ],
    methodologiesTitle: 'Methodische Ansätze',
    methodologies: ['Prädiktiv', 'Agil (Adaptiv)', 'Hybrid'],
    casesTitle: 'Executive Cases (STAR-Methodik)',
    casesSubtitle:
      'Sortiert nach finanzieller Relevanz (Budget) und aktuellstem Jahr. Situation, Aufgabe, Aktion und messbare Ergebnisse.',
    filterAll: 'Alle',
    filterSectorPrefix: 'Sektor',
    filterTypePrefix: 'Bereich',
    loadingCases: 'Executive-Portfolio wird geladen...',
    emptyCases: 'Noch keine STAR-Cases für diesen Filter veröffentlicht.',
    budgetLabel: 'Budget',
    roiLabel: 'Impact / ROI',
    starS: 'S — Situation & Kontext',
    starT: 'T — Aufgabe & Executive-Herausforderung',
    starA: 'A — Aktion & Angewandte Governance',
    starR: 'R — Messbare Ergebnisse',
    footerRights: 'Alle Rechte vorbehalten.',
    adminArea: 'Administratorbereich',
    authenticated: 'Authentifiziert'
  }
};

// Extrai o ano mais recente de strings como "2023 - 2025" ou "2026"
function extractLatestYear(yearStr) {
  if (!yearStr) return 0;
  const matches = yearStr.toString().match(/\d{4}/g);
  if (!matches) return 0;
  return Math.max(...matches.map(Number));
}

// Logos Oficiais (arquivos salvos na pasta public/)
function InstitutionLogos() {
  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-2.5">
      {/* PMI */}
      <div
        title="Project Management Institute (PMI)"
        className="h-9 px-3.5 rounded-full bg-white/95 border border-slate-700/80 flex items-center justify-center shadow-sm"
      >
        <img
          src="/logo-pmi.png"
          alt="Project Management Institute (PMI)"
          className="h-6 w-auto object-contain"
        />
      </div>

      {/* FIA */}
      <div
        title="Fundação Instituto de Administração (FIA Business School)"
        className="h-9 px-3.5 rounded-full bg-white/95 border border-slate-700/80 flex items-center justify-center shadow-sm"
      >
        <img
          src="/logo-fia.png"
          alt="FIA Business School"
          className="h-5 w-auto object-contain"
        />
      </div>

      {/* FGV */}
      <div
        title="Fundação Getulio Vargas (FGV)"
        className="h-9 px-3.5 rounded-full bg-white/95 border border-slate-700/80 flex items-center justify-center shadow-sm"
      >
        <img
          src="/logo-fgv.png"
          alt="Fundação Getulio Vargas (FGV)"
          className="h-4 w-auto object-contain"
        />
      </div>

      {/* SBC */}
      <div
        title="Sociedade Brasileira de Computação (SBC)"
        className="h-9 px-3.5 rounded-full bg-white/95 border border-slate-700/80 flex items-center justify-center shadow-sm"
      >
        <img
          src="/logo-sbc.png"
          alt="Sociedade Brasileira de Computação (SBC)"
          className="h-6 w-auto object-contain"
        />
      </div>
    </div>
  );
}

export default function App() {
  // Idioma ativo (PT, EN, IT, DE) com persistência
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('portfolio_lang');
    return saved && TRANSLATIONS[saved] ? saved : 'pt';
  });

  const t = TRANSLATIONS[lang];

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('portfolio_lang', newLang);
  };

  // Rolagem suave para as seções
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Autenticação e Sessão Real (Supabase)
  const [session, setSession] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dados dos Projetos STAR
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Filtros
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');

  // Modal de Cadastro / Edição de Case
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [savingProject, setSavingProject] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    sector: DEFAULT_SECTORS[0],
    project_type: DEFAULT_TYPES[0],
    year: new Date().getFullYear().toString(),
    budget: '',
    roi: '',
    situation: '',
    task: '',
    action: '',
    result: ''
  });

  // Notificação Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Inicializa sessão e busca projetos do banco
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchProjects();

    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    const { data, error } = await supabase
      .from('star_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar cases:', error);
      showToast('Erro ao conectar ao banco de dados.', 'error');
    } else {
      setProjects(data || []);
    }
    setLoadingProjects(false);
  };

  // Login Seguro (E-mail + Senha)
  const handleSecureLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail.trim(),
      password: adminPasswordInput,
    });

    setAuthLoading(false);

    if (error) {
      setLoginError('E-mail ou senha incorretos.');
    } else {
      setShowLoginModal(false);
      setAdminPasswordInput('');
      showToast('Modo Administrador autenticado com segurança.');
    }
  };

  // Logout Seguro
  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('Sessão encerrada.');
  };

  // Abrir Modal para Novo Case
  const openNewProjectModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      sector: DEFAULT_SECTORS[0],
      project_type: DEFAULT_TYPES[0],
      year: new Date().getFullYear().toString(),
      budget: '',
      roi: '',
      situation: '',
      task: '',
      action: '',
      result: ''
    });
    setShowProjectModal(true);
  };

  // Abrir Modal para Editar Case
  const openEditProjectModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      sector: project.sector,
      project_type: project.project_type,
      year: project.year || '',
      budget: project.budget || '',
      roi: project.roi || '',
      situation: project.situation,
      task: project.task,
      action: project.action,
      result: project.result
    });
    setShowProjectModal(true);
  };

  // Salvar ou Atualizar Case no Supabase
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!session) return;
    setSavingProject(true);

    const payload = {
      title: formData.title,
      sector: formData.sector,
      project_type: formData.project_type,
      year: formData.year,
      budget: Number(formData.budget) || 0,
      roi: Number(formData.roi) || 0,
      situation: formData.situation,
      task: formData.task,
      action: formData.action,
      result: formData.result
    };

    if (editingProject) {
      const { error } = await supabase
        .from('star_projects')
        .update(payload)
        .eq('id', editingProject.id);

      if (error) {
        showToast('Erro ao atualizar o case.', 'error');
      } else {
        showToast('Case STAR atualizado na nuvem!');
        setShowProjectModal(false);
        fetchProjects();
      }
    } else {
      const { error } = await supabase
        .from('star_projects')
        .insert([payload]);

      if (error) {
        showToast('Erro ao salvar novo case.', 'error');
      } else {
        showToast('Novo case STAR publicado com sucesso!');
        setShowProjectModal(false);
        fetchProjects();
      }
    }
    setSavingProject(false);
  };

  // Excluir Case no Supabase
  const handleDeleteProject = async (id) => {
    if (!session) return;
    if (!window.confirm('Tem certeza que deseja excluir permanentemente este case?')) return;

    const { error } = await supabase
      .from('star_projects')
      .delete()
      .eq('id', id);

    if (error) {
      showToast('Erro ao excluir case.', 'error');
    } else {
      showToast('Case removido com sucesso.');
      fetchProjects();
    }
  };

  // Exportar Backup JSON
  const handleExportBackup = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-portfolio-romulo-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON baixado.');
  };

  // Importar Backup JSON para o Banco Supabase
  const handleImportBackup = async (e) => {
    const file = e.target.files[0];
    if (!file || !session) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error('Formato inválido');

        const cleanedRecords = imported.map((item) => ({
          title: item.title || 'Projeto Importado',
          sector: item.sector || DEFAULT_SECTORS[0],
          project_type: item.project_type || item.type || DEFAULT_TYPES[0],
          year: item.year || '2025',
          budget: Number(item.budget) || 0,
          roi: Number(item.roi) || 0,
          situation: item.situation || '',
          task: item.task || '',
          action: item.action || '',
          result: item.result || ''
        }));

        const { error } = await supabase.from('star_projects').insert(cleanedRecords);
        if (error) throw error;

        showToast(`${cleanedRecords.length} cases restaurados para o banco!`);
        fetchProjects();
      } catch (err) {
        showToast('Erro ao importar arquivo JSON.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Listas dinâmicas de filtros
  const sectors = useMemo(() => {
    const set = new Set([...DEFAULT_SECTORS, ...projects.map((p) => p.sector)]);
    return ['Todos', ...Array.from(set)];
  }, [projects]);

  const types = useMemo(() => {
    const set = new Set([...DEFAULT_TYPES, ...projects.map((p) => p.project_type)]);
    return ['Todos', ...Array.from(set)];
  }, [projects]);

  // Projetos Filtrados e Ordenados por Relevância (Maior Orçamento) e Ano Mais Recente
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((p) => {
      const matchSector = selectedSector === 'Todos' || p.sector === selectedSector;
      const matchType = selectedType === 'Todos' || p.project_type === selectedType;
      return matchSector && matchType;
    });

    return [...filtered].sort((a, b) => {
      const budgetA = Number(a.budget) || 0;
      const budgetB = Number(b.budget) || 0;
      if (budgetB !== budgetA) {
        return budgetB - budgetA;
      }
      const yearA = extractLatestYear(a.year);
      const yearB = extractLatestYear(b.year);
      return yearB - yearA;
    });
  }, [projects, selectedSector, selectedType]);

  // KPIs Executivos Calculados Automaticamente
  const kpis = useMemo(() => {
    const totalProjects = filteredProjects.length;
    const totalBudget = filteredProjects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
    const avgRoi =
      totalProjects > 0
        ? filteredProjects.reduce((acc, p) => acc + (Number(p.roi) || 0), 0) / totalProjects
        : 0;
    const uniqueSectors = new Set(filteredProjects.map((p) => p.sector)).size;

    return { totalProjects, totalBudget, avgRoi, uniqueSectors };
  }, [filteredProjects]);

  const formatCurrency = (val) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
    return `R$ ${val.toLocaleString('pt-BR')}`;
  };

  const renderCredentialIcon = (type) => {
    switch (type) {
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'award':
        return <Award className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0" />;
      default:
        return <GraduationCap className="w-5 h-5 text-slate-300 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 scroll-smooth">
      {/* Notificação Flutuante */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-2xl border text-sm font-medium transition-all ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-800 text-red-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Barra Administrativa (Visível apenas quando autenticado) */}
      {session && (
        <div className="bg-cyan-950/60 border-b border-cyan-800/60 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-cyan-300 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Admin Conectado: {session.user.email}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={openNewProjectModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-md transition"
              >
                <Plus className="w-4 h-4" /> Novo Case STAR
              </button>
              <button
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" /> Backup JSON
              </button>
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md border border-slate-700 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" /> Restaurar
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs rounded-md border border-red-900/60 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho Executivo (Hero Centralizado) */}
      <header className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6 pt-6 flex justify-end">
          {/* Seletor de Idiomas (PT / EN / IT / DE) */}
          <div className="inline-flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            {[
              { code: 'pt', label: 'PT' },
              { code: 'en', label: 'EN' },
              { code: 'it', label: 'IT' },
              { code: 'de', label: 'DE' }
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => handleLanguageChange(item.code)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  lang === item.code
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 text-center flex flex-col items-center">
          {/* Badges + Logos Oficiais PMI, FIA, FGV, SBC centralizados */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
              {t.heroBadge}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
              PMP® • PMBOK® 8
            </span>
            <InstitutionLogos />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Romulo Radowitz
          </h1>
          <p className="text-xl md:text-2xl text-cyan-400 font-medium mb-6">
            {t.heroRole}
          </p>
          <p className="max-w-3xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed mb-8">
            {t.heroSubtitle}
          </p>

          {/* Botões de Ação Centralizados: Trajetória, Projetos, LinkedIn e Contato */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => scrollToSection('trajetoria')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold rounded-lg text-sm transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4" /> {t.navTrajectoryBtn}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('projetos')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold rounded-lg text-sm transition cursor-pointer"
            >
              <FolderKanban className="w-4 h-4" /> {t.navProjectsBtn}
            </button>
            <a
              href="https://www.linkedin.com/in/radowitz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-sm transition"
            >
              <Linkedin className="w-4 h-4" /> {t.linkedinBtn}
            </a>
            <a
              href="mailto:romuloradowitz@hotmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium rounded-lg text-sm transition"
            >
              <Mail className="w-4 h-4" /> {t.contactBtn}
            </a>
          </div>
        </div>
      </header>

      {/* Painel de KPIs Consolidados */}
      <section className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">{t.kpi1Label}</span>
              <Briefcase className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white">{t.kpi1Value}</div>
            <p className="text-xs text-slate-500 mt-1">{t.kpi1Sub}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">{t.kpi2Label}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatCurrency(kpis.totalBudget)}</div>
            <p className="text-xs text-slate-500 mt-1">{t.kpi2Sub}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">{t.kpi3Label}</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white">{kpis.avgRoi.toFixed(1)}%</div>
            <p className="text-xs text-slate-500 mt-1">{t.kpi3Sub}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">{t.kpi4Label}</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">{kpis.uniqueSectors}</div>
            <p className="text-xs text-slate-500 mt-1">{t.kpi4Sub}</p>
          </div>
        </div>
      </section>

      {/* Seção Narrativa Executiva, Formação, IA PMI e Metodologias */}
      <section id="trajetoria" className="max-w-6xl mx-auto px-6 pt-14 scroll-mt-6">
        <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Narrativa da Trajetória (7 colunas) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                {t.aboutBadge}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {t.aboutTitle}
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                {t.aboutP1}
              </p>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                {t.aboutP2}
              </p>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                {t.aboutP3}
              </p>
              <p className="text-sm md:text-base text-cyan-200/90 font-medium leading-relaxed pt-1">
                {t.aboutP4}
              </p>

              {/* Abordagens Metodológicas */}
              <div className="pt-4 border-t border-slate-800/80">
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> {t.methodologiesTitle}
                </span>
                <div className="flex flex-wrap gap-2">
                  {t.methodologies.map((method) => (
                    <span
                      key={method}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pilares Acadêmicos e Certificações (5 colunas) */}
            <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                {t.credentialsTitle}
              </h3>
              {t.credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800/80"
                >
                  <div className="mt-0.5">{renderCredentialIcon(cred.icon)}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{cred.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{cred.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filtros e Listagem de Cases STAR */}
      <main id="projetos" className="max-w-6xl mx-auto px-6 py-14 scroll-mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold text-white">{t.casesTitle}</h2>
            <p className="text-sm text-slate-400 mt-1">
              {t.casesSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-transparent text-sm text-slate-200 focus:outline-none"
              >
                {sectors.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {t.filterSectorPrefix}: {s === 'Todos' ? t.filterAll : s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent text-sm text-slate-200 focus:outline-none"
              >
                {types.map((typeItem) => (
                  <option key={typeItem} value={typeItem} className="bg-slate-900">
                    {t.filterTypePrefix}: {typeItem === 'Todos' ? t.filterAll : typeItem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estado de Carregamento ou Lista de Projetos */}
        {loadingProjects ? (
          <div className="py-20 text-center text-slate-400">{t.loadingCases}</div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl mt-8">
            <p className="text-slate-400 mb-4">{t.emptyCases}</p>
            {session && (
              <button
                onClick={openNewProjectModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-950 font-semibold rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" /> Cadastrar Primeiro Case
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mt-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 md:p-8 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium">
                        {project.sector}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-medium">
                        {project.project_type}
                      </span>
                      {project.year && (
                        <span className="text-xs text-slate-500 font-mono">• {project.year}</span>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{project.title}</h3>
                  </div>

                  <div className="flex items-center gap-4">
                    {Number(project.budget) > 0 && (
                      <div className="text-right">
                        <span className="block text-[11px] uppercase tracking-wider text-slate-500">{t.budgetLabel}</span>
                        <span className="text-sm font-bold text-slate-200">{formatCurrency(Number(project.budget))}</span>
                      </div>
                    )}
                    {Number(project.roi) > 0 && (
                      <div className="text-right">
                        <span className="block text-[11px] uppercase tracking-wider text-slate-500">{t.roiLabel}</span>
                        <span className="text-sm font-bold text-emerald-400">+{project.roi}%</span>
                      </div>
                    )}
                    {session && (
                      <div className="flex items-center gap-1.5 ml-2 pl-4 border-l border-slate-800">
                        <button
                          onClick={() => openEditProjectModal(project)}
                          title="Editar Case"
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          title="Excluir Case"
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grade STAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5" /> {t.starS}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.situation}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5" /> {t.starT}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.task}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5" /> {t.starA}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.action}</p>
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t.starR}
                      </h4>
                      <p className="text-sm text-emerald-100 leading-relaxed font-medium">{project.result}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Romulo Radowitz. {t.footerRights}</p>
          {!session ? (
            <button
              onClick={() => {
                setLoginError('');
                setShowLoginModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition"
            >
              <Lock className="w-3.5 h-3.5" /> {t.adminArea}
            </button>
          ) : (
            <span className="text-emerald-500">{t.authenticated}</span>
          )}
        </div>
      </footer>

      {/* Modal de Login Seguro (Usuário + Senha) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Acesso Restrito</h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSecureLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                  E-mail do Administrador
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {loginError && (
                <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/60 px-3 py-2 rounded">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-sm transition"
              >
                {authLoading ? 'Autenticando...' : 'Entrar com Segurança'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cadastro / Edição de Case STAR */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? 'Editar Case STAR' : 'Novo Case Executivo STAR'}
              </h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Título do Programa / Projeto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex.: Integração Pós-Fusão de Operações Hospitalares"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Setor *
                  </label>
                  <input
                    type="text"
                    required
                    list="sectors-list"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <datalist id="sectors-list">
                    {DEFAULT_SECTORS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Tipo de Frente *
                  </label>
                  <input
                    type="text"
                    required
                    list="types-list"
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <datalist id="types-list">
                    {DEFAULT_TYPES.map((typeItem) => (
                      <option key={typeItem} value={typeItem} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Ano / Período
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024 - 2025"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Orçamento (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="1500000"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Ganho / ROI ANUAL(%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.roi}
                    onChange={(e) => setFormData({ ...formData, roi: e.target.value })}
                    placeholder="32"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-cyan-400 mb-1">
                  S — Situação (Contexto organizacional e cenário inicial) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.situation}
                  onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-cyan-400 mb-1">
                  T — Tarefa (Objetivo estratégico e responsabilidade) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-cyan-400 mb-1">
                  A — Ação (Metodologia, governança e execução liderada) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-emerald-400 mb-1">
                  R — Resultados (Indicadores financeiros, prazos e impacto entregue) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-sm transition"
                >
                  {savingProject ? 'Salvando na nuvem...' : 'Salvar Case STAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
