import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Moon,
  Presentation,
  Printer,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import {
  CLOSING_CONCLUSION,
  CONSOLIDATED_MATRIX,
  EVALUATION_MATRIX,
  INTRO_TEXT,
  OBJECTIVES,
  PORTFOLIO_META,
  REFLECTION_RETROSPECTIVE,
  REFLECTION_SECTIONS,
  STAGE_1_POINTS,
  STAGE_2_DISCARDED,
  STAGE_3_PROPOSALS,
  TEAM_MEMBERS,
} from './data/portfolioData';
import Stage1GraphsExplorer from './components/Stage1GraphsExplorer';
import Stage2EquivalenceExplorer from './components/Stage2EquivalenceExplorer';
import Stage3MonoidExplorer from './components/Stage3MonoidExplorer';
import Stage4ModularValidator from './components/Stage4ModularValidator';
import PresentationMode from './components/PresentationMode';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('unju-portfolio-theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [presentationOpen, setPresentationOpen] = useState<boolean>(false);
  const [presentationInitialSlide, setPresentationInitialSlide] = useState<number>(0);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [reflectionImgFailed, setReflectionImgFailed] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeStageFilter, setActiveStageFilter] = useState<number | 'all'>('all');
  const [selectedEvalIdx, setSelectedEvalIdx] = useState<number>(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      window.localStorage.setItem('unju-portfolio-theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage failures in restricted browser environments
    }
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / docHeight)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openPresentationAt = (slideIdx: number) => {
    setPresentationInitialSlide(slideIdx);
    setPresentationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#090E1A] text-[#0F172A] dark:text-slate-100 transition-colors duration-200">
      {presentationOpen && (
        <PresentationMode
          initialSlide={presentationInitialSlide}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          onExit={() => setPresentationOpen(false)}
        />
      )}

      {/* Top Navigation Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xs no-print transition-colors">
        <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Wordmark */}
          <a
            href="#portada"
            className="inline-flex items-center gap-2 rounded-lg border border-[#1D4ED8]/30 dark:border-sky-500/40 bg-white dark:bg-[#111827] p-1 pr-3 shadow-xs hover:border-[#1D4ED8] dark:hover:border-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="rounded-md bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-white">
              GRUPO 36
            </span>
            <span className="font-bold text-sm tracking-tight text-[#0F172A] dark:text-white">
              UNJu
            </span>
          </a>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Navegación principal del portafolio"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a
              href="#introduccion"
              className="hover:text-[#1D4ED8] dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Introducción
            </a>
            <a
              href="#etapas"
              className="hover:text-[#1D4ED8] dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Etapas 1–4
            </a>
            <a
              href="#producto-final"
              className="hover:text-[#1D4ED8] dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Síntesis
            </a>
            <a
              href="#reflexion"
              className="hover:text-[#1D4ED8] dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Reflexión
            </a>
            <a
              href="#evaluacion"
              className="hover:text-[#1D4ED8] dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Evaluación
            </a>
          </nav>

          {/* Zone 3: Theme Toggle & Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-pressed={darkMode}
              title={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {darkMode ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  <span className="hidden sm:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                  <span className="hidden sm:inline">Oscuro</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => openPresentationAt(0)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] px-4 py-2 text-xs font-semibold text-white hover:from-[#1E40AF] hover:via-[#2563EB] hover:to-[#0EA5E9] shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
              Modo Exposición
            </button>
          </div>
        </div>
        {/* Precision Reading Progress Line */}
        <div className="h-[2px] w-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] origin-left transition-transform duration-100"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:py-14 space-y-20">
        {/* Hero / Institutional Cover */}
        <section id="portada" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Cover Column */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 lg:p-10 transition-colors">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>{PORTFOLIO_META.institution}</span>
                  <span aria-hidden="true">·</span>
                  <span>{PORTFOLIO_META.faculty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{PORTFOLIO_META.year}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#1D4ED8] dark:text-sky-400">
                    {PORTFOLIO_META.career} · {PORTFOLIO_META.subject}
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0F172A] dark:text-white leading-[1.08]">
                    {PORTFOLIO_META.title}
                  </h1>
                </div>

                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                  Plataforma interactiva de exposición académica del <strong className="text-[#0F172A] dark:text-white">{PORTFOLIO_META.team}</strong>: cuatro modelos formales de matemática discreta con simuladores en vivo aplicados a la gestión educativa y plataformas digitales.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 no-print">
                  <button
                    type="button"
                    onClick={() => openPresentationAt(0)}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] px-5 py-2.5 text-sm font-semibold text-white hover:from-[#1E40AF] hover:via-[#2563EB] hover:to-[#0EA5E9] shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Presentation className="h-4 w-4" aria-hidden="true" />
                    Iniciar Exposición Oral
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="h-4 w-4" aria-hidden="true" />
                    Imprimir / PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setDarkMode((prev) => !prev)}
                    aria-pressed={darkMode}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {darkMode ? (
                      <>
                        <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
                        Tema Claro
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                        Tema Oscuro
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Team Roster Footer inside Cover */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Integrantes · {PORTFOLIO_META.team}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {TEAM_MEMBERS.map((member) => (
                    <div key={member.dni} className="space-y-0.5">
                      <div className="text-sm font-semibold text-[#0F172A] dark:text-white">{member.name}</div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">DNI {member.dni}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Cover Institutional Logo */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 flex flex-col justify-between transition-colors">
              <div className="relative flex-1 min-h-[260px] flex items-center justify-center rounded-xl bg-white p-4 border border-slate-100 dark:border-slate-700/60">
                {!heroImgFailed ? (
                  <img
                    src={PORTFOLIO_META.facultyLogo}
                    alt="Logo oficial de la Facultad de Ingeniería — Universidad Nacional de Jujuy"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="max-h-[280px] w-auto object-contain"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl">
                    <BookOpen className="h-10 w-10 text-[#1D4ED8] dark:text-sky-400 mb-2" aria-hidden="true" />
                    <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
                      Facultad de Ingeniería
                    </span>
                    <span className="text-xs">Universidad Nacional de Jujuy</span>
                  </div>
                )}
              </div>
              <p className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                Facultad de Ingeniería · Universidad Nacional de Jujuy (UNJu)
              </p>
            </div>
          </div>

          {/* 4-Stage Quick Launch Strip below Hero Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONSOLIDATED_MATRIX.map((item) => (
              <a
                key={item.stageNumber}
                href={`#${item.targetId}`}
                onClick={() => setActiveStageFilter('all')}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 hover:border-[#1D4ED8]/60 dark:hover:border-sky-500/60 transition-colors flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-xs text-[#1D4ED8] dark:text-sky-400 font-semibold tabular-nums">
                    <span>0{item.stageNumber} · {item.stageLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </div>
                  <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
                    {item.structure}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.problem}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Section 1: Introduction & Objectives */}
        <section id="introduccion" className="scroll-mt-24 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                01 · Encuadre Inicial
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                Introducción y Objetivos
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 max-w-prose">
                {INTRO_TEXT}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {OBJECTIVES.map((obj) => (
                  <div key={obj.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 space-y-2 transition-colors">
                    <div className="font-mono text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 tabular-nums">
                      Objetivo {obj.id}
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white leading-snug">
                      {obj.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{obj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Evidencias del Proceso de Construcción (4 Etapas) */}
        <section id="etapas" className="scroll-mt-24 space-y-12 border-t border-slate-200 dark:border-slate-800 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                02 · Evidencias del Proceso de Construcción
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-white">
                Laboratorios Interactivos por Etapa
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Filtra por etapa para concentrar la exposición en un modelo específico o recorre las cuatro etapas con sus simuladores ejecutables en vivo.
              </p>
            </div>

            {/* Interactive Stage Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 p-1 no-print">
              <button
                type="button"
                onClick={() => setActiveStageFilter('all')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeStageFilter === 'all'
                    ? 'bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Todas las etapas
              </button>
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setActiveStageFilter(num)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeStageFilter === num
                      ? 'bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  Etapa {num}
                </button>
              ))}
            </div>
          </div>

          {/* Etapa 1 */}
          {(activeStageFilter === 'all' || activeStageFilter === 1) && (
            <article id="etapa-1" className="scroll-mt-24 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Etapa 1 · Estructuras Conectivas y Jerárquicas
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                    Teoría de Grafos y Árboles
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openPresentationAt(2)}
                  className="text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 hover:underline underline-offset-4 cursor-pointer no-print whitespace-nowrap"
                >
                  Abrir Etapa 1 en Exposición →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAGE_1_POINTS.map((point) => (
                  <div key={point.index} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 space-y-2 transition-colors">
                    <div className="font-mono text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 tabular-nums">
                      Caso {point.index}
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">{point.title}</h4>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{point.detail}</p>
                  </div>
                ))}
              </div>

              <Stage1GraphsExplorer />
            </article>
          )}

          {/* Etapa 2 */}
          {(activeStageFilter === 'all' || activeStageFilter === 2) && (
            <article id="etapa-2" className="scroll-mt-24 space-y-6 pt-4">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Etapa 2 · Clasificación sin Solapamientos
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                    Relaciones de Equivalencia y Partición de Conjuntos para Trayectos Evaluativos
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openPresentationAt(3)}
                  className="text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 hover:underline underline-offset-4 cursor-pointer no-print whitespace-nowrap"
                >
                  Abrir Etapa 2 en Exposición →
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    Modelamos la realidad concreta de la UNJu: cursantes de distintas localidades y con cargas laborales dispares que requerían metodologías de evaluación diferenciadas (<strong className="text-[#0F172A] dark:text-white">Local</strong>, <strong className="text-[#0F172A] dark:text-white">Híbrido</strong> y <strong className="text-[#0F172A] dark:text-white">Remoto</strong>). El aporte central del proceso fue descartar de manera fundamentada herramientas alternativas antes de adoptar <code className="font-mono text-[#1D4ED8] dark:text-sky-400">f(a) = f(b)</code>.
                  </p>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 space-y-2 transition-colors">
                    <div className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Resultado · Conjunto Cociente |E/R| = 3
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      La relación binaria demostró ser reflexiva, simétrica y transitiva, generando 3 clases disjuntas que garantizan cobertura total y evitan solapamientos o exclusiones arbitrarias.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {STAGE_2_DISCARDED.map((item) => (
                    <div key={item.structure} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 space-y-2 transition-colors">
                      <div className="font-mono text-xs font-semibold text-red-700 dark:text-red-400">
                        Hipótesis descartada
                      </div>
                      <h4 className="text-base font-bold text-[#0F172A] dark:text-white">{item.structure}</h4>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Stage2EquivalenceExplorer />
            </article>
          )}

          {/* Etapa 3 */}
          {(activeStageFilter === 'all' || activeStageFilter === 3) && (
            <article id="etapa-3" className="scroll-mt-24 space-y-6 pt-4">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Etapa 3 · Álgebra de Actas Académicas
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                    Estructuras Algebraicas y la Regla de la Calificación Máxima
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openPresentationAt(4)}
                  className="text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 hover:underline underline-offset-4 cursor-pointer no-print whitespace-nowrap"
                >
                  Abrir Etapa 3 en Exposición →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STAGE_3_PROPOSALS.map((prop) => (
                  <div
                    key={prop.id}
                    className={`rounded-xl border p-5 space-y-2 transition-colors ${
                      prop.selected
                        ? 'border-[#1D4ED8] dark:border-sky-500 bg-white dark:bg-[#111827]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0D1322]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={prop.selected ? 'text-[#1D4ED8] dark:text-sky-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
                        {prop.selected ? 'Elegida por unanimidad' : 'Propuesta individual'}
                      </span>
                      {prop.selected && <CheckCircle2 className="h-4 w-4 text-[#1D4ED8] dark:text-sky-400" aria-hidden="true" />}
                    </div>
                    <h4 className="text-base font-bold text-[#0F172A] dark:text-white">{prop.name}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{prop.summary}</p>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      {prop.verdict}
                    </p>
                  </div>
                ))}
              </div>

              <Stage3MonoidExplorer />
            </article>
          )}

          {/* Etapa 4 */}
          {(activeStageFilter === 'all' || activeStageFilter === 4) && (
            <article id="etapa-4" className="scroll-mt-24 space-y-6 pt-4">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Etapa 4 · Integridad de Datos y Aritmética Modular
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                    Códigos de Seguridad y Validación Modular contra Errores de Tipeo
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openPresentationAt(5)}
                  className="text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 hover:underline underline-offset-4 cursor-pointer no-print whitespace-nowrap"
                >
                  Abrir Etapa 4 en Exposición →
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    Comparamos un código detector (5,4) de paridad simple con un dígito verificador ponderado en el cuerpo primo <strong className="text-[#0F172A] dark:text-white">ℤ₁₁</strong> para números de legajo e inventario escolar de netbooks. Elegimos ℤ₁₁ fundamentando que el módulo 11, al ser primo, carece de divisores de cero: esto garantiza detectar el <strong className="text-[#0F172A] dark:text-white">100% de las sustituciones de un dígito</strong> y el <strong className="text-[#0F172A] dark:text-white">100% de las transposiciones adyacentes</strong> por error humano, superando a los sistemas en ℤ₁₀ que fallan sistemáticamente ante inversiones con diferencia 5.
                  </p>
                </div>
                <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 flex items-start gap-3 transition-colors">
                  <ShieldCheck className="h-5 w-5 text-[#1D4ED8] dark:text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="text-[#0F172A] dark:text-white block mb-0.5">Propiedad clave de cuerpo primo</strong>
                    En ℤ₁₁ todo elemento no nulo posee inverso multiplicativo: <code className="font-mono text-[#1D4ED8] dark:text-sky-400">w · Δ ≠ 0 (mód 11)</code> para toda diferencia <code className="font-mono text-[#1D4ED8] dark:text-sky-400">Δ ≠ 0</code>.
                  </div>
                </div>
              </div>

              <Stage4ModularValidator />
            </article>
          )}
        </section>

        {/* Section 3: Producto Final Consolidado */}
        <section id="producto-final" className="scroll-mt-24 space-y-6 border-t border-slate-200 dark:border-slate-800 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                03 · Producto Final Consolidado
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                Marco Integrado de Modelado para la Informática Educativa
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Los productos concluidos por el Grupo 36 conforman una arquitectura unificada de decisiones institucionales. Haz clic en cualquier etapa para abrir su demostración interactiva en Modo Exposición.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openPresentationAt(6)}
              className="text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 hover:underline underline-offset-4 cursor-pointer no-print whitespace-nowrap"
            >
              Ver síntesis en Exposición →
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] transition-colors">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] font-mono text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Etapa</th>
                  <th className="px-5 py-3.5 font-medium">Problema Educativo</th>
                  <th className="px-5 py-3.5 font-medium">Estructura Matemática</th>
                  <th className="px-5 py-3.5 font-medium">Decisión Operativa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {CONSOLIDATED_MATRIX.map((row) => (
                  <tr
                    key={row.stageNumber}
                    onClick={() => openPresentationAt(row.slideIndex)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 font-mono font-semibold text-[#1D4ED8] dark:text-sky-400 whitespace-nowrap tabular-nums">
                      {row.stageLabel} →
                    </td>
                    <td className="px-5 py-4 text-slate-800 dark:text-slate-200">{row.problem}</td>
                    <td className="px-5 py-4 font-semibold text-[#0F172A] dark:text-white">{row.structure}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{row.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Reflexión Crítica */}
        <section id="reflexion" className="scroll-mt-24 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-14">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
              04 · Proceso Humano y Aprendizaje Situado
            </div>
            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
              Reflexión Crítica: La Experiencia Real del Equipo
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Como estudiantes adultos de la Licenciatura en Informática Educativa, el desarrollo de este proyecto integrador implicó atravesar una serie de tensiones y desafíos que consideramos indispensable visibilizar en este portafolio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {REFLECTION_SECTIONS.map((sec) => (
                <article key={sec.title} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-3 transition-colors">
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">{sec.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{sec.body}</p>
                </article>
              ))}
            </div>

            <aside className="lg:col-span-5 space-y-6">
              <figure className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-3 transition-colors">
                <div className="overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  {!reflectionImgFailed ? (
                    <img
                      src={PORTFOLIO_META.reflectionImage}
                      alt="Hombre estudiante universitario trabajando de noche frente a su computadora con cuadernos de matemática discreta"
                      referrerPolicy="no-referrer"
                      onError={() => setReflectionImgFailed(true)}
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      Registro documental del trabajo nocturno del equipo
                    </div>
                  )}
                </div>
                <figcaption className="mt-2.5 px-1 text-xs text-slate-500 dark:text-slate-400">
                  Fig. 1 — Trabajo nocturno asincrónico: coordinando entregas entre jornadas laborales, familia y distancias geográficas en Jujuy.
                </figcaption>
              </figure>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-2.5 transition-colors">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Proyección y Mejora Continua
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{REFLECTION_RETROSPECTIVE}</p>
              </div>
            </aside>
          </div>
        </section>

        {/* Section 5: Autoevaluación, Coevaluación y Conclusión */}
        <section id="evaluacion" className="scroll-mt-24 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-14">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
              05 · Balance Formativo
            </div>
            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
              Autoevaluación y Coevaluación del Trabajo en Equipo
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Selecciona una dimensión de la matriz para destacar su fundamentación y evidencia concreta dentro del trayecto grupal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] transition-colors">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] font-mono text-xs uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Dimensión Evaluada</th>
                    <th className="px-5 py-3.5 font-medium">Nivel Alcanzado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {EVALUATION_MATRIX.map((row, idx) => {
                    const isSelected = selectedEvalIdx === idx;
                    return (
                      <tr
                        key={row.dimension}
                        onClick={() => setSelectedEvalIdx(idx)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#1D4ED8]/8 dark:bg-sky-500/15'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="px-5 py-4 font-semibold text-[#0F172A] dark:text-white">{row.dimension}</td>
                        <td className="px-5 py-4 whitespace-nowrap font-mono text-xs font-semibold">
                          <span
                            className={
                              row.statusType === 'excellent'
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : row.statusType === 'very-good'
                                ? 'text-[#1D4ED8] dark:text-sky-400'
                                : 'text-amber-700 dark:text-amber-400'
                            }
                          >
                            {row.level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-3 transition-colors">
              <div className="font-mono text-xs uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                Evidencia · {EVALUATION_MATRIX[selectedEvalIdx].level}
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                {EVALUATION_MATRIX[selectedEvalIdx].dimension}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {EVALUATION_MATRIX[selectedEvalIdx].rationale}
              </p>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                Respaldo: {EVALUATION_MATRIX[selectedEvalIdx].evidenceLink}
              </div>
            </div>
          </div>

          {/* Closing Editorial Pull Quote */}
          <div className="border-y border-slate-300 dark:border-slate-800 py-10 px-4 text-center max-w-4xl mx-auto space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Conclusión de Cierre
            </div>
            <blockquote className="text-xl sm:text-2xl font-semibold leading-relaxed text-[#0F172A] dark:text-white">
              “{CLOSING_CONCLUSION}”
            </blockquote>
            <div className="pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              {PORTFOLIO_META.team} · {PORTFOLIO_META.career} · {PORTFOLIO_META.institution} ({PORTFOLIO_META.year})
            </div>
          </div>
        </section>
      </main>

      {/* Clean Minimal Academic Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] mt-12 py-8 px-6 no-print transition-colors">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            {PORTFOLIO_META.subject} · {PORTFOLIO_META.institution} ({PORTFOLIO_META.faculty})
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1D4ED8] dark:hover:text-sky-400 cursor-pointer"
            >
              {darkMode ? <Sun className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" /> : <Moon className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />}
              {darkMode ? 'Tema Claro' : 'Tema Oscuro'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => openPresentationAt(0)}
              className="font-semibold text-[#1D4ED8] dark:text-sky-400 hover:underline underline-offset-4 cursor-pointer"
            >
              Abrir Modo Exposición
            </button>
            <span aria-hidden="true">·</span>
            <a href="#portada" className="hover:text-slate-900 dark:hover:text-white">
              Volver arriba
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
