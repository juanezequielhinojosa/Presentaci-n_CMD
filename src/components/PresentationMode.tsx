import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Pause,
  Play,
  RotateCcw,
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

export default function PresentationMode({ initialSlide = 0, onExit }: PresentationModeProps) {
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
      className="fixed inset-0 z-50 flex flex-col bg-[#F8FAFC] text-[#0F172A] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Modo Exposición de Portafolio"
    >
      {/* Top Presentation Bar */}
      <header className="border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-bold text-sm tracking-tight text-[#0F172A] whitespace-nowrap shrink-0">
            Modo Exposición
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-xs font-mono text-slate-600 truncate">
            {SLIDE_TITLES[slideIndex]}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Stopwatch for oral defense pacing */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span className="font-mono text-xs font-semibold text-[#0F172A] tabular-nums">
              {formatTimer(elapsedSeconds)}
            </span>
            <button
              type="button"
              onClick={() => setTimerRunning((p) => !p)}
              title={timerRunning ? 'Pausar cronómetro' : 'Reanudar cronómetro'}
              className="p-0.5 text-slate-600 hover:text-[#0F766E] cursor-pointer"
            >
              {timerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
            <button
              type="button"
              onClick={() => setElapsedSeconds(0)}
              title="Reiniciar cronómetro"
              className="p-0.5 text-slate-600 hover:text-[#0F766E] cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowNotes((p) => !p)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              showNotes
                ? 'border-[#0F766E] bg-[#0F766E] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Guion Oral
          </button>

          <span className="hidden md:inline font-mono text-xs text-slate-500 tabular-nums">
            {slideIndex + 1} / {totalSlides}
          </span>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Salir
          </button>
        </div>
      </header>

      {/* Thin Progress Track */}
      <div className="h-1 w-full bg-slate-200 shrink-0">
        <div
          className="h-full bg-[#0F766E] transition-transform duration-200 origin-left"
          style={{ transform: `scaleX(${progressScale})` }}
        />
      </div>

      {/* Optional Speaker Notes Banner */}
      {showNotes && (
        <div className="border-b border-slate-200 bg-[#0F172A] text-slate-100 px-6 py-3 shrink-0">
          <div className="mx-auto max-w-6xl flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between gap-8 rounded-2xl border border-slate-200 bg-white p-8 lg:p-10">
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                    {PORTFOLIO_META.institution} · {PORTFOLIO_META.faculty} · {PORTFOLIO_META.year}
                  </div>
                  <p className="text-sm font-semibold text-[#0F766E]">
                    {PORTFOLIO_META.career} · {PORTFOLIO_META.subject}
                  </p>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight">
                    {PORTFOLIO_META.title}
                  </h1>
                  <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                    Modelado matemático discreto aplicado a la gestión educativa, la arquitectura de plataformas virtuales y la integridad de datos académicos.
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
                    Equipo de Trabajo · {PORTFOLIO_META.team}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TEAM_MEMBERS.map((m) => (
                      <div key={m.dni} className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3.5">
                        <div className="text-sm font-semibold text-[#0F172A]">{m.name}</div>
                        <div className="mt-1 font-mono text-xs text-slate-500 tabular-nums">DNI {m.dni}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between">
                <div className="relative flex-1 min-h-[260px] overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={PORTFOLIO_META.heroImage}
                    alt="Diagramas geométricos de grafos, árboles con raíz y grillas modulares"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Fig. 0 — Síntesis visual de estructuras discretas: árboles jerárquicos, grafos conexos y reticulados modulares.
                </p>
              </div>
            </div>
          )}

          {/* Slide 1: Intro & Objectives */}
          {slideIndex === 1 && (
            <div className="space-y-8">
              <div className="space-y-3 max-w-3xl">
                <div className="text-xs font-mono uppercase tracking-wider text-[#0F766E]">
                  01 · Encuadre Pedagógico
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A]">
                  Introducción y Objetivos del Equipo
                </h2>
                <p className="text-base leading-relaxed text-slate-700">{INTRO_TEXT}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {OBJECTIVES.map((obj) => (
                  <div key={obj.id} className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
                    <div className="font-mono text-xs font-semibold text-[#0F766E] tabular-nums">
                      Objetivo {obj.id}
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A]">
                      {obj.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">{obj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 2: Stage 1 */}
          {slideIndex === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[#0F766E]">
                  02 · Evidencias de Construcción · Etapa 1
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                  Teoría de Grafos y Árboles
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAGE_1_POINTS.map((p) => (
                  <div key={p.index} className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5">
                    <div className="font-mono text-xs font-semibold text-[#0F766E] tabular-nums">{p.index}</div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{p.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-600">{p.detail}</p>
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
                <div className="text-xs font-mono uppercase tracking-wider text-[#0F766E]">
                  03 · Evidencias de Construcción · Etapa 2
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                  Relaciones de Equivalencia y Partición de Conjuntos
                </h2>
                <p className="text-sm text-slate-600 max-w-3xl">
                  Modelado de la realidad territorial de la UNJu para asignar trayectos evaluativos diferenciados (Local, Híbrido y Remoto) mediante f(a) = f(b) y el conjunto cociente |E/R| = 3.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STAGE_2_DISCARDED.map((item) => (
                  <div key={item.structure} className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
                    <div className="text-xs font-mono text-red-700 font-semibold">Alternativa descartada</div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{item.structure}</h3>
                    <p className="text-xs leading-relaxed text-slate-600">{item.reason}</p>
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
                <div className="text-xs font-mono uppercase tracking-wider text-[#0F766E]">
                  04 · Evidencias de Construcción · Etapa 3
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                  Estructuras Algebraicas y la Regla de la Calificación Máxima
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STAGE_3_PROPOSALS.map((prop) => (
                  <div
                    key={prop.id}
                    className={`rounded-xl border p-4 space-y-1.5 ${
                      prop.selected
                        ? 'border-[#0F766E] bg-white'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={prop.selected ? 'text-[#0F766E] font-semibold' : 'text-slate-500'}>
                        {prop.selected ? 'Propuesta seleccionada' : 'Propuesta comparada'}
                      </span>
                      {prop.selected && <CheckCircle2 className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />}
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{prop.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{prop.verdict}</p>
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
                <div className="text-xs font-mono uppercase tracking-wider text-[#0F766E]">
                  05 · Evidencias de Construcción · Etapa 4
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                  Códigos de Seguridad y Validación Modular en ℤ₁₁
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
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
                <div className="text-xs font-mono uppercase tracking-wider text-[#0F766E]">
                  06 · Síntesis Institucional
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                  Producto Final Consolidado
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Haz clic en cualquier fila para saltar directamente al simulador interactivo de esa etapa.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 font-mono text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5 font-medium">Etapa</th>
                      <th className="px-5 py-3.5 font-medium">Problema Educativo</th>
                      <th className="px-5 py-3.5 font-medium">Estructura Matemática</th>
                      <th className="px-5 py-3.5 font-medium">Decisión Operativa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {CONSOLIDATED_MATRIX.map((row) => (
                      <tr
                        key={row.stageNumber}
                        onClick={() => setSlideIndex(row.slideIndex)}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-4 font-mono font-semibold text-[#0F766E] whitespace-nowrap tabular-nums">
                          {row.stageLabel} →
                        </td>
                        <td className="px-5 py-4 text-slate-800">{row.problem}</td>
                        <td className="px-5 py-4 font-semibold text-[#0F172A]">{row.structure}</td>
                        <td className="px-5 py-4 text-slate-600">{row.decision}</td>
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
                  <div className="text-xs font-mono uppercase tracking-wider text-[#0F766E]">
                    07 · Voz del Equipo
                  </div>
                  <h2 className="text-3xl font-bold text-[#0F172A]">
                    Reflexión Crítica: La Experiencia Real del Equipo
                  </h2>
                </div>

                {REFLECTION_SECTIONS.map((sec) => (
                  <div key={sec.title} className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
                    <h3 className="text-lg font-bold text-[#0F172A]">{sec.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{sec.body}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <img
                    src={PORTFOLIO_META.reflectionImage}
                    alt="Trabajo nocturno de estudio con cuadernos de grafos y computadora"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <p className="mt-2.5 px-1 text-xs text-slate-500">
                    Fig. 1 — Jornadas nocturnas de modelado discreto compatibilizando trabajo, familia y cursado.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                    Mirada Retrospectiva
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{REFLECTION_RETROSPECTIVE}</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 8: Self & Peer Evaluation + Closing */}
          {slideIndex === 8 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[#0F766E]">
                  08 · Cierre Formativo
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                  Autoevaluación, Coevaluación y Conclusión de Cierre
                </h2>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 font-mono text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Dimensión Evaluada</th>
                      <th className="px-4 py-3 font-medium">Nivel Alcanzado</th>
                      <th className="px-4 py-3 font-medium">Fundamentación y Evidencias</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {EVALUATION_MATRIX.map((row) => (
                      <tr key={row.dimension}>
                        <td className="px-4 py-3 font-semibold text-[#0F172A]">{row.dimension}</td>
                        <td className="px-4 py-3 font-mono font-semibold text-[#0F766E] whitespace-nowrap">
                          {row.level}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{row.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                  Conclusión de Cierre
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed text-[#0F172A]">
                  “{CLOSING_CONCLUSION}”
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Slide Controls */}
      <footer className="border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <button
          type="button"
          onClick={() => setSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={slideIndex === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
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
              className={`rounded-md px-2.5 py-1 font-mono text-xs tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                slideIndex === idx
                  ? 'bg-[#0F766E] text-white font-semibold'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
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
          className="inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
        >
          {slideIndex < totalSlides - 1 ? 'Siguiente' : 'Finalizar exposición'}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
}
