import heroMathImage from '../assets/images/hero_discrete_algebra_1795419221836.jpg';
import reflectionStudyImage from '../assets/images/editorial_male_student_desk_1795414810585.jpg';

export interface TeamMember {
  name: string;
  dni: string;
}

export interface ObjectiveItem {
  id: string;
  title: string;
  description: string;
}

export interface StageSummaryRow {
  stageNumber: number;
  stageLabel: string;
  problem: string;
  structure: string;
  decision: string;
  targetId: string;
  slideIndex: number;
}

export interface EvaluationDimension {
  dimension: string;
  level: string;
  statusType: 'excellent' | 'very-good' | 'regular-good';
  rationale: string;
  evidenceLink: string;
}

export const PORTFOLIO_META = {
  subject: 'Complementos de Matemática Discreta',
  title: 'Portafolio Educativo Integrador',
  institution: 'Universidad Nacional de Jujuy',
  faculty: 'Facultad de Ingeniería',
  career: 'Licenciatura en Informática Educativa',
  team: 'Grupo 36',
  year: '2026',
  heroImage: heroMathImage,
  reflectionImage: reflectionStudyImage,
  facultyLogo: './assets/aistudio/image_b937669a.png',
};

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Asmuzi, Fernando Francisco', dni: '38.408.534' },
  { name: 'Hinojosa, Juan Ezequiel', dni: '33.253.208' },
  { name: 'Quiros, José Daniel', dni: '31.202.001' },
];

export const INTRO_TEXT =
  'En el presente portafolio educativo se reúne, documenta y analiza el trayecto de aprendizaje desarrollado por el Grupo 36 a lo largo de la asignatura Complementos de Matemática Discreta. Lejos de concebir a la matemática como un repertorio de algoritmos abstractos y descontextualizados, el trabajo se orientó a la construcción progresiva de modelos matemáticos capaces de responder a problemáticas auténticas de la gestión educativa, arquitectura de plataformas virtuales y el diseño pedagógico en entornos digitales.';

export const OBJECTIVES: ObjectiveItem[] = [
  {
    id: '01',
    title: 'Apropiar el método de modelado discreto',
    description:
      'Aprender a recortar una situación educativa real (objetos, relaciones, preguntas de decisión y límites) evitando forzar la matemática sobre la realidad.',
  },
  {
    id: '02',
    title: 'Vincular la teoría con la Informática Educativa',
    description:
      'Demostrar que conceptos como grafos, caminos críticos, relaciones de equivalencia y monoides son herramientas directas para tomar decisiones de software, optimizar tiempos de estudio y proteger la integridad de los datos académicos.',
  },
  {
    id: '03',
    title: 'Consolidar el trabajo colaborativo auténtico',
    description:
      'Superar el trabajo meramente aditivo o fragmentado, construyendo instancias de discusión o debate por distintos medios, coevaluación fundamentada y consenso argumental en la elección de propuestas grupales.',
  },
];

export const STAGE_1_POINTS = [
  {
    index: '1.1',
    title: 'Conectividad en el aula virtual',
    detail:
      'Modelada mediante un grafo simple no dirigido (V = 9 vértices) para evaluar la navegación bidireccional, detectando un vértice aislado (grado 0) y los puntos de corte.',
  },
  {
    index: '1.2',
    title: 'Correlatividades y viabilidad curricular',
    detail:
      'Uso de un Dígrafo Acíclico (DAG) para detectar un ciclo vicioso cerrado en el folleto de capacitación (M2 → M4 → M6 → M2) y calcular el camino crítico de 5 etapas para el egreso.',
  },
  {
    index: '1.3',
    title: 'Estructura de contenidos y regla de los tres clics',
    detail:
      'Desacoplamiento del modelo en dos herramientas complementarias: un DAG para secuenciar unidades correlativas y un Árbol con raíz de altura 3 para garantizar acceso en ≤ 3 clics.',
  },
  {
    index: '1.4',
    title: 'Clasificación dicotómica de cohortes',
    detail:
      'Árboles binarios de decisión (4 niveles, 2⁴ = 16 hojas) para clasificar a 120 alumnos en 16 grupos homogéneos de seguimiento pedagógico.',
  },
];

export const STAGE_1_SITUATIONS = [
  {
    number: 1,
    title: 'Situación 1 · Navegación en el Aula Virtual (Grafo No Dirigido)',
    caption:
      'La bidireccionalidad de los enlaces y la ausencia de jerarquías se modelan de forma natural con un grafo simple.',
    image: './assets/aistudio/situacion_1_ee6682bf.jpeg',
  },
  {
    number: 2,
    title: 'Situación 2 · Trayecto Formativo y Correlativas (Dígrafo)',
    caption:
      'Las dependencias secuenciales y los posibles ciclos se analizan mediante arcos dirigidos.',
    image: './assets/aistudio/situacion_2_20aa85db.jpeg',
  },
  {
    number: 3,
    title: 'Situación 3 · Organización de Archivos en la Nube (Árbol con Raíz)',
    caption:
      'La jerarquía de contención y los niveles de carpetas se modelan mediante un árbol de altura 3.',
    image: './assets/aistudio/situacion_3_793fb690.jpeg',
  },
  {
    number: 4,
    title: 'Situación 4 · Rediseño Curricular (Ensamble: DAG + Árbol)',
    caption:
      'Se combinan un dígrafo acíclico para correlatividades y un árbol de altura 3 para la navegación.',
    image: './assets/aistudio/situacion_4_33ebb604.jpeg',
  },
  {
    number: 5,
    title: 'Situación 5 · Clasificación y Roles (Árboles Binario y de Permisos)',
    caption:
      'Se utilizan un árbol de decisión para clasificar estudiantes y un árbol de jerarquía para el acceso al aula.',
    image: './assets/aistudio/situacion_5_3036edd7.jpeg',
  },
];

export const STAGE_2_DISCARDED = [
  {
    structure: 'Orden parcial y Diagramas de Hasse',
    reason:
      'Descartado porque la condición de compartir modalidad de cursado entre pares es simétrica (mutua), lo que destruye la antisimetría exigida por todo orden parcial.',
  },
  {
    structure: 'Retículos algebraicos',
    reason:
      'Descartados porque dentro de la diversidad territorial y laboral de los cursantes no existe un "estudiante supremo" ni un "estudiante ínfimo" universal.',
  },
];

export const STAGE_3_PROPOSALS = [
  {
    id: 'z6',
    name: 'Propuesta A · Rotación de turnos en ℤ₆',
    summary: 'Grupo cíclico finito para asignar rotaciones semanales de comisiones.',
    verdict: 'Evaluada en debate interno; menor alcance transversal frente al problema de actas.',
    selected: false,
  },
  {
    id: 'z2',
    name: 'Propuesta B · Asistencia binaria en ℤ₂',
    summary: 'Operación modular binaria para registros de presente/ausente.',
    verdict: 'Evaluada; alcance acotado para modelar reglas de evaluación continua.',
    selected: false,
  },
  {
    id: 'monoid',
    name: 'Propuesta C · Regla de calificación máxima (M, máx)',
    summary: 'Monoide conmutativo e idempotente sobre M = {1, …, 10} con neutro e = 1.',
    verdict:
      'Seleccionada por unanimidad: esta operación específica de calificación máxima no forma un grupo por carecer de inversos para a ≥ 2, y por eso en este flujo de notas se requiere auditoría transaccional (mientras que otras operaciones dentro de una plataforma sí pueden ser grupos).',
    selected: true,
  },
];

export const CONSOLIDATED_MATRIX: StageSummaryRow[] = [
  {
    stageNumber: 1,
    stageLabel: 'Etapa 1',
    problem: 'Navegación en aulas virtuales y plan de correlatividades.',
    structure: 'Grafos simples, DAGs y Árboles con raíz.',
    decision: 'Eliminación de ciclos que traban egresos y diseño de menús en ≤ 3 clics.',
    targetId: 'etapa-1',
    slideIndex: 2,
  },
  {
    stageNumber: 2,
    stageLabel: 'Etapa 2',
    problem: 'Asignación de modalidades evaluativas (local, híbrido, remoto).',
    structure: 'Relación de equivalencia y Conjunto cociente.',
    decision: 'Partición sin solapamiento; reducción del 50% en la sobrecarga de gestión.',
    targetId: 'etapa-2',
    slideIndex: 3,
  },
  {
    stageNumber: 3,
    stageLabel: 'Etapa 3',
    problem: 'Automatización de calificaciones en recuperatorios.',
    structure: 'Monoide conmutativo e idempotente (M, máx).',
    decision: 'Garantía de conservación de nota máxima y exigencia de auditoría histórica.',
    targetId: 'etapa-3',
    slideIndex: 4,
  },
  {
    stageNumber: 4,
    stageLabel: 'Etapa 4',
    problem: 'Carga errónea de legajos y números de serie de inventario.',
    structure: 'Dígitos verificadores sobre cuerpo primo ℤ₁₁.',
    decision: 'Detección inmediata del 100% de errores de tipeo y transposiciones humanas.',
    targetId: 'etapa-4',
    slideIndex: 5,
  },
];

export const REFLECTION_SECTIONS = [
  {
    title: 'El desafío de los tiempos, la vida laboral y las responsabilidades familiares',
    body: 'Todos los miembros del grupo nos encontramos insertos en el ámbito laboral, con jornadas extensas, responsabilidades de familia e imprevistos de conectividad propios de residir en distintas localidades. En más de una ocasión, los horarios para coordinar reuniones sincrónicas resultaron prácticamente nulos, debiendo trabajar en horarios nocturnos o mediante intercambios de mensajes asincrónicos fragmentados. Esta restricción de tiempo generó momentos de cansancio e incertidumbre, pero también nos obligó a profesionalizar la comunicación: aprendimos a fijar plazos realistas, a dividir tareas con responsabilidad individual previa y a utilizar documentos compartidos para revisar y pulir las entregas sin depender exclusivamente de encuentros en vivo.',
  },
  {
    title: 'De la frustración con la matemática a la calidad de lo aprendido',
    body: 'Al comenzar el cuatrimestre, existía en el grupo un prejuicio compartido: la sensación de que la matemática discreta era una materia árida, difícil y lejana al ejercicio cotidiano de la tecnología educativa. Muchos conceptos se percibían como obstáculos teóricos más que como herramientas prácticas. El quiebre positivo se produjo cuando entendimos el verdadero significado de modelar. Descubrir que un árbol con raíz explica matemáticamente por qué un estudiante se desmotiva al navegar más de tres clics, que una relación de equivalencia fundamenta una cursada híbrida equitativa, o que la falta de inverso en un monoide justifica la seguridad de las actas de examen, transformó por completo nuestra relación con el contenido. Logramos una apropiación conceptual en base a situaciones reales y cotidianas, alcanzando un estándar de rigurosidad que consideramos suficiente para la finalización de la materia.',
  },
];

export const REFLECTION_RETROSPECTIVE =
  '¿Qué cambiaríamos si tuviéramos que empezar de nuevo? Probablemente estableceríamos desde la primera semana un cronograma de desarrollo más temprano para amortiguar las semanas de alta carga laboral; sabemos que sería igualmente complicado porque la realidad generalmente nos sorprende, pero podríamos lograr una mejor organización.';

export const EVALUATION_MATRIX: EvaluationDimension[] = [
  {
    dimension: 'Compromiso y Responsabilidad Individual',
    level: 'Muy Bueno',
    statusType: 'very-good',
    rationale:
      'A pesar de las urgencias y el ritmo de vida de cada integrante, cada uno cumplió con la entrega de sus propuestas y aportó a la revisión general de documentos.',
    evidenceLink: 'Entregas completas en las 4 etapas',
  },
  {
    dimension: 'Colaboración y Consenso',
    level: 'Excelente',
    statusType: 'excellent',
    rationale:
      'No hubo imposiciones ni elecciones unilaterales. La elección de cada propuesta se basó en criterios formales establecidos por la cátedra.',
    evidenceLink: 'Consenso argumental en Etapas 2, 3 y 4',
  },
  {
    dimension: 'Rigor Matemático Conceptual',
    level: 'Regular – Bueno',
    statusType: 'regular-good',
    rationale:
      'Se cuidó la fundamentación teórica: demostraciones de propiedades, conjuntos cocientes y límites de cada herramienta. Costó en cuanto al aprendizaje y la relación con nuestro día a día.',
    evidenceLink: 'Demostraciones de propiedades y límites',
  },
  {
    dimension: 'Adaptabilidad y Resiliencia',
    level: 'Muy Bueno',
    statusType: 'very-good',
    rationale:
      'Capacidad para reorganizar entregas en horarios no convencionales ante cualquier imprevisto.',
    evidenceLink: 'Trabajo asincrónico inter-localidades',
  },
  {
    dimension: 'Impacto en la Formación Profesional',
    level: 'Excelente',
    statusType: 'excellent',
    rationale:
      'El proyecto permitió tender un puente directo entre la abstracción matemática y las decisiones de arquitectura de software y gestión escolar que enfrentamos como informáticos educativos.',
    evidenceLink: 'Transferencia a plataformas y actas',
  },
];

export const CLOSING_CONCLUSION =
  'Llegar al final de este trayecto nos deja la certeza de que el mayor valor de este portafolio no está únicamente en las fórmulas o en los esquemas finales concluidos, sino en la capacidad que desarrollamos como equipo para sortear las dificultades de la vida, sostenernos mutuamente y demostrar que, con dedicación, empatía y pensamiento crítico, la matemática discreta se convierte en una aliada imprescindible para transformar nuestras prácticas educativas.';

export const SPEAKER_NOTES: string[] = [
  'Presentación institucional del Grupo 36 (Asmuzi, Hinojosa, Quiros). Remarcar que el portafolio articula cuatro problemáticas reales de la Informática Educativa con estructuras discretas formales.',
  'Destacar los 3 objetivos: apropiar el modelado sin forzar la realidad, demostrar utilidad directa en software educativo y consolidar un trabajo colaborativo basado en consenso argumental.',
  'En el simulador de Etapa 1: mostrar primero la caída de un punto de corte (V3 o V5) y la conexión del vértice aislado V9; luego pasar al DAG para corregir el ciclo M2→M4→M6→M2 y probar el árbol de 16 grupos.',
  'En Etapa 2: explicar por qué se descartó Orden Parcial (la relación es simétrica) y Retículo (sin supremo ni ínfimo). Agregar un estudiante en vivo para ver la partición disjunta en |E/R| = 3 clases.',
  'En Etapa 3: mostrar en la matriz de Cayley 10×10 que el 1 es neutro, hay simetría (conmutatividad) y diagonal idempotente, pero ningún valor > 1 tiene inverso: de ahí la obligación de auditoría en bases de datos.',
  'En Etapa 4: ejecutar el simulador comparativo de 1.000 errores y probar el caso de diferencia 5 (201645 → 206145) para demostrar en vivo por qué ℤ₁₁ detecta el 100% donde ℤ₁₀ falla.',
  'Síntesis de los cuatro productos terminados: mostrar cómo cada estructura matemática se traduce directamente en una decisión operativa verificable para la institución.',
  'Compartir la experiencia real como estudiantes adultos trabajadores de distintas localidades de Jujuy y el cambio de mirada frente a la matemática discreta.',
  'Recorrer la matriz de autoevaluación y cerrar leyendo la conclusión sobre el valor formativo del trabajo sostenido en equipo.',
];
