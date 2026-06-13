// Atomic masses for all 118 elements
export const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.941, Be: 9.0122, B: 10.811, C: 12.011,
  N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
  Al: 26.982, Si: 28.086, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948,
  K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
  Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95,
  Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41,
  In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29,
  Cs: 132.91, Ba: 137.33, La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24,
  Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50,
  Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.04, Lu: 174.97, Hf: 178.49,
  Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08,
  Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209,
  At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04,
  U: 238.03, Np: 237, Pu: 244, Am: 243, Cm: 247, Bk: 247, Cf: 251,
  Es: 252, Fm: 257, Md: 258, No: 259, Lr: 262, Rf: 267, Db: 268,
  Sg: 271, Bh: 272, Hs: 270, Mt: 276, Ds: 281, Rg: 280, Cn: 285,
  Nh: 284, Fl: 289, Mc: 288, Lv: 293, Ts: 294, Og: 294,
};

const ELEMENT_NAMES: Record<string, string> = {
  H: "Hydrogen", He: "Helium", Li: "Lithium", Be: "Beryllium", B: "Boron",
  C: "Carbon", N: "Nitrogen", O: "Oxygen", F: "Fluorine", Ne: "Neon",
  Na: "Sodium", Mg: "Magnesium", Al: "Aluminum", Si: "Silicon", P: "Phosphorus",
  S: "Sulfur", Cl: "Chlorine", Ar: "Argon", K: "Potassium", Ca: "Calcium",
  Sc: "Scandium", Ti: "Titanium", V: "Vanadium", Cr: "Chromium", Mn: "Manganese",
  Fe: "Iron", Co: "Cobalt", Ni: "Nickel", Cu: "Copper", Zn: "Zinc",
  Ga: "Gallium", Ge: "Germanium", As: "Arsenic", Se: "Selenium", Br: "Bromine",
  Kr: "Krypton", Rb: "Rubidium", Sr: "Strontium", Y: "Yttrium", Zr: "Zirconium",
  Nb: "Niobium", Mo: "Molybdenum", Tc: "Technetium", Ru: "Ruthenium", Rh: "Rhodium",
  Pd: "Palladium", Ag: "Silver", Cd: "Cadmium", In: "Indium", Sn: "Tin",
  Sb: "Antimony", Te: "Tellurium", I: "Iodine", Xe: "Xenon", Cs: "Cesium",
  Ba: "Barium", La: "Lanthanum", Ce: "Cerium", Pr: "Praseodymium", Nd: "Neodymium",
  Pm: "Promethium", Sm: "Samarium", Eu: "Europium", Gd: "Gadolinium", Tb: "Terbium",
  Dy: "Dysprosium", Ho: "Holmium", Er: "Erbium", Tm: "Thulium", Yb: "Ytterbium",
  Lu: "Lutetium", Hf: "Hafnium", Ta: "Tantalum", W: "Tungsten", Re: "Rhenium",
  Os: "Osmium", Ir: "Iridium", Pt: "Platinum", Au: "Gold", Hg: "Mercury",
  Tl: "Thallium", Pb: "Lead", Bi: "Bismuth", Po: "Polonium", At: "Astatine",
  Rn: "Radon", Fr: "Francium", Ra: "Radium", Ac: "Actinium", Th: "Thorium",
  Pa: "Protactinium", U: "Uranium", Np: "Neptunium", Pu: "Plutonium", Am: "Americium",
  Cm: "Curium", Bk: "Berkelium", Cf: "Californium", Es: "Einsteinium", Fm: "Fermium",
  Md: "Mendelevium", No: "Nobelium", Lr: "Lawrencium", Rf: "Rutherfordium",
  Db: "Dubnium", Sg: "Seaborgium", Bh: "Bohrium", Hs: "Hassium", Mt: "Meitnerium",
  Ds: "Darmstadtium", Rg: "Roentgenium", Cn: "Copernicium", Nh: "Nihonium",
  Fl: "Flerovium", Mc: "Moscovium", Lv: "Livermorium", Ts: "Tennessine", Og: "Oganesson",
};

export interface ParsedElement {
  symbol: string;
  count: number;
}

export function parseFormula(formula: string): ParsedElement[] | null {
  const elements: Record<string, number> = {};
  
  function parseGroup(s: string, pos: number): [Record<string, number>, number] {
    const result: Record<string, number> = {};
    while (pos < s.length && s[pos] !== ')') {
      if (s[pos] === '(') {
        pos++;
        const [inner, newPos] = parseGroup(s, pos);
        pos = newPos;
        if (s[pos] !== ')') return [result, pos];
        pos++;
        let numStr = '';
        while (pos < s.length && /\d/.test(s[pos])) {
          numStr += s[pos++];
        }
        const multiplier = numStr ? parseInt(numStr) : 1;
        for (const [sym, cnt] of Object.entries(inner)) {
          result[sym] = (result[sym] || 0) + cnt * multiplier;
        }
      } else if (/[A-Z]/.test(s[pos])) {
        let sym = s[pos++];
        while (pos < s.length && /[a-z]/.test(s[pos])) {
          sym += s[pos++];
        }
        let numStr = '';
        while (pos < s.length && /\d/.test(s[pos])) {
          numStr += s[pos++];
        }
        const count = numStr ? parseInt(numStr) : 1;
        if (!ATOMIC_MASSES[sym]) return [result, pos]; // invalid symbol
        result[sym] = (result[sym] || 0) + count;
      } else {
        pos++;
      }
    }
    return [result, pos];
  }

  try {
    const [parsed] = parseGroup(formula, 0);
    if (Object.keys(parsed).length === 0) return null;
    for (const [sym, cnt] of Object.entries(parsed)) {
      elements[sym] = (elements[sym] || 0) + cnt;
    }
    return Object.entries(elements).map(([symbol, count]) => ({ symbol, count }));
  } catch {
    return null;
  }
}

export function calculateMolecularMass(formula: string) {
  const parsed = parseFormula(formula);
  if (!parsed) return null;

  let totalMass = 0;
  for (const { symbol, count } of parsed) {
    const mass = ATOMIC_MASSES[symbol];
    if (!mass) return null;
    totalMass += mass * count;
  }

  const composition = parsed.map(({ symbol, count }) => {
    const atomicMass = ATOMIC_MASSES[symbol];
    const totalMassEl = atomicMass * count;
    return {
      symbol,
      name: ELEMENT_NAMES[symbol] || symbol,
      count,
      atomicMass,
      totalMass: totalMassEl,
      percentComposition: (totalMassEl / totalMass) * 100,
    };
  });

  return {
    formula,
    molecularMass: totalMass,
    molarMass: totalMass,
    composition,
  };
}

// Simple equation balancer using linear algebra (small molecule limit)
export function balanceEquation(equation: string) {
  // Parse equation: "H2 + O2 -> H2O" or "H2 + O2 → H2O"
  const normalized = equation.replace(/→/g, '->').replace(/=/g, '->').replace(/⟶/g, '->');
  const parts = normalized.split('->');
  if (parts.length !== 2) return null;

  const reactantStr = parts[0].trim();
  const productStr = parts[1].trim();

  const reactantFormulas = reactantStr.split('+').map(s => s.trim());
  const productFormulas = productStr.split('+').map(s => s.trim());

  // Try coefficients from 1-10 using brute force for small molecules
  const allFormulas = [...reactantFormulas, ...productFormulas];
  
  // Collect all elements
  const elementSet = new Set<string>();
  for (const formula of allFormulas) {
    const parsed = parseFormula(formula);
    if (!parsed) return null;
    for (const { symbol } of parsed) elementSet.add(symbol);
  }
  const elements = Array.from(elementSet);

  // Build atom matrix
  const matrix: number[][] = elements.map(el => {
    return allFormulas.map(formula => {
      const parsed = parseFormula(formula);
      if (!parsed) return 0;
      const found = parsed.find(p => p.symbol === el);
      return found ? found.count : 0;
    });
  });

  // Brute force for coefficients 1-8
  const maxCoeff = 8;
  const nReactants = reactantFormulas.length;
  const nProducts = productFormulas.length;
  const nTotal = nReactants + nProducts;

  function* coeffIter(len: number, max: number): Generator<number[]> {
    if (len === 1) {
      for (let i = 1; i <= max; i++) yield [i];
      return;
    }
    for (const rest of coeffIter(len - 1, max)) {
      for (let i = 1; i <= max; i++) yield [i, ...rest];
    }
  }

  for (const coeffs of coeffIter(nTotal, maxCoeff)) {
    let balanced = true;
    for (const row of matrix) {
      let sum = 0;
      for (let i = 0; i < nReactants; i++) sum += row[i] * coeffs[i];
      for (let i = nReactants; i < nTotal; i++) sum -= row[i] * coeffs[i];
      if (sum !== 0) { balanced = false; break; }
    }
    if (balanced) {
      const reactants = reactantFormulas.map((f, i) => ({ formula: f, coefficient: coeffs[i] }));
      const products = productFormulas.map((f, i) => ({ formula: f, coefficient: coeffs[nReactants + i] }));
      
      const fmt = (arr: typeof reactants) => arr.map(({ formula, coefficient }) => coefficient === 1 ? formula : `${coefficient}${formula}`).join(' + ');
      const balanced_eq = `${fmt(reactants)} → ${fmt(products)}`;

      const steps: string[] = [
        `Identified elements: ${elements.join(', ')}`,
        `Reactants: ${reactantFormulas.join(' + ')}`,
        `Products: ${productFormulas.join(' + ')}`,
        `Applied coefficients: ${coeffs.join(', ')}`,
        `Verified atom conservation for all elements`,
      ];

      return {
        original: equation,
        balanced: balanced_eq,
        reactants,
        products,
        isBalanced: true,
        steps,
      };
    }
  }

  // Couldn't balance
  const reactants = reactantFormulas.map(f => ({ formula: f, coefficient: 1 }));
  const products = productFormulas.map(f => ({ formula: f, coefficient: 1 }));
  return {
    original: equation,
    balanced: equation,
    reactants,
    products,
    isBalanced: false,
    steps: ["Could not automatically balance this equation. Please check the formula and try a simpler reaction."],
  };
}

export function buildCompound(
  symbol1: string, oxidation1: number,
  symbol2: string, oxidation2: number,
  name1: string, name2: string,
) {
  // Find LCM to determine subscripts
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const abs1 = Math.abs(oxidation1);
  const abs2 = Math.abs(oxidation2);
  const lcm = (abs1 * abs2) / gcd(abs1, abs2);
  const count1 = lcm / abs1;
  const count2 = lcm / abs2;

  const sub = (n: number) => n === 1 ? '' : n.toString();
  const formula = `${symbol1}${sub(count1)}${symbol2}${sub(count2)}`;

  const mass1 = (ATOMIC_MASSES[symbol1] || 0) * count1;
  const mass2 = (ATOMIC_MASSES[symbol2] || 0) * count2;
  const molecularMass = mass1 + mass2;

  // Generate compound name
  const compoundName = generateCompoundName(name1, name2, count1, count2, oxidation1, oxidation2);

  return {
    formula,
    name: compoundName,
    element1: { symbol: symbol1, name: name1, oxidation: oxidation1, count: count1 },
    element2: { symbol: symbol2, name: name2, oxidation: oxidation2, count: count2 },
    molecularMass,
    description: `${compoundName} (${formula}) is formed from ${name1} (oxidation state ${oxidation1 > 0 ? '+' : ''}${oxidation1}) and ${name2} (oxidation state ${oxidation2 > 0 ? '+' : ''}${oxidation2}).`,
  };
}

export interface StoichiometryReagentAmount {
  formula: string;
  amount: number;
  unit: "grams" | "moles";
}

export interface StoichiometryReagentDetail {
  formula: string;
  amountGiven: number;
  unit: "grams" | "moles";
  molarMass: number;
  molesGiven: number;
  coefficient: number;
  molesOfTargetProduced: number;
}

export interface StoichiometryResult {
  balancedEquation: string;
  targetFormula: string;
  targetMolarMass: number;
  theoreticalYieldMoles: number;
  theoreticalYieldGrams: number;
  limitingReagent: string;
  excessReagents: string[];
  actualYieldGrams: number | null;
  percentYield: number | null;
  reagentDetails: StoichiometryReagentDetail[];
  steps: string[];
  isLimitingReagentCalculation: boolean;
}

export function calculateStoichiometry(
  equation: string,
  reactantAmounts: StoichiometryReagentAmount[],
  targetFormula: string,
  actualYieldGrams?: number,
): StoichiometryResult | null {
  if (reactantAmounts.length === 0) return null;

  // Balance the equation
  const balanced = balanceEquation(equation);
  if (!balanced || !balanced.isBalanced) return null;

  const getMolarMass = (formula: string): number | null => {
    const result = calculateMolecularMass(formula);
    return result ? result.molarMass : null;
  };

  // Find target in products
  const targetProduct = balanced.products.find(p => p.formula === targetFormula);
  if (!targetProduct) return null;

  const targetMolarMass = getMolarMass(targetFormula);
  if (!targetMolarMass) return null;

  const steps: string[] = [];
  steps.push(`Step 1: Confirm balanced equation — ${balanced.balanced}`);

  // Calculate molar masses step
  const molarMassLines: string[] = [];
  for (const ra of reactantAmounts) {
    const mm = getMolarMass(ra.formula);
    if (mm) molarMassLines.push(`${ra.formula}: ${mm.toFixed(3)} g/mol`);
  }
  molarMassLines.push(`${targetFormula}: ${targetMolarMass.toFixed(3)} g/mol`);
  steps.push(`Step 2: Look up molar masses — ${molarMassLines.join(', ')}`);

  // Build reagent details
  const reagentDetails: StoichiometryReagentDetail[] = [];
  for (const ra of reactantAmounts) {
    const reactant = balanced.reactants.find(r => r.formula === ra.formula);
    if (!reactant) continue;
    const molarMass = getMolarMass(ra.formula);
    if (!molarMass) continue;

    const molesGiven = ra.unit === "grams" ? ra.amount / molarMass : ra.amount;
    const molesOfTargetProduced = molesGiven * (targetProduct.coefficient / reactant.coefficient);

    reagentDetails.push({
      formula: ra.formula,
      amountGiven: ra.amount,
      unit: ra.unit,
      molarMass,
      molesGiven,
      coefficient: reactant.coefficient,
      molesOfTargetProduced,
    });
  }

  if (reagentDetails.length === 0) return null;

  // Conversion step
  const conversionLines = reagentDetails.map(r =>
    r.unit === "grams"
      ? `${r.amountGiven} g ${r.formula} ÷ ${r.molarMass.toFixed(3)} g/mol = ${r.molesGiven.toFixed(4)} mol`
      : `${r.amountGiven} mol ${r.formula} (given directly)`,
  );
  steps.push(`Step 3: Convert to moles — ${conversionLines.join('; ')}`);

  // Mole ratio step
  const ratioLines = reagentDetails.map(r =>
    `${r.molesGiven.toFixed(4)} mol ${r.formula} × (${targetProduct.coefficient}/${r.coefficient}) = ${r.molesOfTargetProduced.toFixed(4)} mol ${targetFormula}`,
  );
  steps.push(`Step 4: Apply mole ratio from balanced equation — ${ratioLines.join('; ')}`);

  // Find limiting reagent
  const limitingDetail = reagentDetails.reduce((min, r) =>
    r.molesOfTargetProduced < min.molesOfTargetProduced ? r : min,
  );

  const limitingReagent = limitingDetail.formula;
  const theoreticalYieldMoles = limitingDetail.molesOfTargetProduced;
  const theoreticalYieldGrams = theoreticalYieldMoles * targetMolarMass;
  const excessReagents = reagentDetails.filter(r => r.formula !== limitingReagent).map(r => r.formula);

  if (reagentDetails.length > 1) {
    steps.push(`Step 5: Identify limiting reagent — ${limitingReagent} produces the least ${targetFormula} (${theoreticalYieldMoles.toFixed(4)} mol); ${excessReagents.join(', ')} ${excessReagents.length === 1 ? 'is' : 'are'} in excess`);
  }

  const yieldStep = reagentDetails.length > 1 ? "Step 6" : "Step 5";
  steps.push(`${yieldStep}: Calculate theoretical yield — ${theoreticalYieldMoles.toFixed(4)} mol × ${targetMolarMass.toFixed(3)} g/mol = ${theoreticalYieldGrams.toFixed(4)} g ${targetFormula}`);

  let percentYield: number | null = null;
  if (actualYieldGrams !== undefined && actualYieldGrams !== null) {
    percentYield = (actualYieldGrams / theoreticalYieldGrams) * 100;
    const percentStep = reagentDetails.length > 1 ? "Step 7" : "Step 6";
    steps.push(`${percentStep}: Calculate percent yield — (${actualYieldGrams} g actual ÷ ${theoreticalYieldGrams.toFixed(4)} g theoretical) × 100 = ${percentYield.toFixed(2)}%`);
  }

  return {
    balancedEquation: balanced.balanced,
    targetFormula,
    targetMolarMass,
    theoreticalYieldMoles,
    theoreticalYieldGrams,
    limitingReagent,
    excessReagents,
    actualYieldGrams: actualYieldGrams ?? null,
    percentYield,
    reagentDetails,
    steps,
    isLimitingReagentCalculation: reagentDetails.length > 1,
  };
}

function generateCompoundName(name1: string, name2: string, count1: number, count2: number, ox1: number, ox2: number): string {
  const prefixes = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca'];
  
  // Common ionic compounds
  const ionicPairs: Record<string, string> = {
    'NaCl': 'Sodium Chloride', 'KCl': 'Potassium Chloride',
    'CaO': 'Calcium Oxide', 'Al2O3': 'Aluminum Oxide',
    'MgO': 'Magnesium Oxide', 'Fe2O3': 'Iron(III) Oxide',
  };

  // Simple naming: [prefix]name1 [prefix]name2ide
  const p1 = count1 > 1 ? (prefixes[count1] || `${count1}-`) : '';
  const p2 = count2 > 1 ? (prefixes[count2] || `${count2}-`) : '';
  
  // Anion name (change ending to -ide for simple elements)
  let anionName = name2.toLowerCase();
  if (!anionName.endsWith('ide') && !anionName.endsWith('ate') && !anionName.endsWith('ite')) {
    // Strip vowel ending and add -ide
    anionName = anionName.replace(/ine$/, '') .replace(/um$/, '') .replace(/ogen$/, 'ogen') + 'ide';
    if (name2 === 'Oxygen') anionName = 'oxide';
    if (name2 === 'Nitrogen') anionName = 'nitride';
    if (name2 === 'Sulfur') anionName = 'sulfide';
    if (name2 === 'Chlorine') anionName = 'chloride';
    if (name2 === 'Fluorine') anionName = 'fluoride';
    if (name2 === 'Bromine') anionName = 'bromide';
    if (name2 === 'Iodine') anionName = 'iodide';
    if (name2 === 'Phosphorus') anionName = 'phosphide';
    if (name2 === 'Carbon') anionName = 'carbide';
    if (name2 === 'Silicon') anionName = 'silicide';
    if (name2 === 'Hydrogen') anionName = 'hydride';
  }

  const cationName = `${p1}${name1}`;
  const fullAnionName = `${p2}${anionName}`;
  return `${cationName} ${fullAnionName}`.trim();
}
