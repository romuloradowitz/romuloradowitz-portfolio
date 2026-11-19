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
  ChevronRight
} from 'lucide-react';
import { supabase } from './supabaseClient';

const DEFAULT_SECTORS = ['Saúde Suplementar', 'Telecomunicações', 'TI & Transformação Digital', 'Operações & PMO'];
const DEFAULT_TYPES = ['Transformação Organizacional', 'Implantação de PMO', 'Eficiência Operacional', 'Integração M&A'];

export default function App() {
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

  // Projetos Filtrados
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSector = selectedSector === 'Todos' || p.sector === selectedSector;
      const matchType = selectedType === 'Todos' || p.project_type === selectedType;
      return matchSector && matchType;
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
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

      {/* Cabeçalho Executivo (Hero) */}
      <header className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-6">
            Portfólio Executivo & Track Record STAR
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Romulo Radowitz
          </h1>
          <p className="text-xl md:text-2xl text-cyan-400 font-medium mb-6">
            Diretor Corporativo de PMO & Líder de Projetos Estratégicos
          </p>
     <p className="max-w-3xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed mb-8 text-balance">
            Mais de 16 anos liderando programas e projetos de alta complexidade, governança corporativa, transformação digital nos setores de Saúde Suplementar, Telecomunicações e Tecnologia da Informação.
          </p>
    <div className="flex flex-wrap items-center justify-center gap-4">
        
            <a
              href="https://www.linkedin.com/in/radowitz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-sm transition"
            >
              <Linkedin className="w-4 h-4" /> Conectar no LinkedIn
            </a>
            <a
              href="mailto:romuloradowitz@hotmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium rounded-lg text-sm transition"
            >
              <Mail className="w-4 h-4" /> Contato Executivo
            </a>
          </div>
        </div>
      </header>

      {/* Painel de KPIs Consolidados */}
      <section className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Programas & Cases</span>
              <Briefcase className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white">{kpis.totalProjects}</div>
            <p className="text-xs text-slate-500 mt-1">Entregas documentadas em STAR</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Orçamento Gerido</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatCurrency(kpis.totalBudget)}</div>
            <p className="text-xs text-slate-500 mt-1">Capex/Opex sob governança</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">ROI / Ganho Médio</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white">{kpis.avgRoi.toFixed(1)}%</div>
            <p className="text-xs text-slate-500 mt-1">Retorno e eficiência capturados</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Setores de Atuação</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">{kpis.uniqueSectors}</div>
            <p className="text-xs text-slate-500 mt-1">Indústrias de alta complexidade</p>
          </div>
        </div>
      </section>

      {/* Filtros e Listagem de Cases STAR */}
      <main className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold text-white">Cases Executivos (Metodologia STAR)</h2>
            <p className="text-sm text-slate-400 mt-1">
              Situação, Tarefa, Ação e Resultados mensuráveis entregues em liderança corporativa.
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
                    Setor: {s}
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
                {types.map((t) => (
                  <option key={t} value={t} className="bg-slate-900">
                    Frente: {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estado de Carregamento ou Lista de Projetos */}
        {loadingProjects ? (
          <div className="py-20 text-center text-slate-400">Carregando portfólio executivo...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl mt-8">
            <p className="text-slate-400 mb-4">Nenhum case STAR publicado para este filtro ainda.</p>
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
                        <span className="block text-[11px] uppercase tracking-wider text-slate-500">Orçamento</span>
                        <span className="text-sm font-bold text-slate-200">{formatCurrency(Number(project.budget))}</span>
                      </div>
                    )}
                    {Number(project.roi) > 0 && (
                      <div className="text-right">
                        <span className="block text-[11px] uppercase tracking-wider text-slate-500">Impacto / ROI</span>
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
                        <ChevronRight className="w-3.5 h-3.5" /> S — Situação & Contexto
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.situation}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5" /> T — Tarefa & Desafio Executivo
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.task}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5" /> A — Ação & Governança Aplicada
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.action}</p>
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> R — Resultados Mensuráveis
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
          <p>© {new Date().getFullYear()} Romulo Radowitz. Todos os direitos reservados.</p>
          {!session ? (
            <button
              onClick={() => {
                setLoginError('');
                setShowLoginModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition"
            >
              <Lock className="w-3.5 h-3.5" /> Área do Administrador
            </button>
          ) : (
            <span className="text-emerald-500">Autenticado</span>
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
                    {DEFAULT_TYPES.map((t) => (
                      <option key={t} value={t} />
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
                    Ganho / ROI (%)
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
