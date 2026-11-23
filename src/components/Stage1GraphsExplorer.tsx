import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, GitBranch, Network, Trees, Unplug } from 'lucide-react';

type GraphTab = 'aula' | 'dag' | 'arbol';

interface AulaNode {
  id: string;
  label: string;
  x: number;
  y: number;
  role: string;
  isCutVertex?: boolean;
  isIsolated?: boolean;
}

const AULA_NODES: AulaNode[] = [
  { id: 'V1', label: 'Inicio', x: 75, y: 90, role: 'Portada del aula virtual' },
  { id: 'V2', label: 'Programa', x: 75, y: 205, role: 'Documento de cátedra' },
  { id: 'V3', label: 'Módulos', x: 195, y: 145, role: 'Punto de corte: articula el inicio con el resto del aula', isCutVertex: true },
  { id: 'V4', label: 'Foro', x: 315, y: 75, role: 'Espacio de debate asincrónico' },
  { id: 'V5', label: 'Evaluación', x: 325, y: 185, role: 'Punto de corte: único acceso hacia Prácticos y Consultas', isCutVertex: true },
  { id: 'V6', label: 'Bibliografía', x: 430, y: 95, role: 'Repositorio de lecturas' },
  { id: 'V7', label: 'Prácticos', x: 455, y: 215, role: 'Guías de ejercitación' },
  { id: 'V8', label: 'Consultas', x: 565, y: 175, role: 'Mensajería con tutores' },
  { id: 'V9', label: 'Recurso Oculto', x: 555, y: 65, role: 'Vértice aislado original (grado 0)', isIsolated: true },
];

const BASE_EDGES: [string, string][] = [
  ['V1', 'V2'],
  ['V1', 'V3'],
  ['V2', 'V3'],
  ['V3', 'V4'],
  ['V3', 'V5'],
  ['V4', 'V6'],
  ['V5', 'V7'],
  ['V5', 'V8'],
  ['V7', 'V8'],
];

const DAG_NODES = [
  { id: 'M1', label: 'Etapa 1', desc: 'Introd. Sistemas', x: 70, y: 125, inCycle: false, reqs: 'Ninguna' },
  { id: 'M2', label: 'Etapa 2', desc: 'Estructuras I', x: 210, y: 125, inCycle: true, reqs: 'M1 (y M6 en ciclo erróneo)' },
  { id: 'M4', label: 'Etapa 3', desc: 'Modelado II', x: 345, y: 125, inCycle: true, reqs: 'M2' },
  { id: 'M6', label: 'Etapa 4', desc: 'Proyecto Aplicado', x: 480, y: 125, inCycle: true, reqs: 'M4' },
  { id: 'EG', label: 'Egreso (5)', desc: 'Aprobación Final', x: 585, y: 125, inCycle: false, reqs: 'M6 y M5' },
  { id: 'M3', label: 'Optativa A', desc: 'Taller TIC', x: 210, y: 200, inCycle: false, reqs: 'M1' },
  { id: 'M5', label: 'Optativa B', desc: 'Gestión Plataformas', x: 480, y: 200, inCycle: false, reqs: 'M3' },
];

function computeReachableFromV1(edges: [string, string][], failedNodeId: string | null): Set<string> {
  if (failedNodeId === 'V1') return new Set();
  const visited = new Set<string>(['V1']);
  const queue = ['V1'];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const [u, v] of edges) {
      if (u === failedNodeId || v === failedNodeId) continue;
      if (u === curr && !visited.has(v)) {
        visited.add(v);
        queue.push(v);
      } else if (v === curr && !visited.has(u)) {
        visited.add(u);
        queue.push(u);
      }
    }
  }
  return visited;
}

export default function Stage1GraphsExplorer() {
  const [activeTab, setActiveTab] = useState<GraphTab>('aula');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('V3');
  const [failedNodeId, setFailedNodeId] = useState<string | null>(null);
  const [v9Connected, setV9Connected] = useState<boolean>(false);

  const [cycleResolved, setCycleResolved] = useState<boolean>(false);
  const [selectedDagId, setSelectedDagId] = useState<string>('M2');

  const [selectedDepth, setSelectedDepth] = useState<number>(3);
  const [criteria, setCriteria] = useState<[boolean, boolean, boolean, boolean]>([true, false, true, false]);

  const activeEdges = useMemo<[string, string][]>(() => {
    return v9Connected ? [...BASE_EDGES, ['V6', 'V9']] : BASE_EDGES;
  }, [v9Connected]);

  const reachableSet = useMemo(
    () => computeReachableFromV1(activeEdges, failedNodeId),
    [activeEdges, failedNodeId]
  );

  const selectedNode = AULA_NODES.find((n) => n.id === selectedNodeId) ?? AULA_NODES[2];
  const nodeDegree = activeEdges.filter(([u, v]) => u === selectedNode.id || v === selectedNode.id).length;

  const selectedDagNode = DAG_NODES.find((n) => n.id === selectedDagId) ?? DAG_NODES[1];

  // Binary decision tree group calculation (4 criteria => 0..15 => Grupo 1..16)
  const groupNumber =
    (criteria[0] ? 8 : 0) + (criteria[1] ? 4 : 0) + (criteria[2] ? 2 : 0) + (criteria[3] ? 1 : 0) + 1;

  const toggleCriteria = (idx: 0 | 1 | 2 | 3) => {
    setCriteria((prev) => {
      const next: [boolean, boolean, boolean, boolean] = [...prev] as [boolean, boolean, boolean, boolean];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/80 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('aula')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'aula' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <Network className="h-3.5 w-3.5" aria-hidden="true" />
            Grafo Aula Virtual (V=9)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dag')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'dag' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
            DAG Correlatividades
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('arbol')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'arbol' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <Trees className="h-3.5 w-3.5" aria-hidden="true" />
            Árbol ≤ 3 Clics y Clasificador
          </button>
        </div>

        <span className="font-mono text-xs text-slate-600 tabular-nums">
          {activeTab === 'aula' && `Alcance desde Inicio: ${reachableSet.size}/9 vértices`}
          {activeTab === 'dag' && (cycleResolved ? 'DAG Acíclico · Camino crítico = 5 etapas' : 'Ciclo vicioso activo: M2 → M4 → M6 → M2')}
          {activeTab === 'arbol' && `h = 3 · Grupo asignado: #${groupNumber} de 16`}
        </span>
      </div>

      {/* Tab 1: Aula Virtual Graph with Live Cut-Vertex Failure Simulation */}
      {activeTab === 'aula' && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-[#F8FAFC] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span>Haz clic en un nodo para inspeccionarlo o simular su caída:</span>
              <button
                type="button"
                onClick={() => setV9Connected((p) => !p)}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {v9Connected ? 'Desconectar V9 (volver a grado 0)' : 'Conectar vértice aislado V9 (reparar)'}
              </button>
            </div>

            <svg
              viewBox="0 0 640 270"
              className="w-full h-auto max-h-[280px]"
              role="img"
              aria-label="Grafo simple no dirigido de conectividad en aula virtual con simulación de fallos"
            >
              {activeEdges.map(([uId, vId]) => {
                const u = AULA_NODES.find((n) => n.id === uId)!;
                const v = AULA_NODES.find((n) => n.id === vId)!;
                const disabled = uId === failedNodeId || vId === failedNodeId;
                const isConnectedToSelected = (uId === selectedNode.id || vId === selectedNode.id) && !disabled;
                return (
                  <line
                    key={`${uId}-${vId}`}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={disabled ? '#E2E8F0' : isConnectedToSelected ? '#0F766E' : '#94A3B8'}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1.75}
                    strokeDasharray={disabled ? '4 4' : undefined}
                  />
                );
              })}

              {AULA_NODES.map((node) => {
                const isSelected = node.id === selectedNode.id;
                const isFailed = node.id === failedNodeId;
                const isReachable = reachableSet.has(node.id);
                const isolatedNow = node.id === 'V9' && !v9Connected;

                const fill = isFailed
                  ? '#FEE2E2'
                  : !isReachable
                  ? '#FEF2F2'
                  : node.isCutVertex
                  ? '#FFFBEB'
                  : '#FFFFFF';

                const stroke = isSelected
                  ? '#0F766E'
                  : isFailed || !isReachable || isolatedNow
                  ? '#DC2626'
                  : node.isCutVertex
                  ? '#D97706'
                  : '#475569';

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspeccionar vértice ${node.id}: ${node.label}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNodeId(node.id);
                      }
                    }}
                  >
                    {isSelected && (
                      <circle cx={node.x} cy={node.y} r={25} fill="none" stroke="#0F766E" strokeWidth={1.5} strokeDasharray="3 3" />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={20}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSelected ? 2.5 : 1.75}
                      opacity={isFailed ? 0.55 : 1}
                    />
                    <text x={node.x} y={node.y + 4} textAnchor="middle" className="font-mono text-[11px] font-semibold fill-[#0F172A] select-none">
                      {node.id}
                    </text>
                    <text x={node.x} y={node.y + 34} textAnchor="middle" className="font-sans text-[11px] font-medium fill-slate-600 select-none">
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="lg:col-span-4 p-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Diagnóstico del Vértice
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-2">
                <h4 className="text-lg font-bold text-[#0F172A]">
                  {selectedNode.id} · {selectedNode.label}
                </h4>
                <span className="font-mono text-xs font-semibold text-[#0F766E] tabular-nums">
                  gr = {selectedNode.id === failedNodeId ? 0 : nodeDegree}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{selectedNode.role}</p>

              {failedNodeId && (
                <div className={`flex items-start gap-2 rounded-lg border p-3 text-xs ${reachableSet.size < (v9Connected ? 9 : 8) ? 'border-red-200 bg-red-50 text-red-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Con <strong>{failedNodeId}</strong> fuera de servicio, solo{' '}
                    <strong className="tabular-nums">{reachableSet.size} de 9</strong> vértices siguen accesibles desde Inicio.
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2.5 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => setFailedNodeId((prev) => (prev === selectedNode.id ? null : selectedNode.id))}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  failedNodeId === selectedNode.id
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-[#0F766E] text-white hover:bg-[#115E59]'
                }`}
              >
                <Unplug className="h-3.5 w-3.5" aria-hidden="true" />
                {failedNodeId === selectedNode.id
                  ? `Restaurar enlace de ${selectedNode.id}`
                  : `Simular caída del nodo ${selectedNode.id}`}
              </button>
              <div className="text-[11px] text-slate-500">
                Prueba desconectar <strong>V3</strong> o <strong>V5</strong> para comprobar por qué son puntos de corte críticos.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: DAG Correlatividades */}
      {activeTab === 'dag' && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-[#F8FAFC]">
            <svg viewBox="0 0 640 250" className="w-full h-auto max-h-[280px]" role="img" aria-label="Dígrafo de correlatividades interactivo">
              <defs>
                <marker id="arrow-slate-2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,1 L7,4 L0,7 Z" fill="#64748B" />
                </marker>
                <marker id="arrow-blue-2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,1 L7,4 L0,7 Z" fill="#0F766E" />
                </marker>
                <marker id="arrow-red-2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,1 L7,4 L0,7 Z" fill="#DC2626" />
                </marker>
              </defs>

              {[
                { x1: 92, y1: 125, x2: 188, y2: 125, idx: 0 },
                { x1: 232, y1: 125, x2: 323, y2: 125, idx: 1 },
                { x1: 367, y1: 125, x2: 458, y2: 125, idx: 2 },
                { x1: 502, y1: 125, x2: 563, y2: 125, idx: 3 },
              ].map((e) => (
                <line
                  key={e.idx}
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke={cycleResolved ? '#0F766E' : e.idx === 1 || e.idx === 2 ? '#DC2626' : '#94A3B8'}
                  strokeWidth={cycleResolved ? 2.5 : 2}
                  markerEnd={cycleResolved ? 'url(#arrow-blue-2)' : e.idx === 1 || e.idx === 2 ? 'url(#arrow-red-2)' : 'url(#arrow-slate-2)'}
                />
              ))}

              <path d="M 80 144 Q 140 205 188 200" fill="none" stroke="#94A3B8" strokeWidth="1.75" markerEnd="url(#arrow-slate-2)" />
              <line x1="232" y1="200" x2="458" y2="200" stroke="#94A3B8" strokeWidth="1.75" markerEnd="url(#arrow-slate-2)" />
              <path d="M 502 200 Q 550 195 575 147" fill="none" stroke="#94A3B8" strokeWidth="1.75" markerEnd="url(#arrow-slate-2)" />

              {!cycleResolved && (
                <path
                  d="M 480 103 Q 345 25 212 101"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                  markerEnd="url(#arrow-red-2)"
                />
              )}

              {DAG_NODES.map((node) => {
                const isSel = node.id === selectedDagId;
                const highlightCycle = !cycleResolved && node.inCycle;
                const highlightPath = cycleResolved && node.id !== 'M3' && node.id !== 'M5';
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedDagId(node.id)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedDagId(node.id);
                      }
                    }}
                  >
                    <rect
                      x={node.x - 24}
                      y={node.y - 21}
                      width="48"
                      height="42"
                      rx="8"
                      fill={highlightCycle ? '#FEF2F2' : highlightPath ? '#F0FDFA' : '#FFFFFF'}
                      stroke={isSel ? '#0F172A' : highlightCycle ? '#DC2626' : highlightPath ? '#0F766E' : '#94A3B8'}
                      strokeWidth={isSel ? 2.5 : 1.75}
                    />
                    <text x={node.x} y={node.y + 4} textAnchor="middle" className="font-mono text-[11px] font-semibold fill-[#0F172A]">
                      {node.id}
                    </text>
                    <text x={node.x} y={node.y + 34} textAnchor="middle" className="font-sans text-[10px] fill-slate-500">
                      {node.label}
                    </text>
                  </g>
                );
              })}

              {!cycleResolved && (
                <text x="345" y="44" textAnchor="middle" className="font-mono text-[11px] font-semibold fill-red-700">
                  Arista circular del folleto: M6 → M2
                </text>
              )}
            </svg>
          </div>

          <div className="lg:col-span-4 p-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Módulo seleccionado: {selectedDagNode.id}
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">
                {selectedDagNode.label} · {selectedDagNode.desc}
              </h4>
              <p className="text-xs font-mono text-slate-600">
                Correlativa exigida: <strong className="text-[#0F172A]">{selectedDagNode.reqs}</strong>
              </p>

              <div className={`flex items-start gap-2 rounded-lg border p-3 text-xs ${cycleResolved ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'}`}>
                {cycleResolved ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-700 mt-0.5" aria-hidden="true" />
                )}
                <span>
                  {cycleResolved
                    ? 'Orden topológico válido: camino crítico de 5 etapas habilitado hacia el egreso.'
                    : 'Ciclo cerrado M2 → M4 → M6 → M2: ningún estudiante puede egresar.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCycleResolved((prev) => !prev)}
              className="w-full rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#115E59] transition-colors cursor-pointer whitespace-nowrap"
            >
              {cycleResolved ? 'Restaurar ciclo original del folleto' : 'Eliminar arista M6 → M2 (Resolver DAG)'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Rooted Tree (3-click rule) + Interactive Binary Classifier (120 -> 16) */}
      {activeTab === 'arbol' && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-[#F8FAFC] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#0F172A]">
                Árbol con raíz (Regla ≤ 3 clics)
              </span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedDepth(lvl)}
                    className={`rounded px-2.5 py-1 font-mono text-xs tabular-nums transition-colors cursor-pointer ${
                      selectedDepth === lvl
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lvl} clics
                  </button>
                ))}
              </div>
            </div>

            <svg viewBox="0 0 560 215" className="w-full h-auto max-h-[220px]" role="img" aria-label="Árbol con raíz de altura 3">
              {[0, 1, 2, 3].map((lvl) => {
                const y = 26 + lvl * 54;
                return (
                  <g key={lvl}>
                    <line x1="20" y1={y} x2="540" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="14" y={y - 5} className="font-mono text-[10px] fill-slate-400">N{lvl}</text>
                  </g>
                );
              })}

              <line x1="280" y1="26" x2="155" y2="80" stroke={selectedDepth >= 1 ? '#0F766E' : '#CBD5E1'} strokeWidth="2" />
              <line x1="280" y1="26" x2="405" y2="80" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="155" y1="80" x2="95" y2="134" stroke={selectedDepth >= 2 ? '#0F766E' : '#CBD5E1'} strokeWidth="2" />
              <line x1="155" y1="80" x2="215" y2="134" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="405" y1="80" x2="345" y2="134" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="405" y1="80" x2="465" y2="134" stroke="#CBD5E1" strokeWidth="1.5" />

              {[[95, 65], [95, 125], [215, 185], [215, 245], [345, 315], [345, 375], [465, 435], [465, 495]].map(([px, cx], i) => (
                <line
                  key={i}
                  x1={px}
                  y1={134}
                  x2={cx}
                  y2={188}
                  stroke={selectedDepth >= 3 && i === 0 ? '#0F766E' : '#CBD5E1'}
                  strokeWidth={selectedDepth >= 3 && i === 0 ? 2 : 1.25}
                />
              ))}

              <circle cx="280" cy="26" r="13" fill="#0F766E" />
              <text x="280" y="30" textAnchor="middle" className="font-mono text-[9px] fill-white font-semibold">Raíz</text>

              {[155, 405].map((x, idx) => (
                <g key={x}>
                  <circle cx={x} cy="80" r="11" fill={selectedDepth >= 1 && idx === 0 ? '#0F766E' : '#FFFFFF'} stroke="#475569" strokeWidth="1.5" />
                  <text x={x} y="84" textAnchor="middle" className={`font-mono text-[9px] ${selectedDepth >= 1 && idx === 0 ? 'fill-white' : 'fill-slate-700'}`}>C{idx + 1}</text>
                </g>
              ))}

              {[95, 215, 345, 465].map((x, idx) => (
                <g key={x}>
                  <circle cx={x} cy="134" r="10" fill={selectedDepth >= 2 && idx === 0 ? '#0F766E' : '#FFFFFF'} stroke="#475569" strokeWidth="1.5" />
                  <text x={x} y="138" textAnchor="middle" className={`font-mono text-[9px] ${selectedDepth >= 2 && idx === 0 ? 'fill-white' : 'fill-slate-700'}`}>U{idx + 1}</text>
                </g>
              ))}

              {[65, 125, 185, 245, 315, 375, 435, 495].map((x, idx) => (
                <g key={x}>
                  <rect x={x - 13} y="178" width="26" height="19" rx="4" fill={selectedDepth === 3 && idx === 0 ? '#047857' : '#FFFFFF'} stroke={selectedDepth === 3 && idx === 0 ? '#047857' : '#64748B'} strokeWidth="1.25" />
                  <text x={x} y="191" textAnchor="middle" className={`font-mono text-[9px] ${selectedDepth === 3 && idx === 0 ? 'fill-white' : 'fill-slate-700'}`}>H{idx + 1}</text>
                </g>
              ))}
            </svg>
            <p className="text-xs text-slate-600">
              Cualquier hoja del repositorio se alcanza en <strong>{selectedDepth} {selectedDepth === 1 ? 'clic' : 'clics'}</strong> (límite máximo h = 3).
            </p>
          </div>

          {/* Interactive 4-Level Binary Decision Classifier (120 -> 16 groups) */}
          <div className="lg:col-span-6 p-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F172A]">
                  Clasificador Dicotómico en Vivo (120 → 16 grupos)
                </span>
                <span className="font-mono text-xs font-semibold text-[#0F766E] tabular-nums">
                  2⁴ = 16 hojas
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Activa o cambia los 4 criterios binarios de un estudiante para trazar su rama en el árbol de decisión:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { idx: 0 as const, label: 'Nivel 1 · Situación Laboral', on: 'Trabaja', off: 'No trabaja' },
                  { idx: 1 as const, label: 'Nivel 2 · Residencia', on: 'Interior Jujuy', off: 'Capital / Cercanía' },
                  { idx: 2 as const, label: 'Nivel 3 · Conectividad', on: 'Estable', off: 'Intermitente' },
                  { idx: 3 as const, label: 'Nivel 4 · Base TIC', on: 'Avanzada', off: 'Inicial' },
                ].map((c) => (
                  <button
                    key={c.idx}
                    type="button"
                    onClick={() => toggleCriteria(c.idx)}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-left hover:border-[#0F766E]/40 transition-colors cursor-pointer"
                  >
                    <div className="text-[10px] font-mono uppercase text-slate-500">{c.label}</div>
                    <div className="mt-1 flex items-center justify-between text-xs font-semibold text-[#0F172A]">
                      <span>{criteria[c.idx] ? c.on : c.off}</span>
                      <span className="font-mono text-[#0F766E]">[{criteria[c.idx] ? '1' : '0'}]</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3.5 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-500">
                  Ruta binaria: {criteria.map((b) => (b ? '1' : '0')).join(' → ')}
                </div>
                <div className="text-sm font-bold text-[#0F172A]">
                  Grupo Homogéneo #{groupNumber} <span className="font-normal text-slate-600">(~7–8 alumnos)</span>
                </div>
              </div>
              <div className="font-mono text-xs text-emerald-700 font-semibold tabular-nums">
                120 / 16 ≈ 7.5
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
