// Rule-based chemistry tutor
interface TutorResponse {
  answer: string;
  topic?: string;
}

interface KnowledgeEntry {
  patterns: RegExp[];
  response: string;
  topic: string;
}

const knowledge: KnowledgeEntry[] = [
  {
    topic: "Periodic Table",
    patterns: [/periodic table/i, /elements.*arranged/i, /how.*elements.*organized/i],
    response: `The **Periodic Table** is an organized chart of all known chemical elements, arranged by:

1. **Atomic number** (number of protons) — increases left to right, top to bottom
2. **Periods (rows)** — elements in the same period have the same number of electron shells
3. **Groups (columns)** — elements in the same group have similar chemical properties

**Key groups:**
- Group 1: Alkali metals (Li, Na, K...) — very reactive, form +1 ions
- Group 2: Alkaline earth metals (Mg, Ca...) — reactive, form +2 ions  
- Groups 3-12: Transition metals (Fe, Cu, Zn...)
- Group 17: Halogens (F, Cl, Br...) — very reactive nonmetals
- Group 18: Noble gases (He, Ne, Ar...) — very stable, unreactive

There are **118 confirmed elements** as of today.`,
  },
  {
    topic: "Atomic Structure",
    patterns: [/atom(ic)? structure/i, /proton|neutron|electron/i, /nucleus/i, /atomic number/i, /mass number/i],
    response: `**Atomic Structure** — every atom has three main particles:

| Particle | Location | Charge | Mass (amu) |
|----------|----------|--------|------------|
| **Proton** | Nucleus | +1 | 1 |
| **Neutron** | Nucleus | 0 | 1 |
| **Electron** | Electron shells | −1 | ~0 |

**Key definitions:**
- **Atomic number (Z)** = number of protons (defines the element)
- **Mass number (A)** = protons + neutrons
- **Isotopes** = atoms of the same element with different neutron counts

**Example: Carbon-12**
- 6 protons, 6 neutrons, 6 electrons
- Atomic number = 6, Mass number = 12`,
  },
  {
    topic: "Chemical Bonding",
    patterns: [/bond(ing)?/i, /ionic/i, /covalent/i, /metallic bond/i, /electronegativity/i],
    response: `**Chemical Bonding** — how atoms join together:

**1. Ionic Bonds** (metal + nonmetal)
- Transfer of electrons from metal → nonmetal
- Metal loses electrons → becomes positive cation
- Nonmetal gains electrons → becomes negative anion
- *Example:* NaCl — Na⁺ and Cl⁻ attract each other
- High melting points, conduct electricity when dissolved

**2. Covalent Bonds** (nonmetal + nonmetal)
- Electrons are *shared* between atoms
- *Example:* H₂O — oxygen shares electrons with 2 hydrogens
- Can be single (H-H), double (O=O), or triple (N≡N)

**3. Metallic Bonds** (metal + metal)
- "Sea" of delocalized electrons
- Explains conductivity, malleability, and luster

**Electronegativity difference rule:**
- < 0.4: Nonpolar covalent
- 0.4–1.7: Polar covalent  
- > 1.7: Ionic`,
  },
  {
    topic: "Moles and Stoichiometry",
    patterns: [/mol(e|ar)?/i, /stoichiometry/i, /avogadro/i, /molar mass/i, /limiting reagent/i],
    response: `**Moles and Stoichiometry**

**1 mole = 6.022 × 10²³ particles** (Avogadro's number)

**Key formulas:**
\`\`\`
Moles = Mass (g) / Molar Mass (g/mol)
Moles = Particles / 6.022×10²³
Moles = Volume (L) / 22.4 L (at STP, for gases)
\`\`\`

**Molar Mass** = sum of atomic masses of all atoms in the formula
- Example: H₂O = 2(1.008) + 15.999 = **18.015 g/mol**

**Stoichiometry steps:**
1. Write and balance the chemical equation
2. Convert given mass → moles
3. Use mole ratios from balanced equation
4. Convert moles → desired units

**Limiting Reagent** = the reactant that runs out first and limits product formation`,
  },
  {
    topic: "Acids and Bases",
    patterns: [/acid|base|pH|alkaline|neutral/i, /hydrogen ion|hydroxide/i, /proton donor|proton accept/i],
    response: `**Acids and Bases**

**Arrhenius Definition:**
- Acid: produces H⁺ ions in water (e.g., HCl → H⁺ + Cl⁻)
- Base: produces OH⁻ ions in water (e.g., NaOH → Na⁺ + OH⁻)

**Brønsted-Lowry Definition:**
- Acid: proton (H⁺) *donor*
- Base: proton (H⁺) *acceptor*

**pH Scale (0–14):**
- pH < 7: Acidic (more H⁺)
- pH = 7: Neutral (pure water)
- pH > 7: Basic/Alkaline (more OH⁻)

\`\`\`
pH = -log[H⁺]
pOH = -log[OH⁻]
pH + pOH = 14
\`\`\`

**Strong vs Weak:**
- Strong acids: HCl, H₂SO₄, HNO₃ — fully dissociate
- Weak acids: CH₃COOH (acetic acid) — partially dissociate
- Neutralization: Acid + Base → Salt + Water`,
  },
  {
    topic: "Oxidation and Reduction",
    patterns: [/oxidat|reduct|redox|oxidation state|valence/i, /gain.*electron|lose.*electron/i],
    response: `**Oxidation-Reduction (Redox) Reactions**

**Memory trick:** OIL RIG
- **O**xidation **I**s **L**oss (of electrons)
- **R**eduction **I**s **G**ain (of electrons)

**Oxidation states (rules):**
1. Pure element = 0 (e.g., O₂, Fe)
2. Monoatomic ion = its charge (Na⁺ = +1)
3. Oxygen in compounds = −2 (except peroxides: −1)
4. Hydrogen in compounds = +1 (except metal hydrides: −1)
5. Fluorine always = −1

**Example: 2Mg + O₂ → 2MgO**
- Mg: 0 → +2 (oxidized, loses 2 e⁻)
- O: 0 → −2 (reduced, gains 2 e⁻)
- Mg is the **reducing agent** (gets oxidized)
- O₂ is the **oxidizing agent** (gets reduced)`,
  },
  {
    topic: "Gas Laws",
    patterns: [/gas law|boyle|charles|gay.lussac|ideal gas|PV=nRT/i, /pressure.*volume|temperature.*gas/i],
    response: `**Gas Laws**

**Boyle's Law** (constant T): P₁V₁ = P₂V₂
- Pressure and volume are inversely proportional

**Charles's Law** (constant P): V₁/T₁ = V₂/T₂
- Volume and temperature (Kelvin) are directly proportional

**Gay-Lussac's Law** (constant V): P₁/T₁ = P₂/T₂
- Pressure and temperature (Kelvin) are directly proportional

**Combined Gas Law:** P₁V₁/T₁ = P₂V₂/T₂

**Ideal Gas Law:** PV = nRT
- P = pressure (atm), V = volume (L)
- n = moles, R = 0.0821 L·atm/mol·K
- T = temperature (Kelvin = °C + 273.15)

**STP** (Standard Temperature and Pressure):
- 0°C (273.15 K) and 1 atm
- 1 mole of ideal gas = 22.4 L at STP`,
  },
  {
    topic: "Electron Configuration",
    patterns: [/electron config|orbital|subshell|aufbau|hund|pauli/i, /1s.*2s|2p.*3s/i],
    response: `**Electron Configuration**

Electrons occupy orbitals in order of increasing energy:
**1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p...**

**Orbital capacities:**
- s: 2 electrons (1 orbital)
- p: 6 electrons (3 orbitals)
- d: 10 electrons (5 orbitals)
- f: 14 electrons (7 orbitals)

**Three rules:**
1. **Aufbau principle** — fill lowest energy orbitals first
2. **Pauli exclusion** — max 2 electrons per orbital, opposite spins
3. **Hund's rule** — fill each orbital singly before pairing

**Examples:**
- H (Z=1): 1s¹
- C (Z=6): 1s² 2s² 2p²
- Fe (Z=26): 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶
- Na (Z=11): 1s² 2s² 2p⁶ 3s¹  →  shorthand: [Ne] 3s¹`,
  },
  {
    topic: "Molecular Geometry",
    patterns: [/molecular geometry|VSEPR|shape|bond angle|linear|tetrahedral|trigonal/i, /lone pair/i],
    response: `**Molecular Geometry (VSEPR Theory)**

VSEPR = Valence Shell Electron Pair Repulsion
Electron pairs repel each other → determines shape

| Bonding pairs | Lone pairs | Shape | Bond angle | Example |
|---------------|------------|-------|------------|---------|
| 2 | 0 | Linear | 180° | CO₂, BeCl₂ |
| 3 | 0 | Trigonal planar | 120° | BF₃ |
| 4 | 0 | Tetrahedral | 109.5° | CH₄ |
| 3 | 1 | Trigonal pyramidal | ~107° | NH₃ |
| 2 | 2 | Bent/V-shape | ~104.5° | H₂O |
| 5 | 0 | Trigonal bipyramidal | 90°/120° | PCl₅ |
| 6 | 0 | Octahedral | 90° | SF₆ |

**Polarity:** A molecule is polar if it has polar bonds AND an asymmetric shape`,
  },
  {
    topic: "Chemical Equilibrium",
    patterns: [/equilibrium|Le Chatelier|Kc|Kp|equilibrium constant/i, /forward.*reverse reaction/i],
    response: `**Chemical Equilibrium**

A reaction reaches equilibrium when the **rate of the forward reaction = rate of the reverse reaction**. Both reactions still occur, but concentrations remain constant.

**Equilibrium constant (Kc):**
For: aA + bB ⇌ cC + dD
\`\`\`
Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ
\`\`\`

**Interpreting K:**
- K >> 1: Products favored
- K << 1: Reactants favored
- K ≈ 1: Roughly equal amounts

**Le Chatelier's Principle:**
If a stress is applied to an equilibrium, the system shifts to *relieve* that stress:

| Stress | System Response |
|--------|----------------|
| Add reactant | Shifts right (→ products) |
| Remove product | Shifts right |
| Increase pressure | Shifts toward fewer moles of gas |
| Increase temperature | Shifts toward endothermic direction |`,
  },
  {
    topic: "Thermochemistry",
    patterns: [/thermochemi|enthalpy|entropy|gibbs|exothermic|endothermic|ΔH|heat of reaction/i],
    response: `**Thermochemistry**

**Enthalpy (ΔH)** = heat flow at constant pressure
- **Exothermic:** ΔH < 0 (releases heat, products more stable)
- **Endothermic:** ΔH > 0 (absorbs heat, reactants more stable)

**Hess's Law:** ΔH for an overall reaction = sum of ΔH for individual steps

**Standard enthalpy of formation (ΔHf°):**
- Energy to form 1 mole of compound from its elements in standard states
- Elements in standard state: ΔHf° = 0

**Entropy (ΔS)** = measure of disorder/randomness
- Gases > liquids > solids in entropy
- More particles = more entropy

**Gibbs Free Energy:**
\`\`\`
ΔG = ΔH - TΔS
\`\`\`
- ΔG < 0: Spontaneous (favorable)
- ΔG > 0: Non-spontaneous
- ΔG = 0: At equilibrium`,
  },
];

function generateFallbackResponse(userMessage: string): string {
  return `Great chemistry question! Let me help you understand **"${userMessage}"**.

Chemistry is the science of matter and its transformations. Here are some tips for exploring this topic:

**Study approach:**
1. Start with the fundamentals — atomic structure, periodic trends, and bonding
2. Practice with examples and problems
3. Connect concepts to real-world applications

**CHEMIA can help you:**
- 🔬 **Periodic Table** — explore all 118 elements with detailed properties
- ⚗️ **Molecular Mass Calculator** — calculate masses for any formula
- 🧪 **Compound Builder** — see how elements combine
- ⚖️ **Equation Balancer** — balance chemical reactions step by step

Try asking me about:
- "What is an ionic bond?"
- "How does the pH scale work?"
- "Explain electron configuration"
- "What are gas laws?"
- "How do I balance equations?"`;
}

export function getChemistryResponse(userMessage: string, history: { role: string; content: string }[]): TutorResponse {
  // Check knowledge base
  for (const entry of knowledge) {
    for (const pattern of entry.patterns) {
      if (pattern.test(userMessage)) {
        return {
          answer: entry.response,
          topic: entry.topic,
        };
      }
    }
  }

  // Context-aware fallback based on conversation history
  return {
    answer: generateFallbackResponse(userMessage),
    topic: "General Chemistry",
  };
}
