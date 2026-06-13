// Tutor de Química en Español
interface TutorResponse {
  answer: string;
  topic?: string;
}

interface KnowledgeEntry {
  patterns: RegExp[];
  response: string;
  topic: string;
}

// ── Saludos y conversación natural ─────────────────────────────────────────
const GREETINGS: { patterns: RegExp[]; response: string }[] = [
  {
    patterns: [/^(hola|buenos días|buenas tardes|buenas noches|buenas|hey|hi|hello)\s*[!.]*$/i, /^hola,?\s*(soy|me llamo|tengo)/i],
    response: "¡Hola! Soy tu Tutor de Química de CHEMIA. ¿En qué tema puedo ayudarte hoy? Puedo explicarte desde conceptos básicos hasta química universitaria.",
  },
  {
    patterns: [/hablas?\s+español/i, /eres?\s+en\s+español/i, /en\s+español/i],
    response: "Sí, hablo español. Soy tu Tutor de Química de CHEMIA y estoy aquí para ayudarte a aprender química en tu idioma. ¿Qué tema te gustaría explorar?",
  },
  {
    patterns: [/¿?(cómo|como)\s+(estás|estas|te\s+encuentras|andas)\??/i, /¿?qué\s+tal\??/i],
    response: "¡Muy bien, gracias por preguntar! Listo para ayudarte a conquistar la química. ¿Qué tema quieres estudiar hoy?",
  },
  {
    patterns: [/^(gracias|muchas gracias|thanks|thank you)\s*[!.]*$/i],
    response: "¡Con mucho gusto! Si tienes más preguntas de química, aquí estoy. ¡Sigue estudiando!",
  },
  {
    patterns: [/^(adiós|adios|hasta luego|bye|chao|chau)\s*[!.]*$/i],
    response: "¡Hasta luego! Ha sido un placer ayudarte. Recuerda: la química está en todo lo que te rodea. ¡Vuelve cuando quieras!",
  },
  {
    patterns: [/¿?(quién|quien)\s+eres\??/i, /¿?(qué|que)\s+(eres|puedes\s+hacer)\??/i, /¿?para\s+qué\s+sirves\??/i],
    response: `Soy el **Tutor de Química de CHEMIA** — un asistente educativo especializado en química.

Puedo ayudarte con:
- 🔬 **Estructura atómica** y tabla periódica
- ⚗️ **Enlace químico** (iónico, covalente, metálico)
- ⚖️ **Estequiometría** y cálculos de moles
- 🧪 **Ácidos, bases y pH**
- 🌡️ **Leyes de los gases**
- ⇌ **Equilibrio químico**
- 🔥 **Termodinámica**
- ⚡ **Electroquímica**

Pregúntame en español o en inglés, y adapto mi explicación a tu nivel (principiante, bachillerato o universidad).`,
  },
];

// ── Base de conocimiento química en español ────────────────────────────────
const knowledge: KnowledgeEntry[] = [
  {
    topic: "Tabla Periódica",
    patterns: [/tabla periódica/i, /tabla periodica/i, /periodic table/i, /elementos.*organizados/i, /cómo.*organizan.*elementos/i],
    response: `## Tabla Periódica

La tabla periódica organiza los **118 elementos** por número atómico creciente (izquierda → derecha, arriba → abajo).

**Estructura:**
- **Períodos (filas)** — misma cantidad de capas electrónicas
- **Grupos (columnas)** — propiedades químicas similares

**Grupos importantes:**
- Grupo 1 — Metales alcalinos (Li, Na, K…): muy reactivos, forman iones +1
- Grupo 2 — Alcalinotérreos (Mg, Ca…): reactivos, forman iones +2
- Grupos 3–12 — Metales de transición (Fe, Cu, Zn…)
- Grupo 17 — Halógenos (F, Cl, Br…): muy reactivos, forman iones −1
- Grupo 18 — Gases nobles (He, Ne, Ar…): muy estables, poco reactivos

**Tendencias periódicas:**
- Radio atómico: ↑ hacia abajo y hacia la izquierda
- Electronegatividad: ↑ hacia arriba y hacia la derecha
- Energía de ionización: ↑ hacia arriba y hacia la derecha`,
  },
  {
    topic: "Estructura Atómica",
    patterns: [/estructura atómica/i, /estructura atomica/i, /atomic structure/i, /protón|proton/i, /neutrón|neutron/i, /electrón|electron/i, /núcleo|nucleus/i, /número atómico/i, /numero atomico/i, /atomic number/i, /masa atómica/i, /masa atomica/i],
    response: `## Estructura del Átomo

Todo átomo está formado por tres partículas fundamentales:

| Partícula | Ubicación | Carga | Masa (u) |
|-----------|-----------|-------|----------|
| **Protón** | Núcleo | +1 | 1 |
| **Neutrón** | Núcleo | 0 | 1 |
| **Electrón** | Capas externas | −1 | ≈ 0 |

**Definiciones clave:**
- **Número atómico (Z)** = número de protones (define el elemento)
- **Número de masa (A)** = protones + neutrones
- **Isótopos** = átomos del mismo elemento con distinto número de neutrones

**Ejemplo: Carbono-12**
- 6 protones, 6 neutrones, 6 electrones
- Z = 6, A = 12

**Configuración electrónica:**
Los electrones se distribuyen en niveles de energía: 1s → 2s → 2p → 3s → 3p → 4s → 3d…`,
  },
  {
    topic: "Enlace Químico",
    patterns: [/enlace (químico|quimico|ionico|iónico|covalente|metálico|metalico)/i, /chemical bond/i, /ionic bond/i, /covalent/i, /electronegativi/i, /unión.*átomos/i],
    response: `## Enlace Químico

Los átomos se unen mediante tres tipos principales de enlace:

**1. Enlace Iónico** (metal + no metal)
- Transferencia de electrones del metal al no metal
- El metal pierde electrones → catión (+)
- El no metal gana electrones → anión (−)
- *Ejemplo:* NaCl — Na⁺ y Cl⁻ se atraen electrostáticamente
- Altos puntos de fusión, conducen electricidad disueltos en agua

**2. Enlace Covalente** (no metal + no metal)
- Los electrones se *comparten* entre los átomos
- *Ejemplo:* H₂O — el oxígeno comparte electrones con 2 hidrógenos
- Puede ser simple (H−H), doble (O=O) o triple (N≡N)

**3. Enlace Metálico** (metal + metal)
- "Mar" de electrones deslocalizados
- Explica la conductividad, maleabilidad y brillo de los metales

**Regla de electronegatividad (escala de Pauling):**
- Δ < 0.4 → Covalente no polar
- 0.4–1.7 → Covalente polar
- > 1.7 → Iónico`,
  },
  {
    topic: "Moles y Estequiometría",
    patterns: [/mol(es?|ar)?/i, /stoichiometry/i, /estequiometr/i, /avogadro/i, /masa molar/i, /molar mass/i, /reactivo limitante/i, /limiting reagent/i, /rendimiento/i, /yield/i],
    response: `## Moles y Estequiometría

**1 mol = 6.022 × 10²³ partículas** (número de Avogadro)

**Fórmulas clave:**
\`\`\`
Moles = Masa (g) / Masa molar (g/mol)
Moles = Partículas / 6.022 × 10²³
Moles = Volumen (L) / 22.4 L  [gases a CNPT]
\`\`\`

**Masa molar** = suma de las masas atómicas de todos los átomos en la fórmula
- Ejemplo: H₂O = 2(1.008) + 15.999 = **18.015 g/mol**

**Pasos estequiométricos:**
1. Escribir y balancear la ecuación química
2. Convertir la masa dada → moles
3. Usar la relación molar de la ecuación balanceada
4. Convertir moles → unidades deseadas

**Reactivo limitante** = el reactivo que se agota primero y limita la cantidad de producto formado

**Rendimiento teórico** = cantidad máxima de producto si la reacción fuera 100% eficiente
**Rendimiento porcentual** = (Rendimiento real / Rendimiento teórico) × 100`,
  },
  {
    topic: "Ácidos y Bases",
    patterns: [/ácido|acido|base|pH|alcalino|alkalin|neutralización/i, /ion hidrógeno|ion hidroxilo|hydroxide/i, /donante.*protón|aceptor.*protón|proton donor/i, /how does ph work/i],
    response: `## Ácidos y Bases

**Definición de Arrhenius:**
- Ácido: produce iones H⁺ en agua (ej: HCl → H⁺ + Cl⁻)
- Base: produce iones OH⁻ en agua (ej: NaOH → Na⁺ + OH⁻)

**Definición de Brønsted-Lowry:**
- Ácido: donante de protones (H⁺)
- Base: aceptor de protones (H⁺)

**Escala de pH (0–14):**
- pH < 7 → Ácido (más H⁺)
- pH = 7 → Neutro (agua pura)
- pH > 7 → Básico/Alcalino (más OH⁻)

\`\`\`
pH = −log[H⁺]
pOH = −log[OH⁻]
pH + pOH = 14
\`\`\`

**Ácidos y bases fuertes vs débiles:**
- Ácidos fuertes: HCl, H₂SO₄, HNO₃ — se disocian completamente
- Ácidos débiles: CH₃COOH (ácido acético) — se disocian parcialmente
- Neutralización: Ácido + Base → Sal + Agua`,
  },
  {
    topic: "Reacciones Redox",
    patterns: [/oxidaci[oó]n|reducci[oó]n|redox/i, /oxidation|reduction/i, /estado de oxidaci[oó]n/i, /oxidation state/i, /pierde.*electron|gana.*electron/i, /OIL RIG/i],
    response: `## Reacciones de Oxidación-Reducción (Redox)

**Regla nemotécnica:** LEO dice GER
- **L**a **E**lectra **O**xida → **LEO** (la oxidación es pérdida de electrones)
- **G**ana **E**lectrones → **R**educción → **GER**

**Reglas para estados de oxidación:**
1. Elemento puro = 0 (ej: O₂, Fe)
2. Ion monoatómico = su carga (Na⁺ = +1)
3. Oxígeno en compuestos = −2 (excepto peróxidos: −1)
4. Hidrógeno en compuestos = +1 (excepto hidruros metálicos: −1)
5. Flúor siempre = −1

**Ejemplo: 2Mg + O₂ → 2MgO**
- Mg: 0 → +2 (se **oxida**, pierde 2 e⁻)
- O: 0 → −2 (se **reduce**, gana 2 e⁻)
- Mg es el **agente reductor** (se oxida)
- O₂ es el **agente oxidante** (se reduce)`,
  },
  {
    topic: "Leyes de los Gases",
    patterns: [/ley(es)?\s+de\s+(los\s+)?gases?/i, /gas law/i, /boyle/i, /charles/i, /gay.lussac/i, /ideal gas|gas ideal/i, /PV=nRT/i, /presión.*volumen|pressure.*volume/i, /temperatura.*gas/i],
    response: `## Leyes de los Gases

**Ley de Boyle** (T constante): P₁V₁ = P₂V₂
- La presión y el volumen son inversamente proporcionales

**Ley de Charles** (P constante): V₁/T₁ = V₂/T₂
- El volumen y la temperatura (Kelvin) son directamente proporcionales

**Ley de Gay-Lussac** (V constante): P₁/T₁ = P₂/T₂
- La presión y la temperatura (Kelvin) son directamente proporcionales

**Ley de los Gases Combinada:** P₁V₁/T₁ = P₂V₂/T₂

**Ley del Gas Ideal:** PV = nRT
- P = presión (atm), V = volumen (L)
- n = moles, R = 0.0821 L·atm/mol·K
- T = temperatura (Kelvin = °C + 273.15)

**CNPT** (Condiciones Normales de Presión y Temperatura):
- 0°C (273.15 K) y 1 atm
- 1 mol de gas ideal = 22.4 L a CNPT`,
  },
  {
    topic: "Configuración Electrónica",
    patterns: [/configuraci[oó]n electr[oó]nica/i, /electron config/i, /orbital/i, /subcapa/i, /aufbau/i, /hund/i, /pauli/i, /1s.*2s|2p.*3s/i],
    response: `## Configuración Electrónica

Los electrones ocupan orbitales en orden creciente de energía:
**1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p…**

**Capacidad de los orbitales:**
- s: 2 electrones (1 orbital)
- p: 6 electrones (3 orbitales)
- d: 10 electrones (5 orbitales)
- f: 14 electrones (7 orbitales)

**Tres principios:**
1. **Aufbau** — llenar los orbitales de menor energía primero
2. **Exclusión de Pauli** — máx. 2 electrones por orbital, espines opuestos
3. **Regla de Hund** — llenar cada orbital individualmente antes de emparejar

**Ejemplos:**
- H (Z=1): 1s¹
- C (Z=6): 1s² 2s² 2p²
- Fe (Z=26): 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶
- Na (Z=11): [Ne] 3s¹`,
  },
  {
    topic: "Geometría Molecular",
    patterns: [/geometr[ií]a molecular/i, /molecular geometry/i, /VSEPR/i, /forma.*molécula/i, /ángulo de enlace|bond angle/i, /lineal|tetraédrica|piramidal|angular|tetrahedral|trigonal/i, /par(es)? solitari/i, /lone pair/i],
    response: `## Geometría Molecular (Teoría VSEPR)

VSEPR = Repulsión de Pares de Electrones de la Capa de Valencia
Los pares de electrones se repelen → determinan la forma de la molécula

| Pares enlazantes | Pares solitarios | Geometría | Ángulo | Ejemplo |
|-----------------|-----------------|-----------|--------|---------|
| 2 | 0 | Lineal | 180° | CO₂ |
| 3 | 0 | Trigonal plana | 120° | BF₃ |
| 4 | 0 | Tetraédrica | 109.5° | CH₄ |
| 3 | 1 | Piramidal trigonal | ~107° | NH₃ |
| 2 | 2 | Angular (en V) | ~104.5° | H₂O |
| 5 | 0 | Bipiramidal trigonal | 90°/120° | PCl₅ |
| 6 | 0 | Octaédrica | 90° | SF₆ |

**Polaridad:** Una molécula es polar si tiene enlaces polares Y forma asimétrica.`,
  },
  {
    topic: "Equilibrio Químico",
    patterns: [/equilibrio (químico|quimico)/i, /chemical equilibrium/i, /Le Chatelier/i, /Kc|Kp/i, /constante.*equilibrio/i, /equilibrium constant/i, /reacción.*reversible|reversible reaction/i],
    response: `## Equilibrio Químico

Una reacción alcanza el equilibrio cuando la **velocidad de la reacción directa = velocidad de la reacción inversa**. Las concentraciones se mantienen constantes.

**Constante de equilibrio (Kc):**
Para: aA + bB ⇌ cC + dD
\`\`\`
Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ
\`\`\`

**Interpretando K:**
- K >> 1 → Productos favorecidos
- K << 1 → Reactivos favorecidos
- K ≈ 1 → Cantidades aproximadamente iguales

**Principio de Le Chatelier:**
Si se aplica una perturbación al equilibrio, el sistema se desplaza para contrarrestarla:

| Perturbación | Respuesta del sistema |
|--------------|----------------------|
| Agregar reactivo | Se desplaza hacia los productos (→) |
| Eliminar producto | Se desplaza hacia los productos (→) |
| Aumentar presión | Se desplaza hacia menos moles de gas |
| Aumentar temperatura | Se desplaza hacia la dirección endotérmica |`,
  },
  {
    topic: "Termodinámica",
    patterns: [/termoqu[ií]mica|thermochemi/i, /entalpía|enthalpy|ΔH/i, /entrop[ií]a|entropy|ΔS/i, /energía (libre|de Gibbs)|gibbs/i, /exotérmico|exothermic/i, /endotérmico|endothermic/i, /ley de Hess/i, /espontáne/i],
    response: `## Termodinámica Química

**Entalpía (ΔH)** = calor transferido a presión constante
- **Exotérmico:** ΔH < 0 (libera calor, los productos son más estables)
- **Endotérmico:** ΔH > 0 (absorbe calor, los reactivos son más estables)

**Ley de Hess:** ΔH de una reacción total = suma de ΔH de los pasos individuales

**Entalpía estándar de formación (ΔHf°):**
- Energía para formar 1 mol de compuesto desde sus elementos en estado estándar
- Elementos en estado estándar: ΔHf° = 0

**Entropía (ΔS)** = medida del desorden/aleatoriedad
- Gases > Líquidos > Sólidos en entropía

**Energía Libre de Gibbs:**
\`\`\`
ΔG = ΔH − TΔS
\`\`\`
- ΔG < 0 → Espontánea (favorable)
- ΔG > 0 → No espontánea
- ΔG = 0 → En equilibrio`,
  },
  {
    topic: "Electroquímica",
    patterns: [/electroquím|electrochemis/i, /celda galvánica|galvanic cell/i, /ánodo|cátodo|anode|cathode/i, /potencial.*celda|cell potential/i, /ecuación de Nernst|nernst/i, /electrólisis|electrolysis/i, /E°/i],
    response: `## Electroquímica

**Celda Galvánica** (pila):
- Convierte energía química en energía eléctrica
- **Ánodo** (−): oxidación ocurre aquí (pierde electrones)
- **Cátodo** (+): reducción ocurre aquí (gana electrones)

**Potencial estándar de celda:**
\`\`\`
E°celda = E°cátodo − E°ánodo
\`\`\`

**Relación con Gibbs:**
\`\`\`
ΔG° = −nFE°
F = 96,485 C/mol (constante de Faraday)
\`\`\`

**Ecuación de Nernst** (condiciones no estándar):
\`\`\`
E = E° − (RT/nF) × ln(Q)
A 25°C: E = E° − (0.0592/n) × log(Q)
\`\`\`

**Celda Zn/Cu** (ejemplo clásico):
- Ánodo: Zn → Zn²⁺ + 2e⁻  (E° = −0.76 V)
- Cátodo: Cu²⁺ + 2e⁻ → Cu  (E° = +0.34 V)
- E°celda = 0.34 − (−0.76) = **+1.10 V**`,
  },
  {
    topic: "Nomenclatura Química",
    patterns: [/nomenclatura/i, /cómo.*nombrar|como.*nombrar/i, /nombre.*compuesto/i, /nomenclature/i, /IUPAC/i, /sufijo.*uro|sufijo.*ato/i],
    response: `## Nomenclatura Química

**Compuestos binarios (dos elementos):**

**1. Óxidos** (metal/no metal + O₂)
- Óxido básico: Metal + O₂  →  CaO = óxido de calcio
- Óxido ácido: No metal + O₂  →  SO₃ = trióxido de azufre

**2. Hidruros**
- Hidruro metálico: NaH = hidruro de sodio
- Hidruro no metálico: HCl(g) = cloruro de hidrógeno

**3. Sales** (nomenclatura estequiométrica IUPAC)
- NaCl = cloruro de sodio
- CaCO₃ = carbonato de calcio
- Na₂SO₄ = sulfato de sodio

**Prefijos numéricos:**
mono-, di-, tri-, tetra-, penta-, hexa-, hepta-, octa-

**Ejemplo:** PCl₅ = pentacloruro de fósforo`,
  },
  {
    topic: "Ácidos y Oxoácidos",
    patterns: [/ácido (sulfúrico|nítrico|clorhídrico|acético|fosfórico|carbónico)/i, /HCl|H2SO4|HNO3|H3PO4|CH3COOH/i, /oxoácido/i],
    response: `## Ácidos Comunes

**Ácidos sin oxígeno (hidrácidos):**
- HF(aq) = ácido fluorhídrico
- HCl(aq) = ácido clorhídrico
- HBr(aq) = ácido bromhídrico

**Ácidos con oxígeno (oxoácidos):**

| Ácido | Fórmula | Fortaleza |
|-------|---------|-----------|
| Sulfúrico | H₂SO₄ | Fuerte |
| Nítrico | HNO₃ | Fuerte |
| Fosfórico | H₃PO₄ | Débil |
| Carbónico | H₂CO₃ | Débil |
| Acético | CH₃COOH | Débil |

**Ácido acético (CH₃COOH = CH₃CO₂H):**
- Fórmula simplificada: C₂H₄O₂
- Es el componente activo del vinagre (~5%)
- Ka = 1.8 × 10⁻⁵ (ácido débil, se disocia parcialmente)`,
  },
];

function generateFallbackResponse(userMessage: string): string {
  // Detectar si parece una pregunta de química
  const isChemQuestion = /[A-Z][a-z]?\d|mol|pH|masa|reacci|compuest|element|átom|electron|enlace|fórmu|químic|quimic|chemical|formula|equation|bond|acid|base|gas|calor|energía/i.test(userMessage);

  if (isChemQuestion) {
    return `Entiendo tu pregunta sobre **"${userMessage}"**.

Esta es un área de la química que puedo explorar contigo. Para darte la mejor explicación, cuéntame:

1. ¿Cuál es tu nivel? (principiante, bachillerato o universidad)
2. ¿Qué parte específica no queda clara?

Mientras tanto, aquí hay algunos temas relacionados que quizás te ayuden:
- 🔬 Estructura atómica y tabla periódica
- ⚗️ Enlace iónico y covalente
- ⚖️ Moles y estequiometría
- 🧪 Ácidos, bases y pH
- 🌡️ Leyes de los gases

Reformula tu pregunta con más detalle y te daré una explicación paso a paso.`;
  }

  return `Hola, soy tu **Tutor de Química de CHEMIA**. Puedo ayudarte con:

- ⚗️ **Estructura atómica** — protones, neutrones, electrones, orbitales
- 🔬 **Tabla periódica** — tendencias, grupos y períodos
- ⚖️ **Estequiometría** — moles, masa molar, reactivo limitante
- 🧪 **Ácidos y bases** — pH, Ka, neutralización
- 🌡️ **Leyes de los gases** — PV=nRT, Boyle, Charles
- ⇌ **Equilibrio** — Kc, principio de Le Chatelier
- 🔥 **Termodinámica** — ΔG, ΔH, ΔS, Hess
- ⚡ **Electroquímica** — celdas galvánicas, Nernst

Escríbeme cualquier pregunta de química en español y te la explico paso a paso, adaptado a tu nivel.`;
}

export function getChemistryResponse(
  userMessage: string,
  _history: { role: string; content: string }[],
): TutorResponse {
  const msg = userMessage.trim();

  // 1. Detectar saludos y conversación natural primero
  for (const greeting of GREETINGS) {
    for (const pattern of greeting.patterns) {
      if (pattern.test(msg)) {
        return { answer: greeting.response, topic: "Conversación" };
      }
    }
  }

  // 2. Buscar en la base de conocimiento química
  for (const entry of knowledge) {
    for (const pattern of entry.patterns) {
      if (pattern.test(msg)) {
        return { answer: entry.response, topic: entry.topic };
      }
    }
  }

  // 3. Respuesta de reserva contextual en español
  return {
    answer: generateFallbackResponse(msg),
    topic: "Química General",
  };
}
