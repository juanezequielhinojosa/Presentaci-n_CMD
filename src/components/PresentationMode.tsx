import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Sun,
  X,
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
  SPEAKER_NOTES,
  STAGE_1_POINTS,
  STAGE_2_DISCARDED,
  STAGE_3_PROPOSALS,
  TEAM_MEMBERS,
} from '../data/portfolioData';
import Stage1GraphsExplorer from './Stage1GraphsExplorer';
import Stage2EquivalenceExplorer from './Stage2EquivalenceExplorer';
import Stage3MonoidExplorer from './Stage3MonoidExplorer';
import Stage4ModularValidator from './Stage4ModularValidator';

interface PresentationModeProps {
  initialSlide?: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onExit: () => void;
}

const SLIDE_TITLES = [
  'Portada Institucional',
  'Introducción y Objetivos',
  'Etapa 1 · Grafos y Árboles',
  'Etapa 2 · Relaciones de Equivalencia',
  'Etapa 3 · Estructuras Algebraicas',
  'Etapa 4 · Validación Modular ℤ₁₁',
  'Producto Final Consolidado',
  'Reflexión Crítica del Equipo',
  'Autoevaluación y Cierre',
];

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PresentationMode({
  initialSlide = 0,
  darkMode = false,
  onToggleDarkMode,
  onExit,
}: PresentationModeProps) {
  const [slideIndex, setSlideIndex] = useState<number>(initialSlide);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const totalSlides = SLIDE_TITLES.length;

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        setSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit, totalSlides]);

  const progressScale = (slideIndex + 1) / totalSlides;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F4F7FB] dark:bg-[#090E1A] text-[#0F172A] dark:text-slate-100 overflow-hidden transition-colors"
      role="dialog"
      aria-modal="true"
      aria-label="Modo Exposición de Portafolio"
    >
      {/* Top Presentation Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-6 py-3 flex items-center justify-between gap-4 shrink-0 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-bold text-sm tracking-tight text-[#0F172A] dark:text-white whitespace-nowrap shrink-0">
            Modo Exposición
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate">
            {SLIDE_TITLES[slideIndex]}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Stopwatch for oral defense pacing */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span className="font-mono text-xs font-semibold text-[#0F172A] dark:text-white tabular-nums">
              {formatTimer(elapsedSeconds)}
            </span>
            <button
              type="button"
              onClick={() => setTimerRunning((p) => !p)}
              title={timerRunning ? 'Pausar cronómetro' : 'Reanudar cronómetro'}
              className="p-0.5 text-slate-600 dark:text-slate-300 hover:text-[#1D4ED8] dark:hover:text-sky-400 cursor-pointer"
            >
              {timerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
            <button
              type="button"
              onClick={() => setElapsedSeconds(0)}
              title="Reiniciar cronómetro"
              className="p-0.5 text-slate-600 dark:text-slate-300 hover:text-[#1D4ED8] dark:hover:text-sky-400 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-pressed={darkMode}
              title={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
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
          )}

          <button
            type="button"
            onClick={() => setShowNotes((p) => !p)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              showNotes
                ? 'border-[#1D4ED8] bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] text-white'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Guion Oral
          </button>

          <span className="hidden md:inline font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {slideIndex + 1} / {totalSlides}
          </span>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Salir
          </button>
        </div>
      </header>

      {/* Thin Progress Track */}
      <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] transition-transform duration-200 origin-left"
          style={{ transform: `scaleX(${progressScale})` }}
        />
      </div>

      {/* Optional Speaker Notes Banner */}
      {showNotes && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-[#0F172A] dark:bg-[#050811] text-slate-100 px-6 py-3 shrink-0">
          <div className="mx-auto max-w-6xl flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-sky-400">
                Guion de Defensa Oral · Diapositiva {slideIndex + 1}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-100">
                {SPEAKER_NOTES[slideIndex]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNotes(false)}
              className="text-xs text-slate-400 hover:text-white shrink-0 cursor-pointer"
            >
              Ocultar
            </button>
          </div>
        </div>
      )}

      {/* Main Slide Canvas */}
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-6xl">
          {/* Slide 0: Cover */}
          {slideIndex === 0 && (
            <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-lg shadow-slate-900/5 dark:shadow-black/40 overflow-hidden transition-colors">
              <div className="lg:col-span-7 relative z-10 flex flex-col justify-between gap-8 p-8 lg:p-10">
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {PORTFOLIO_META.institution} · {PORTFOLIO_META.faculty} · {PORTFOLIO_META.year}
                  </div>
                  <p className="text-sm font-semibold text-[#1D4ED8] dark:text-sky-400">
                    {PORTFOLIO_META.career} · {PORTFOLIO_META.subject}
                  </p>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] dark:text-white leading-tight">
                    {PORTFOLIO_META.title}
                  </h1>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    Modelado matemático discreto aplicado a la gestión educativa, la arquitectura de plataformas virtuales y la integridad de datos académicos.
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Equipo de Trabajo · {PORTFOLIO_META.team}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TEAM_MEMBERS.map((m) => (
                      <div key={m.dni} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F4F7FB] dark:bg-[#0D1322] p-3.5">
                        <div className="text-sm font-semibold text-[#0F172A] dark:text-white">{m.name}</div>
                        <div className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">DNI {m.dni}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full overflow-hidden bg-slate-900">
                <img
                  src={PORTFOLIO_META.heroImage}
                  alt="Estructura tridimensional de álgebra discreta y grafos en azul cobalto"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none hidden lg:block absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#111827] dark:via-[#111827]/85 dark:to-transparent z-10"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:hidden absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-[#111827] dark:via-[#111827]/85 dark:to-transparent z-10"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/75 via-slate-950/30 to-transparent z-10"
                />
                <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-2.5 rounded-xl border border-white/80 dark:border-slate-700/80 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md px-3 py-2 shadow-lg">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-white p-1 border border-slate-200/80 flex items-center justify-center">
                    <img
                      src={PORTFOLIO_META.facultyLogo}
                      alt="Escudo Facultad de Ingeniería — UNJu"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="leading-tight pr-1">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                      UNJu · FI
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A] dark:text-white whitespace-nowrap">
                      Facultad de Ingeniería
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 right-5 left-5 lg:left-16 z-20 text-right text-xs font-medium text-white/90 drop-shadow-xs">
                  Álgebra discreta · Retículos, grafos y estructuras modulares
                </p>
              </div>
            </div>
          )}

          {/* Slide 1: Intro & Objectives */}
          {slideIndex === 1 && (
            <div className="space-y-8">
              <div className="space-y-3 max-w-3xl">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                  01 · Encuadre Pedagógico
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] dark:text-white">
                  Introducción y Objetivos del Equipo
                </h2>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{INTRO_TEXT}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {OBJECTIVES.map((obj) => (
                  <div key={obj.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-3 transition-colors">
                    <div className="font-mono text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 tabular-nums">
                      Objetivo {obj.id}
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                      {obj.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{obj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 2: Stage 1 */}
          {slideIndex === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                  02 · Evidencias de Construcción · Etapa 1
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                  Teoría de Grafos y Árboles
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAGE_1_POINTS.map((p) => (
                  <div key={p.index} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 space-y-1.5 transition-colors">
                    <div className="font-mono text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 tabular-nums">{p.index}</div>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">{p.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{p.detail}</p>
                  </div>
                ))}
              </div>

              <Stage1GraphsExplorer />
            </div>
          )}

          {/* Slide 3: Stage 2 */}
          {slideIndex === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                  03 · Evidencias de Construcción · Etapa 2
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                  Relaciones de Equivalencia y Partición de Conjuntos
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
                  Modelado de la realidad territorial de la UNJu para asignar trayectos evaluativos diferenciados (Local, Híbrido y Remoto) mediante f(a) = f(b) y el conjunto cociente |E/R| = 3.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STAGE_2_DISCARDED.map((item) => (
                  <div key={item.structure} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 space-y-1 transition-colors">
                    <div className="text-xs font-mono text-red-700 dark:text-red-400 font-semibold">Alternativa descartada</div>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">{item.structure}</h3>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.reason}</p>
                  </div>
                ))}
              </div>

              <Stage2EquivalenceExplorer />
            </div>
          )}

          {/* Slide 4: Stage 3 */}
          {slideIndex === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                  04 · Evidencias de Construcción · Etapa 3
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                  Estructuras Algebraicas y la Regla de la Calificación Máxima
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STAGE_3_PROPOSALS.map((prop) => (
                  <div
                    key={prop.id}
                    className={`rounded-xl border p-4 space-y-1.5 transition-colors ${
                      prop.selected
                        ? 'border-[#1D4ED8] dark:border-sky-500 bg-white dark:bg-[#111827]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D1322]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={prop.selected ? 'text-[#1D4ED8] dark:text-sky-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
                        {prop.selected ? 'Propuesta seleccionada' : 'Propuesta comparada'}
                      </span>
                      {prop.selected && <CheckCircle2 className="h-4 w-4 text-[#1D4ED8] dark:text-sky-400" aria-hidden="true" />}
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">{prop.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{prop.verdict}</p>
                  </div>
                ))}
              </div>

              <Stage3MonoidExplorer />
            </div>
          )}

          {/* Slide 5: Stage 4 */}
          {slideIndex === 5 && (
            <div className="space-y-6">
              <div className="space-y-2 max-w-3xl">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                  05 · Evidencias de Construcción · Etapa 4
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                  Códigos de Seguridad y Validación Modular en ℤ₁₁
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Al ser 11 un número primo, el cuerpo ℤ₁₁ carece de divisores de cero. Esto garantiza la detección del 100% de sustituciones simples y transposiciones adyacentes en legajos y series de netbooks escolares.
                </p>
              </div>

              <Stage4ModularValidator />
            </div>
          )}

          {/* Slide 6: Consolidated Product */}
          {slideIndex === 6 && (
            <div className="space-y-6">
              <div className="space-y-2 max-w-3xl">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                  06 · Síntesis Institucional
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                  Producto Final Consolidado
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Haz clic en cualquier fila para saltar directamente al simulador interactivo de esa etapa.
                </p>
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
                        onClick={() => setSlideIndex(row.slideIndex)}
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
            </div>
          )}

          {/* Slide 7: Critical Reflection */}
          {slideIndex === 7 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                    07 · Voz del Equipo
                  </div>
                  <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                    Reflexión Crítica: La Experiencia Real del Equipo
                  </h2>
                </div>

                {REFLECTION_SECTIONS.map((sec) => (
                  <div key={sec.title} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-2 transition-colors">
                    <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">{sec.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{sec.body}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-3 transition-colors">
                  <img
                    src={PORTFOLIO_META.reflectionImage}
                    alt="Hombre estudiante universitario trabajando de noche frente a su computadora con cuadernos de matemática discreta"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <p className="mt-2.5 px-1 text-xs text-slate-500 dark:text-slate-400">
                    Fig. 1 — Trabajo nocturno asincrónico: coordinando entregas entre jornadas laborales, familia y distancias geográficas en Jujuy.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-2 transition-colors">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Mirada Retrospectiva
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{REFLECTION_RETROSPECTIVE}</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 8: Self & Peer Evaluation + Closing */}
          {slideIndex === 8 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
                  08 · Cierre Formativo
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
                  Autoevaluación, Coevaluación y Conclusión de Cierre
                </h2>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] transition-colors">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] font-mono text-xs uppercase text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Dimensión Evaluada</th>
                      <th className="px-4 py-3 font-medium">Nivel Alcanzado</th>
                      <th className="px-4 py-3 font-medium">Fundamentación y Evidencias</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {EVALUATION_MATRIX.map((row) => (
                      <tr key={row.dimension}>
                        <td className="px-4 py-3 font-semibold text-[#0F172A] dark:text-white">{row.dimension}</td>
                        <td className="px-4 py-3 font-mono font-semibold text-[#1D4ED8] dark:text-sky-400 whitespace-nowrap">
                          {row.level}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 transition-colors">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Conclusión de Cierre
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed text-[#0F172A] dark:text-white">
                  “{CLOSING_CONCLUSION}”
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Slide Controls */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-6 py-3 flex items-center justify-between gap-4 shrink-0 transition-colors">
        <button
          type="button"
          onClick={() => setSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={slideIndex === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Anterior
        </button>

        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-2xl">
          {SLIDE_TITLES.map((title, idx) => (
            <button
              key={title}
              type="button"
              onClick={() => setSlideIndex(idx)}
              title={title}
              className={`rounded-md px-2.5 py-1 font-mono text-xs tabular-nums transition-all cursor-pointer whitespace-nowrap ${
                slideIndex === idx
                  ? 'bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] text-white font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            if (slideIndex < totalSlides - 1) {
              setSlideIndex((prev) => prev + 1);
            } else {
              onExit();
            }
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] px-4 py-2 text-xs font-semibold text-white hover:from-[#1E40AF] hover:via-[#2563EB] hover:to-[#0EA5E9] shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          {slideIndex < totalSlides - 1 ? 'Siguiente' : 'Finalizar exposición'}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
}
