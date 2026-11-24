import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';

type Modality = 'Todos' | 'Local' | 'Híbrido' | 'Remoto';

interface StudentSample {
  id: string;
  localidad: string;
  cargaLaboral: string;
  modality: Exclude<Modality, 'Todos'>;
}

const INITIAL_STUDENTS: StudentSample[] = [
  { id: 'Est. 01', localidad: 'San Salvador de Jujuy', cargaLaboral: 'Part-time', modality: 'Local' },
  { id: 'Est. 02', localidad: 'Perico', cargaLaboral: 'Jornada completa', modality: 'Híbrido' },
  { id: 'Est. 03', localidad: 'Palpalá', cargaLaboral: 'Sin carga fija', modality: 'Local' },
  { id: 'Est. 04', localidad: 'Tilcara', cargaLaboral: 'Jornada completa', modality: 'Remoto' },
  { id: 'Est. 05', localidad: 'San Pedro', cargaLaboral: 'Turnos rotativos', modality: 'Híbrido' },
  { id: 'Est. 06', localidad: 'Humahuaca', cargaLaboral: 'Jornada completa', modality: 'Remoto' },
];

const LOCALITIES = [
  'San Salvador de Jujuy',
  'Palpalá',
  'Perico',
  'San Pedro',
  'Tilcara',
  'Humahuaca',
  'La Quiaca',
  'Libertador Gral. San Martín',
];

const WORKLOADS = ['Sin carga fija', 'Part-time', 'Turnos rotativos', 'Jornada completa'];

function classifyModality(localidad: string, carga: string): Exclude<Modality, 'Todos'> {
  const remoteLocs = ['Tilcara', 'Humahuaca', 'La Quiaca', 'Libertador Gral. San Martín'];
  if (remoteLocs.includes(localidad)) return 'Remoto';
  if (carga === 'Jornada completa' || carga === 'Turnos rotativos' || localidad === 'Perico' || localidad === 'San Pedro') {
    return 'Híbrido';
  }
  return 'Local';
}

const AXIOMS = [
  {
    key: 'reflexiva',
    title: 'Reflexiva: ∀a ∈ E, a R a',
    explanation: 'Todo cursante a posee exactamente la misma condición f(a) = f(a) que sí mismo.',
  },
  {
    key: 'simetrica',
    title: 'Simétrica: a R b ⇒ b R a',
    explanation: 'Si a comparte modalidad con b, entonces b comparte modalidad con a. Esta simetría mutua rompe la antisimetría e invalida todo orden parcial.',
  },
  {
    key: 'transitiva',
    title: 'Transitiva: (a R b ∧ b R c) ⇒ a R c',
    explanation: 'Si a y b están en la misma clase y b y c también, entonces f(a) = f(b) = f(c). Garantiza partición sin solapamientos.',
  },
] as const;

export default function Stage2EquivalenceExplorer() {
  const [students, setStudents] = useState<StudentSample[]>(INITIAL_STUDENTS);
  const [selectedModality, setSelectedModality] = useState<Modality>('Todos');
  const [activeAxiom, setActiveAxiom] = useState<'reflexiva' | 'simetrica' | 'transitiva'>('simetrica');

  const [newLoc, setNewLoc] = useState<string>('Tilcara');
  const [newWork, setNewWork] = useState<string>('Jornada completa');

  const handleAddStudent = () => {
    const nextNum = String(students.length + 1).padStart(2, '0');
    const modality = classifyModality(newLoc, newWork);
    setStudents((prev) => [
      { id: `Est. ${nextNum}`, localidad: newLoc, cargaLaboral: newWork, modality },
      ...prev,
    ]);
    setSelectedModality(modality);
  };

  const countLocal = students.filter((s) => s.modality === 'Local').length;
  const countHibrido = students.filter((s) => s.modality === 'Híbrido').length;
  const countRemoto = students.filter((s) => s.modality === 'Remoto').length;

  const filteredStudents =
    selectedModality === 'Todos' ? students : students.filter((s) => s.modality === selectedModality);

  const axiomObj = AXIOMS.find((a) => a.key === activeAxiom)!;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] px-5 py-3">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 p-1">
          {(['Todos', 'Local', 'Híbrido', 'Remoto'] as Modality[]).map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => setSelectedModality(mod)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedModality === mod
                  ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              {mod === 'Todos' ? `Conjunto E (${students.length})` : `[${mod}]`}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
          |E/R| = 3 clases · C₁ ∪ C₂ ∪ C₃ = E · Cᵢ ∩ Cⱼ = ∅
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Live Partition Builder + Table */}
        <div className="lg:col-span-7 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 space-y-4">
          {/* Interactive Cohort Adder */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0D1322] p-3.5 space-y-2.5">
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white">
              Evaluar nuevo cursante mediante f(a) en tiempo real
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-5">
                <label htmlFor="loc-select" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Localidad (Jujuy)
                </label>
                <select
                  id="loc-select"
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-2.5 py-1.5 text-xs text-[#0F172A] dark:text-white"
                >
                  {LOCALITIES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-4">
                <label htmlFor="work-select" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Carga laboral
                </label>
                <select
                  id="work-select"
                  value={newWork}
                  onChange={(e) => setNewWork(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-2.5 py-1.5 text-xs text-[#0F172A] dark:text-white"
                >
                  {WORKLOADS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleAddStudent}
                  className="w-full inline-flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7] px-3 py-1.5 text-xs font-semibold text-white hover:from-[#172554] hover:via-[#1E40AF] hover:to-[#0369A1] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Clasificar
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 max-h-[220px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0D1322] text-slate-500 dark:text-slate-400 font-mono uppercase sticky top-0">
                <tr>
                  <th className="px-3.5 py-2.5 font-medium">Cursante</th>
                  <th className="px-3.5 py-2.5 font-medium">Localidad</th>
                  <th className="px-3.5 py-2.5 font-medium">Carga Laboral</th>
                  <th className="px-3.5 py-2.5 font-medium">Clase [f(a)]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#111827]">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-3.5 py-2 font-mono font-medium text-[#0F172A] dark:text-white tabular-nums">{s.id}</td>
                    <td className="px-3.5 py-2 text-slate-700 dark:text-slate-300">{s.localidad}</td>
                    <td className="px-3.5 py-2 text-slate-600 dark:text-slate-400">{s.cargaLaboral}</td>
                    <td className="px-3.5 py-2 font-mono font-semibold text-[#1D4ED8] dark:text-sky-400">[{s.modality}]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Clase Local', count: countLocal, tag: 'C₁' },
              { label: 'Clase Híbrido', count: countHibrido, tag: 'C₂' },
              { label: 'Clase Remoto', count: countRemoto, tag: 'C₃' },
            ].map((c) => (
              <div key={c.label} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0D1322] p-3">
                <div className="flex items-center justify-between font-mono text-xs font-semibold text-[#1D4ED8] dark:text-sky-400 tabular-nums">
                  <span>{c.tag}</span>
                  <span>{c.count} est.</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-[#0F172A] dark:text-white">{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Axioms & Discarded Models */}
        <div className="lg:col-span-5 p-5 flex flex-col justify-between gap-4 bg-[#F8FAFC] dark:bg-[#0D1322]">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Demostración de Propiedades
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AXIOMS.map((ax) => (
                <button
                  key={ax.key}
                  type="button"
                  onClick={() => setActiveAxiom(ax.key)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeAxiom === ax.key
                      ? 'border-transparent bg-gradient-to-r from-[#1E3A8A] to-[#0284C7] text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {ax.key.charAt(0).toUpperCase() + ax.key.slice(1)}
                </button>
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{axiomObj.title}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{axiomObj.explanation}</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Por qué se descartaron otros modelos
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <X className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" aria-hidden="true" />
              <span><strong>Orden parcial (Hasse):</strong> si Est. 01 R Est. 02 y Est. 02 R Est. 01 pero Est. 01 ≠ Est. 02, se viola la antisimetría.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <X className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" aria-hidden="true" />
              <span><strong>Retículos:</strong> no existe cota superior ni inferior única entre estudiantes reales.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Read-Only Boolean Relation Matrix (M_R) */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">
            Matriz Booleana de la Relación (M<sub>R</sub>)
          </h4>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Dimensión dinámica: {students.length} × {students.length} · Conjunto E completo
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          {(() => {
            const orderedStudents = [...students].sort((a, b) => a.id.localeCompare(b.id));
            return (
              <table className="w-full border-collapse text-center font-mono text-xs tabular-nums">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0D1322] text-slate-600 dark:text-slate-300">
                    <th className="border-b border-r border-slate-200 dark:border-slate-800 px-3 py-2 text-left font-medium text-slate-500 dark:text-slate-400">
                      eᵢ \ eⱼ
                    </th>
                    {orderedStudents.map((colStudent) => (
                      <th
                        key={colStudent.id}
                        className="border-b border-slate-200 dark:border-slate-800 px-2.5 py-2 font-semibold whitespace-nowrap"
                        title={`${colStudent.id} · [${colStudent.modality}]`}
                      >
                        {colStudent.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {orderedStudents.map((rowStudent, rowIdx) => (
                    <tr key={rowStudent.id}>
                      <th
                        scope="row"
                        className="border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap"
                        title={`${rowStudent.id} · [${rowStudent.modality}]`}
                      >
                        {rowStudent.id}
                      </th>
                      {orderedStudents.map((colStudent, colIdx) => {
                        const isDiagonal = rowIdx === colIdx;
                        const isRelated = rowStudent.modality === colStudent.modality;
                        return (
                          <td
                            key={colStudent.id}
                            title={`(${rowStudent.id}, ${colStudent.id}): ${
                              isRelated
                                ? `1 — comparten clase [${rowStudent.modality}]`
                                : `0 — clases distintas ([${rowStudent.modality}] vs [${colStudent.modality}])`
                            }`}
                            className={`px-2.5 py-2 transition-colors ${
                              isDiagonal
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-800 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-800/70'
                                : isRelated
                                ? 'bg-emerald-50/35 dark:bg-emerald-950/25 font-bold text-emerald-700 dark:text-emerald-400'
                                : 'bg-white dark:bg-[#111827] font-normal text-slate-300 dark:text-slate-600'
                            }`}
                          >
                            {isRelated ? '1' : '0'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Diagonal principal con valores 1 (Reflexiva) · Matriz igual a su transpuesta M<sub>R</sub> = M<sub>R</sub><sup>T</sup> (Simétrica)
        </p>
      </div>
    </div>
  );
}
