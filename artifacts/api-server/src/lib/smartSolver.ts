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
}

// ────────────────────────────────────────────────────────────
// Pattern matchers
// ────────────────────────────────────────────────────────────
const PATTERNS = {
  molesFromMass: /(\d+(?:\.\d+)?)\s*(?:grams?|g)\s+(?:of\s+)?([A-Z][a-zA-Z0-9()]*)/,
  massFromMoles: /(\d+(?:\.\d+)?)\s*(?:moles?|mol)\s+(?:of\s+)?([A-Z][a-zA-Z0-9()]*)/,
  molecularMass: /(?:molecular|molar)\s+mass\s+(?:of\s+)?([A-Z][a-zA-Z0-9()]*)/i,
  phFromConc: /\[H[^]]*\]\s*=\s*([\d.eE+\-]+)\s*(?:M|mol\/L)/i,
  concFromPh: /pH\s*[=:]\s*(\d+(?:\.\d+)?)/i,
  pOHtoPH: /pOH\s*[=:]\s*(\d+(?:\.\d+)?)/i,
  gasIdeal: /PV\s*=\s*nRT|ideal\s+gas/i,
  boylesLaw: /boyle|P1V1\s*=\s*P2V2/i,
  charlesLaw: /charles|V1\/T1\s*=\s*V2\/T2/i,
  percentYield: /percent.*yield|actual.*yield|theoretical.*yield/i,
  limitingReagent: /limiting\s+(?:reagent|reactant)/i,
  enthalpy: /enthalpy|ΔH|delta H|exothermic|endothermic/i,
  gibbs: /gibbs|ΔG|delta G|spontan/i,
  equilibrium: /equilibri|Kc|Kp|Le Chatel/i,
  electronConfig: /electron\s+config/i,
  molecularGeometry: /molecular\s+geom|VSEPR|bond angle/i,
  balanceEquation: /balance.*equat|equat.*balance/i,
};

function detectType(problem: string): string {
  if (PATTERNS.molecularMass.test(problem)) return "molecular-mass";
  if (PATTERNS.phFromConc.test(problem) || PATTERNS.concFromPh.test(problem) || /\bpH\b/.test(problem)) return "ph-calculation";
  if (PATTERNS.pOHtoPH.test(problem)) return "poh-calculation";
  if (PATTERNS.molesFromMass.test(problem) && /moles?/.test(problem)) return "moles-from-mass";
  if (PATTERNS.massFromMoles.test(problem) && /grams?|mass/.test(problem)) return "mass-from-moles";
  if (PATTERNS.molesFromMass.test(problem)) return "moles-from-mass";
  if (PATTERNS.percentYield.test(problem)) return "percent-yield";
  if (PATTERNS.limitingReagent.test(problem)) return "limiting-reagent";
  if (PATTERNS.balanceEquation.test(problem)) return "balance-equation";
  if (PATTERNS.gasIdeal.test(problem)) return "ideal-gas";
  if (PATTERNS.boylesLaw.test(problem)) return "boyles-law";
  if (PATTERNS.charlesLaw.test(problem)) return "charles-law";
  if (PATTERNS.gibbs.test(problem)) return "gibbs";
  if (PATTERNS.enthalpy.test(problem)) return "enthalpy";
  if (PATTERNS.equilibrium.test(problem)) return "equilibrium";
  if (PATTERNS.electronConfig.test(problem)) return "electron-config";
  if (PATTERNS.molecularGeometry.test(problem)) return "molecular-geometry";
  return "general";
}

// ────────────────────────────────────────────────────────────
// Solver implementations
// ────────────────────────────────────────────────────────────

function solveMolesFromMass(problem: string, level: SolverLevel): SmartSolverResult | null {
  const m = problem.match(/(\d+(?:\.\d+)?)\s*(?:grams?|g)\s+(?:of\s+)?([A-Z][a-zA-Z0-9()]*)/);
  if (!m) return null;
  const mass = parseFloat(m[1]);
  const formula = m[2];
  const mmResult = calculateMolecularMass(formula);
  if (!mmResult) return null;

  const moles = mass / mmResult.molarMass;
  const answer = `${moles.toFixed(4)} mol of ${formula}`;

  const steps: SolverStep[] = [
    {
      number: 1,
      title: "Identify the given information",
      content: `Given mass = ${mass} g of ${formula}. We need to find the number of moles.`,
    },
    {
      number: 2,
      title: "Write the mole formula",
      content: "Moles is calculated by dividing mass by molar mass.",
      formula: "n = m / M",
      substitution: `n = ${mass} g / M(${formula})`,
    },
    {
      number: 3,
      title: `Calculate the molar mass of ${formula}`,
      content: mmResult.composition.map(c =>
        `${c.symbol}: ${c.count} × ${c.atomicMass.toFixed(3)} g/mol = ${c.totalMass.toFixed(3)} g/mol`
      ).join("\n") + `\nTotal molar mass = ${mmResult.molarMass.toFixed(3)} g/mol`,
      formula: `M(${formula}) = ${mmResult.composition.map(c => `${c.count}×${c.atomicMass.toFixed(3)}`).join(" + ")}`,
      result: `${mmResult.molarMass.toFixed(3)} g/mol`,
      unit: "g/mol",
    },
    {
      number: 4,
      title: "Substitute and calculate",
      content: "Divide the given mass by the molar mass to get moles.",
      formula: "n = m / M",
      substitution: `n = ${mass} g / ${mmResult.molarMass.toFixed(3)} g/mol`,
      result: `${moles.toFixed(4)} mol`,
      unit: "mol",
    },
    {
      number: 5,
      title: "Verify units",
      content: "g ÷ (g/mol) = mol ✓  The grams cancel, leaving moles as the unit.",
      result: `n = ${moles.toFixed(4)} mol of ${formula}`,
    },
  ];

  const particles = moles * 6.022e23;

  return {
    detectedType: "moles-from-mass",
    topic: "Moles and Molar Mass",
    problem,
    level,
    answer,
    steps,
    formulas: [
      "n = m / M",
      `M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol`,
      "N = n × Nₐ  (Nₐ = 6.022 × 10²³)",
    ],
    levelExplanations: {
      beginner: `Think of a "mole" like a dozen eggs — it's just a counting number (6.022×10²³ particles). The molar mass tells us how heavy one mole of a substance is. Since ${formula} has a molar mass of ${mmResult.molarMass.toFixed(1)} g/mol, and you have ${mass} g, you simply divide: ${mass} ÷ ${mmResult.molarMass.toFixed(1)} = ${moles.toFixed(4)} moles.`,
      highschool: `Using the fundamental mole relationship n = m/M: given m = ${mass} g and M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol, we get n = ${mass}/${mmResult.molarMass.toFixed(3)} = ${moles.toFixed(4)} mol. This also equals ${particles.toExponential(3)} formula units (using Avogadro's number).`,
      university: `The SI unit of amount of substance is the mole (mol). Given mass m = ${mass} g and molar mass M(${formula}) = ${mmResult.molarMass.toFixed(4)} g·mol⁻¹, the amount n = m/M = ${moles.toFixed(6)} mol. This corresponds to ${particles.toExponential(4)} formula units. In spectroscopic terms, this sample contains ${moles.toFixed(6)} × Nₐ molecules, each with their characteristic vibrational and rotational states.`,
    },
    workedExample: {
      problem: `How many moles are in ${(mass * 2).toFixed(1)} grams of ${formula}?`,
      steps: [
        { number: 1, title: "Identify formula and molar mass", content: `${formula}: M = ${mmResult.molarMass.toFixed(3)} g/mol` },
        { number: 2, title: "Apply n = m/M", formula: "n = m / M", substitution: `n = ${(mass * 2).toFixed(1)} / ${mmResult.molarMass.toFixed(3)}`, result: `${(mass * 2 / mmResult.molarMass).toFixed(4)} mol`, content: "Divide mass by molar mass." },
      ],
      answer: `${(mass * 2 / mmResult.molarMass).toFixed(4)} mol of ${formula}`,
    },
    practiceExercise: {
      problem: `Calculate the number of moles in ${(mass * 1.5).toFixed(1)} grams of ${formula}. Show all steps.`,
      hint: `First find the molar mass of ${formula}, then use n = m/M.`,
      answer: `n = ${(mass * 1.5).toFixed(1)} / ${mmResult.molarMass.toFixed(3)} = ${(mass * 1.5 / mmResult.molarMass).toFixed(4)} mol`,
    },
    commonMistakes: [
      "Using atomic mass (amu) instead of molar mass (g/mol) — they are numerically equal but have different units.",
      `Forgetting to add up ALL atoms: ${formula} has ${mmResult.composition.map(c => `${c.count} ${c.symbol}`).join(", ")}.`,
      "Dividing molar mass by mass instead of mass by molar mass (n = m/M, not M/m).",
      "Not cancelling units — always write g ÷ (g/mol) = mol to verify.",
    ],
    relatedTopics: ["Avogadro's Number", "Stoichiometry", "Limiting Reagent", "Percent Composition"],
    canCompute: true,
  };
}

function solveMassFromMoles(problem: string, level: SolverLevel): SmartSolverResult | null {
  const m = problem.match(/(\d+(?:\.\d+)?)\s*(?:moles?|mol)\s+(?:of\s+)?([A-Z][a-zA-Z0-9()]*)/);
  if (!m) return null;
  const moles = parseFloat(m[1]);
  const formula = m[2];
  const mmResult = calculateMolecularMass(formula);
  if (!mmResult) return null;

  const mass = moles * mmResult.molarMass;

  const steps: SolverStep[] = [
    {
      number: 1,
      title: "Identify given information",
      content: `Given: n = ${moles} mol of ${formula}. Find: mass in grams.`,
    },
    {
      number: 2,
      title: "Write the mass formula",
      content: "Rearrange n = m/M to solve for mass.",
      formula: "m = n × M",
    },
    {
      number: 3,
      title: `Find molar mass of ${formula}`,
      content: mmResult.composition.map(c => `${c.symbol}: ${c.count} × ${c.atomicMass.toFixed(3)} = ${c.totalMass.toFixed(3)} g/mol`).join("\n"),
      result: `M = ${mmResult.molarMass.toFixed(3)} g/mol`,
      unit: "g/mol",
    },
    {
      number: 4,
      title: "Calculate mass",
      formula: "m = n × M",
      substitution: `m = ${moles} mol × ${mmResult.molarMass.toFixed(3)} g/mol`,
      result: `${mass.toFixed(4)} g`,
      unit: "g",
      content: "Multiply moles by molar mass.",
    },
  ];

  return {
    detectedType: "mass-from-moles",
    topic: "Moles and Molar Mass",
    problem,
    level,
    answer: `${mass.toFixed(4)} g of ${formula}`,
    steps,
    formulas: ["m = n × M", "n = m / M", `M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol`],
    levelExplanations: {
      beginner: `If one "bag" (mole) of ${formula} weighs ${mmResult.molarMass.toFixed(1)} grams, then ${moles} bags weigh ${moles} × ${mmResult.molarMass.toFixed(1)} = ${mass.toFixed(2)} grams.`,
      highschool: `Using m = n × M: m = ${moles} mol × ${mmResult.molarMass.toFixed(3)} g/mol = ${mass.toFixed(4)} g. Units check: mol × g/mol = g ✓`,
      university: `Given n = ${moles} mol and M(${formula}) = ${mmResult.molarMass.toFixed(4)} g·mol⁻¹, the mass m = nM = ${mass.toFixed(5)} g. This corresponds to ${(moles * 6.022e23).toExponential(3)} molecules.`,
    },
    workedExample: {
      problem: `What is the mass of ${moles * 2} moles of ${formula}?`,
      steps: [
        { number: 1, title: "Apply m = n × M", formula: "m = n × M", substitution: `m = ${moles * 2} × ${mmResult.molarMass.toFixed(3)}`, result: `${(moles * 2 * mmResult.molarMass).toFixed(4)} g`, content: "Multiply moles by molar mass." },
      ],
      answer: `${(moles * 2 * mmResult.molarMass).toFixed(4)} g`,
    },
    practiceExercise: {
      problem: `What is the mass of ${(moles * 0.5).toFixed(2)} moles of ${formula}?`,
      hint: `Use m = n × M, where M(${formula}) = ${mmResult.molarMass.toFixed(3)} g/mol`,
      answer: `m = ${(moles * 0.5).toFixed(2)} × ${mmResult.molarMass.toFixed(3)} = ${(moles * 0.5 * mmResult.molarMass).toFixed(4)} g`,
    },
    commonMistakes: [
      "Using m = M/n (dividing instead of multiplying)",
      "Forgetting to first calculate the molar mass of the compound",
      "Mixing up mass (grams) with molar mass (g/mol)",
    ],
    relatedTopics: ["Moles from Mass", "Stoichiometry", "Percent Composition"],
    canCompute: true,
  };
}

function solveMolecularMass(problem: string, level: SolverLevel): SmartSolverResult | null {
  const m = problem.match(/(?:molecular|molar)\s+mass\s+(?:of\s+)?([A-Z][a-zA-Z0-9()]*)/i)
    ?? problem.match(/(?:mass|weight)\s+of\s+([A-Z][a-zA-Z0-9()]{0,20})/);
  if (!m) return null;
  const formula = m[1];
  const result = calculateMolecularMass(formula);
  if (!result) return null;

  const steps: SolverStep[] = [
    { number: 1, title: "Write the molecular formula", content: `Formula: ${formula}`, },
    { number: 2, title: "Identify each element and its count", content: result.composition.map(c => `${c.name} (${c.symbol}): ${c.count} atom${c.count > 1 ? "s" : ""}`).join("\n"), },
    {
      number: 3, title: "Look up atomic masses from the periodic table",
      content: result.composition.map(c => `${c.symbol}: ${c.atomicMass.toFixed(4)} g/mol`).join("\n"),
    },
    {
      number: 4, title: "Multiply each atomic mass by its count",
      content: result.composition.map(c => `${c.symbol}: ${c.count} × ${c.atomicMass.toFixed(4)} = ${c.totalMass.toFixed(4)} g/mol`).join("\n"),
      formula: `M = ${result.composition.map(c => `${c.count}×${c.atomicMass.toFixed(3)}`).join(" + ")}`,
    },
    {
      number: 5, title: "Add all contributions",
      content: `Total = ${result.composition.map(c => c.totalMass.toFixed(4)).join(" + ")} = ${result.molarMass.toFixed(4)} g/mol`,
      result: `${result.molarMass.toFixed(4)} g/mol`,
      unit: "g/mol",
    },
  ];

  return {
    detectedType: "molecular-mass",
    topic: "Molecular Mass",
    problem,
    level,
    answer: `M(${formula}) = ${result.molarMass.toFixed(4)} g/mol`,
    steps,
    formulas: [`M = Σ(nᵢ × Aᵣᵢ)`, `M(${formula}) = ${result.composition.map(c => `${c.count}×${c.atomicMass.toFixed(3)}`).join("+")}`],
    levelExplanations: {
      beginner: `The molar mass is like the "weight" of one mole (6.022×10²³) of ${formula} molecules. You just add up the atomic masses of each atom in the formula. ${result.composition.map(c => `${c.count} ${c.name} atom${c.count > 1 ? "s" : ""} = ${c.totalMass.toFixed(2)} g/mol`).join(", ")}. Total = ${result.molarMass.toFixed(2)} g/mol.`,
      highschool: `Molar mass M = Σ(nᵢ × Aᵣᵢ). For ${formula}: ${result.composition.map(c => `${c.count}(${c.atomicMass.toFixed(3)})`).join(" + ")} = ${result.molarMass.toFixed(4)} g/mol. This is used in the mole formula n = m/M.`,
      university: `The molar mass M(${formula}) = ${result.molarMass.toFixed(4)} g·mol⁻¹ is derived from the standard atomic weights (IUPAC 2021). Composition by mass: ${result.composition.map(c => `${c.symbol} ${c.percentComposition.toFixed(2)}%`).join(", ")}. This value is critical for all stoichiometric calculations and solution preparation.`,
    },
    workedExample: {
      problem: "Calculate the molar mass of CO₂.",
      steps: [
        { number: 1, title: "Identify atoms", content: "CO₂: 1 C + 2 O" },
        { number: 2, title: "Atomic masses", content: "C = 12.011, O = 15.999 g/mol" },
        { number: 3, title: "Calculate", formula: "M = 1×12.011 + 2×15.999", result: "44.009 g/mol", content: "Multiply and add." },
      ],
      answer: "M(CO₂) = 44.009 g/mol",
    },
    practiceExercise: {
      problem: "Calculate the molar mass of H₂SO₄ (sulfuric acid).",
      hint: "H₂SO₄ has 2 H, 1 S, 4 O atoms. Use atomic masses: H=1.008, S=32.06, O=15.999",
      answer: "M = 2(1.008) + 32.06 + 4(15.999) = 98.072 g/mol",
    },
    commonMistakes: [
      "Forgetting to multiply atomic mass by the subscript (count) of each element.",
      "Using mass number from periodic table instead of standard atomic weight.",
      "Confusing molecular formula with empirical formula when calculating.",
      "Missing atoms inside parentheses: e.g., Ca(OH)₂ has 2 O and 2 H, not 1 O and 1 H.",
    ],
    relatedTopics: ["Moles from Mass", "Percent Composition", "Empirical Formula", "Stoichiometry"],
    canCompute: true,
  };
}

function solvePH(problem: string, level: SolverLevel): SmartSolverResult | null {
  let concentration: number | null = null;
  let phGiven: number | null = null;
  let pOHGiven: number | null = null;
  let answer = "";
  const steps: SolverStep[] = [];

  const concMatch = problem.match(/\[H[^]]*\]\s*=\s*([\d.eE+\-]+)\s*(?:M|mol\/L)/i)
    ?? problem.match(/([\d.eE+\-]+)\s*M\s+(?:HCl|H2SO4|HNO3|acid)/i);
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
    steps.push(
      { number: 1, title: "Identify the given concentration", content: `[H⁺] = ${concentration} mol/L` },
      { number: 2, title: "Apply the pH formula", formula: "pH = −log₁₀[H⁺]", substitution: `pH = −log₁₀(${concentration})`, result: `pH = ${pH.toFixed(4)}`, content: "Take the negative base-10 logarithm." },
      { number: 3, title: "Find pOH and [OH⁻]", formula: "pOH = 14 − pH", substitution: `pOH = 14 − ${pH.toFixed(4)}`, result: `pOH = ${pOH.toFixed(4)}; [OH⁻] = ${ohConc.toExponential(3)} M`, content: "At 25°C, pH + pOH = 14." },
    );
  } else if (phGiven !== null) {
    const hConc = Math.pow(10, -phGiven);
    const pOH = 14 - phGiven;
    const ohConc = Math.pow(10, -pOH);
    answer = `[H⁺] = ${hConc.toExponential(3)} M`;
    steps.push(
      { number: 1, title: "Given: pH", content: `pH = ${phGiven}` },
      { number: 2, title: "Find [H⁺]", formula: "[H⁺] = 10^(−pH)", substitution: `[H⁺] = 10^(−${phGiven})`, result: `${hConc.toExponential(4)} M`, content: "Raise 10 to the negative pH." },
      { number: 3, title: "Find pOH and [OH⁻]", formula: "pOH = 14 − pH; [OH⁻] = 10^(−pOH)", substitution: `pOH = 14 − ${phGiven} = ${pOH}`, result: `[OH⁻] = ${ohConc.toExponential(3)} M`, content: "Using the water autoionization relationship." },
      { number: 4, title: "Classify the solution", content: `pH = ${phGiven} ${phGiven < 7 ? "< 7 → Acidic solution" : phGiven > 7 ? "> 7 → Basic/alkaline solution" : "= 7 → Neutral solution"}` },
    );
  } else if (pOHGiven !== null) {
    const pH = 14 - pOHGiven;
    const hConc = Math.pow(10, -pH);
    answer = `pH = ${pH.toFixed(2)}`;
    steps.push(
      { number: 1, title: "Given: pOH", content: `pOH = ${pOHGiven}` },
      { number: 2, title: "Use pH + pOH = 14", formula: "pH = 14 − pOH", substitution: `pH = 14 − ${pOHGiven}`, result: `pH = ${pH.toFixed(2)}`, content: "This relationship holds at 25°C." },
      { number: 3, title: "Find [H⁺]", formula: "[H⁺] = 10^(−pH)", substitution: `[H⁺] = 10^(−${pH.toFixed(2)})`, result: `${hConc.toExponential(3)} M`, content: "Raise 10 to the negative pH." },
    );
  } else {
    return null;
  }

  return {
    detectedType: "ph-calculation",
    topic: "Acids and Bases — pH",
    problem,
    level,
    answer,
    steps,
    formulas: ["pH = −log₁₀[H⁺]", "[H⁺] = 10^(−pH)", "pOH = 14 − pH", "[H⁺][OH⁻] = 10⁻¹⁴"],
    levelExplanations: {
      beginner: "The pH scale measures how acidic or basic a solution is, from 0 (very acidic) to 14 (very basic). 7 is neutral (like pure water). The formula pH = −log[H⁺] just converts a tiny concentration number into a simple 0–14 scale.",
      highschool: "pH is defined as −log₁₀[H⁺]. Since [H⁺] values are very small (like 0.0001 M), taking the negative log gives us a manageable scale. At 25°C, pH + pOH = 14 always, because [H⁺][OH⁻] = Kw = 10⁻¹⁴.",
      university: "pH = −log₁₀(aH⁺) where aH⁺ is the activity of hydrogen ions. For dilute aqueous solutions, activity ≈ concentration. The autoprotolysis constant of water Kw = [H⁺][OH⁻] = 10⁻¹⁴ at 25°C gives pH + pOH = pKw = 14. For strong acids, [H⁺] equals the acid concentration; for weak acids, Ka equilibrium must be applied.",
    },
    workedExample: {
      problem: "Find the pH of a 0.01 M HCl solution.",
      steps: [
        { number: 1, title: "HCl is a strong acid — fully dissociates", content: "HCl → H⁺ + Cl⁻, so [H⁺] = 0.01 M" },
        { number: 2, title: "Apply pH formula", formula: "pH = −log₁₀[H⁺]", substitution: "pH = −log₁₀(0.01)", result: "pH = 2.00", content: "log(0.01) = −2, so pH = 2." },
      ],
      answer: "pH = 2.00",
    },
    practiceExercise: {
      problem: "What is the pH of a 0.0001 M HNO₃ solution?",
      hint: "HNO₃ is a strong acid. [H⁺] = 0.0001 M = 10⁻⁴ M",
      answer: "pH = −log(10⁻⁴) = 4.00",
    },
    commonMistakes: [
      "Forgetting the NEGATIVE sign: pH = −log[H⁺], not log[H⁺].",
      "Using log base e (ln) instead of log base 10.",
      "Assuming weak acids fully dissociate — only strong acids do.",
      "Not converting temperature: Ka values change with temperature, affecting pH.",
    ],
    relatedTopics: ["Buffer Solutions", "Ka and Kb", "Acid-Base Titration", "Neutralization Reactions"],
    canCompute: concentration !== null || phGiven !== null || pOHGiven !== null,
  };
}

function solveIdealGas(problem: string, level: SolverLevel): SmartSolverResult {
  // Extract values if present
  const pMatch = problem.match(/P\s*=\s*([\d.]+)\s*atm/i);
  const vMatch = problem.match(/V\s*=\s*([\d.]+)\s*L/i);
  const nMatch = problem.match(/n\s*=\s*([\d.]+)\s*mol/i);
  const tMatch = problem.match(/T\s*=\s*([\d.]+)\s*K/i) ?? problem.match(/(\d+(?:\.\d+)?)\s*K/);

  const R = 0.0821; // L·atm/(mol·K)
  let answer = "Use PV = nRT to solve for the unknown variable.";
  let computedSteps: SolverStep[] = [];
  let canCompute = false;

  const known = {
    P: pMatch ? parseFloat(pMatch[1]) : null,
    V: vMatch ? parseFloat(vMatch[1]) : null,
    n: nMatch ? parseFloat(nMatch[1]) : null,
    T: tMatch ? parseFloat(tMatch[1]) : null,
  };

  const knowCount = Object.values(known).filter(v => v !== null).length;

  if (knowCount === 3) {
    canCompute = true;
    if (known.P === null) {
      const P = (known.n! * R * known.T!) / known.V!;
      answer = `P = ${P.toFixed(4)} atm`;
      computedSteps = [
        { number: 1, title: "Identify known values", content: `n = ${known.n} mol, V = ${known.V} L, T = ${known.T} K, R = 0.0821 L·atm/(mol·K)` },
        { number: 2, title: "Rearrange PV = nRT for P", formula: "P = nRT / V", substitution: `P = (${known.n} × 0.0821 × ${known.T}) / ${known.V}`, result: `${P.toFixed(4)} atm`, content: "Divide nRT by V." },
      ];
    } else if (known.V === null) {
      const V = (known.n! * R * known.T!) / known.P!;
      answer = `V = ${V.toFixed(4)} L`;
      computedSteps = [
        { number: 1, title: "Known values", content: `P = ${known.P} atm, n = ${known.n} mol, T = ${known.T} K` },
        { number: 2, title: "Rearrange for V", formula: "V = nRT / P", substitution: `V = (${known.n} × 0.0821 × ${known.T}) / ${known.P}`, result: `${V.toFixed(4)} L`, content: "Multiply n×R×T, then divide by P." },
      ];
    } else if (known.n === null) {
      const n = (known.P! * known.V!) / (R * known.T!);
      answer = `n = ${n.toFixed(4)} mol`;
      computedSteps = [
        { number: 1, title: "Known values", content: `P = ${known.P} atm, V = ${known.V} L, T = ${known.T} K` },
        { number: 2, title: "Rearrange for n", formula: "n = PV / RT", substitution: `n = (${known.P} × ${known.V}) / (0.0821 × ${known.T})`, result: `${n.toFixed(4)} mol`, content: "Multiply P×V, then divide by R×T." },
      ];
    } else {
      const T = (known.P! * known.V!) / (known.n! * R);
      answer = `T = ${T.toFixed(2)} K`;
      computedSteps = [
        { number: 1, title: "Known values", content: `P = ${known.P} atm, V = ${known.V} L, n = ${known.n} mol` },
        { number: 2, title: "Rearrange for T", formula: "T = PV / nR", substitution: `T = (${known.P} × ${known.V}) / (${known.n} × 0.0821)`, result: `${T.toFixed(2)} K`, content: "Multiply P×V, divide by n×R." },
      ];
    }
  }

  const steps: SolverStep[] = [
    { number: 1, title: "State the Ideal Gas Law", formula: "PV = nRT", content: "Where P=pressure (atm), V=volume (L), n=moles, R=0.0821 L·atm/(mol·K), T=temperature (K)." },
    { number: 2, title: "Identify known and unknown", content: `Known: ${Object.entries(known).filter(([, v]) => v !== null).map(([k, v]) => `${k}=${v}`).join(", ") || "see problem"}\nUnknown: the variable to solve for.` },
    { number: 3, title: "Rearrange for the unknown", content: "Isolate the unknown variable by dividing both sides by the known quantities.", formula: "P = nRT/V   |   V = nRT/P   |   n = PV/RT   |   T = PV/nR" },
    ...computedSteps.slice(1),
    { number: 4, title: "Important: Temperature must be in Kelvin", content: "T(K) = T(°C) + 273.15\nNever use Celsius directly in the ideal gas law!", formula: "T(K) = T(°C) + 273.15" },
  ];

  return {
    detectedType: "ideal-gas",
    topic: "Gas Laws — Ideal Gas Law",
    problem,
    level,
    answer: canCompute ? answer : "PV = nRT — provide 3 of 4 variables (P, V, n, T) to solve for the 4th.",
    steps,
    formulas: ["PV = nRT", "R = 0.0821 L·atm/(mol·K)", "T(K) = T(°C) + 273.15", "P = nRT/V", "V = nRT/P", "n = PV/RT"],
    levelExplanations: {
      beginner: "Imagine gas molecules bouncing around in a box. More molecules (n) or higher temperature (T) means more pressure. Bigger box (V) means less pressure. PV = nRT captures all these relationships in one equation. R is just a constant (0.0821) that makes the units work out.",
      highschool: "The ideal gas law PV = nRT combines Boyle's (P∝1/V), Charles's (V∝T), and Avogadro's (V∝n) laws into one equation. R = 0.0821 L·atm/(mol·K). Always convert temperature to Kelvin! At STP (0°C, 1 atm), 1 mol of any ideal gas = 22.4 L.",
      university: "The ideal gas law is an equation of state for a hypothetical ideal gas: PV = nRT, where R = 8.314 J/(mol·K). Real gases deviate from ideal behavior at high P or low T; the van der Waals equation corrects for intermolecular forces (a) and finite molecular volume (b): (P + an²/V²)(V − nb) = nRT.",
    },
    workedExample: {
      problem: "A gas occupies 2.0 L at 1.0 atm and 300 K. How many moles are present?",
      steps: [
        { number: 1, title: "Known: P=1.0 atm, V=2.0 L, T=300 K", content: "Solving for n." },
        { number: 2, title: "Rearrange for n", formula: "n = PV/RT", substitution: "n = (1.0 × 2.0) / (0.0821 × 300)", result: "0.0812 mol", content: "Compute numerator and denominator." },
      ],
      answer: "n = 0.0812 mol",
    },
    practiceExercise: {
      problem: "What is the volume of 0.5 mol of gas at 2.0 atm and 350 K?",
      hint: "Rearrange PV = nRT to V = nRT/P",
      answer: "V = (0.5 × 0.0821 × 350) / 2.0 = 7.18 L",
    },
    commonMistakes: [
      "Using temperature in °C instead of Kelvin — always add 273.15.",
      "Using pressure in kPa with R = 0.0821 — this R requires atm.",
      "Forgetting that R = 8.314 J/(mol·K) when working in SI units (Pa, m³).",
      "Assuming the ideal gas law works for all real gases — it fails at high pressure and low temperature.",
    ],
    relatedTopics: ["Boyle's Law", "Charles's Law", "Dalton's Law", "Kinetic Molecular Theory"],
    canCompute,
  };
}

function solveGeneralTopic(problem: string, topic: SolverTopic, level: SolverLevel, detectedType: string): SmartSolverResult {
  // Topic-specific comprehensive explanations
  const topicData: Record<string, {
    title: string;
    answer: string;
    steps: SolverStep[];
    formulas: string[];
    explanations: { beginner: string; highschool: string; university: string };
    example: WorkedExample;
    practice: PracticeExercise;
    mistakes: string[];
    related: string[];
  }> = {
    "equilibrium": {
      title: "Chemical Equilibrium",
      answer: "A reaction is at equilibrium when the rate of the forward reaction equals the rate of the reverse reaction.",
      steps: [
        { number: 1, title: "Write the balanced equation", content: "For: aA + bB ⇌ cC + dD" },
        { number: 2, title: "Write the equilibrium expression", formula: "Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ", content: "Products over reactants, each raised to their stoichiometric coefficient." },
        { number: 3, title: "Interpret K", content: "K >> 1: products favored\nK << 1: reactants favored\nK ≈ 1: roughly equal" },
        { number: 4, title: "Apply Le Chatelier's Principle", content: "Adding reactant → shifts right\nRemoving product → shifts right\nIncreasing pressure → shifts toward fewer gas moles\nIncreasing temperature → shifts toward endothermic side" },
      ],
      formulas: ["Kc = [products]ᵖ / [reactants]ʳ", "Kp = Kc(RT)^Δn", "ΔG° = −RT ln K", "Q vs K determines direction of shift"],
      explanations: {
        beginner: "Equilibrium is like a tug-of-war that reaches a draw. Both teams (forward and reverse reactions) keep pulling, but the rope doesn't move. Adding more reactant is like adding players to one side — the rope shifts until a new balance is found.",
        highschool: "At equilibrium, the rates of forward and reverse reactions are equal (not the concentrations!). The equilibrium constant Kc = [products]/[reactants] (with coefficients as exponents) tells us where the balance lies. Le Chatelier's principle predicts how the system responds to stress.",
        university: "Thermodynamic equilibrium is defined by ΔG = 0. The equilibrium constant K relates to standard Gibbs energy via ΔG° = −RT ln K. The reaction quotient Q predicts direction: if Q < K, reaction proceeds forward; if Q > K, reverse. At non-standard conditions, ΔG = ΔG° + RT ln Q.",
      },
      example: {
        problem: "For N₂ + 3H₂ ⇌ 2NH₃, write the Kc expression.",
        steps: [
          { number: 1, title: "Identify products and reactants with coefficients", content: "Products: NH₃ (coeff=2)\nReactants: N₂ (coeff=1), H₂ (coeff=3)" },
          { number: 2, title: "Write Kc", formula: "Kc = [NH₃]² / ([N₂][H₂]³)", content: "Each species raised to its coefficient." },
        ],
        answer: "Kc = [NH₃]² / ([N₂][H₂]³)",
      },
      practice: { problem: "For 2SO₂ + O₂ ⇌ 2SO₃, write the Kc expression and state which direction is favored if Kc = 1×10⁸.", hint: "Products over reactants, with exponents from coefficients.", answer: "Kc = [SO₃]² / ([SO₂]²[O₂]). Kc >> 1 → products (SO₃) are strongly favored." },
      mistakes: ["Including pure solids or liquids in K expressions (only gases and aqueous species)", "Forgetting that equilibrium means equal RATES, not equal concentrations", "Mixing up Kc (concentrations) and Kp (pressures)", "Not squaring coefficients as exponents"],
      related: ["Le Chatelier's Principle", "Gibbs Energy", "Ksp Solubility", "Buffer Solutions"],
    },
    "thermodynamics": {
      title: "Thermochemistry and Thermodynamics",
      answer: "Thermodynamics governs energy changes in chemical reactions using ΔH, ΔS, and ΔG.",
      steps: [
        { number: 1, title: "Identify the type of energy change", content: "ΔH < 0: exothermic (releases heat)\nΔH > 0: endothermic (absorbs heat)" },
        { number: 2, title: "Calculate ΔH using Hess's Law", formula: "ΔH_rxn = Σ ΔH°f(products) − Σ ΔH°f(reactants)", content: "Use standard enthalpies of formation from tables." },
        { number: 3, title: "Calculate ΔS (entropy change)", content: "ΔS > 0: disorder increases (favorable)\nMore gas products = more entropy" },
        { number: 4, title: "Calculate ΔG (Gibbs free energy)", formula: "ΔG = ΔH − TΔS", content: "ΔG < 0: spontaneous\nΔG > 0: non-spontaneous\nΔG = 0: at equilibrium" },
      ],
      formulas: ["ΔH_rxn = Σ ΔH°f(products) − Σ ΔH°f(reactants)", "ΔG = ΔH − TΔS", "ΔG° = −RT ln K", "ΔG = ΔG° + RT ln Q"],
      explanations: {
        beginner: "Think of ΔH as measuring if a reaction releases heat (like burning wood, ΔH < 0) or needs heat to go (like melting ice, ΔH > 0). ΔG tells us if the reaction will happen on its own — if ΔG is negative, the reaction is spontaneous (it 'wants' to go).",
        highschool: "ΔH is heat at constant pressure; ΔS measures disorder. The Gibbs equation ΔG = ΔH − TΔS combines both to predict spontaneity. A negative ΔG means spontaneous. Temperature affects which term dominates — at high T, the TΔS term becomes important.",
        university: "Gibbs free energy G = H − TS is the thermodynamic potential minimized at constant T and P. Spontaneity requires ΔG < 0. For a reaction, ΔG° = ΔH° − TΔS° = −RT ln K (standard state). Non-standard: ΔG = ΔG° + RT ln Q. The second law requires total entropy (system + surroundings) to increase for spontaneous processes.",
      },
      example: {
        problem: "Is the combustion of CH₄ spontaneous? ΔH = −890 kJ, ΔS = +3.4 J/(mol·K) at 298 K.",
        steps: [
          { number: 1, title: "Calculate ΔG at 298 K", formula: "ΔG = ΔH − TΔS", substitution: "ΔG = −890 kJ − (298 × 0.0034 kJ/K)", result: "ΔG ≈ −891 kJ", content: "Convert ΔS to kJ." },
          { number: 2, title: "Interpret", content: "ΔG = −891 kJ < 0 → spontaneous ✓" },
        ],
        answer: "ΔG = −891 kJ, spontaneous",
      },
      practice: { problem: "If ΔH = +50 kJ and ΔS = +200 J/(mol·K), at what temperature does ΔG become negative?", hint: "Set ΔG = 0: T = ΔH/ΔS", answer: "T = 50000 J / 200 J/K = 250 K. Above 250 K, the reaction becomes spontaneous." },
      mistakes: ["Mixing units: ΔH in kJ but ΔS in J/(mol·K) — convert both to same units", "Thinking negative ΔH means spontaneous — entropy matters too", "Forgetting that ΔG, not ΔH, determines spontaneity", "Not accounting for temperature dependence of ΔG"],
      related: ["Hess's Law", "Entropy", "Equilibrium Constant", "Calorimetry"],
    },
    "electrochemistry": {
      title: "Electrochemistry",
      answer: "Electrochemistry studies the interconversion of chemical and electrical energy in redox reactions.",
      steps: [
        { number: 1, title: "Identify oxidation and reduction half-reactions", content: "OIL RIG: Oxidation Is Loss, Reduction Is Gain of electrons." },
        { number: 2, title: "Look up standard reduction potentials (E°red)", content: "From the standard reduction potential table: higher E° = better oxidizing agent." },
        { number: 3, title: "Calculate cell potential", formula: "E°cell = E°cathode − E°anode", content: "Cathode = reduction (higher E°), Anode = oxidation (lower E°)." },
        { number: 4, title: "Determine spontaneity", formula: "ΔG° = −nFE°cell", content: "n = electrons transferred, F = 96485 C/mol. If E°cell > 0, reaction is spontaneous." },
        { number: 5, title: "Apply Nernst equation for non-standard conditions", formula: "E = E° − (RT/nF)ln Q", content: "At 25°C: E = E° − (0.0592/n)log Q" },
      ],
      formulas: ["E°cell = E°cathode − E°anode", "ΔG° = −nFE°cell", "E = E° − (0.0592/n)log Q", "log K = nE°/0.0592"],
      explanations: {
        beginner: "A battery is a good example of electrochemistry. Electrons flow from one metal to another through a wire, creating electricity. Zinc gives up electrons (oxidation, anode) and copper accepts them (reduction, cathode). The bigger the difference in 'eagerness' to grab electrons, the higher the voltage.",
        highschool: "Galvanic cells convert spontaneous redox reactions into electrical energy. E°cell = E°cathode − E°anode. If E°cell > 0, the reaction is spontaneous. ΔG° = −nFE°. The Nernst equation adjusts for non-standard concentrations.",
        university: "Electrochemical cells obey: ΔG° = −nFE° = −RT ln K. The Nernst equation E = E° − (RT/nF)ln Q describes non-equilibrium potentials. Overpotential, Butler-Volmer kinetics, and electrode polarization govern real cells. Electrolytic cells apply external voltage to drive non-spontaneous reactions (E°cell < 0).",
      },
      example: {
        problem: "Calculate E°cell for Zn/Cu galvanic cell. E°(Cu²⁺/Cu) = +0.34V, E°(Zn²⁺/Zn) = −0.76V.",
        steps: [
          { number: 1, title: "Identify cathode and anode", content: "Cu²⁺ has higher E°→ cathode (reduction)\nZn has lower E° → anode (oxidation)" },
          { number: 2, title: "Calculate E°cell", formula: "E°cell = E°cathode − E°anode", substitution: "E°cell = 0.34 − (−0.76)", result: "1.10 V", content: "This positive value confirms spontaneous reaction." },
        ],
        answer: "E°cell = 1.10 V (spontaneous)",
      },
      practice: { problem: "Is the reaction Fe²⁺ + Mg → Mg²⁺ + Fe spontaneous? E°(Fe²⁺/Fe) = −0.44V, E°(Mg²⁺/Mg) = −2.37V.", hint: "Higher E° species is reduced (cathode). Calculate E°cell = E°cathode − E°anode.", answer: "E°cell = −0.44 − (−2.37) = +1.93V > 0 → spontaneous" },
      mistakes: ["Using E°anode instead of E°cathode in the formula (always cathode − anode)", "Multiplying E° by the number of electrons (E° is intensive — never multiply it)", "Confusing galvanic (spontaneous) with electrolytic (non-spontaneous) cells", "Not flipping the sign when reversing a half-reaction for the Nernst equation"],
      related: ["Redox Reactions", "Gibbs Energy", "Nernst Equation", "Electrolysis"],
    },
  };

  const data = topicData[topic] ?? topicData["equilibrium"];

  return {
    detectedType,
    topic: data?.title ?? "Chemistry",
    problem,
    level,
    answer: data?.answer ?? "See explanation below.",
    steps: data?.steps ?? [],
    formulas: data?.formulas ?? [],
    levelExplanations: data?.explanations ?? { beginner: "", highschool: "", university: "" },
    workedExample: data?.example ?? { problem: "", steps: [], answer: "" },
    practiceExercise: data?.practice ?? { problem: "", hint: "", answer: "" },
    commonMistakes: data?.mistakes ?? [],
    relatedTopics: data?.related ?? [],
    canCompute: false,
  };
}

// ────────────────────────────────────────────────────────────
// Action modifiers
// ────────────────────────────────────────────────────────────

function applyAction(
  base: SmartSolverResult,
  action: SolverAction,
  level: SolverLevel,
): SmartSolverResult {
  if (action === "simplify") {
    const newLevel = level === "university" ? "highschool" : "beginner";
    return { ...base, level: newLevel, answer: `[Simplified] ${base.answer}` };
  }
  if (action === "formula") {
    return {
      ...base,
      answer: `Key formulas for ${base.topic}:\n${base.formulas.join("\n")}`,
      steps: base.formulas.map((f, i) => ({ number: i + 1, title: `Formula ${i + 1}`, content: f, formula: f })),
    };
  }
  if (action === "mistakes") {
    return {
      ...base,
      answer: `Common mistakes in ${base.topic}`,
      steps: base.commonMistakes.map((m, i) => ({ number: i + 1, title: `Mistake ${i + 1}`, content: m })),
    };
  }
  if (action === "example") {
    return {
      ...base,
      answer: base.workedExample.answer,
      steps: base.workedExample.steps,
      problem: base.workedExample.problem,
    };
  }
  if (action === "practice") {
    return {
      ...base,
      answer: base.practiceExercise.answer,
      steps: [
        { number: 1, title: "Problem", content: base.practiceExercise.problem },
        { number: 2, title: "Hint", content: base.practiceExercise.hint },
        { number: 3, title: "Answer", content: base.practiceExercise.answer },
      ],
      problem: base.practiceExercise.problem,
    };
  }
  return base;
}

// ────────────────────────────────────────────────────────────
// Main entry point
// ────────────────────────────────────────────────────────────

export function solve(
  problem: string,
  topic: SolverTopic,
  level: SolverLevel,
  action: SolverAction,
): SmartSolverResult {
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

  if (!base) {
    base = solveGeneralTopic(problem, topic, level, detectedType);
  }

  return applyAction(base, action, level);
}
