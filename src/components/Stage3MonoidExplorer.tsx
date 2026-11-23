import { useState } from 'react';
import { AlertCircle, CheckCircle2, History, RotateCcw } from 'lucide-react';

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface AuditEntry {
  id: number;
  step: string;
  partial: number;
  recup: number;
  result: number;
}

export default function Stage3MonoidExplorer() {
  const [gradeA, setGradeA] = useState<number>(5);
  const [gradeB, setGradeB] = useState<number>(8);
  const [nextSeq, setNextSeq] = useState<number>(3);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    { id: 2, step: 'Instancia Recuperatorio · mejora de acta', partial: 5, recup: 8, result: 8 },
    { id: 1, step: 'Acta inicial (Parcial 1)', partial: 5, recup: 1, result: 5 },
  ]);

  const finalGrade = Math.max(gradeA, gradeB);

  const handleRecordTransition = () => {
    const latest = auditLog[0];
    if (
      latest &&
      !latest.step.startsWith('Corrección') &&
      latest.partial === gradeA &&
      latest.recup === gradeB &&
      latest.result === finalGrade
    ) {
      return;
    }

    const label =
      gradeB > gradeA
        ? `Acta #${nextSeq} · Superación en recuperatorio`
        : gradeB === gradeA
        ? `Acta #${nextSeq} · Ratificación idempotente`
        : gradeB === 1
        ? `Acta #${nextSeq} · Registro con neutro (e=1)`
        : `Acta #${nextSeq} · Conserva parcial superior`;

    setAuditLog((prev) => [
      {
        id: nextSeq,
        step: label,
        partial: gradeA,
        recup: gradeB,
        result: finalGrade,
      },
      ...prev.slice(0, 5),
    ]);
    setNextSeq((n) => n + 1);
  };

  const handleSimulateRollback = () => {
    const latest = auditLog[0];
    const target =
      auditLog.find(
        (entry, idx) => idx > 0 && (entry.partial !== gradeA || entry.recup !== gradeB)
      ) ?? { partial: 5, recup: 1, result: 5 };

    if (
      latest &&
      latest.step.startsWith('Corrección') &&
      latest.partial === target.partial &&
      latest.recup === target.recup
    ) {
      return;
    }

    setAuditLog((prev) => [
      {
        id: nextSeq,
        step: `Corrección #${nextSeq} · Reversión manual a estado previo`,
        partial: target.partial,
        recup: target.recup,
        result: target.result,
      },
      ...prev.slice(0, 5),
    ]);
    setNextSeq((n) => n + 1);
    setGradeA(target.partial);
    setGradeB(target.recup);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] px-5 py-3">
        <span className="text-xs font-semibold text-[#0F172A] dark:text-white">
          Laboratorio Algebraico · Tabla de Cayley 10×10 y Simulador (M, máx)
        </span>
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
          M = {'{1..10}'} · Neutro e = 1 · Sin inverso para a ≥ 2
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Interactive 10x10 Cayley Table */}
        <div className="lg:col-span-6 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">
              Tabla de Cayley Interactiva (haz clic en cualquier celda)
            </div>
            <span className="font-mono text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 tabular-nums">
              máx({gradeA}, {gradeB}) = {finalGrade}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[11px] tabular-nums text-center">
              <thead>
                <tr>
                  <th className="border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#0D1322] px-1.5 py-1 text-slate-500 dark:text-slate-400">máx</th>
                  {GRADES.map((col) => (
                    <th
                      key={col}
                      className={`border border-slate-200 dark:border-slate-700 px-1.5 py-1 font-semibold ${
                        col === gradeB
                          ? 'bg-gradient-to-b from-[#1E3A8A] to-[#1D4ED8] text-white'
                          : 'bg-slate-50 dark:bg-[#0D1322] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRADES.map((row) => (
                  <tr key={row}>
                    <th
                      className={`border border-slate-200 dark:border-slate-700 px-1.5 py-1 font-semibold ${
                        row === gradeA
                          ? 'bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8] text-white'
                          : 'bg-slate-50 dark:bg-[#0D1322] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {row}
                    </th>
                    {GRADES.map((col) => {
                      const val = Math.max(row, col);
                      const isSelected = row === gradeA && col === gradeB;
                      const isDiag = row === col;
                      const isIdentityResult = val === 1;
                      return (
                        <td key={col} className="border border-slate-200 dark:border-slate-800 p-0">
                          <button
                            type="button"
                            onClick={() => {
                              setGradeA(row);
                              setGradeB(col);
                            }}
                            title={`máx(${row}, ${col}) = ${val}`}
                            className={`w-full h-full px-1.5 py-1 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#1E3A8A] to-[#0284C7] text-white font-bold'
                                : isIdentityResult
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                                : isDiag
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                                : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            {val}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Diagonal sombreada: idempotencia máx(a,a)=a</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Verde (1): único neutro e=1, sin otros inversos</span>
          </div>
        </div>

        {/* Right: Axioms & Transactional Audit Log */}
        <div className="lg:col-span-6 p-5 bg-[#F8FAFC] dark:bg-[#0D1322] flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Resultado algebraico activo</div>
                <div className="font-mono text-lg font-bold text-[#0F172A] dark:text-white tabular-nums">
                  máx({gradeA}, {gradeB}) = <span className="text-[#1D4ED8] dark:text-sky-400">{finalGrade}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRecordTransition}
                  className="rounded-lg bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] px-3 py-2 text-xs font-semibold text-white hover:from-[#172554] hover:via-[#1E40AF] hover:to-[#0369A1] transition-all cursor-pointer whitespace-nowrap"
                >
                  Grabar en acta
                </button>
                <button
                  type="button"
                  onClick={handleSimulateRollback}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
                  title="Simular reversión por auditoría"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Auditar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-2 text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="font-mono">Neutro: máx({gradeA},1)={gradeA}</span>
              </div>
              <div className="flex items-center gap-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-2 text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="font-mono">Simetría: ({gradeA},{gradeB})=({gradeB},{gradeA})</span>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/40 p-3 text-xs text-amber-950 dark:text-amber-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Sin inverso para {finalGrade > 1 ? finalGrade : 2}:</strong> En la fila {finalGrade > 1 ? finalGrade : 2} de la matriz nunca aparece el 1. Por eso el sistema exige un log transaccional para deshacer errores humanos.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <History className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Bitácora Transaccional Inmutable</span>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] max-h-[125px] overflow-y-auto">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-3 py-2 text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">{entry.step}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                      ({entry.partial},{entry.recup}) → <strong className="text-[#1D4ED8] dark:text-sky-400">{entry.result}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
