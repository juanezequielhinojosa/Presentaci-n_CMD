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
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    { id: 1, step: 'Acta inicial (Parcial)', partial: 5, recup: 1, result: 5 },
    { id: 2, step: 'Instancia Recuperatorio', partial: 5, recup: 8, result: 8 },
  ]);

  const finalGrade = Math.max(gradeA, gradeB);

  const handleRecordTransition = () => {
    setAuditLog((prev) => [
      {
        id: prev.length + 1,
        step: `Evento #${prev.length + 1} · máx(${gradeA}, ${gradeB})`,
        partial: gradeA,
        recup: gradeB,
        result: finalGrade,
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleSimulateRollback = () => {
    setAuditLog((prev) => [
      {
        id: prev.length + 1,
        step: 'Reversión por auditoría (restaurado desde log)',
        partial: 5,
        recup: 1,
        result: 5,
      },
      ...prev.slice(0, 4),
    ]);
    setGradeA(5);
    setGradeB(1);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3">
        <span className="text-xs font-semibold text-[#0F172A]">
          Laboratorio Algebraico · Tabla de Cayley 10×10 y Simulador (M, máx)
        </span>
        <span className="font-mono text-xs text-slate-600 tabular-nums">
          M = {'{1..10}'} · Neutro e = 1 · Sin inverso para a ≥ 2
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Interactive 10x10 Cayley Table */}
        <div className="lg:col-span-6 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#0F172A]">
              Tabla de Cayley Interactiva (haz clic en cualquier celda)
            </div>
            <span className="font-mono text-xs font-semibold text-[#0F766E] tabular-nums">
              máx({gradeA}, {gradeB}) = {finalGrade}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[11px] tabular-nums text-center">
              <thead>
                <tr>
                  <th className="border border-slate-200 bg-slate-100 px-1.5 py-1 text-slate-500">máx</th>
                  {GRADES.map((col) => (
                    <th
                      key={col}
                      className={`border border-slate-200 px-1.5 py-1 font-semibold ${
                        col === gradeB ? 'bg-[#0F766E] text-white' : 'bg-slate-50 text-slate-700'
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
                      className={`border border-slate-200 px-1.5 py-1 font-semibold ${
                        row === gradeA ? 'bg-[#0F766E] text-white' : 'bg-slate-50 text-slate-700'
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
                        <td key={col} className="border border-slate-200 p-0">
                          <button
                            type="button"
                            onClick={() => {
                              setGradeA(row);
                              setGradeB(col);
                            }}
                            title={`máx(${row}, ${col}) = ${val}`}
                            className={`w-full h-full px-1.5 py-1 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#0F766E] text-white font-bold'
                                : isIdentityResult
                                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                                : isDiag
                                ? 'bg-slate-100 text-slate-900 font-medium'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
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

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>Diagonal gris: idempotencia máx(a,a)=a</span>
            <span className="text-emerald-700 font-medium">Verde (1): único neutro e=1, sin otros inversos</span>
          </div>
        </div>

        {/* Right: Axioms & Transactional Audit Log */}
        <div className="lg:col-span-6 p-5 bg-[#F8FAFC] flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Resultado algebraico activo</div>
                <div className="font-mono text-lg font-bold text-[#0F172A] tabular-nums">
                  máx({gradeA}, {gradeB}) = <span className="text-[#0F766E]">{finalGrade}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRecordTransition}
                  className="rounded-lg bg-[#0F766E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Grabar en acta
                </button>
                <button
                  type="button"
                  onClick={handleSimulateRollback}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                  title="Simular reversión por auditoría"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Auditar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span className="font-mono">Neutro: máx({gradeA},1)={gradeA}</span>
              </div>
              <div className="flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span className="font-mono">Simetría: ({gradeA},{gradeB})=({gradeB},{gradeA})</span>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-950">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Sin inverso para {finalGrade > 1 ? finalGrade : 2}:</strong> En la fila {finalGrade > 1 ? finalGrade : 2} de la matriz nunca aparece el 1. Por eso el sistema exige un log transaccional para deshacer errores humanos.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <History className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Bitácora Transaccional Inmutable</span>
              </div>
              <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white max-h-[125px] overflow-y-auto">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-3 py-2 text-xs">
                    <span className="font-medium text-slate-800 truncate pr-2">{entry.step}</span>
                    <span className="font-mono text-slate-500 tabular-nums shrink-0">
                      ({entry.partial},{entry.recup}) → <strong className="text-[#0F766E]">{entry.result}</strong>
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
