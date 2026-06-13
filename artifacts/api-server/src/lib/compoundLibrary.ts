// ─────────────────────────────────────────────────────────────────────────────
// CHEMIA Compound Library
// Architecture: static data module for MVP (10 compounds).
// Expansion path: replace COMPOUNDS array with a DB query that implements the
// same CompoundDetail interface — zero frontend changes required.
// ─────────────────────────────────────────────────────────────────────────────

export type CompoundState = "solid" | "liquid" | "gas";
export type CompoundCategory = "acid" | "base" | "salt" | "oxide" | "organic" | "element-molecule" | "other";
export type Hazard = "corrosive" | "toxic" | "flammable" | "oxidizer" | "irritant" | "environmental" | "none";

export interface CompoundReaction {
  name: string;
  equation: string;
  description: string;
  type: string; // synthesis, decomposition, combustion, acid-base, redox, neutralization
}

export interface CompoundProperty {
  label: string;
  value: string;
  unit?: string;
}

export interface CompoundExplanation {
  beginner: string;
  highschool: string;
  university: string;
}

export interface CompoundDetail {
  id: string;
  formula: string;
  name: string;
  iupacName: string;
  commonNames: string[];
  category: CompoundCategory;
  color: string; // UI accent color token: "cyan", "violet", "green", "orange", "red", "blue", "yellow", "slate"
  state: CompoundState;
  appearance: string;
  smell: string;
  molarMass: number; // g/mol
  meltingPoint: number | null; // °C
  boilingPoint: number | null; // °C
  density: string; // e.g. "1.00 g/cm³"
  solubility: string;
  bondType: string;
  geometry: string;
  dipole: boolean; // polar molecule?
  phInWater: string | null;
  hazards: Hazard[];
  uses: string[];
  funFacts: string[];
  reactions: CompoundReaction[];
  properties: CompoundProperty[];
  explanation: CompoundExplanation;
  tags: string[];
}

export interface CompoundSummary {
  id: string;
  formula: string;
  name: string;
  category: CompoundCategory;
  state: CompoundState;
  molarMass: number;
  color: string;
  tagline: string;
  tags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Compound data — 10 MVP compounds
// ─────────────────────────────────────────────────────────────────────────────
const COMPOUNDS: CompoundDetail[] = [
  {
    id: "H2O",
    formula: "H₂O",
    name: "Water",
    iupacName: "Oxidane",
    commonNames: ["Water", "Dihydrogen monoxide", "H2O"],
    category: "other",
    color: "cyan",
    state: "liquid",
    appearance: "Colorless, transparent liquid",
    smell: "Odorless",
    molarMass: 18.015,
    meltingPoint: 0,
    boilingPoint: 100,
    density: "1.00 g/cm³ (liquid, 4°C)",
    solubility: "Solvent (dissolves most ionic and polar substances)",
    bondType: "Polar covalent (O–H)",
    geometry: "Bent (V-shaped), bond angle ≈ 104.5°",
    dipole: true,
    phInWater: "7.0 (neutral)",
    hazards: ["none"],
    uses: [
      "Universal solvent in chemistry and biology",
      "Drinking water and food preparation",
      "Industrial cooling and heating systems",
      "Hydroelectric power generation",
      "Fire suppression",
      "Photosynthesis (raw material for plants)",
    ],
    funFacts: [
      "Water is the only natural substance that exists in all three states on Earth's surface.",
      "Ice is less dense than liquid water — that's why ice floats.",
      "A water molecule spends only 9 days in the atmosphere before falling as precipitation.",
      "The human body is about 60% water by mass.",
      "Hot water can freeze faster than cold water (Mpemba effect) under certain conditions.",
    ],
    reactions: [
      {
        name: "Synthesis from elements",
        equation: "2H₂(g) + O₂(g) → 2H₂O(g)  ΔH = −484 kJ",
        description: "Hydrogen combustion in oxygen releases energy. This exothermic reaction is used in rocket engines.",
        type: "synthesis",
      },
      {
        name: "Electrolysis",
        equation: "2H₂O(l) → 2H₂(g) + O₂(g)  ΔH = +572 kJ",
        description: "Electric current splits water into hydrogen and oxygen gas. Endothermic — requires energy input.",
        type: "decomposition",
      },
      {
        name: "Acid-base autoionization",
        equation: "H₂O(l) ⇌ H⁺(aq) + OH⁻(aq)  Kw = 10⁻¹⁴",
        description: "Water self-ionizes to a tiny extent. This is the foundation of the pH scale.",
        type: "acid-base",
      },
      {
        name: "Neutralization (as product)",
        equation: "HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)",
        description: "Water forms when an acid neutralizes a base, along with a salt.",
        type: "neutralization",
      },
    ],
    properties: [
      { label: "Molar mass", value: "18.015", unit: "g/mol" },
      { label: "Melting point", value: "0", unit: "°C" },
      { label: "Boiling point", value: "100", unit: "°C" },
      { label: "Density (liquid)", value: "1.00", unit: "g/cm³" },
      { label: "Surface tension (25°C)", value: "71.97", unit: "mN/m" },
      { label: "Viscosity (25°C)", value: "0.89", unit: "mPa·s" },
      { label: "Specific heat capacity", value: "4.184", unit: "J/(g·K)" },
      { label: "Dipole moment", value: "1.85", unit: "D" },
      { label: "Bond angle", value: "104.5", unit: "°" },
      { label: "O–H bond length", value: "0.96", unit: "Å" },
    ],
    explanation: {
      beginner: "Water is made of 2 hydrogen atoms and 1 oxygen atom. Because oxygen pulls electrons strongly toward itself, the molecule is slightly negative near oxygen and slightly positive near the hydrogens — this makes it 'polar', like a tiny magnet. That's why water dissolves so many things (sugar, salt) and why it has a high boiling point for such a small molecule.",
      highschool: "H₂O has a bent geometry (VSEPR: 2 bonding pairs + 2 lone pairs on O → tetrahedral electron geometry, bent molecular geometry, bond angle ≈ 104.5°). The large electronegativity difference between O (3.44) and H (2.20) creates polar O–H bonds. The net dipole moment is 1.85 D, making water polar. Hydrogen bonding between molecules explains its anomalously high boiling point (100°C), surface tension, and specific heat capacity (4.184 J/g·K).",
      university: "The electronic structure of H₂O features sp³-hybridized oxygen with two lone pairs (though a pure sp³ description is debated; the actual HOMOs show more p character). The bent geometry results in C₂ᵥ symmetry. Intermolecular hydrogen bonding (OH···O, ~20 kJ/mol) gives water its unique properties: high dielectric constant (ε = 78.4), maximum density at 4°C due to the open hexagonal ice structure, and anomalously high heat of vaporization (40.65 kJ/mol). The autoionization constant Kw = 10⁻¹⁴ at 25°C governs all aqueous acid-base chemistry.",
    },
    tags: ["polar", "hydrogen-bonding", "bent", "solvent", "life", "common"],
  },

  {
    id: "CO2",
    formula: "CO₂",
    name: "Carbon Dioxide",
    iupacName: "Carbon dioxide",
    commonNames: ["Carbon dioxide", "Carbonic anhydride", "Dry ice (solid)"],
    category: "oxide",
    color: "slate",
    state: "gas",
    appearance: "Colorless, odorless gas; solid form is white 'dry ice'",
    smell: "Odorless at normal concentrations; slightly acidic at high concentrations",
    molarMass: 44.009,
    meltingPoint: -78.5, // sublimation point
    boilingPoint: -78.5,
    density: "1.977 g/L (gas, 0°C); 1.56 g/cm³ (solid)",
    solubility: "Soluble in water: CO₂ + H₂O ⇌ H₂CO₃ (carbonic acid)",
    bondType: "Nonpolar covalent (C=O double bonds)",
    geometry: "Linear, bond angle 180°",
    dipole: false,
    phInWater: "~5.6 (slightly acidic, forms carbonic acid)",
    hazards: ["irritant", "environmental"],
    uses: [
      "Carbonated beverages (fizz in sodas)",
      "Dry ice for refrigeration and special effects",
      "Fire extinguishers (smothers flames without leaving residue)",
      "Photosynthesis feedstock for plants",
      "Supercritical CO₂ as industrial solvent",
      "Welding shield gas",
      "Decaffeination of coffee beans",
    ],
    funFacts: [
      "CO₂ doesn't have a liquid phase at standard pressure — it goes directly from solid (dry ice) to gas.",
      "CO₂ absorbs infrared radiation, making it a greenhouse gas. It's responsible for ~20% of the greenhouse effect.",
      "The atmosphere of Mars is 95% CO₂.",
      "Ocean acidification — the ocean absorbs ~25% of human CO₂ emissions, lowering pH by 0.1 since industrialization.",
      "Plants use 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂ during photosynthesis.",
    ],
    reactions: [
      {
        name: "Combustion of carbon",
        equation: "C(s) + O₂(g) → CO₂(g)  ΔH = −393.5 kJ",
        description: "Complete combustion of carbon produces CO₂. Incomplete combustion gives CO (carbon monoxide).",
        type: "combustion",
      },
      {
        name: "Dissolves in water",
        equation: "CO₂(g) + H₂O(l) ⇌ H₂CO₃(aq) ⇌ H⁺(aq) + HCO₃⁻(aq)",
        description: "CO₂ reacts with water to form carbonic acid, which then ionizes — making the solution acidic.",
        type: "acid-base",
      },
      {
        name: "Reaction with NaOH",
        equation: "CO₂(g) + 2NaOH(aq) → Na₂CO₃(aq) + H₂O(l)",
        description: "CO₂ reacts with sodium hydroxide to form sodium carbonate. Used in CO₂ scrubbers.",
        type: "acid-base",
      },
      {
        name: "Photosynthesis (reverse)",
        equation: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
        description: "Plants convert CO₂ and water into glucose using light energy. The foundation of all food chains.",
        type: "other",
      },
    ],
    properties: [
      { label: "Molar mass", value: "44.009", unit: "g/mol" },
      { label: "Sublimation point", value: "−78.5", unit: "°C" },
      { label: "Density (gas, 0°C)", value: "1.977", unit: "g/L" },
      { label: "C=O bond length", value: "1.16", unit: "Å" },
      { label: "Bond angle", value: "180", unit: "°" },
      { label: "Dipole moment", value: "0", unit: "D (nonpolar)" },
      { label: "Atmospheric concentration", value: "≈421", unit: "ppm (2023)" },
      { label: "Henry's law constant (25°C)", value: "3.4×10⁻²", unit: "mol/(L·atm)" },
    ],
    explanation: {
      beginner: "CO₂ is made of one carbon atom between two oxygen atoms (O=C=O). It's the gas we breathe out and plants breathe in. Even though each C=O bond is polar (oxygen pulls electrons), the two bonds point in opposite directions and cancel each other out — making CO₂ a nonpolar molecule overall. That's why CO₂ doesn't dissolve in water as well as HCl, but it does react slightly with water to make your soda fizzy and a little acidic.",
      highschool: "CO₂ has a linear geometry (2 bonding pairs on C, no lone pairs → VSEPR linear). The two C=O dipoles are equal and opposite (180° apart), so the net dipole moment is zero — CO₂ is nonpolar. Despite this, CO₂ is moderately soluble in water because it reacts chemically: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ (Ka₁ = 4.3×10⁻⁷). CO₂ absorbs infrared radiation at 15 μm, making it an important greenhouse gas.",
      university: "CO₂ belongs to the D∞h point group with σg, πu, and πg molecular orbitals. The HOMO are the πg (nonbonding) orbitals, making CO₂ a poor nucleophile. Its linear structure gives zero dipole moment (μ = 0), but it has a large quadrupole moment (Θ = −4.3×10⁻⁴⁰ C·m²) which drives interactions in supercritical CO₂. The pKa₁ of H₂CO₃ is 6.35; the apparent pKa accounting for dissolved CO₂(aq) is 6.35 but the true pKa of H₂CO₃ is ~3.6.",
    },
    tags: ["nonpolar", "linear", "greenhouse", "gas", "oxide", "photosynthesis"],
  },

  {
    id: "NH3",
    formula: "NH₃",
    name: "Ammonia",
    iupacName: "Azane",
    commonNames: ["Ammonia", "Nitrogen trihydride", "Spirit of hartshorn (historical)"],
    category: "base",
    color: "blue",
    state: "gas",
    appearance: "Colorless gas with a pungent, suffocating smell",
    smell: "Pungent, characteristic 'ammonia' smell",
    molarMass: 17.031,
    meltingPoint: -77.73,
    boilingPoint: -33.35,
    density: "0.769 g/L (gas); 0.682 g/cm³ (liquid, −33°C)",
    solubility: "Very soluble: 51.8 g/100 mL water at 20°C",
    bondType: "Polar covalent (N–H)",
    geometry: "Trigonal pyramidal, bond angle ≈ 107°",
    dipole: true,
    phInWater: "~11.1 (for 1M solution, weak base)",
    hazards: ["toxic", "corrosive", "irritant"],
    uses: [
      "Fertilizer production (Haber-Bosch process) — 80% of global ammonia use",
      "Household and industrial cleaning agents",
      "Refrigerant (R-717) — environmentally friendly alternative",
      "Manufacture of nitric acid (Ostwald process)",
      "Production of nylon and other polymers",
      "pH adjustment in water treatment",
    ],
    funFacts: [
      "About 175 million tons of ammonia are produced globally each year — making it one of the most manufactured chemicals.",
      "The Haber-Bosch process for making ammonia is credited with feeding ~half the world's population by enabling synthetic fertilizers.",
      "Ammonia was first liquefied by Carl Wilhelm Scheele in 1774.",
      "Uranus and Neptune both have ammonia clouds in their atmospheres.",
      "Ammonia has a critical temperature of 132.25°C, making it easy to liquefy at room temperature.",
    ],
    reactions: [
      {
        name: "Haber-Bosch synthesis",
        equation: "N₂(g) + 3H₂(g) ⇌ 2NH₃(g)  ΔH = −92 kJ",
        description: "Industrial synthesis using iron catalyst, 150–300 atm, 400–500°C. The most important industrial chemical reaction in history.",
        type: "synthesis",
      },
      {
        name: "Dissolution in water (weak base)",
        equation: "NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)  Kb = 1.8×10⁻⁵",
        description: "Ammonia acts as a weak Brønsted-Lowry base, accepting a proton from water. Only ~1% ionized at typical concentrations.",
        type: "acid-base",
      },
      {
        name: "Combustion",
        equation: "4NH₃(g) + 3O₂(g) → 2N₂(g) + 6H₂O(g)",
        description: "Ammonia burns in oxygen with a yellow/orange flame, producing nitrogen gas and water.",
        type: "combustion",
      },
      {
        name: "Ostwald process (step 1)",
        equation: "4NH₃(g) + 5O₂(g) → 4NO(g) + 6H₂O(g)  (Pt catalyst, 850°C)",
        description: "Catalytic oxidation of ammonia to nitric oxide — the first step in making nitric acid and fertilizers.",
        type: "redox",
      },
    ],
    properties: [
      { label: "Molar mass", value: "17.031", unit: "g/mol" },
      { label: "Melting point", value: "−77.73", unit: "°C" },
      { label: "Boiling point", value: "−33.35", unit: "°C" },
      { label: "Density (gas)", value: "0.769", unit: "g/L" },
      { label: "Dipole moment", value: "1.47", unit: "D" },
      { label: "Bond angle", value: "107.8", unit: "°" },
      { label: "N–H bond length", value: "1.01", unit: "Å" },
      { label: "Kb (weak base)", value: "1.8×10⁻⁵", unit: "" },
      { label: "pKb", value: "4.74", unit: "" },
    ],
    explanation: {
      beginner: "Ammonia is a gas that smells like cleaning products (because many cleaners contain it!). It's made of 1 nitrogen and 3 hydrogen atoms. Nitrogen has a lone pair (2 extra electrons) that isn't shared — this makes the molecule look like a pyramid instead of a flat triangle. Ammonia is a weak base: when it dissolves in water, it captures H⁺ ions, making the solution alkaline (pH > 7). It's most famous for helping grow food — most fertilizers are made from ammonia.",
      highschool: "NH₃ has a trigonal pyramidal geometry (3 bonding pairs + 1 lone pair on N; VSEPR → tetrahedral electron geometry, pyramidal molecular shape). Bond angle is 107.8° (compressed from 109.5° by the lone pair). The molecule is polar (μ = 1.47 D) due to N–H dipoles and the lone pair direction. As a Brønsted-Lowry base: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, Kb = 1.8×10⁻⁵, pKb = 4.74. In the Haber-Bosch process, N₂ + 3H₂ ⇌ 2NH₃ is run at 150–300 atm, 400–500°C with Fe catalyst.",
      university: "NH₃ belongs to the C₃ᵥ point group. Nitrogen is sp³ hybridized (though the lone pair HOMO has significant s-character). The inversion barrier is surprisingly low (~24 kJ/mol), allowing rapid nitrogen inversion at room temperature — this prevents isolation of chiral amines. Ammonia is both a Lewis base (donates the N lone pair to Lewis acids like BF₃ and metal ions to form coordination complexes) and a Brønsted base (pKa of NH₄⁺ = 9.25). The Haber-Bosch process involves N₂ dissociation on Fe surfaces as the rate-determining step; the activation energy is dramatically lowered by the Fe(111) surface.",
    },
    tags: ["base", "polar", "pyramidal", "toxic", "fertilizer", "industrial"],
  },

  {
    id: "CH4",
    formula: "CH₄",
    name: "Methane",
    iupacName: "Methane",
    commonNames: ["Methane", "Natural gas (main component)", "Marsh gas"],
    category: "organic",
    color: "orange",
    state: "gas",
    appearance: "Colorless, odorless gas (the 'rotten egg' smell of natural gas is added mercaptan)",
    smell: "Odorless (the smell of gas stoves is an added odorant)",
    molarMass: 16.043,
    meltingPoint: -182.5,
    boilingPoint: -161.5,
    density: "0.657 g/L (gas); 0.422 g/cm³ (liquid, −161°C)",
    solubility: "Slightly soluble: 22.7 mg/L water at 25°C",
    bondType: "Nonpolar covalent (C–H)",
    geometry: "Tetrahedral, bond angle 109.5°",
    dipole: false,
    phInWater: null,
    hazards: ["flammable"],
    uses: [
      "Primary component of natural gas (heating, cooking)",
      "Electricity generation in gas turbines",
      "Production of hydrogen via steam reforming",
      "Feedstock for methanol, formaldehyde, and plastics",
      "Fuel for vehicles (CNG — compressed natural gas)",
      "Rocket propellant (liquid methane + liquid oxygen in SpaceX Raptor engine)",
    ],
    funFacts: [
      "Methane is the simplest hydrocarbon — just one carbon and four hydrogens.",
      "Methane is a potent greenhouse gas: 80× more warming than CO₂ over 20 years.",
      "Methanogen bacteria in cow stomachs produce methane — cows burp millions of tons per year.",
      "There are oceans of liquid methane on Saturn's moon Titan.",
      "Methane clathrates (methane ice) on the ocean floor contain more carbon than all coal, oil, and gas reserves combined.",
    ],
    reactions: [
      {
        name: "Complete combustion",
        equation: "CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)  ΔH = −890 kJ/mol",
        description: "Burns cleanly in excess oxygen. This is why natural gas is a relatively clean fuel — no soot with complete combustion.",
        type: "combustion",
      },
      {
        name: "Steam reforming (H₂ production)",
        equation: "CH₄(g) + H₂O(g) → CO(g) + 3H₂(g)  (Ni catalyst, 700–1100°C)",
        description: "The main industrial method for producing hydrogen gas. 'Grey hydrogen' — CO₂ is also produced.",
        type: "other",
      },
      {
        name: "Chlorination (radical substitution)",
        equation: "CH₄ + Cl₂ → CH₃Cl + HCl  (UV light or heat)",
        description: "Free-radical substitution: a H is replaced by Cl. Can continue to CH₂Cl₂, CHCl₃ (chloroform), CCl₄.",
        type: "other",
      },
    ],
    properties: [
      { label: "Molar mass", value: "16.043", unit: "g/mol" },
      { label: "Melting point", value: "−182.5", unit: "°C" },
      { label: "Boiling point", value: "−161.5", unit: "°C" },
      { label: "Density (gas)", value: "0.657", unit: "g/L" },
      { label: "Dipole moment", value: "0", unit: "D (nonpolar)" },
      { label: "Bond angle", value: "109.5", unit: "°" },
      { label: "C–H bond length", value: "1.09", unit: "Å" },
      { label: "C–H bond energy", value: "438", unit: "kJ/mol" },
      { label: "ΔHc° (combustion)", value: "−890", unit: "kJ/mol" },
    ],
    explanation: {
      beginner: "Methane is the simplest carbon molecule — one carbon atom with four hydrogen atoms surrounding it in a perfect 3D shape called a tetrahedron (like a triangular pyramid). Because the 4 bonds are identical and perfectly symmetrical, methane has no overall positive or negative side — it's completely nonpolar. It's the main ingredient in natural gas. When it burns, it produces CO₂ and water and releases a lot of energy — that's what heats your home.",
      highschool: "CH₄ has a tetrahedral geometry (4 bonding pairs, 0 lone pairs on C; sp³ hybridized). All bond angles are exactly 109.5° and all four C–H bonds are identical, giving a net dipole of zero (nonpolar). CH₄ is the simplest alkane. Combustion: CH₄ + 2O₂ → CO₂ + 2H₂O, ΔH = −890 kJ/mol. C–H bonds are strong (438 kJ/mol) and relatively inert — reactions require high activation energy (UV light or high temperature).",
      university: "Methane's carbon is sp³ hybridized with Td symmetry. All four C–H bonds are equivalent (no distinction by NMR at room temperature). The HOMO is a triply degenerate set of t₂ symmetry. C–H bond homolysis (BDE = 439 kJ/mol) initiates free-radical reactions. In organometallic chemistry, methane C–H activation is the 'holy grail' reaction — inserting metal into the C–H bond is extremely challenging due to the low reactivity of the σ C–H bond. Methane hydrates are clathrate structures (CH₄ trapped in water ice cages) stable at high pressure and low temperature.",
    },
    tags: ["nonpolar", "tetrahedral", "organic", "flammable", "greenhouse", "natural-gas"],
  },

  {
    id: "H2SO4",
    formula: "H₂SO₄",
    name: "Sulfuric Acid",
    iupacName: "Sulfuric acid",
    commonNames: ["Sulfuric acid", "Oil of vitriol (historical)", "Battery acid"],
    category: "acid",
    color: "red",
    state: "liquid",
    appearance: "Colorless to slightly yellow, oily, viscous liquid",
    smell: "Virtually odorless (pure); choking/acrid when hot or fuming",
    molarMass: 98.072,
    meltingPoint: 10.31,
    boilingPoint: 337,
    density: "1.84 g/cm³ (concentrated, 98%)",
    solubility: "Miscible with water in all proportions (exothermic dissolution!)",
    bondType: "Covalent (S–O and S=O bonds); ionizes completely in water",
    geometry: "Tetrahedral around S, bond angle ≈ 109.5°",
    dipole: true,
    phInWater: "<0 (strong diprotic acid; 1M solution pH ≈ 0)",
    hazards: ["corrosive", "toxic", "irritant"],
    uses: [
      "Lead-acid batteries in cars",
      "Fertilizer manufacturing (converting phosphate rock to superphosphate)",
      "Petroleum refining",
      "Steel pickling (removing rust and scale)",
      "Manufacture of detergents, dyes, and pharmaceuticals",
      "Paper and pulp production",
      "Explosives manufacturing (TNT, nitroglycerin)",
    ],
    funFacts: [
      "H₂SO₄ is the most-produced industrial chemical in the world — over 200 million tons per year.",
      "Never add water to concentrated H₂SO₄ — always add acid to water. The dissolution is so exothermic it can cause violent spattering.",
      "Concentrated H₂SO₄ is a strong dehydrating agent — it will char (carbonize) sugar and wood.",
      "A car battery contains about 3–4 kg of sulfuric acid solution.",
      "Venus has clouds of concentrated sulfuric acid droplets in its atmosphere.",
    ],
    reactions: [
      {
        name: "Ionization in water (1st step)",
        equation: "H₂SO₄(aq) → H⁺(aq) + HSO₄⁻(aq)  Ka₁ → ∞ (strong acid)",
        description: "The first proton is completely donated — H₂SO₄ is a strong acid for the first ionization.",
        type: "acid-base",
      },
      {
        name: "Ionization in water (2nd step)",
        equation: "HSO₄⁻(aq) ⇌ H⁺(aq) + SO₄²⁻(aq)  Ka₂ = 1.2×10⁻²",
        description: "The second proton is partially released — HSO₄⁻ is a weak acid (pKa₂ = 1.92).",
        type: "acid-base",
      },
      {
        name: "Reaction with metal (Fe)",
        equation: "Fe(s) + H₂SO₄(aq) → FeSO₄(aq) + H₂(g)",
        description: "Dilute H₂SO₄ dissolves reactive metals, releasing hydrogen gas. Used in metal pickling.",
        type: "redox",
      },
      {
        name: "Dehydration of sugar",
        equation: "C₁₂H₂₂O₁₁ + H₂SO₄(conc) → 12C + 11H₂O",
        description: "Concentrated H₂SO₄ dehydrates sucrose, leaving behind black carbon. Demonstrates its powerful dehydrating ability.",
        type: "other",
      },
      {
        name: "Neutralization with NaOH",
        equation: "H₂SO₄(aq) + 2NaOH(aq) → Na₂SO₄(aq) + 2H₂O(l)",
        description: "Diprotic acid requires 2 moles of base per mole of acid for complete neutralization.",
        type: "neutralization",
      },
    ],
    properties: [
      { label: "Molar mass", value: "98.072", unit: "g/mol" },
      { label: "Melting point", value: "10.31", unit: "°C" },
      { label: "Boiling point", value: "337", unit: "°C" },
      { label: "Density (98%)", value: "1.84", unit: "g/cm³" },
      { label: "Ka₁", value: "∞ (strong)", unit: "" },
      { label: "Ka₂", value: "1.2×10⁻²", unit: "(pKa = 1.92)" },
      { label: "Viscosity (25°C, 98%)", value: "21", unit: "mPa·s" },
      { label: "ΔH dissolution (conc. → water)", value: "−95", unit: "kJ/mol" },
    ],
    explanation: {
      beginner: "Sulfuric acid is one of the most dangerous and important acids. It's a thick, oily liquid that reacts violently with water (releasing so much heat it can boil!). It's a 'strong acid' — when dissolved in water, it breaks apart almost completely to release H⁺ ions. This is why it burns skin severely. Despite being dangerous, H₂SO₄ is incredibly useful: car batteries, fertilizers, and hundreds of industrial chemicals all depend on it. It's the world's most-produced industrial chemical.",
      highschool: "H₂SO₄ is a diprotic strong acid. First ionization is complete: H₂SO₄ → H⁺ + HSO₄⁻ (Ka₁ ≫ 1). Second ionization is partial: HSO₄⁻ ⇌ H⁺ + SO₄²⁻ (Ka₂ = 0.012, pKa₂ = 1.92). Molecular geometry: tetrahedral around S (sp³). ALWAYS add acid to water — dissolution is highly exothermic (−95 kJ/mol) and adding water to acid can cause violent spattering. Concentrated H₂SO₄ is also a strong dehydrating and oxidizing agent.",
      university: "In H₂SO₄, sulfur is in the +6 oxidation state, bonded in a tetrahedral geometry (C₂ᵥ) with two S=O (sulfuryl) and two S–OH bonds. The S=O bonds have partial double-bond character due to d-orbital participation (now better described as negative hyperconjugation). In fuming sulfuric acid (oleum), SO₃ dissolves to give H₂S₂O₇ (pyrosulfuric acid). The conjugate base SO₄²⁻ is a stable, symmetric (Td) anion that is a poor nucleophile. Industrial production via the Contact Process: S → SO₂ → SO₃ (V₂O₅ catalyst) → H₂SO₄.",
    },
    tags: ["acid", "strong-acid", "corrosive", "industrial", "diprotic", "dangerous"],
  },

  {
    id: "NaCl",
    formula: "NaCl",
    name: "Sodium Chloride",
    iupacName: "Sodium chloride",
    commonNames: ["Salt", "Table salt", "Rock salt", "Halite"],
    category: "salt",
    color: "yellow",
    state: "solid",
    appearance: "White crystalline solid, cubic crystals",
    smell: "Odorless",
    molarMass: 58.44,
    meltingPoint: 801,
    boilingPoint: 1413,
    density: "2.16 g/cm³",
    solubility: "35.9 g/100 mL water at 25°C",
    bondType: "Ionic (Na⁺ and Cl⁻)",
    geometry: "Face-centered cubic crystal lattice (rock salt structure)",
    dipole: false,
    phInWater: "~7.0 (neutral salt — Na⁺ and Cl⁻ are neither acidic nor basic)",
    hazards: ["none"],
    uses: [
      "Food seasoning and preservation",
      "De-icing roads in winter",
      "Production of chlorine gas and NaOH (chlor-alkali process)",
      "Manufacturing of PVC and other chlorine compounds",
      "Water softening (ion exchange)",
      "Medical saline solutions (0.9% NaCl)",
      "Preserving fish, meats, and pickles",
    ],
    funFacts: [
      "The human body contains about 250 g of salt — needed for nerve function, fluid balance, and muscle contraction.",
      "Roman soldiers were reportedly paid partly in salt — the word 'salary' comes from Latin 'salarium' (salt money).",
      "NaCl melts at 801°C and conducts electricity when molten — solid NaCl doesn't because ions can't move freely.",
      "The ocean contains about 3.5% salt (mostly NaCl) — if all oceanic salt were dried out, it would cover the continents 40 stories deep.",
      "Salt dissolves in water because the polar water molecules surround and pull Na⁺ and Cl⁻ ions apart.",
    ],
    reactions: [
      {
        name: "Formation from elements",
        equation: "2Na(s) + Cl₂(g) → 2NaCl(s)  ΔH = −822 kJ/mol",
        description: "Sodium metal burns vigorously in chlorine gas to produce sodium chloride. Highly exothermic.",
        type: "synthesis",
      },
      {
        name: "Electrolysis (chlor-alkali process)",
        equation: "2NaCl(aq) + 2H₂O(l) → Cl₂(g) + H₂(g) + 2NaOH(aq)",
        description: "Industrial electrolysis of brine produces three crucial chemicals: chlorine, hydrogen, and sodium hydroxide.",
        type: "redox",
      },
      {
        name: "Reaction with AgNO₃ (test for Cl⁻)",
        equation: "NaCl(aq) + AgNO₃(aq) → AgCl(s) ↓ + NaNO₃(aq)",
        description: "White AgCl precipitate confirms presence of chloride ions. This is the standard lab test for halides.",
        type: "other",
      },
      {
        name: "Neutralization (formation)",
        equation: "HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)",
        description: "NaCl forms when hydrochloric acid is neutralized by sodium hydroxide. Classic acid-base reaction.",
        type: "neutralization",
      },
    ],
    properties: [
      { label: "Molar mass", value: "58.44", unit: "g/mol" },
      { label: "Melting point", value: "801", unit: "°C" },
      { label: "Boiling point", value: "1413", unit: "°C" },
      { label: "Density", value: "2.16", unit: "g/cm³" },
      { label: "Lattice energy", value: "−787", unit: "kJ/mol" },
      { label: "Solubility (25°C)", value: "35.9", unit: "g/100 mL" },
      { label: "Ion radius Na⁺", value: "1.02", unit: "Å" },
      { label: "Ion radius Cl⁻", value: "1.81", unit: "Å" },
    ],
    explanation: {
      beginner: "Table salt is made of sodium (a silvery metal that explodes in water) and chlorine (a poisonous yellow-green gas) — yet together they form something completely safe to eat! This happens because sodium gives one electron to chlorine, creating positively charged Na⁺ and negatively charged Cl⁻ ions that attract each other strongly in a crystal. When you put salt in water, the polar water molecules surround each ion and pull them away from the crystal — that's why salt dissolves.",
      highschool: "NaCl is an ionic compound formed by the transfer of one electron from Na (ionization energy = 496 kJ/mol) to Cl (electron affinity = −349 kJ/mol). The resulting Na⁺ and Cl⁻ ions arrange in a face-centered cubic (rock salt) lattice structure. Lattice energy = −787 kJ/mol (very stable). High melting point (801°C) reflects strong ionic bonds. Dissolves in water because hydration energies of Na⁺ (−406 kJ/mol) and Cl⁻ (−363 kJ/mol) overcome the lattice energy. Conducts electricity only when molten or dissolved.",
      university: "The NaCl rock salt structure (Fm3̄m space group) consists of two interpenetrating face-centered cubic sublattices, with each Na⁺ surrounded by 6 Cl⁻ (octahedral coordination) and vice versa. The Born-Haber cycle: ΔHf = ΔHsub(Na) + IE₁(Na) + ½D(Cl₂) + EA(Cl) + U(NaCl) = −411 kJ/mol. The Born-Mayer equation gives U = −(NAz²e²/4πε₀r₀)(1−ρ/r₀). Ion pair spectroscopy shows NaCl(g) has a permanent dipole of 9.0 D, confirming the ionic character of the bond even in the gas phase.",
    },
    tags: ["ionic", "salt", "solid", "common", "food", "electrolyte"],
  },

  {
    id: "O2",
    formula: "O₂",
    name: "Oxygen",
    iupacName: "Dioxygen",
    commonNames: ["Oxygen", "Dioxygen", "Molecular oxygen"],
    category: "element-molecule",
    color: "cyan",
    state: "gas",
    appearance: "Colorless gas; pale blue as liquid",
    smell: "Odorless",
    molarMass: 32.00,
    meltingPoint: -218.8,
    boilingPoint: -182.9,
    density: "1.429 g/L (gas, 0°C); 1.141 g/cm³ (liquid)",
    solubility: "8.2 mg/L water at 25°C (critical for aquatic life)",
    bondType: "Nonpolar covalent (O=O double bond)",
    geometry: "Linear diatomic",
    dipole: false,
    phInWater: null,
    hazards: ["oxidizer"],
    uses: [
      "Respiration — all aerobic life requires O₂",
      "Medical oxygen therapy (hospitals, breathing support)",
      "Steelmaking (blast furnace and basic oxygen furnace)",
      "Rocket propellant (liquid oxygen, LOX)",
      "Welding and cutting (oxyacetylene torch, 3500°C)",
      "Wastewater treatment (aerobic decomposition)",
      "Bleaching of paper and textiles",
    ],
    funFacts: [
      "Oxygen makes up 21% of Earth's atmosphere — a result of billions of years of photosynthesis.",
      "O₂ is paramagnetic (attracted to magnets) because it has 2 unpaired electrons — this is only explained by molecular orbital theory, not Lewis structures.",
      "Liquid oxygen is pale blue and strongly magnetic.",
      "Oxygen is the third most abundant element in the universe (after H and He).",
      "Humans cannot survive more than ~4 minutes without oxygen; brain damage starts in 4–6 minutes.",
    ],
    reactions: [
      {
        name: "Combustion (general)",
        equation: "Fuel + O₂ → CO₂ + H₂O + energy",
        description: "O₂ is the oxidant in all combustion reactions. Without it, nothing burns.",
        type: "combustion",
      },
      {
        name: "Respiration",
        equation: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O  ΔG = −2870 kJ/mol",
        description: "Cellular respiration uses O₂ to oxidize glucose, releasing energy stored as ATP.",
        type: "redox",
      },
      {
        name: "Rusting of iron",
        equation: "4Fe(s) + 3O₂(g) + 6H₂O(l) → 4Fe(OH)₃ → 2Fe₂O₃·3H₂O",
        description: "Slow oxidation of iron in the presence of water and oxygen forms rust (hydrated iron oxide).",
        type: "redox",
      },
      {
        name: "Ozone formation",
        equation: "3O₂ ⇌ 2O₃  (UV radiation, stratosphere)",
        description: "O₂ is converted to ozone (O₃) in the stratosphere by UV radiation, forming the protective ozone layer.",
        type: "other",
      },
    ],
    properties: [
      { label: "Molar mass", value: "32.00", unit: "g/mol" },
      { label: "Melting point", value: "−218.8", unit: "°C" },
      { label: "Boiling point", value: "−182.9", unit: "°C" },
      { label: "Density (gas, 0°C)", value: "1.429", unit: "g/L" },
      { label: "O=O bond length", value: "1.21", unit: "Å" },
      { label: "O=O bond energy", value: "498", unit: "kJ/mol" },
      { label: "Electronegativity", value: "3.44", unit: "(Pauling scale)" },
      { label: "Unpaired electrons", value: "2", unit: "(paramagnetic)" },
    ],
    explanation: {
      beginner: "Oxygen is the gas we breathe — about 21% of the air around us. It comes in pairs of oxygen atoms (O₂) held together by a strong double bond. When we breathe, oxygen enters our blood and reacts with the food we eat inside our cells, releasing the energy that keeps us alive. Everything that burns also needs oxygen — fire needs fuel + oxygen to react. Without oxygen, no fire, no breathing, no life as we know it.",
      highschool: "O₂ has a double bond (bond order = 2), bond length = 1.21 Å, bond energy = 498 kJ/mol. Unusually, O₂ is paramagnetic — it has 2 unpaired electrons. Lewis structures predict all electrons should be paired, but MO theory correctly shows two unpaired electrons in degenerate π* antibonding orbitals: configuration (σ2s)²(σ*2s)²(σ2p)²(π2p)⁴(π*2p)². This paramagnetism means liquid oxygen is attracted to magnets. O₂ is a strong oxidizing agent (E° = +1.23 V for O₂/H₂O).",
      university: "The electronic ground state of O₂ is ³Σg⁻ (triplet oxygen) — a diradical with two unpaired electrons in orthogonal π* MOs. This triplet ground state has profound consequences: reactions of ³O₂ with closed-shell singlet molecules are spin-forbidden and kinetically slow (despite being thermodynamically favorable), which is why organic matter doesn't combust spontaneously at room temperature. Singlet oxygen (¹Δg), generated photochemically, is far more reactive. The O₂/O₂⁻ reduction potential in aqueous solution is context-dependent: E°(O₂/H₂O₂) = +0.695 V; E°(O₂/H₂O) = +1.229 V.",
    },
    tags: ["element", "nonpolar", "oxidizer", "paramagnetic", "gas", "essential"],
  },

  {
    id: "N2",
    formula: "N₂",
    name: "Nitrogen",
    iupacName: "Dinitrogen",
    commonNames: ["Nitrogen", "Dinitrogen", "Liquid nitrogen (liquid)"],
    category: "element-molecule",
    color: "slate",
    state: "gas",
    appearance: "Colorless, odorless gas; colorless liquid",
    smell: "Odorless",
    molarMass: 28.014,
    meltingPoint: -210.0,
    boilingPoint: -195.8,
    density: "1.250 g/L (gas, 0°C); 0.808 g/cm³ (liquid)",
    solubility: "14 mg/L water at 25°C (slightly soluble)",
    bondType: "Nonpolar covalent (N≡N triple bond)",
    geometry: "Linear diatomic",
    dipole: false,
    phInWater: null,
    hazards: ["none"],
    uses: [
      "Inert atmosphere for chemical reactions and food packaging",
      "Liquid nitrogen for cryogenic cooling and storage (−196°C)",
      "Tire inflation (more stable than air — less moisture and oxygen)",
      "Fertilizer production (via Haber-Bosch to make NH₃)",
      "Fire suppression in data centers",
      "Cryopreservation of biological samples (cells, embryos)",
      "Electronics manufacturing (prevents oxidation during soldering)",
    ],
    funFacts: [
      "N₂ makes up 78% of the Earth's atmosphere — by far the most abundant gas.",
      "The N≡N triple bond is one of the strongest bonds in chemistry (945 kJ/mol) — this is why N₂ is so unreactive.",
      "Liquid nitrogen at −196°C can instantly freeze biological tissue — used in dermatology to remove warts and lesions.",
      "Lightning converts N₂ into nitrates that fertilize the soil — up to 100 million tons per year globally.",
      "Nitrogen fixation (converting N₂ to NH₃) requires so much energy that the Haber-Bosch process uses ~2% of the world's energy supply.",
    ],
    reactions: [
      {
        name: "Haber-Bosch (nitrogen fixation)",
        equation: "N₂(g) + 3H₂(g) ⇌ 2NH₃(g)  ΔH = −92 kJ (Fe catalyst, 450°C, 200 atm)",
        description: "The industrial fixation of nitrogen into ammonia. The rate-determining step is N₂ dissociation on the Fe catalyst surface.",
        type: "synthesis",
      },
      {
        name: "Reaction with oxygen (lightning/high T)",
        equation: "N₂(g) + O₂(g) ⇌ 2NO(g)  ΔH = +180 kJ",
        description: "At very high temperatures (lightning, car engines), N₂ reacts with O₂ to form NO, which leads to acid rain and smog.",
        type: "other",
      },
      {
        name: "Reaction with lithium",
        equation: "6Li(s) + N₂(g) → 2Li₃N(s)",
        description: "Lithium is one of the few metals that reacts directly with N₂ at room temperature, forming lithium nitride.",
        type: "synthesis",
      },
    ],
    properties: [
      { label: "Molar mass", value: "28.014", unit: "g/mol" },
      { label: "Melting point", value: "−210.0", unit: "°C" },
      { label: "Boiling point", value: "−195.8", unit: "°C" },
      { label: "N≡N bond length", value: "1.10", unit: "Å" },
      { label: "N≡N bond energy", value: "945", unit: "kJ/mol (one of strongest bonds)" },
      { label: "Atmospheric abundance", value: "78.09", unit: "% by volume" },
      { label: "Dipole moment", value: "0", unit: "D" },
    ],
    explanation: {
      beginner: "Nitrogen is the most common gas in the air (78%!). Two nitrogen atoms share 3 pairs of electrons, making an incredibly strong triple bond (N≡N). This bond is so strong that nitrogen is one of the most unreactive gases — it doesn't easily burn, rust, or react with most things. That's why we use it to keep food fresh (air has oxygen that spoils food; nitrogen doesn't). Liquid nitrogen is so cold (−196°C) that it instantly freezes things — famous for the dramatic fog seen in cooking shows.",
      highschool: "N₂ has a triple bond (bond order = 3): one σ bond and two π bonds. Bond length = 1.10 Å, bond energy = 945 kJ/mol (one of the strongest in chemistry). MO configuration: (σ2s)²(σ*2s)²(π2p)⁴(σ2p)² — HOMO is σ2p (unlike O₂ where HOMO is π*). N₂ is diamagnetic (all electrons paired). The extreme stability of N≡N makes N₂ very inert at room temperature. Industrial nitrogen fixation (N₂ → NH₃) requires Fe catalyst, high pressure, and temperature to overcome the activation barrier.",
      university: "N₂ has ¹Σg⁺ ground state (diamagnetic, unlike O₂'s ³Σg⁻). The bond order is 3 (one σ, two π bonds). Importantly, in N₂ the σ2p (HOMO) is higher in energy than the π2p, unlike O₂ and F₂ where orbital energy ordering reverses due to greater 2s-2p interaction in N. N₂ dissociation (D₀ = 9.75 eV = 941 kJ/mol) is the rate-limiting step in biological and industrial N₂ fixation. Nitrogenase enzyme uses a FeMo cofactor to catalyze: N₂ + 8H⁺ + 8e⁻ + 16ATP → 2NH₃ + H₂ + 16ADP + 16Pᵢ at room temperature — still not understood well enough to replicate industrially.",
    },
    tags: ["element", "nonpolar", "inert", "triple-bond", "gas", "atmosphere"],
  },

  {
    id: "HCl",
    formula: "HCl",
    name: "Hydrogen Chloride",
    iupacName: "Hydrogen chloride",
    commonNames: ["Hydrogen chloride", "Hydrochloric acid (in solution)", "Muriatic acid", "Stomach acid"],
    category: "acid",
    color: "green",
    state: "gas",
    appearance: "Colorless gas; colorless to slightly yellow liquid in solution",
    smell: "Pungent, choking acidic smell",
    molarMass: 36.461,
    meltingPoint: -114.2,
    boilingPoint: -85.05,
    density: "1.490 g/L (gas); 1.19 g/cm³ (37% solution)",
    solubility: "Highly soluble: 72 g/100 mL at 20°C (forms HCl(aq) = hydrochloric acid)",
    bondType: "Polar covalent (H–Cl)",
    geometry: "Linear diatomic",
    dipole: true,
    phInWater: "<0 (strong acid; 1M solution pH ≈ 0)",
    hazards: ["corrosive", "toxic", "irritant"],
    uses: [
      "Stomach acid (gastric HCl) for digestion and killing bacteria",
      "pH adjustment in water treatment and swimming pools",
      "Cleaning and descaling (removing rust, scale, mineral deposits)",
      "Production of PVC and other chlorine compounds",
      "Metal pickling in steelmaking",
      "Pharmaceutical production",
      "Food additive (E507) for acidification",
    ],
    funFacts: [
      "Your stomach contains HCl at pH ~1.5–2. The stomach lining produces a protective mucus layer — without it, the acid would digest the stomach itself.",
      "HCl was called 'spirits of salt' or 'acidum salis' historically.",
      "Mixing HCl with HNO₃ (3:1 ratio) makes 'aqua regia' — the only acid that dissolves gold and platinum.",
      "HCl fumes are dense (heavier than air) and can accumulate in low areas, creating a hazard.",
      "Muriatic acid (dilute HCl) is used by construction workers to clean brick and concrete.",
    ],
    reactions: [
      {
        name: "Ionization in water (strong acid)",
        equation: "HCl(g) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)  (complete)",
        description: "HCl is a strong acid — 100% dissociation in water. Every HCl molecule donates its proton to water.",
        type: "acid-base",
      },
      {
        name: "Reaction with NaOH",
        equation: "HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)",
        description: "Classic acid-base neutralization. pH goes from ~0 to 7 at the equivalence point.",
        type: "neutralization",
      },
      {
        name: "Reaction with metals",
        equation: "Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)",
        description: "Active metals dissolve in HCl, releasing hydrogen gas. Used to test metal reactivity and clean metal surfaces.",
        type: "redox",
      },
      {
        name: "Aqua regia",
        equation: "3HCl(conc) + HNO₃(conc) → NOCl + 2Cl· + 2H₂O  (then Cl· attacks Au)",
        description: "Mixture of 3 parts HCl and 1 part HNO₃ dissolves gold and platinum. The active species are chlorine radicals and NOCl.",
        type: "redox",
      },
    ],
    properties: [
      { label: "Molar mass", value: "36.461", unit: "g/mol" },
      { label: "Melting point", value: "−114.2", unit: "°C" },
      { label: "Boiling point", value: "−85.05", unit: "°C" },
      { label: "H–Cl bond length", value: "1.27", unit: "Å" },
      { label: "H–Cl bond energy", value: "432", unit: "kJ/mol" },
      { label: "Dipole moment", value: "1.08", unit: "D" },
      { label: "Ka in water", value: "≫1 (strong acid)", unit: "" },
      { label: "Electronegativity difference", value: "0.96", unit: "(H: 2.20, Cl: 3.16)" },
    ],
    explanation: {
      beginner: "HCl is a gas made of hydrogen and chlorine bonded together. Because chlorine pulls electrons much harder than hydrogen, the bond is very polar (unequal sharing). When HCl dissolves in water, it breaks apart 100% — releasing H⁺ ions and making the solution very acidic. This solution is hydrochloric acid. Your own stomach makes hydrochloric acid at pH ~1.5 to help digest food. It's a 'strong acid' because it completely gives away its H⁺ — unlike weak acids that only partially do this.",
      highschool: "HCl is a polar diatomic molecule (Δelectronegativity = 0.96). Dipole moment = 1.08 D, H–Cl bond length = 1.27 Å. As a Brønsted-Lowry acid in water, HCl is a strong acid: HCl + H₂O → H₃O⁺ + Cl⁻ (Ka ≫ 1, ~10⁷). This means essentially 100% dissociation at any normal concentration. Cl⁻ is the conjugate base — it's such a weak base that it exerts no measurable basic effect. Note: HCl in solution is 'hydrochloric acid'; pure HCl gas is 'hydrogen chloride'.",
      university: "HCl belongs to C∞ᵥ symmetry. The bond is highly polar (ionic character ~18%, partial charge δ≈+0.18 on H). The pKa of HCl in water is approximately −7 (superacid regime), confirming complete ionization. In non-aqueous solvents, HCl can be quantitatively titrated. The H–Cl bond dissociation energy (432 kJ/mol) is lower than H–F (569 kJ/mol) due to poorer 1s(H)-3p(Cl) orbital overlap. In aqueous solution, Cl⁻ is weakly hydrated (ΔHhyd = −363 kJ/mol) and is an excellent nucleophile in aprotic solvents but poor in protic solvents.",
    },
    tags: ["acid", "strong-acid", "polar", "gas", "corrosive", "stomach-acid"],
  },

  {
    id: "HNO3",
    formula: "HNO₃",
    name: "Nitric Acid",
    iupacName: "Nitric acid",
    commonNames: ["Nitric acid", "Aqua fortis (historical)", "Spirit of nitre"],
    category: "acid",
    color: "orange",
    state: "liquid",
    appearance: "Colorless to yellow liquid (yellow from dissolved NO₂); fuming in moist air",
    smell: "Pungent, choking, acrid",
    molarMass: 63.012,
    meltingPoint: -42,
    boilingPoint: 83,
    density: "1.51 g/cm³ (concentrated, 68%)",
    solubility: "Miscible with water in all proportions",
    bondType: "Polar covalent; ionizes completely in water",
    geometry: "Planar, N is sp² hybridized",
    dipole: true,
    phInWater: "<0 (strong monoprotic acid)",
    hazards: ["corrosive", "toxic", "oxidizer"],
    uses: [
      "Fertilizer production (via ammonium nitrate, NH₄NO₃)",
      "Explosives manufacturing (TNT, nitroglycerin, RDX)",
      "Metal cleaning and etching (especially stainless steel, copper, brass)",
      "Nylon production (via adipic acid synthesis)",
      "Rocket propellants (as oxidizer)",
      "Gold testing and refining (aqua regia)",
      "Synthesis of dyes and pharmaceuticals",
    ],
    funFacts: [
      "HNO₃ turns skin yellow-orange due to the 'xanthoproteic reaction' — nitric acid nitrates proteins in skin.",
      "Aqua regia (3 HCl : 1 HNO₃) is the only common acid that dissolves gold — neither acid alone can.",
      "About 60 million tons of HNO₃ are produced annually, mostly for fertilizers.",
      "HNO₃ is both an acid AND a strong oxidizing agent — it can oxidize metals that don't react with HCl.",
      "Fuming nitric acid (>86% HNO₃) was used as a rocket propellant oxidizer in early missiles.",
    ],
    reactions: [
      {
        name: "Ionization (strong acid)",
        equation: "HNO₃(aq) → H⁺(aq) + NO₃⁻(aq)  (complete)",
        description: "HNO₃ is a strong monoprotic acid — 100% dissociation in dilute aqueous solution.",
        type: "acid-base",
      },
      {
        name: "Reaction with Cu (dilute HNO₃)",
        equation: "3Cu(s) + 8HNO₃(dilute) → 3Cu(NO₃)₂(aq) + 2NO(g) + 4H₂O(l)",
        description: "Dilute HNO₃ acts as an oxidizing acid — dissolves copper (normally resistant to HCl) and releases colorless NO gas.",
        type: "redox",
      },
      {
        name: "Reaction with Cu (concentrated HNO₃)",
        equation: "Cu(s) + 4HNO₃(conc) → Cu(NO₃)₂(aq) + 2NO₂(g) + 2H₂O(l)",
        description: "Concentrated HNO₃ produces brown NO₂ gas instead of NO. More oxidizing at high concentration.",
        type: "redox",
      },
      {
        name: "Nitration of benzene",
        equation: "C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O  (H₂SO₄ catalyst, 50°C)",
        description: "Electrophilic aromatic substitution — HNO₃ provides the nitronium ion (NO₂⁺) that attacks the benzene ring. Key step in making explosives and dyes.",
        type: "other",
      },
      {
        name: "Ostwald process (formation)",
        equation: "4NO(g) + 3O₂(g) + 2H₂O(l) → 4HNO₃(aq)",
        description: "Industrial production of HNO₃: NH₃ → NO → NO₂ → HNO₃. Based on catalytic oxidation of ammonia.",
        type: "synthesis",
      },
    ],
    properties: [
      { label: "Molar mass", value: "63.012", unit: "g/mol" },
      { label: "Melting point", value: "−42", unit: "°C" },
      { label: "Boiling point", value: "83", unit: "°C" },
      { label: "Density (68%)", value: "1.51", unit: "g/cm³" },
      { label: "Ka", value: "28 (pKa = −1.44)", unit: "(strong acid)" },
      { label: "Oxidation state of N", value: "+5", unit: "" },
      { label: "N–O bond lengths", value: "1.21 (N=O) / 1.41 (N–O)", unit: "Å" },
    ],
    explanation: {
      beginner: "Nitric acid is a powerful acid AND a strong oxidizer — it can react with and dissolve metals that even other acids can't touch. When it touches skin, it turns it yellow-orange (the xanthoproteic test for proteins). It's used to make fertilizers and explosives — both important for human civilization. When mixed with hydrochloric acid (aqua regia), it can even dissolve gold. The N in HNO₃ is in its highest oxidation state (+5), which is why it's so good at taking electrons from other substances (oxidizing them).",
      highschool: "HNO₃ is a strong monoprotic acid (Ka = 28, pKa = −1.44). The NO₃⁻ ion is trigonal planar (sp² N, resonance stabilized). HNO₃ is also a powerful oxidizing agent due to N being in the +5 oxidation state. With metals: dilute HNO₃ → NO gas; concentrated HNO₃ → NO₂ gas. Fe and Al are 'passivated' by concentrated HNO₃ (form protective oxide layers). Industrial production via Ostwald process: 4NH₃ + 5O₂ → 4NO + 6H₂O; 2NO + O₂ → 2NO₂; 3NO₂ + H₂O → 2HNO₃ + NO.",
      university: "In HNO₃, nitrogen is sp² hybridized (+5 oxidation state) with resonance between two equivalent N–O bonds (bond order ~1.5) and one N=O double bond. The pKa (−1.44) reflects the high acidity from the electron-withdrawing NO₂ group. As an oxidant, the reduction potential E°(NO₃⁻/NO) = +0.96 V (dilute) and E°(NO₃⁻/NO₂) = +0.80 V (concentrated). The passivation of Fe and Al in concentrated HNO₃ involves rapid formation of a dense Fe₂O₃/Al₂O₃ oxide layer. Nitration via NO₂⁺ (nitronium ion): HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O; the NO₂⁺ (14-electron species, isoelectronic with CO₂) then acts as an electrophile in aromatic substitution.",
    },
    tags: ["acid", "strong-acid", "oxidizer", "corrosive", "industrial", "dangerous"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Public API functions
// ─────────────────────────────────────────────────────────────────────────────

export function listCompounds(search?: string, category?: string, state?: string): CompoundSummary[] {
  let results = COMPOUNDS;

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.formula.toLowerCase().replace(/[₀-₉]/g, s => String.fromCharCode(s.charCodeAt(0) - 8272)).includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.commonNames.some(n => n.toLowerCase().includes(q)) ||
      c.tags.some(t => t.includes(q))
    );
  }

  if (category && category !== "all") {
    results = results.filter(c => c.category === category);
  }

  if (state && state !== "all") {
    results = results.filter(c => c.state === state);
  }

  return results.map(c => ({
    id: c.id,
    formula: c.formula,
    name: c.name,
    category: c.category,
    state: c.state,
    molarMass: c.molarMass,
    color: c.color,
    tagline: c.commonNames.slice(1).join(" · ") || c.iupacName,
    tags: c.tags,
  }));
}

export function getCompound(id: string): CompoundDetail | null {
  return COMPOUNDS.find(c => c.id === id) ?? null;
}
