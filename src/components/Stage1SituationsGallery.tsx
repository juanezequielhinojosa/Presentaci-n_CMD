import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { STAGE_1_SITUATIONS } from '../data/portfolioData';

export default function Stage1SituationsGallery() {
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  useEffect(() => {
    if (zoomIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setZoomIndex(null);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        setZoomIndex((prev) =>
          prev === null ? null : (prev + 1) % STAGE_1_SITUATIONS.length
        );
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        setZoomIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + STAGE_1_SITUATIONS.length) % STAGE_1_SITUATIONS.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [zoomIndex]);

  const activeItem = zoomIndex !== null ? STAGE_1_SITUATIONS[zoomIndex] : null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-5 transition-colors">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-sky-400">
            Síntesis Visual · Etapa 1
          </div>
          <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">
            Representación Gráfica de las 5 Situaciones Analizadas
          </h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Haz clic en cualquier esquema para ampliarlo en pantalla completa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {STAGE_1_SITUATIONS.map((item, idx) => {
          const isLastCentered = idx === STAGE_1_SITUATIONS.length - 1;
          return (
            <figure
              key={item.number}
              className={`group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] overflow-hidden transition-colors hover:border-[#1D4ED8]/50 dark:hover:border-sky-500/50 ${
                isLastCentered ? 'md:col-span-2 md:w-[calc(50%-0.625rem)] md:mx-auto' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setZoomIndex(idx)}
                className="relative block w-full overflow-hidden bg-[#061326] cursor-pointer text-left"
                aria-label={`Ampliar ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-3 w-3" aria-hidden="true" />
                  Ampliar
                </span>
              </button>
              <figcaption className="p-4 space-y-1">
                <div className="text-sm font-bold text-[#0F172A] dark:text-white">
                  {item.title}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeItem && zoomIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={() => setZoomIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-[#0B1120] text-slate-100 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-3.5">
              <div className="min-w-0">
                <div className="font-mono text-xs text-sky-400 tabular-nums">
                  Esquema {zoomIndex + 1} de {STAGE_1_SITUATIONS.length}
                </div>
                <h5 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeItem.title}
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setZoomIndex(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer shrink-0"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Cerrar
              </button>
            </div>

            <div className="relative bg-[#061326] flex items-center justify-center">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 px-5 py-3.5">
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                {activeItem.caption}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setZoomIndex(
                      (zoomIndex - 1 + STAGE_1_SITUATIONS.length) %
                        STAGE_1_SITUATIONS.length
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setZoomIndex((zoomIndex + 1) % STAGE_1_SITUATIONS.length)
                  }
                  className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] px-3 py-1.5 text-xs font-semibold text-white hover:from-[#1E40AF] hover:via-[#2563EB] hover:to-[#0EA5E9] cursor-pointer"
                >
                  Siguiente
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
