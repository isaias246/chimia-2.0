import { calculateMolecularMass, balanceEquation } from "./chemistry.js";

export type SolverLevel = "beginner" | "highschool" | "university";
export type SolverAction = "solve" | "simplify" | "example" | "practice" | "formula" | "mistakes";
export type SolverTopic =
  | "molecular-mass"
  | "stoichiometry"
  | "gas-laws"
  | "acids-bases"
  | "equilibrium"
  | "thermodynamics"
  | "electrochemistry"
  | "general";

export interface SolverStep {
  number: number;
  title: string;
  content: string;
  formula?: string;
  substitution?: string;
  result?: string;
  unit?: string;
}

export interface PracticeExercise {
  problem: string;
  hint: string;
  answer: string;
}

export interface WorkedExample {
  problem: string;
  steps: SolverStep[];
  answer: string;
}

export interface SmartSolverResult {
  detectedType: string;
  topic: string;
  problem: string;
  level: SolverLevel;
  answer: string;
  steps: SolverStep[];
  formulas: string[];
  levelExplanations: { beginner: string; highschool: string; university: string };
  workedExample: WorkedExample;
  practiceExercise: PracticeExercise;
  commonMistakes: string[];
  relatedTopics: string[];
  canCompute: boolean;
  variables: Record<string, string>;
  datosExtraidos: Record<string, string>;
  interpretacion: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern matchers — bilingual (English + Spanish)
// ─────────────────────────────────────────────────────────────────────────────
const PATTERNS = {
  // Moles from mass: "36 g of H2O", "36 g de H2O", "36 gramos de NaCl"
  molesFromMass: /(\d+(?:\.\d+)?)\s*(?:gramos?|grams?|g)\s+(?:of|de)\s+([A-Z][a-zA-Z0-9()]*)/,
  molesFromMassSimple: /(\d+(?:\.\d+)?)\s*g\s+([A-Z][a-zA-Z0-9()]{1,20})/,
  // Mass from moles: "0.5 mol of NaCl", "2 moles de CO2", "2 mol de H2O"
  massFromMoles: /(\d+(?:\.\d+)?)\s*(?:moles?|mol)\s+(?:of|de)\s+([A-Z][a-zA-Z0-9()]*)/,
  massFromMolesSimple: /(\d+(?:\.\d+)?)\s*mol\s+([A-Z][a-zA-Z0-9()]{1,20})/,
  // Molecular mass — NO /i flag: [A-Z] must stay uppercase-only or "de/el/la" is captured as a formula
  molecularMassEN: /(?:[Mm]olecular|[Mm]olar)\s+[Mm]ass\s+(?:[Oo]f\s+)?([A-Z][a-zA-Z0-9()]*)/,
  molecularMassES: /[Mm]asa\s+(?:[Mm]olecular|[Mm]olar)\s+(?:[Dd]e\s+)?(?:[Ee]l\s+|[Ll]a\s+)?([A-Z][a-zA-Z0-9()]*)/,
  masaDeES: /[Mm]asa\s+[Dd]e\s+(?:[Ee]l\s+|[Ll]a\s+)?([A-Z][a-zA-Z0-9()]*)/,
  // "Calcula/Halla/Determina la masa molar de X"
  calcMasaES: /(?:[Cc]alcula|[Hh]alla|[Dd]etermina|[Ee]ncuentra|[Oo]btén)\s+(?:[Ll]a\s+)?[Mm]asa\s+(?:[Mm]olecular|[Mm]olar)\s+(?:[Dd]e\s+)?([A-Z][a-zA-Z0-9()]*)/,
  // pH
  phFromConc: /\[H[^]]*\]\s*=\s*([\d.eE+\-]+)\s*(?:M|mol\/L)/i,
  phFromConcShort: /([\d.eE+\-]+)\s*M\s+(?:HCl|H2SO4|HNO3|HBr|HI|ácido|acid)/i,
  concFromPh: /pH\s*[=:]\s*(\d+(?:\.\d+)?)/i,
  pOHtoPH: /pOH\s*[=:]\s*(\d+(?:\.\d+)?)/i,
  // Gas laws
  gasIdeal: /PV\s*=\s*nRT|ideal\s+gas|gas\s+ideal|ley\s+del\s+gas/i,
  boylesLaw: /boyle|P1V1\s*=\s*P2V2/i,
  charlesLaw: /charles|V1\/T1\s*=\s*V2\/T2/i,
  // Stoichiometry
  percentYield: /percent.*yield|actual.*yield|theoretical.*yield|rendimiento\s+(?:porcentual|teórico|real)/i,
  limitingReagent: /limiting\s+(?:reagent|reactant)|reactivo\s+limitante/i,
  // Other
  enthalpy: /enthalpy|ΔH|delta H|exothermic|endothermic|entalp|exotérmico|endotérmico/i,
  gibbs: /gibbs|ΔG|delta G|spontan|espontán/i,
  equilibrium: /equilibri|Kc|Kp|Le Chatel|equilibrio/i,
  electronConfig: /electron\s+config|configuración\s+electrónica/i,
  molecularGeometry: /molecular\s+geom|VSEPR|bond angle|geometría\s+molecular/i,
  balanceEquation: /balance.*equat|equat.*balance|balancea|ecuación.*balancea/i,
};

function detectType(problem: string): string {
  const p = problem;
  // Explicit molecular mass request (ES and EN)
  if (PATTERNS.molecularMassES.test(p) || PATTERNS.molecularMassEN.test(p) || PATTERNS.calcMasaES.test(p) || PATTERNS.masaDeES.test(p)) return "molecular-mass";
  // pH / pOH
  if (PATTERNS.phFromConc.test(p) || PATTERNS.phFromConcShort.test(p) || PATTERNS.concFromPh.test(p) || /\bpH\b/.test(p)) return "ph-calculation";
  if (PATTERNS.pOHtoPH.test(p)) return "poh-calculation";
  // Moles/mass conversions — check if user is asking for moles
  if ((PATTERNS.molesFromMass.test(p) || PATTERNS.molesFromMassSimple.test(p)) && /moles?|mol\b/i.test(p)) return "moles-from-mass";
  if ((PATTERNS.massFromMoles.test(p) || PATTERNS.massFromMolesSimple.test(p)) && /grams?|masa\b|g\b/i.test(p)) return "mass-from-moles";
  // Simple "X g of/de formula" → assume moles-from-mass
  if (PATTERNS.molesFromMass.test(p) || PATTERNS.molesFromMassSimple.test(p)) return "moles-from-mass";
  // Simple "X mol of/de formula" → assume mass-from-moles
  if (PATTERNS.massFromMoles.test(p) || PATTERNS.massFromMolesSimple.test(p)) return "mass-from-moles";
  // Stoichiometry
  if (PATTERNS.percentYield.test(p)) return "percent-yield";
  if (PATTERNS.limitingReagent.test(p)) return "limiting-reagent";
  if (PATTERNS.balanceEquation.test(p)) return "balance-equation";
  // Gas laws
  if (PATTERNS.gasIdeal.test(p)) return "ideal-gas";
  if (PATTERNS.boylesLaw.test(p)) return "boyles-law";
  if (PATTERNS.charlesLaw.test(p)) return "charles-law";
  // Thermodynamics
  if (PATTERNS.gibbs.test(p)) return "gibbs";
  if (PATTERNS.enthalpy.test(p)) return "enthalpy";
  // Equilibrium
  if (PATTERNS.equilibrium.test(p)) return "equilibrium";
  // General
  if (PATTERNS.electronConfig.test(p)) return "electron-config";
  if (PATTERNS.molecularGeometry.test(p)) return "molecular-geometry";
  return "general";
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const NA = 6.022e23;

function interpretarPH(ph: number): string {
  if (ph < 0) return "Solución extremadamente ácida (más ácida que el ácido clorhídrico concentrado).";
  if (ph < 2) return "Solución fuertemente ácida. Corrosiva — requiere manejo cuidadoso.";
  if (ph < 4) return "Solución ácida. Comparable al vinagre o jugo de limón.";
  if (ph < 6.5) return "Solución levemente ácida. Comparable a la lluvia o el café.";
  if (ph < 7.5) return "Solución neutra. Similar al agua pura (pH 7.0).";
  if (ph < 9) return "Solución levemente básica. Comparable al bicarbonato de sodio.";
  if (ph < 12) return "Solución básica. Comparable al jabón o el amoniaco doméstico.";
  return "Solución fuertemente básica (alcalina). Comparable a la lejía — muy corrosiva.";
}

// ─────────────────────────────────────────────────────────────────────────────
// Solver: Moles from mass   n = m / M
// ─────────────────────────────────────────────────────────────────────────────
function solveMolesFromMass(problem: string, level: SolverLevel): SmartSolverResult | null {
  const m =
    problem.match(/(\d+(?:\.\d+)?)\s*(?:gramos?|grams?|g)\s+(?:of|de)\s+([A-Z][a-zA-Z0-9()]*)/) ??
    problem.match(/(\d+(?:\.\d+)?)\s*g\s+([A-Z][a-zA-Z0-9()]{1,20})/);
  if (!m) return null;
  const mass = parseFloat(m[1]);
  const formula = m[2];
  const mmResult = calculateMolecularMass(formula);
  if (!mmResult) return null;

  const moles = mass / mmResult.molarMass;
  const particles = moles * NA;
  const answer = `n = ${moles.toFixed(4)} mol de ${formula}`;

  const steps: SolverStep[] = [
    {
      number: 1, title: "Identificar los datos del problema",
      content: `Dato: masa = ${mass} g de ${formula}\nIncógnita: cantidad de sustancia (n) en mol`,
    },
    {
      number: 2, title: "Escribir la fórmula de los moles",
      content: "Los moles se calculan dividiendo la masa entre la masa molar.",
      formula: "n = m / M",
    },
    {
      number: 3, title: `Calcular la masa molar de ${formula}`,
      content: mmResult.composition.map(c =>
        `${c.symbol}: ${c.count} × ${c.atomicMass.toFixed(3)} g/mol = ${c.totalMass.toFixed(3)} g/mol`
      ).join("\n") + `\nMasa molar total = ${mmResult.molarMass.toFixed(3)} g/mol`,
      formula: `M(${formula}) = ${mmResult.composition.map(c => `${c.count} × ${c.atomicMass.toFixed(3)}`).join(" + ")}`,
      result: `${mmResult.molarMass.toFixed(3)} g/mol`,
      unit: "g/mol",
    },
    {
      number: 4, title: "Sustituir y calcular",
      content: "Divido la masa dada entre la masa molar.",
      formula: "n = m / M",
      substitution: `n = ${mass} g / ${mmResult.molarMass.toFixed(3)} g/mol`,
      result: `${moles.toFixed(4)} mol`,
      unit: "mol",
    },
    {
      number: 5, title: "Verificar las unidades",
      content: "g ÷ (g/mol) = mol ✓   Los gramos se cancelan y quedan los moles.",
      result: `n = ${moles.toFixed(4)} mol de ${formula}`,
    },
  ];

  return {
    detectedType: "moles-from-mass",
    topic: "Moles y Masa Molar",
    problem, level, answer, steps,
    formulas: [
      "n = m / M",
      `M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol`,
      "N = n × Nₐ   (Nₐ = 6.022 × 10²³)",
    ],
    levelExplanations: {
      beginner: `Un "mol" es como una docena, pero de ${(NA).toExponential(3)} partículas. La masa molar nos dice cuánto pesa un mol. Como ${formula} tiene una masa molar de ${mmResult.molarMass.toFixed(1)} g/mol y tienes ${mass} g, simplemente divides: ${mass} ÷ ${mmResult.molarMass.toFixed(1)} = ${moles.toFixed(4)} moles.`,
      highschool: `Usando n = m/M: masa dada m = ${mass} g, M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol → n = ${mass}/${mmResult.molarMass.toFixed(3)} = ${moles.toFixed(4)} mol. Esto equivale a ${particles.toExponential(3)} unidades de fórmula (número de Avogadro).`,
      university: `Cantidad de sustancia n = m/M = ${moles.toFixed(6)} mol. Usando la masa atómica estándar IUPAC 2021: M(${formula}) = ${mmResult.molarMass.toFixed(4)} g·mol⁻¹. La muestra contiene ${particles.toExponential(4)} unidades de fórmula. Composición másica: ${mmResult.composition.map(c => `${c.symbol} ${c.percentComposition.toFixed(2)}%`).join(", ")}.`,
    },
    workedExample: {
      problem: `¿Cuántos moles hay en ${(mass * 2).toFixed(1)} g de ${formula}?`,
      steps: [
        { number: 1, title: "Masa molar", content: `M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol` },
        { number: 2, title: "Aplicar n = m/M", formula: "n = m / M", substitution: `n = ${(mass * 2).toFixed(1)} / ${mmResult.molarMass.toFixed(3)}`, result: `${(mass * 2 / mmResult.molarMass).toFixed(4)} mol`, content: "Dividir masa entre masa molar." },
      ],
      answer: `n = ${(mass * 2 / mmResult.molarMass).toFixed(4)} mol de ${formula}`,
    },
    practiceExercise: {
      problem: `Calcula el número de moles en ${(mass * 1.5).toFixed(1)} g de ${formula}. Muestra todos los pasos.`,
      hint: `Primero calcula la masa molar de ${formula}, luego usa n = m/M.`,
      answer: `n = ${(mass * 1.5).toFixed(1)} / ${mmResult.molarMass.toFixed(3)} = ${(mass * 1.5 / mmResult.molarMass).toFixed(4)} mol`,
    },
    commonMistakes: [
      "Usar la masa atómica (uma) en vez de la masa molar (g/mol) — son iguales numéricamente pero tienen unidades distintas.",
      `Olvidar sumar TODOS los átomos: ${formula} tiene ${mmResult.composition.map(c => `${c.count} ${c.symbol}`).join(", ")}.`,
      "Dividir la masa molar entre la masa (M/m) en vez de la masa entre la masa molar (m/M).",
      "No cancelar unidades — siempre escribe g ÷ (g/mol) = mol para verificar.",
    ],
    relatedTopics: ["Número de Avogadro", "Estequiometría", "Reactivo Limitante", "Composición Porcentual"],
    canCompute: true,
    variables: {
      n: "cantidad de sustancia (mol)",
      m: "masa de la muestra (g)",
      M: "masa molar del compuesto (g/mol)",
      Nₐ: "número de Avogadro = 6.022 × 10²³ mol⁻¹",
    },
    datosExtraidos: {
      masa: `${mass} g`,
      fórmula: formula,
      masaMolar: `${mmResult.molarMass.toFixed(3)} g/mol`,
      composición: mmResult.composition.map(c => `${c.count}${c.symbol}`).join(" + "),
    },
    interpretacion: `${moles.toFixed(4)} mol de ${formula} equivalen a ${particles.toExponential(3)} moléculas individuales — más de 600 sextillones de partículas. En términos prácticos, ${mass} g de ${formula} caben en ${mass < 10 ? "una pequeña muestra de laboratorio" : mass < 100 ? "un vaso de precipitados pequeño" : "un recipiente de laboratorio estándar"}.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Solver: Mass from moles   m = n × M
// ─────────────────────────────────────────────────────────────────────────────
function solveMassFromMoles(problem: string, level: SolverLevel): SmartSolverResult | null {
  const m =
    problem.match(/(\d+(?:\.\d+)?)\s*(?:moles?|mol)\s+(?:of|de)\s+([A-Z][a-zA-Z0-9()]*)/) ??
    problem.match(/(\d+(?:\.\d+)?)\s*mol\s+([A-Z][a-zA-Z0-9()]{1,20})/);
  if (!m) return null;
  const moles = parseFloat(m[1]);
  const formula = m[2];
  const mmResult = calculateMolecularMass(formula);
  if (!mmResult) return null;

  const mass = moles * mmResult.molarMass;
  const particles = moles * NA;

  const steps: SolverStep[] = [
    {
      number: 1, title: "Identificar los datos",
      content: `Dato: n = ${moles} mol de ${formula}\nIncógnita: masa en gramos`,
    },
    {
      number: 2, title: "Escribir la fórmula de la masa",
      content: "Despejo m de la ecuación n = m/M.",
      formula: "m = n × M",
    },
    {
      number: 3, title: `Hallar la masa molar de ${formula}`,
      content: mmResult.composition.map(c => `${c.symbol}: ${c.count} × ${c.atomicMass.toFixed(3)} = ${c.totalMass.toFixed(3)} g/mol`).join("\n"),
      result: `M = ${mmResult.molarMass.toFixed(3)} g/mol`,
      unit: "g/mol",
    },
    {
      number: 4, title: "Calcular la masa",
      formula: "m = n × M",
      substitution: `m = ${moles} mol × ${mmResult.molarMass.toFixed(3)} g/mol`,
      result: `${mass.toFixed(4)} g`,
      unit: "g",
      content: "Multiplico los moles por la masa molar.",
    },
    {
      number: 5, title: "Verificar unidades",
      content: "mol × (g/mol) = g ✓",
      result: `m = ${mass.toFixed(4)} g de ${formula}`,
    },
  ];

  return {
    detectedType: "mass-from-moles",
    topic: "Moles y Masa Molar",
    problem, level,
    answer: `m = ${mass.toFixed(4)} g de ${formula}`,
    steps,
    formulas: ["m = n × M", "n = m / M", `M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol`],
    levelExplanations: {
      beginner: `Si una "bolsa" (mol) de ${formula} pesa ${mmResult.molarMass.toFixed(1)} gramos, entonces ${moles} bolsas pesan ${moles} × ${mmResult.molarMass.toFixed(1)} = ${mass.toFixed(2)} gramos.`,
      highschool: `Usando m = n × M: m = ${moles} mol × ${mmResult.molarMass.toFixed(3)} g/mol = ${mass.toFixed(4)} g. Verificación de unidades: mol × g/mol = g ✓`,
      university: `Dado n = ${moles} mol y M(${formula}) = ${mmResult.molarMass.toFixed(4)} g·mol⁻¹, la masa m = nM = ${mass.toFixed(5)} g. Número de partículas: ${particles.toExponential(4)} unidades de fórmula.`,
    },
    workedExample: {
      problem: `¿Cuál es la masa de ${moles * 2} moles de ${formula}?`,
      steps: [
        { number: 1, title: "Aplicar m = n × M", formula: "m = n × M", substitution: `m = ${moles * 2} × ${mmResult.molarMass.toFixed(3)}`, result: `${(moles * 2 * mmResult.molarMass).toFixed(4)} g`, content: "Multiplicar moles por masa molar." },
      ],
      answer: `${(moles * 2 * mmResult.molarMass).toFixed(4)} g de ${formula}`,
    },
    practiceExercise: {
      problem: `¿Cuál es la masa de ${(moles * 0.5).toFixed(2)} moles de ${formula}?`,
      hint: `Usa m = n × M, donde M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol`,
      answer: `m = ${(moles * 0.5).toFixed(2)} × ${mmResult.molarMass.toFixed(3)} = ${(moles * 0.5 * mmResult.molarMass).toFixed(4)} g`,
    },
    commonMistakes: [
      "Usar m = M/n (dividir en vez de multiplicar).",
      "Olvidar calcular primero la masa molar del compuesto.",
      "Confundir masa (gramos) con masa molar (g/mol).",
    ],
    relatedTopics: ["Moles desde Masa", "Estequiometría", "Composición Porcentual"],
    canCompute: true,
    variables: {
      m: "masa de la muestra (g)",
      n: "cantidad de sustancia (mol)",
      M: "masa molar del compuesto (g/mol)",
      Nₐ: "número de Avogadro = 6.022 × 10²³ mol⁻¹",
    },
    datosExtraidos: {
      moles: `${moles} mol`,
      fórmula: formula,
      masaMolar: `${mmResult.molarMass.toFixed(3)} g/mol`,
      partículas: `${particles.toExponential(3)} entidades`,
    },
    interpretacion: `${mass.toFixed(4)} g de ${formula} equivalen a ${particles.toExponential(3)} unidades de fórmula. ${mass < 1 ? "Esta es una cantidad muy pequeña, típica de experimentos de alta precisión." : mass < 100 ? "Esta cantidad es pesable en una balanza analítica de laboratorio." : "Esta cantidad requiere una balanza de precisión para uso industrial o semi-industrial."}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Solver: Molecular / molar mass
// ─────────────────────────────────────────────────────────────────────────────
function solveMolecularMass(problem: string, level: SolverLevel): SmartSolverResult | null {
  // Extract formula — no /i flag so [A-Z] stays uppercase-only and "de/el/la" is never captured
  const m =
    problem.match(PATTERNS.calcMasaES) ??
    problem.match(PATTERNS.molecularMassES) ??
    problem.match(PATTERNS.masaDeES) ??
    problem.match(PATTERNS.molecularMassEN) ??
    problem.match(/(?:[Mm]ass|[Ww]eight)\s+[Oo]f\s+([A-Z][a-zA-Z0-9()]{0,20})/);
  if (!m) return null;
  const formula = m[1];
  const result = calculateMolecularMass(formula);
  if (!result) return null;

  const steps: SolverStep[] = [
    { number: 1, title: "Escribir la fórmula molecular", content: `Fórmula: ${formula}` },
    { number: 2, title: "Identificar cada elemento y su cantidad", content: result.composition.map(c => `${c.name} (${c.symbol}): ${c.count} átomo${c.count > 1 ? "s" : ""}`).join("\n") },
    { number: 3, title: "Consultar masas atómicas en la tabla periódica", content: result.composition.map(c => `${c.symbol}: ${c.atomicMass.toFixed(4)} g/mol`).join("\n") },
    {
      number: 4, title: "Multiplicar cada masa atómica por su cantidad",
      content: result.composition.map(c => `${c.symbol}: ${c.count} × ${c.atomicMass.toFixed(4)} = ${c.totalMass.toFixed(4)} g/mol`).join("\n"),
      formula: `M = ${result.composition.map(c => `${c.count} × ${c.atomicMass.toFixed(3)}`).join(" + ")}`,
    },
    {
      number: 5, title: "Sumar todas las contribuciones",
      content: `Total = ${result.composition.map(c => c.totalMass.toFixed(4)).join(" + ")} = ${result.molarMass.toFixed(4)} g/mol`,
      result: `${result.molarMass.toFixed(4)} g/mol`,
      unit: "g/mol",
    },
  ];

  return {
    detectedType: "molecular-mass",
    topic: "Masa Molecular",
    problem, level,
    answer: `M(${formula}) = ${result.molarMass.toFixed(4)} g/mol`,
    steps,
    formulas: [`M = Σ(nᵢ × Aᵣᵢ)`, `M(${formula}) = ${result.composition.map(c => `${c.count} × ${c.atomicMass.toFixed(3)}`).join(" + ")}`],
    levelExplanations: {
      beginner: `La masa molar es el "peso" de un mol (${NA.toExponential(3)} moléculas) de ${formula}. Sumas las masas atómicas de cada átomo en la fórmula: ${result.composition.map(c => `${c.count} ${c.name}${c.count > 1 ? "s" : ""} = ${c.totalMass.toFixed(2)} g/mol`).join(", ")}. Total = ${result.molarMass.toFixed(2)} g/mol.`,
      highschool: `Masa molar M = Σ(nᵢ × Aᵣᵢ). Para ${formula}: ${result.composition.map(c => `${c.count}(${c.atomicMass.toFixed(3)})`).join(" + ")} = ${result.molarMass.toFixed(4)} g/mol. Esta es la clave para calcular moles: n = m/M.`,
      university: `M(${formula}) = ${result.molarMass.toFixed(4)} g·mol⁻¹ calculada con masas atómicas estándar IUPAC 2021. Composición másica: ${result.composition.map(c => `${c.symbol} ${c.percentComposition.toFixed(2)}%`).join(", ")}. Valor fundamental en cálculos estequiométricos y preparación de soluciones.`,
    },
    workedExample: {
      problem: "Calcula la masa molar de CO₂.",
      steps: [
        { number: 1, title: "Identificar átomos", content: "CO₂: 1 C + 2 O" },
        { number: 2, title: "Masas atómicas", content: "C = 12.011, O = 15.999 g/mol" },
        { number: 3, title: "Calcular", formula: "M = 1 × 12.011 + 2 × 15.999", result: "44.009 g/mol", content: "Multiplicar y sumar." },
      ],
      answer: "M(CO₂) = 44.009 g/mol",
    },
    practiceExercise: {
      problem: "Calcula la masa molar del H₂SO₄ (ácido sulfúrico).",
      hint: "H₂SO₄ tiene 2 H, 1 S, 4 O. Masas: H=1.008, S=32.06, O=15.999 g/mol",
      answer: "M = 2(1.008) + 32.06 + 4(15.999) = 98.072 g/mol",
    },
    commonMistakes: [
      "Olvidar multiplicar la masa atómica por el subíndice (cantidad) de cada elemento.",
      "Usar el número de masa del protón/neutrón en vez del peso atómico estándar.",
      "Confundir fórmula molecular con fórmula empírica al calcular.",
      `Átomos dentro de paréntesis: por ejemplo Ca(OH)₂ tiene 2 O y 2 H, no 1 O y 1 H.`,
    ],
    relatedTopics: ["Moles desde Masa", "Composición Porcentual", "Fórmula Empírica", "Estequiometría"],
    canCompute: true,
    variables: {
      M: "masa molar del compuesto (g/mol)",
      nᵢ: "número de átomos del elemento i en la fórmula",
      Aᵣᵢ: "masa atómica relativa del elemento i (g/mol)",
    },
    datosExtraidos: {
      fórmula: formula,
      elementos: result.composition.map(c => `${c.count} ${c.symbol}`).join(", "),
      masasAtómicas: result.composition.map(c => `${c.symbol} = ${c.atomicMass.toFixed(4)}`).join(", "),
    },
    interpretacion: `Un mol de ${formula} (${NA.toExponential(3)} moléculas) pesa exactamente ${result.molarMass.toFixed(4)} g. Composición por masa: ${result.composition.map(c => `${c.symbol} ${c.percentComposition.toFixed(1)}%`).join(", ")}. ${result.composition.length === 1 ? "Elemento puro — todos los átomos son del mismo tipo." : "Compuesto — la fórmula determina una proporción fija e inmutable de elementos."}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Solver: pH / pOH
// ─────────────────────────────────────────────────────────────────────────────
function solvePH(problem: string, level: SolverLevel): SmartSolverResult | null {
  let concentration: number | null = null;
  let phGiven: number | null = null;
  let pOHGiven: number | null = null;
  let answer = "";
  const steps: SolverStep[] = [];
  let datos: Record<string, string> = {};

  const concMatch =
    problem.match(/\[H[^]]*\]\s*=\s*([\d.eE+\-]+)\s*(?:M|mol\/L)/i) ??
    problem.match(/([\d.eE+\-]+)\s*M\s+(?:HCl|H2SO4|HNO3|HBr|HI|ácido|acid)/i);
  if (concMatch) concentration = parseFloat(concMatch[1]);

  const phMatch = problem.match(/pH\s*[=:]\s*(\d+(?:\.\d+)?)/i);
  if (phMatch) phGiven = parseFloat(phMatch[1]);

  const pOHMatch = problem.match(/pOH\s*[=:]\s*(\d+(?:\.\d+)?)/i);
  if (pOHMatch) pOHGiven = parseFloat(pOHMatch[1]);

  if (concentration !== null) {
    const pH = -Math.log10(concentration);
    const pOH = 14 - pH;
    const ohConc = Math.pow(10, -pOH);
    answer = `pH = ${pH.toFixed(2)}`;
    datos = { "[H⁺]": `${concentration} mol/L`, tipo: "dada concentración" };
    steps.push(
      { number: 1, title: "Dato: concentración de H⁺", content: `[H⁺] = ${concentration} mol/L` },
      { number: 2, title: "Aplicar la fórmula del pH", formula: "pH = −log₁₀[H⁺]", substitution: `pH = −log₁₀(${concentration})`, result: `pH = ${pH.toFixed(4)}`, content: "Tomo el logaritmo negativo en base 10." },
      { number: 3, title: "Hallar pOH y [OH⁻]", formula: "pOH = 14 − pH", substitution: `pOH = 14 − ${pH.toFixed(4)}`, result: `pOH = ${pOH.toFixed(4)}; [OH⁻] = ${ohConc.toExponential(3)} mol/L`, content: "A 25°C: pH + pOH = 14." },
      { number: 4, title: "Clasificar la solución", content: `pH = ${pH.toFixed(2)} → ${pH < 7 ? "Solución ácida ([H⁺] > [OH⁻])" : pH > 7 ? "Solución básica ([H⁺] < [OH⁻])" : "Solución neutra ([H⁺] = [OH⁻])"}` },
    );
    datos["pH calculado"] = pH.toFixed(2);
    datos["pOH"] = pOH.toFixed(2);
  } else if (phGiven !== null) {
    const hConc = Math.pow(10, -phGiven);
    const pOH = 14 - phGiven;
    const ohConc = Math.pow(10, -pOH);
    answer = `[H⁺] = ${hConc.toExponential(3)} mol/L`;
    datos = { pH: String(phGiven), tipo: "dado pH" };
    steps.push(
      { number: 1, title: "Dato: pH", content: `pH = ${phGiven}` },
      { number: 2, title: "Hallar [H⁺]", formula: "[H⁺] = 10^(−pH)", substitution: `[H⁺] = 10^(−${phGiven})`, result: `${hConc.toExponential(4)} mol/L`, content: "Elevo 10 al pH negativo." },
      { number: 3, title: "Hallar pOH y [OH⁻]", formula: "pOH = 14 − pH", substitution: `pOH = 14 − ${phGiven} = ${pOH}`, result: `[OH⁻] = ${ohConc.toExponential(3)} mol/L`, content: "Usando la relación de autoionización del agua." },
      { number: 4, title: "Clasificar la solución", content: `pH = ${phGiven} → ${phGiven < 7 ? "Ácida" : phGiven > 7 ? "Básica" : "Neutra"}` },
    );
    datos["[H⁺] calculada"] = hConc.toExponential(4) + " mol/L";
    datos["[OH⁻]"] = ohConc.toExponential(3) + " mol/L";
  } else if (pOHGiven !== null) {
    const pH = 14 - pOHGiven;
    const hConc = Math.pow(10, -pH);
    answer = `pH = ${pH.toFixed(2)}`;
    datos = { pOH: String(pOHGiven), tipo: "dado pOH" };
    steps.push(
      { number: 1, title: "Dato: pOH", content: `pOH = ${pOHGiven}` },
      { number: 2, title: "Usar pH + pOH = 14", formula: "pH = 14 − pOH", substitution: `pH = 14 − ${pOHGiven}`, result: `pH = ${pH.toFixed(2)}`, content: "Esta relación es válida a 25°C." },
      { number: 3, title: "Hallar [H⁺]", formula: "[H⁺] = 10^(−pH)", substitution: `[H⁺] = 10^(−${pH.toFixed(2)})`, result: `${hConc.toExponential(3)} mol/L`, content: "Elevo 10 al pH negativo." },
    );
    datos["pH calculado"] = pH.toFixed(2);
  } else {
    return null;
  }

  const finalPH = phGiven ?? (pOHGiven !== null ? 14 - pOHGiven : -Math.log10(concentration!));

  return {
    detectedType: "ph-calculation",
    topic: "Ácidos y Bases — pH",
    problem, level, answer, steps,
    formulas: ["pH = −log₁₀[H⁺]", "[H⁺] = 10^(−pH)", "pOH = 14 − pH", "[H⁺][OH⁻] = Kw = 10⁻¹⁴"],
    levelExplanations: {
      beginner: "La escala de pH mide qué tan ácida o básica es una solución, de 0 (muy ácido) a 14 (muy básico). 7 es neutro (como el agua pura). La fórmula pH = −log[H⁺] convierte una concentración diminuta en un número sencillo del 0 al 14.",
      highschool: "pH = −log₁₀[H⁺]. Como los valores de [H⁺] son muy pequeños (ej. 0.0001 mol/L), el logaritmo negativo nos da una escala manejable. A 25°C: pH + pOH = 14, porque [H⁺][OH⁻] = Kw = 10⁻¹⁴.",
      university: "pH = −log₁₀(aH⁺) donde aH⁺ es la actividad del ion hidronio. Para soluciones diluidas, actividad ≈ concentración molar. Kw = [H⁺][OH⁻] = 10⁻¹⁴ a 25°C (varía con T). Para ácidos débiles, se debe aplicar el equilibrio Ka antes de calcular el pH.",
    },
    workedExample: {
      problem: "Halla el pH de una solución de HCl 0.01 mol/L.",
      steps: [
        { number: 1, title: "HCl es ácido fuerte — se disocia completamente", content: "HCl → H⁺ + Cl⁻, por tanto [H⁺] = 0.01 mol/L" },
        { number: 2, title: "Aplicar la fórmula", formula: "pH = −log₁₀[H⁺]", substitution: "pH = −log₁₀(0.01)", result: "pH = 2.00", content: "log(0.01) = −2, por tanto pH = 2." },
      ],
      answer: "pH = 2.00",
    },
    practiceExercise: {
      problem: "¿Cuál es el pH de una solución de HNO₃ 0.0001 mol/L?",
      hint: "HNO₃ es ácido fuerte. [H⁺] = 0.0001 mol/L = 10⁻⁴ mol/L",
      answer: "pH = −log(10⁻⁴) = 4.00",
    },
    commonMistakes: [
      "Olvidar el signo NEGATIVO: pH = −log[H⁺], no log[H⁺].",
      "Usar logaritmo natural (ln) en vez de logaritmo decimal (log₁₀).",
      "Asumir que los ácidos débiles se disocian completamente — solo los ácidos fuertes lo hacen.",
      "No verificar si la temperatura es 25°C antes de usar pH + pOH = 14.",
    ],
    relatedTopics: ["Soluciones Tampón", "Ka y Kb", "Titulación Ácido-Base", "Reacciones de Neutralización"],
    canCompute: concentration !== null || phGiven !== null || pOHGiven !== null,
    variables: {
      pH: "−log₁₀[H⁺]",
      pOH: "−log₁₀[OH⁻] = 14 − pH (a 25°C)",
      "[H⁺]": "concentración de iones hidronio (mol/L)",
      "[OH⁻]": "concentración de iones hidróxido (mol/L)",
      Kw: "producto iónico del agua = 10⁻¹⁴ a 25°C",
    },
    datosExtraidos: datos,
    interpretacion: interpretarPH(finalPH),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Solver: Ideal Gas Law   PV = nRT
// ─────────────────────────────────────────────────────────────────────────────
function solveIdealGas(problem: string, level: SolverLevel): SmartSolverResult {
  const pMatch = problem.match(/P\s*=\s*([\d.]+)\s*atm/i);
  const vMatch = problem.match(/V\s*=\s*([\d.]+)\s*L/i);
  const nMatch = problem.match(/n\s*=\s*([\d.]+)\s*mol/i);
  const tMatch = problem.match(/T\s*=\s*([\d.]+)\s*K/i) ?? problem.match(/(\d+(?:\.\d+)?)\s*K/);

  const R = 0.0821;
  let answer = "Usa PV = nRT para resolver la variable desconocida.";
  let computedSteps: SolverStep[] = [];
  let canCompute = false;

  const known = {
    P: pMatch ? parseFloat(pMatch[1]) : null,
    V: vMatch ? parseFloat(vMatch[1]) : null,
    n: nMatch ? parseFloat(nMatch[1]) : null,
    T: tMatch ? parseFloat(tMatch[1]) : null,
  };
  const datos: Record<string, string> = {};
  for (const [k, v] of Object.entries(known)) {
    if (v !== null) {
      const units = k === "P" ? "atm" : k === "V" ? "L" : k === "n" ? "mol" : "K";
      datos[k] = `${v} ${units}`;
    }
  }
  datos["variable desconocida"] = Object.keys(known).find(k => known[k as keyof typeof known] === null) ?? "ver problema";

  const knowCount = Object.values(known).filter(v => v !== null).length;

  if (knowCount === 3) {
    canCompute = true;
    if (known.P === null) {
      const P = (known.n! * R * known.T!) / known.V!;
      answer = `P = ${P.toFixed(4)} atm`;
      computedSteps = [
        { number: 1, title: "Valores conocidos", content: `n = ${known.n} mol, V = ${known.V} L, T = ${known.T} K, R = 0.0821 L·atm/(mol·K)` },
        { number: 2, title: "Despejar P", formula: "P = nRT / V", substitution: `P = (${known.n} × 0.0821 × ${known.T}) / ${known.V}`, result: `${P.toFixed(4)} atm`, content: "Dividir nRT entre V." },
      ];
      datos["P calculada"] = `${P.toFixed(4)} atm`;
    } else if (known.V === null) {
      const V = (known.n! * R * known.T!) / known.P!;
      answer = `V = ${V.toFixed(4)} L`;
      computedSteps = [
        { number: 1, title: "Valores conocidos", content: `P = ${known.P} atm, n = ${known.n} mol, T = ${known.T} K` },
        { number: 2, title: "Despejar V", formula: "V = nRT / P", substitution: `V = (${known.n} × 0.0821 × ${known.T}) / ${known.P}`, result: `${V.toFixed(4)} L`, content: "Multiplicar n×R×T y dividir por P." },
      ];
      datos["V calculado"] = `${V.toFixed(4)} L`;
    } else if (known.n === null) {
      const n = (known.P! * known.V!) / (R * known.T!);
      answer = `n = ${n.toFixed(4)} mol`;
      computedSteps = [
        { number: 1, title: "Valores conocidos", content: `P = ${known.P} atm, V = ${known.V} L, T = ${known.T} K` },
        { number: 2, title: "Despejar n", formula: "n = PV / RT", substitution: `n = (${known.P} × ${known.V}) / (0.0821 × ${known.T})`, result: `${n.toFixed(4)} mol`, content: "Multiplicar P×V y dividir por R×T." },
      ];
      datos["n calculado"] = `${n.toFixed(4)} mol`;
    } else {
      const T = (known.P! * known.V!) / (known.n! * R);
      answer = `T = ${T.toFixed(2)} K`;
      computedSteps = [
        { number: 1, title: "Valores conocidos", content: `P = ${known.P} atm, V = ${known.V} L, n = ${known.n} mol` },
        { number: 2, title: "Despejar T", formula: "T = PV / nR", substitution: `T = (${known.P} × ${known.V}) / (${known.n} × 0.0821)`, result: `${T.toFixed(2)} K`, content: "Multiplicar P×V y dividir por n×R." },
      ];
      datos["T calculada"] = `${T.toFixed(2)} K (= ${(T.toFixed(2) as unknown as number - 273.15).toFixed(2)} °C)`;
    }
  }

  const steps: SolverStep[] = [
    { number: 1, title: "Ley del Gas Ideal", formula: "PV = nRT", content: "P = presión (atm), V = volumen (L), n = moles, R = 0.0821 L·atm/(mol·K), T = temperatura (K)." },
    { number: 2, title: "Identificar conocidos e incógnita", content: `Conocidos: ${Object.entries(known).filter(([, v]) => v !== null).map(([k, v]) => `${k} = ${v}`).join(", ") || "ver problema"}\nIncógnita: la variable a despejar.` },
    { number: 3, title: "Despejar la incógnita", content: "Aisla la variable desconocida dividiendo ambos lados por las cantidades conocidas.", formula: "P = nRT/V  |  V = nRT/P  |  n = PV/RT  |  T = PV/nR" },
    ...computedSteps.slice(1),
    { number: computedSteps.length > 0 ? 4 : 4, title: "Importante: temperatura en Kelvin", content: "T(K) = T(°C) + 273.15\n¡Nunca uses Celsius directamente en la ley del gas ideal!", formula: "T(K) = T(°C) + 273.15" },
  ];

  return {
    detectedType: "ideal-gas",
    topic: "Leyes de los Gases — Ley del Gas Ideal",
    problem, level,
    answer: canCompute ? answer : "PV = nRT — proporciona 3 de las 4 variables (P, V, n, T) para resolver la 4ª.",
    steps,
    formulas: ["PV = nRT", "R = 0.0821 L·atm/(mol·K)", "T(K) = T(°C) + 273.15", "P = nRT/V", "V = nRT/P", "n = PV/RT"],
    levelExplanations: {
      beginner: "Imagina moléculas de gas rebotando en una caja. Más moléculas (n) o mayor temperatura (T) significan más presión. Una caja más grande (V) significa menos presión. PV = nRT captura todas estas relaciones en una sola ecuación. R es simplemente una constante (0.0821) que hace que las unidades funcionen.",
      highschool: "La ley del gas ideal PV = nRT combina la ley de Boyle (P∝1/V), la ley de Charles (V∝T) y la ley de Avogadro (V∝n). R = 0.0821 L·atm/(mol·K). ¡Siempre convierte la temperatura a Kelvin! A CNPT (0°C, 1 atm), 1 mol de gas ideal ocupa 22.4 L.",
      university: "La ley del gas ideal PV = nRT es la ecuación de estado para un gas hipotético ideal: R = 8.314 J/(mol·K). Los gases reales se desvían a alta presión o baja temperatura; la ecuación de van der Waals corrige: (P + an²/V²)(V − nb) = nRT, donde a es la atracción intermolecular y b el volumen molecular.",
    },
    workedExample: {
      problem: "Un gas ocupa 2.0 L a 1.0 atm y 300 K. ¿Cuántos moles hay?",
      steps: [
        { number: 1, title: "Conocidos: P=1.0 atm, V=2.0 L, T=300 K", content: "Resolver para n." },
        { number: 2, title: "Despejar n", formula: "n = PV/RT", substitution: "n = (1.0 × 2.0) / (0.0821 × 300)", result: "0.0812 mol", content: "Calcular numerador y denominador." },
      ],
      answer: "n = 0.0812 mol",
    },
    practiceExercise: {
      problem: "¿Cuál es el volumen de 0.5 mol de gas a 2.0 atm y 350 K?",
      hint: "Despeja V: V = nRT/P",
      answer: "V = (0.5 × 0.0821 × 350) / 2.0 = 7.18 L",
    },
    commonMistakes: [
      "Usar temperatura en °C en vez de Kelvin — siempre sumar 273.15.",
      "Usar presión en kPa con R = 0.0821 — esta R requiere presión en atm.",
      "Olvidar que R = 8.314 J/(mol·K) al trabajar en unidades SI (Pa, m³).",
      "Asumir que la ley del gas ideal aplica a todos los gases reales — falla a alta presión y baja temperatura.",
    ],
    relatedTopics: ["Ley de Boyle", "Ley de Charles", "Ley de Dalton", "Teoría Cinético-Molecular"],
    canCompute,
    variables: {
      P: "presión del gas (atm)",
      V: "volumen del gas (L)",
      n: "cantidad de sustancia (mol)",
      R: "constante de los gases ideales = 0.0821 L·atm·mol⁻¹·K⁻¹",
      T: "temperatura absoluta (K) — T(K) = T(°C) + 273.15",
    },
    datosExtraidos: datos,
    interpretacion: canCompute
      ? `Los gases ideales ocupan el mismo volumen molar (22.4 L/mol) a CNTP (0°C, 1 atm). El resultado obtenido es válido para un gas que se comporta idealmente: sin fuerzas intermoleculares significativas y con volumen molecular despreciable frente al volumen del recipiente.`
      : "Proporciona tres de las cuatro variables (P, V, n, T) para obtener la cuarta con PV = nRT.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// General topic engine — conceptual (non-numeric) topics
// Honest about what it is: theory + worked examples, canCompute = false
// ─────────────────────────────────────────────────────────────────────────────
function solveGeneralTopic(problem: string, topic: SolverTopic, level: SolverLevel, detectedType: string): SmartSolverResult {
  const topicData: Record<string, {
    title: string; answer: string; steps: SolverStep[]; formulas: string[];
    explanations: { beginner: string; highschool: string; university: string };
    example: WorkedExample; practice: PracticeExercise; mistakes: string[]; related: string[];
    variables: Record<string, string>;
  }> = {
    "equilibrium": {
      title: "Equilibrio Químico",
      answer: "Una reacción alcanza el equilibrio cuando la velocidad de la reacción directa iguala a la de la inversa.",
      steps: [
        { number: 1, title: "Escribir la ecuación balanceada", content: "Para: aA + bB ⇌ cC + dD" },
        { number: 2, title: "Escribir la expresión de equilibrio", formula: "Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ", content: "Productos sobre reactivos, cada uno elevado a su coeficiente estequiométrico." },
        { number: 3, title: "Interpretar K", content: "K >> 1: favorecidos los productos\nK << 1: favorecidos los reactivos\nK ≈ 1: cantidades aproximadamente iguales" },
        { number: 4, title: "Aplicar el Principio de Le Chatelier", content: "Añadir reactivo → desplazamiento hacia productos\nEliminar producto → desplazamiento hacia productos\nAumentar presión → desplazamiento hacia menos moles de gas\nAumentar temperatura → desplazamiento hacia el lado endotérmico" },
      ],
      formulas: ["Kc = [productos]ᵖ / [reactivos]ʳ", "Kp = Kc(RT)^Δn", "ΔG° = −RT ln K", "Q vs K determina la dirección del desplazamiento"],
      explanations: {
        beginner: "El equilibrio es como un juego de tira y afloja que termina en empate. Los dos equipos (reacción directa e inversa) siguen tirando, pero la cuerda no se mueve. Añadir más reactivo es como añadir jugadores a un lado — la cuerda se desplaza hasta encontrar un nuevo equilibrio.",
        highschool: "En el equilibrio, las velocidades de las reacciones directa e inversa son iguales (¡no las concentraciones!). La constante Kc = [productos]/[reactivos] (con coeficientes como exponentes) indica dónde está el balance. El principio de Le Chatelier predice cómo responde el sistema a una perturbación.",
        university: "El equilibrio termodinámico se define por ΔG = 0. La constante de equilibrio K se relaciona con la energía de Gibbs estándar: ΔG° = −RT ln K. El cociente de reacción Q predice la dirección: si Q < K, la reacción avanza hacia los productos; si Q > K, hacia los reactivos. Fuera de condiciones estándar: ΔG = ΔG° + RT ln Q.",
      },
      example: {
        problem: "Para N₂ + 3H₂ ⇌ 2NH₃, escribe la expresión de Kc.",
        steps: [
          { number: 1, title: "Identificar productos y reactivos con coeficientes", content: "Productos: NH₃ (coef=2)\nReactivos: N₂ (coef=1), H₂ (coef=3)" },
          { number: 2, title: "Escribir Kc", formula: "Kc = [NH₃]² / ([N₂][H₂]³)", content: "Cada especie elevada a su coeficiente." },
        ],
        answer: "Kc = [NH₃]² / ([N₂][H₂]³)",
      },
      practice: { problem: "Para 2SO₂ + O₂ ⇌ 2SO₃, escribe la expresión de Kc e indica qué lado está favorecido si Kc = 1×10⁸.", hint: "Productos sobre reactivos, con exponentes desde los coeficientes.", answer: "Kc = [SO₃]² / ([SO₂]²[O₂]). Kc >> 1 → favorecidos fuertemente los productos (SO₃)." },
      mistakes: ["Incluir sólidos puros o líquidos en las expresiones de K (solo gases y especies acuosas)", "Creer que equilibrio significa concentraciones iguales — significa VELOCIDADES iguales", "Confundir Kc (concentraciones) con Kp (presiones)", "No elevar los coeficientes como exponentes"],
      related: ["Principio de Le Chatelier", "Energía de Gibbs", "Ksp Solubilidad", "Soluciones Tampón"],
      variables: { Kc: "constante de equilibrio en concentraciones molares", Kp: "constante de equilibrio en presiones parciales", Q: "cociente de reacción (estado actual del sistema)", ΔG: "energía libre de Gibbs (J/mol)" },
    },
    "thermodynamics": {
      title: "Termoquímica y Termodinámica",
      answer: "La termodinámica rige los cambios de energía en reacciones químicas mediante ΔH, ΔS y ΔG.",
      steps: [
        { number: 1, title: "Identificar el tipo de cambio energético", content: "ΔH < 0: exotérmico (libera calor)\nΔH > 0: endotérmico (absorbe calor)" },
        { number: 2, title: "Calcular ΔH por la Ley de Hess", formula: "ΔH_rxn = Σ ΔH°f(productos) − Σ ΔH°f(reactivos)", content: "Usar entalpías estándar de formación de tablas." },
        { number: 3, title: "Calcular ΔS (cambio de entropía)", content: "ΔS > 0: aumenta el desorden (favorable)\nMás productos gaseosos = más entropía" },
        { number: 4, title: "Calcular ΔG (energía libre de Gibbs)", formula: "ΔG = ΔH − TΔS", content: "ΔG < 0: espontáneo\nΔG > 0: no espontáneo\nΔG = 0: en equilibrio" },
      ],
      formulas: ["ΔH_rxn = Σ ΔH°f(productos) − Σ ΔH°f(reactivos)", "ΔG = ΔH − TΔS", "ΔG° = −RT ln K", "ΔG = ΔG° + RT ln Q"],
      explanations: {
        beginner: "Piensa en ΔH como si midiera si una reacción libera calor (como quemar madera, ΔH < 0) o necesita calor para ocurrir (como derretir hielo, ΔH > 0). ΔG nos dice si la reacción ocurrirá sola — si ΔG es negativo, la reacción es espontánea.",
        highschool: "ΔH es calor a presión constante; ΔS mide el desorden. La ecuación de Gibbs ΔG = ΔH − TΔS combina ambos para predecir la espontaneidad. ΔG negativo → espontáneo. La temperatura afecta cuál término domina.",
        university: "La energía libre de Gibbs G = H − TS es el potencial termodinámico minimizado a T y P constantes. La espontaneidad requiere ΔG < 0. ΔG° = ΔH° − TΔS° = −RT ln K. Fuera de condiciones estándar: ΔG = ΔG° + RT ln Q.",
      },
      example: {
        problem: "¿Es espontánea la combustión de CH₄? ΔH = −890 kJ, ΔS = +3.4 J/(mol·K) a 298 K.",
        steps: [
          { number: 1, title: "Calcular ΔG a 298 K", formula: "ΔG = ΔH − TΔS", substitution: "ΔG = −890 kJ − (298 × 0.0034 kJ/K)", result: "ΔG ≈ −891 kJ", content: "Convertir ΔS a kJ." },
          { number: 2, title: "Interpretar", content: "ΔG = −891 kJ < 0 → espontánea ✓" },
        ],
        answer: "ΔG = −891 kJ, espontánea",
      },
      practice: { problem: "Si ΔH = +50 kJ y ΔS = +200 J/(mol·K), ¿a qué temperatura ΔG se vuelve negativo?", hint: "Iguala ΔG = 0: T = ΔH/ΔS", answer: "T = 50000 J / 200 J/K = 250 K. Por encima de 250 K la reacción es espontánea." },
      mistakes: ["Mezclar unidades: ΔH en kJ pero ΔS en J/(mol·K) — convertir ambos a las mismas unidades", "Creer que ΔH negativo implica espontaneidad — la entropía también importa", "Olvidar que ΔG, no ΔH, determina la espontaneidad", "No tener en cuenta la dependencia de ΔG con la temperatura"],
      related: ["Ley de Hess", "Entropía", "Constante de Equilibrio", "Calorimetría"],
      variables: { ΔH: "cambio de entalpía (kJ/mol)", ΔS: "cambio de entropía (J/mol·K)", ΔG: "energía libre de Gibbs (kJ/mol)", T: "temperatura absoluta (K)", R: "constante de los gases = 8.314 J/(mol·K)" },
    },
    "electrochemistry": {
      title: "Electroquímica",
      answer: "La electroquímica estudia la interconversión de energía química y eléctrica en reacciones redox.",
      steps: [
        { number: 1, title: "Identificar las semirreacciones de oxidación y reducción", content: "OIL RIG: Oxidación Es Pérdida, Reducción Es Ganancia de electrones." },
        { number: 2, title: "Buscar los potenciales estándar de reducción (E°red)", content: "De la tabla de potenciales: mayor E° = mejor agente oxidante." },
        { number: 3, title: "Calcular el potencial de celda", formula: "E°celda = E°cátodo − E°ánodo", content: "Cátodo = reducción (E° mayor), Ánodo = oxidación (E° menor)." },
        { number: 4, title: "Determinar la espontaneidad", formula: "ΔG° = −nFE°celda", content: "n = electrones transferidos, F = 96485 C/mol. Si E°celda > 0, la reacción es espontánea." },
        { number: 5, title: "Ecuación de Nernst para condiciones no estándar", formula: "E = E° − (0.0592/n) log Q", content: "A 25°C simplificado." },
      ],
      formulas: ["E°celda = E°cátodo − E°ánodo", "ΔG° = −nFE°celda", "E = E° − (0.0592/n) log Q", "log K = nE°/0.0592"],
      explanations: {
        beginner: "Una batería es un buen ejemplo de electroquímica. Los electrones fluyen de un metal al otro, creando electricidad. El zinc cede electrones (oxidación, ánodo) y el cobre los acepta (reducción, cátodo). Cuanto mayor es la diferencia en 'avidez' por los electrones, mayor el voltaje.",
        highschool: "Las celdas galvánicas convierten reacciones redox espontáneas en energía eléctrica. E°celda = E°cátodo − E°ánodo. Si E°celda > 0, la reacción es espontánea. ΔG° = −nFE°. La ecuación de Nernst ajusta por concentraciones no estándar.",
        university: "ΔG° = −nFE° = −RT ln K. La ecuación de Nernst: E = E° − (RT/nF) ln Q describe potenciales fuera del equilibrio. El sobrepotencial, la cinética Butler-Volmer y la polarización del electrodo gobiernan las celdas reales. Las celdas electrolíticas aplican voltaje externo para conducir reacciones no espontáneas.",
      },
      example: {
        problem: "Calcula E°celda para la celda galvánica Zn/Cu. E°(Cu²⁺/Cu) = +0.34 V, E°(Zn²⁺/Zn) = −0.76 V.",
        steps: [
          { number: 1, title: "Identificar cátodo y ánodo", content: "Cu²⁺ tiene mayor E° → cátodo (reducción)\nZn tiene menor E° → ánodo (oxidación)" },
          { number: 2, title: "Calcular E°celda", formula: "E°celda = E°cátodo − E°ánodo", substitution: "E°celda = 0.34 − (−0.76)", result: "1.10 V", content: "El valor positivo confirma reacción espontánea." },
        ],
        answer: "E°celda = 1.10 V (espontánea)",
      },
      practice: { problem: "¿Es espontánea la reacción Fe²⁺ + Mg → Mg²⁺ + Fe? E°(Fe²⁺/Fe) = −0.44 V, E°(Mg²⁺/Mg) = −2.37 V.", hint: "La especie con mayor E° se reduce (cátodo). Calcula E°celda = E°cátodo − E°ánodo.", answer: "E°celda = −0.44 − (−2.37) = +1.93 V > 0 → espontánea" },
      mistakes: ["Usar E°ánodo en vez de E°cátodo en la fórmula (siempre cátodo − ánodo)", "Multiplicar E° por el número de electrones (E° es intensivo — nunca se multiplica)", "Confundir celda galvánica (espontánea) con celda electrolítica (no espontánea)", "No invertir el signo al revertir una semirreacción"],
      related: ["Reacciones Redox", "Energía de Gibbs", "Ecuación de Nernst", "Electrólisis"],
      variables: { "E°celda": "potencial estándar de celda (V)", "E°cátodo": "potencial estándar del electrodo de reducción (V)", "E°ánodo": "potencial estándar del electrodo de oxidación (V)", n: "número de electrones transferidos", F: "constante de Faraday = 96485 C/mol" },
    },
  };

  const data = topicData[topic] ?? topicData["equilibrium"];

  return {
    detectedType,
    topic: data.title,
    problem, level,
    answer: data.answer,
    steps: data.steps,
    formulas: data.formulas,
    levelExplanations: data.explanations,
    workedExample: data.example,
    practiceExercise: data.practice,
    commonMistakes: data.mistakes,
    relatedTopics: data.related,
    canCompute: false,
    variables: data.variables,
    datosExtraidos: {},
    interpretacion: "Este es un tema conceptual. Introduce datos numéricos específicos para obtener un cálculo real.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Action modifiers
// ─────────────────────────────────────────────────────────────────────────────
function applyAction(base: SmartSolverResult, action: SolverAction, level: SolverLevel): SmartSolverResult {
  if (action === "simplify") {
    const newLevel = level === "university" ? "highschool" : "beginner";
    return { ...base, level: newLevel, answer: `[Simplificado] ${base.answer}` };
  }
  if (action === "formula") {
    return {
      ...base,
      answer: `Fórmulas clave para ${base.topic}:\n${base.formulas.join("\n")}`,
      steps: base.formulas.map((f, i) => ({ number: i + 1, title: `Fórmula ${i + 1}`, content: f, formula: f })),
    };
  }
  if (action === "mistakes") {
    return {
      ...base,
      answer: `Errores comunes en ${base.topic}`,
      steps: base.commonMistakes.map((m, i) => ({ number: i + 1, title: `Error ${i + 1}`, content: m })),
    };
  }
  if (action === "example") {
    return { ...base, answer: base.workedExample.answer, steps: base.workedExample.steps, problem: base.workedExample.problem };
  }
  if (action === "practice") {
    return {
      ...base,
      answer: base.practiceExercise.answer,
      steps: [
        { number: 1, title: "Problema", content: base.practiceExercise.problem },
        { number: 2, title: "Pista", content: base.practiceExercise.hint },
        { number: 3, title: "Respuesta", content: base.practiceExercise.answer },
      ],
      problem: base.practiceExercise.problem,
    };
  }
  return base;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────
export function solve(problem: string, topic: SolverTopic, level: SolverLevel, action: SolverAction): SmartSolverResult {
  const detectedType = detectType(problem);

  let base: SmartSolverResult | null = null;

  switch (detectedType) {
    case "molecular-mass":
      base = solveMolecularMass(problem, level);
      break;
    case "moles-from-mass":
      base = solveMolesFromMass(problem, level);
      break;
    case "mass-from-moles":
      base = solveMassFromMoles(problem, level);
      break;
    case "ph-calculation":
    case "poh-calculation":
      base = solvePH(problem, level);
      break;
    case "ideal-gas":
    case "boyles-law":
    case "charles-law":
      base = solveIdealGas(problem, level);
      break;
    case "equilibrium":
    case "balance-equation":
      base = solveGeneralTopic(problem, "equilibrium", level, detectedType);
      break;
    case "enthalpy":
    case "gibbs":
      base = solveGeneralTopic(problem, "thermodynamics", level, detectedType);
      break;
    default:
      base = solveGeneralTopic(problem, topic, level, detectedType);
  }

  // If a numeric solver returned null (pattern detected but data extraction failed),
  // fall through to general topic — never silently return undefined.
  if (!base) {
    base = solveGeneralTopic(problem, topic, level, detectedType);
  }

  return applyAction(base, action, level);
}
