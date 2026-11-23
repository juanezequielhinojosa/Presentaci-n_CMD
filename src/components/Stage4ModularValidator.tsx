import { useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

function computeZ11CheckDigit(digits: number[]): { sum: number; remainder: number; checkChar: string; weights: number[] } {
  const n = digits.length;
  const weights = digits.map((_, idx) => n + 1 - idx);
  const sum = digits.reduce((acc, d, idx) => acc + d * weights[idx], 0);
  const remainder = sum % 11;
  const checkVal = (11 - remainder) % 11;
  const checkChar = checkVal === 10 ? 'X' : String(checkVal);
  return { sum, remainder, checkChar, weights };
}

function computeZ10LuhnLikeCheck(digits: number[]): number {
  const sum = digits.reduce((acc, d, idx) => acc + d * (idx % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10;
}

interface BenchmarkResult {
  trials: number;
  parityCaught: number;
  z10Caught: number;
  z11Caught: number;
}

export default function Stage4ModularValidator() {
  const [presetMode, setPresetMode] = useState<'legajo' | 'netbook'>('legajo');
  const [baseInput, setBaseInput] = useState<string>('384085');
  const [transmittedInput, setTransmittedInput] = useState<string>('384085');
  const [faultDescription, setFaultDescription] = useState<string>(
    'Sin alteraciones: haz clic en cualquier dígito abajo para alterarlo manualmente o usa los botones de prueba.'
  );
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null);

  const cleanBase = baseInput.replace(/\D/g, '').slice(0, 8) || '384085';
  const baseDigits = cleanBase.split('').map(Number);
  const originalZ11 = computeZ11CheckDigit(baseDigits);

  const cleanTransmitted = transmittedInput.replace(/\D/g, '').slice(0, 8) || cleanBase;
  const transmittedDigits = cleanTransmitted.split('').map(Number);
  const transmittedCheck = computeZ11CheckDigit(transmittedDigits);
  const isValidZ11 =
    transmittedDigits.length === baseDigits.length &&
    transmittedCheck.checkChar === originalZ11.checkChar;

  const z10Orig = computeZ10LuhnLikeCheck(baseDigits);
  const z10Trans = computeZ10LuhnLikeCheck(transmittedDigits);
  const z10Colision = transmittedDigits.length === baseDigits.length && cleanTransmitted !== cleanBase && z10Orig === z10Trans;

  const switchPreset = (mode: 'legajo' | 'netbook') => {
    setPresetMode(mode);
    const val = mode === 'legajo' ? '384085' : '9047218';
    setBaseInput(val);
    setTransmittedInput(val);
    setFaultDescription(
      mode === 'legajo'
        ? 'Legajo estudiantil cargado. Haz clic en cualquier dígito para probar mutaciones.'
        : 'Número de serie de netbook escolar cargado. Haz clic en cualquier dígito para probar mutaciones.'
    );
  };

  const handleBaseChange = (val: string) => {
    const filtered = val.replace(/\D/g, '').slice(0, 8);
    setBaseInput(filtered);
    setTransmittedInput(filtered);
    setFaultDescription('Código actualizado sin errores.');
  };

  const handleMutateDigit = (idx: number) => {
    const altered = [...transmittedDigits];
    const oldVal = altered[idx];
    altered[idx] = (oldVal + 1) % 10;
    setTransmittedInput(altered.join(''));
    setFaultDescription(`Mutación manual en posición ${idx + 1}: dígito ${oldVal} → ${altered[idx]}.`);
  };

  const simulateSubstitution = () => {
    if (baseDigits.length === 0) return;
    const pos = Math.min(2, baseDigits.length - 1);
    const altered = [...baseDigits];
    altered[pos] = (altered[pos] + 3) % 10;
    setTransmittedInput(altered.join(''));
    setFaultDescription(`Sustitución de 1 dígito en posición ${pos + 1}: ${baseDigits[pos]} → ${altered[pos]}.`);
  };

  const simulateTransposition = () => {
    if (baseDigits.length < 2) return;
    const altered = [...baseDigits];
    let idx = altered.findIndex((d, i) => i < altered.length - 1 && d !== altered[i + 1]);
    if (idx === -1) idx = 0;
    const tmp = altered[idx];
    altered[idx] = altered[idx + 1];
    altered[idx + 1] = tmp;
    setTransmittedInput(altered.join(''));
    setFaultDescription(
      `Transposición adyacente en posiciones ${idx + 1}–${idx + 2}: ${baseDigits[idx]}${baseDigits[idx + 1]} → ${altered[idx]}${altered[idx + 1]}.`
    );
  };

  const simulateZ10FailureDemo = () => {
    const demoBase = '201645';
    const demoSwapped = '206145';
    setBaseInput(demoBase);
    setTransmittedInput(demoSwapped);
    setFaultDescription(
      'Transposición diferencia 5 (16 → 61): ℤ₁₀ NO la detecta porque 2·5 ≡ 0 (mód 10), mientras ℤ₁₁ sí la rechaza.'
    );
  };

  const runStressBenchmark = () => {
    const trials = 1000;
    let parityCaught = 0;
    let z10Caught = 0;
    let z11Caught = 0;

    for (let t = 0; t < trials; t++) {
      const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
      const origParity = code.reduce((a, b) => a + b, 0) % 2;
      const origZ10 = computeZ10LuhnLikeCheck(code);
      const origZ11 = computeZ11CheckDigit(code).checkChar;

      const mutated = [...code];
      if (t % 2 === 0) {
        // Adjacent transposition of distinct digits
        const i = Math.floor(Math.random() * 5);
        if (mutated[i] === mutated[i + 1]) {
          mutated[i] = (mutated[i] + 5) % 10;
        } else {
          const tmp = mutated[i];
          mutated[i] = mutated[i + 1];
          mutated[i + 1] = tmp;
        }
      } else {
        // Single digit substitution
        const i = Math.floor(Math.random() * 6);
        mutated[i] = (mutated[i] + 1 + Math.floor(Math.random() * 9)) % 10;
      }

      if (mutated.reduce((a, b) => a + b, 0) % 2 !== origParity) parityCaught++;
      if (computeZ10LuhnLikeCheck(mutated) !== origZ10) z10Caught++;
      if (computeZ11CheckDigit(mutated).checkChar !== origZ11) z11Caught++;
    }

    setBenchmark({ trials, parityCaught, z10Caught, z11Caught });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
          <span className="text-xs font-semibold text-[#0F172A]">
            Validador Modular ℤ₁₁ · Auditoría de Carga Humana
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-slate-200/80 p-1">
          <button
            type="button"
            onClick={() => switchPreset('legajo')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              presetMode === 'legajo' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-600'
            }`}
          >
            Legajo UNJu
          </button>
          <button
            type="button"
            onClick={() => switchPreset('netbook')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              presetMode === 'netbook' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-600'
            }`}
          >
            Serie Netbook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Input + Interactive Clickable Digits */}
        <div className="lg:col-span-6 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px]">
              <label htmlFor="legajo-base" className="block text-xs font-medium text-slate-700 mb-1">
                {presetMode === 'legajo' ? 'Número de Legajo base' : 'Serie de Inventario base'} (máx. 8 dígitos)
              </label>
              <input
                id="legajo-base"
                type="text"
                inputMode="numeric"
                value={baseInput}
                onChange={(e) => handleBaseChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-[#0F172A] tracking-wider tabular-nums focus:border-[#0F766E] focus:outline-none"
              />
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-500">Código con ℤ₁₁</div>
              <div className="font-mono text-lg font-bold text-[#0F766E] tabular-nums">
                {cleanBase}-{originalZ11.checkChar}
              </div>
            </div>
          </div>

          {/* Clickable digits to mutate */}
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-slate-700">
              Cadena recibida (haz clic en cualquier dígito para simular error de tipeo):
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {transmittedDigits.map((d, idx) => {
                const isChanged = baseDigits[idx] !== d;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleMutateDigit(idx)}
                    title={`Clic para alterar posición ${idx + 1}`}
                    className={`h-10 w-9 rounded-lg border font-mono text-base font-bold tabular-nums transition-colors cursor-pointer ${
                      isChanged
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-slate-300 bg-white text-[#0F172A] hover:border-[#0F766E]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
              <span className="font-mono text-slate-400 px-0.5">-</span>
              <div className="h-10 px-3 rounded-lg border border-[#0F766E]/40 bg-[#0F766E]/5 flex items-center justify-center font-mono text-base font-bold text-[#0F766E]">
                {originalZ11.checkChar}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={simulateSubstitution}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              Sustitución (1 dígito)
            </button>
            <button
              type="button"
              onClick={simulateTransposition}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              Transposición adyacente
            </button>
            <button
              type="button"
              onClick={simulateZ10FailureDemo}
              className="rounded-lg border border-[#0F766E]/30 bg-[#0F766E]/5 px-3 py-1.5 text-xs font-semibold text-[#0F766E] hover:bg-[#0F766E]/10 cursor-pointer whitespace-nowrap"
            >
              Fallo en ℤ₁₀ (dif. 5)
            </button>
            <button
              type="button"
              onClick={() => {
                setTransmittedInput(cleanBase);
                setFaultDescription('Cadena restaurada al valor original.');
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Restaurar
            </button>
          </div>
        </div>

        {/* Right: Verification Result + 1,000-Trial Benchmark */}
        <div className="lg:col-span-6 p-5 bg-[#F8FAFC] flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs text-slate-600">{faultDescription}</p>

            {isValidZ11 ? (
              <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" aria-hidden="true" />
                <div>
                  <strong>VÁLIDO EN ℤ₁₁:</strong> Suma = {transmittedCheck.sum} ≡ {transmittedCheck.remainder} (mód 11) → Verificador {transmittedCheck.checkChar}.
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-950">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-700 mt-0.5" aria-hidden="true" />
                <div>
                  <strong>ERROR RECHAZADO POR ℤ₁₁:</strong> Se esperaba verificador <strong>{transmittedCheck.checkChar}</strong> para {cleanTransmitted}, pero el adjunto es <strong>{originalZ11.checkChar}</strong>.
                </div>
              </div>
            )}

            {z10Colision && (
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
                <div>
                  <strong>COLISIÓN EN ℤ₁₀:</strong> Un esquema en ℤ₁₀ arroja idéntico dígito ({z10Orig}) y deja pasar el error porque 10 tiene divisores de cero.
                </div>
              </div>
            )}
          </div>

          {/* 1,000-Error Monte Carlo Stress Test */}
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
                <BarChart3 className="h-3.5 w-3.5 text-[#0F766E]" aria-hidden="true" />
                <span>Prueba comparativa (500 sustituciones + 500 transposiciones)</span>
              </div>
              <button
                type="button"
                onClick={runStressBenchmark}
                className="rounded-md bg-[#0F766E] px-3 py-1 text-xs font-semibold text-white hover:bg-[#115E59] cursor-pointer whitespace-nowrap"
              >
                Ejecutar 1.000 errores
              </button>
            </div>

            {benchmark ? (
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs tabular-nums">
                <div className="rounded border border-slate-200 bg-slate-50 p-2">
                  <div className="text-[10px] text-slate-500">Paridad (5,4)</div>
                  <div className="font-bold text-red-700">
                    {((benchmark.parityCaught / benchmark.trials) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-2">
                  <div className="text-[10px] text-slate-500">Módulo ℤ₁₀</div>
                  <div className="font-bold text-amber-700">
                    {((benchmark.z10Caught / benchmark.trials) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="rounded border border-emerald-200 bg-emerald-50 p-2">
                  <div className="text-[10px] text-emerald-700">Cuerpo ℤ₁₁</div>
                  <div className="font-bold text-emerald-800">
                    {((benchmark.z11Caught / benchmark.trials) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Haz clic en “Ejecutar 1.000 errores” para demostrar estadísticamente en tu exposición la superioridad de ℤ₁₁ frente a paridad (5,4) y ℤ₁₀.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
