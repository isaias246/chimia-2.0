// ─────────────────────────────────────────────────────────────────────────────
// CHEMIA — GeneradorPerfilUniversal (TypeScript)
// 7 deterministic motors for the 11-compound MVP whitelist.
// Philosophy: "Calidad antes que cantidad." NO MOCK DATA — every value is
// sourced from IUPAC 2021, NIST WebBook, or standard university textbooks.
// ─────────────────────────────────────────────────────────────────────────────

import { LEWIS_SVG } from "./lewissvg.js";

export interface PerfilNomenclatura {
  tradicional: string;
  stock: string;
  sistematica: string;
  tipo: string;
  nota?: string;
}

export interface PerfilLewis {
  descripcion: string;
  esIonico: boolean;
  electronosValenciaTotal: number;
  atomoCentral?: string;
  paresLibresCentral?: number;
  enlacesSimples?: number;
  enlacesDobles?: number;
  enlacesTriples?: number;
  notaResonancia?: string;
  lewissvg?: string;
}

export interface PerfilVSEPR {
  descripcion: string;
  esIonico: boolean;
  notacionAXE?: string;
  geometriaElectronica?: string;
  geometriaMolecular?: string;
  anguloEnlace?: string;
  hibridacion?: string;
}

export interface PerfilPolaridad {
  esPolar: boolean;
  tipoEnlace: string;
  diferenciaEN: number;
  momentoDipolar: string;
  explicacion: string;
}

export interface PerfilFormacion {
  proceso: string;
  ecuacion: string;
  tipoEnlaceFormado: string;
  estadosOxidacion: Record<string, string>;
  entalpiaFormacion?: string;
}

export interface PerfilReaccion {
  nombre: string;
  ecuacion: string;
  tipo: string;
  descripcion: string;
}

export interface PerfilEducacion {
  teoriaResumida: string;
  erroresComunes: string[];
  ejerciciosPrincipiante: string[];
  ejerciciosSecundario: string[];
  ejerciciosUniversitario: string[];
}

export interface PerfilUniversal {
  formula: string;
  formulaDisplay: string;
  nombre: string;
  familia: string;
  color: string;
  masaMolar: number;
  esCompuestoMVP: true;
  nomenclatura: PerfilNomenclatura;
  lewis: PerfilLewis;
  vsepr: PerfilVSEPR;
  polaridad: PerfilPolaridad;
  formacion: PerfilFormacion;
  reacciones: PerfilReaccion[];
  educacion: PerfilEducacion;
}

// ─────────────────────────────────────────────────────────────────────────────
// MVP compound data
// ─────────────────────────────────────────────────────────────────────────────

const PERFILES: Record<string, PerfilUniversal> = {

  // ── H₂O ──────────────────────────────────────────────────────────────────
  "H2O": {
    formula: "H2O", formulaDisplay: "H₂O",
    nombre: "Agua", familia: "Óxido de hidrógeno", color: "cyan", masaMolar: 18.015,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Agua",
      stock: "Óxido de hidrógeno",
      sistematica: "Monóxido de dihidrógeno",
      tipo: "Óxido de hidrógeno (hidruro de oxígeno)",
      nota: "El nombre 'agua' es el nombre trivial universalmente aceptado por la IUPAC.",
    },
    lewis: {
      descripcion: "El O es el átomo central (6 e⁻ de valencia). Forma 2 enlaces simples O–H, usando 4 e⁻. Los 4 e⁻ restantes forman 2 pares libres en O.",
      esIonico: false, electronosValenciaTotal: 8,
      atomoCentral: "O", paresLibresCentral: 2, enlacesSimples: 2, enlacesDobles: 0, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "2 pares enlazantes + 2 pares libres en O → geometría electrónica tetraédrica → geometría molecular angular. Los pares libres comprimen el ángulo de 109.5° a 104.5°.",
      esIonico: false, notacionAXE: "AX₂E₂",
      geometriaElectronica: "Tetraédrica", geometriaMolecular: "Angular (doblada)",
      anguloEnlace: "104.5°", hibridacion: "sp³",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.24, momentoDipolar: "1.85 D",
      explicacion: "ΔEN(O–H) = 3.44 − 2.20 = 1.24. Geometría angular → los dos dipolos O–H no se cancelan → momento dipolar neto de 1.85 D. El O es el extremo negativo (δ⁻), los H son δ⁺.",
    },
    formacion: {
      proceso: "Síntesis directa de sus elementos: combustión del hidrógeno en oxígeno.",
      ecuacion: "2 H₂(g) + O₂(g) → 2 H₂O(l)  ΔHf° = −285.8 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (O–H)",
      estadosOxidacion: { "H": "+1", "O": "−2" },
      entalpiaFormacion: "−285.8 kJ/mol (líquido)",
    },
    reacciones: [
      { nombre: "Síntesis (combustión de H₂)", ecuacion: "2 H₂(g) + O₂(g) → 2 H₂O(g)  ΔH = −484 kJ", tipo: "síntesis", descripcion: "Reacción altamente exotérmica usada en motores de cohete. La llama de H₂ es casi invisible." },
      { nombre: "Electrólisis", ecuacion: "2 H₂O(l) → 2 H₂(g) + O₂(g)  ΔH = +572 kJ", tipo: "descomposición", descripcion: "Corriente eléctrica descompone el agua. Base de la producción de hidrógeno verde." },
      { nombre: "Autoionización", ecuacion: "H₂O(l) ⇌ H⁺(aq) + OH⁻(aq)  Kw = 10⁻¹⁴ (25°C)", tipo: "ácido-base", descripcion: "Fundamento de la escala de pH. Solo 1 de cada 10⁷ moléculas se ioniza." },
      { nombre: "Neutralización (como producto)", ecuacion: "HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)  ΔH = −57.3 kJ/mol", tipo: "neutralización", descripcion: "El agua se forma al neutralizar ácido fuerte con base fuerte." },
    ],
    educacion: {
      teoriaResumida: "El agua es el disolvente universal: su polaridad (μ = 1.85 D) y los puentes de hidrógeno (∼20 kJ/mol) explican su alto punto de ebullición (100°C), su gran calor específico (4.184 J/g·K) y que sea la base de toda bioquímica. El hielo flota porque la red hexagonal de puentes H hace al sólido menos denso que el líquido.",
      erroresComunes: [
        "Confundir el ángulo tetaédrico ideal (109.5°) con el ángulo real en H₂O (104.5°) — los pares libres comprimen el ángulo.",
        "Creer que H₂O es no polar porque sus átomos son comunes — la geometría angular impide la cancelación de dipolos.",
        "Olvidar que Kw = [H⁺][OH⁻] = 10⁻¹⁴ se cumple en agua pura a 25°C, no a todas las temperaturas.",
        "Escribir 'dioxido de dihidrógeno' — el nombre sistemático correcto es MONÓXIDO de dihidrógeno (1 solo O).",
      ],
      ejerciciosPrincipiante: ["¿Cuántos átomos hay en 1 mol de agua?", "¿Por qué el hielo flota?", "¿Qué significa que el pH del agua pura es 7?"],
      ejerciciosSecundario: ["Calcula la masa molar del H₂O y úsala para convertir 54 g a moles.", "Dibuja la estructura de Lewis del H₂O y justifica el ángulo de 104.5°.", "Escribe la ecuación de electrólisis del agua e identifica qué ocurre en cada electrodo."],
      ejerciciosUniversitario: ["Calcula el ΔG° de la síntesis del agua a 25°C usando ΔHf° y S° estándar.", "Usando la teoría de orbitales moleculares, explica por qué el O en H₂O tiene hibridación sp³ (discute el carácter s del HOMO).", "Calcula el pH de una solución de HCl 0.010 M usando Kw."],
    },
  },

  // ── CO₂ ──────────────────────────────────────────────────────────────────
  "CO2": {
    formula: "CO2", formulaDisplay: "CO₂",
    nombre: "Dióxido de Carbono", familia: "Óxido no metálico (óxido ácido)", color: "slate", masaMolar: 44.009,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Anhídrido carbónico",
      stock: "Óxido de carbono(IV)",
      sistematica: "Dióxido de carbono",
      tipo: "Óxido no metálico (anhídrido del ácido carbónico)",
      nota: "En la nomenclatura de Stock, el estado de oxidación (IV) indica C⁴⁺. El prefijo 'di-' en 'dióxido' indica 2 átomos de O.",
    },
    lewis: {
      descripcion: "C central con 4 e⁻ de valencia; cada O aporta 6 e⁻. Total: 16 e⁻. C forma 2 dobles enlaces C=O (4 e⁻ cada uno). Cada O conserva 2 pares libres (4 e⁻). No quedan pares libres en C.",
      esIonico: false, electronosValenciaTotal: 16,
      atomoCentral: "C", paresLibresCentral: 0, enlacesSimples: 0, enlacesDobles: 2, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "2 grupos de electrones alrededor de C (2 dobles enlaces), sin pares libres → geometría electrónica y molecular lineal. Los dos dipolos C=O son iguales y opuestos → se cancelan → molécula apolar.",
      esIonico: false, notacionAXE: "AX₂",
      geometriaElectronica: "Lineal", geometriaMolecular: "Lineal",
      anguloEnlace: "180°", hibridacion: "sp",
    },
    polaridad: {
      esPolar: false, tipoEnlace: "Covalente polar (enlace) / apolar (molécula)",
      diferenciaEN: 0.89, momentoDipolar: "0 D",
      explicacion: "ΔEN(C=O) = 3.44 − 2.55 = 0.89 → cada enlace C=O es polar. Pero la geometría LINEAL hace que los dos vectores dipolares iguales y opuestos se cancelen exactamente → μ = 0 D. CO₂ es apolar a pesar de tener enlaces polares.",
    },
    formacion: {
      proceso: "Combustión completa del carbono en exceso de oxígeno. Producción industrial: calcinación de CaCO₃.",
      ecuacion: "C(s) + O₂(g) → CO₂(g)  ΔHf° = −393.5 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (dobles enlaces C=O)",
      estadosOxidacion: { "C": "+4", "O": "−2" },
      entalpiaFormacion: "−393.5 kJ/mol",
    },
    reacciones: [
      { nombre: "Combustión del carbono", ecuacion: "C(s) + O₂(g) → CO₂(g)  ΔH = −393.5 kJ", tipo: "combustión", descripcion: "Combustión completa. Si O₂ es insuficiente, se forma CO (monóxido, tóxico)." },
      { nombre: "Reacción con agua (ácido carbónico)", ecuacion: "CO₂(g) + H₂O(l) ⇌ H₂CO₃(aq) ⇌ H⁺ + HCO₃⁻  Ka = 4.3×10⁻⁷", tipo: "ácido-base", descripcion: "Responsable de la acidez del agua de lluvia (pH ≈ 5.6) y del sabor de las bebidas carbonatadas." },
      { nombre: "Reacción con NaOH", ecuacion: "CO₂(g) + 2 NaOH(aq) → Na₂CO₃(aq) + H₂O(l)", tipo: "ácido-base", descripcion: "Base de los depuradores de CO₂ en submarinos y naves espaciales." },
      { nombre: "Fotosíntesis (inversa)", ecuacion: "6 CO₂ + 6 H₂O + hν → C₆H₁₂O₆ + 6 O₂", tipo: "síntesis", descripcion: "Las plantas convierten CO₂ y H₂O en glucosa usando energía solar. Base de toda la cadena alimentaria." },
    ],
    educacion: {
      teoriaResumida: "CO₂ es un gas de efecto invernadero: absorbe radiación infrarroja a 15 μm y la re-emite, calentando la atmósfera. Aunque sus enlaces C=O son polares (ΔEN=0.89), la simetría lineal cancela el momento dipolar neto. Su sublimación directa (−78.5°C) se usa en hielo seco.",
      erroresComunes: [
        "Creer que CO₂ es polar porque sus enlaces C=O son polares — la geometría lineal cancela los dipolos.",
        "Confundir combustión completa (→CO₂) con incompleta (→CO) — el monóxido de carbono es tóxico.",
        "Decir que CO₂ 'se derrite' — a presión estándar sublima directamente de sólido a gas (no tiene fase líquida a 1 atm).",
        "Escribir 'monóxido de carbono' para CO₂ — CO₂ tiene 2 oxígenos (dióxido).",
      ],
      ejerciciosPrincipiante: ["¿Por qué el hielo seco 'humea' pero no moja?", "¿Qué gas producimos al respirar?", "¿Por qué el CO₂ apaga el fuego?"],
      ejerciciosSecundario: ["Dibuja la estructura de Lewis del CO₂ y explica por qué es apolar.", "Calcula el pH del CO₂ disuelto en agua pura (Ka₁ = 4.3×10⁻⁷, [CO₂] = 0.034 M).", "Escribe la ecuación ajustada de combustión completa del propano (C₃H₈)."],
      ejerciciosUniversitario: ["Usando tablas termodinámicas, calcula ΔG° de la reacción CO₂ + H₂O ⇌ H₂CO₃ a 25°C.", "Explica por qué el pKa aparente del CO₂(aq) difiere del pKa real del H₂CO₃.", "Calcula el momento cuadrupolar del CO₂ y explica su importancia en el CO₂ supercrítico."],
    },
  },

  // ── NH₃ ──────────────────────────────────────────────────────────────────
  "NH3": {
    formula: "NH3", formulaDisplay: "NH₃",
    nombre: "Amoníaco", familia: "Hidruro no metálico (base de Brønsted)", color: "blue", masaMolar: 17.031,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Amoníaco",
      stock: "Hidruro de nitrógeno",
      sistematica: "Trihidruro de nitrógeno",
      tipo: "Hidruro no metálico (hidruro de nitrógeno)",
      nota: "El nombre IUPAC moderno es 'azano'. 'Amoníaco' deriva del templo de Amón en Libia, donde se obtenía de excrementos de camellos.",
    },
    lewis: {
      descripcion: "N central con 5 e⁻ de valencia. Forma 3 enlaces simples N–H (6 e⁻). Los 2 e⁻ restantes forman 1 par libre en N. Total: 8 e⁻ de valencia.",
      esIonico: false, electronosValenciaTotal: 8,
      atomoCentral: "N", paresLibresCentral: 1, enlacesSimples: 3, enlacesDobles: 0, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "3 pares enlazantes + 1 par libre en N → geometría electrónica tetraédrica → geometría molecular piramidal trigonal. El par libre comprime el ángulo de 109.5° a 107.8°.",
      esIonico: false, notacionAXE: "AX₃E₁",
      geometriaElectronica: "Tetraédrica", geometriaMolecular: "Piramidal trigonal",
      anguloEnlace: "107.8°", hibridacion: "sp³",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 0.84, momentoDipolar: "1.47 D",
      explicacion: "ΔEN(N–H) = 3.04 − 2.20 = 0.84. Geometría piramidal + contribución del par libre de N → los dipolos N–H NO se cancelan → μ = 1.47 D. N es el extremo δ⁻.",
    },
    formacion: {
      proceso: "Proceso Haber-Bosch: N₂ y H₂ sobre catalizador de Fe a alta T y P. Inventado en 1909, alimenta ∼50% de la humanidad mediante fertilizantes.",
      ecuacion: "N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)  ΔHf° = −46.1 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (N–H)",
      estadosOxidacion: { "N": "−3", "H": "+1" },
      entalpiaFormacion: "−46.1 kJ/mol",
    },
    reacciones: [
      { nombre: "Proceso Haber-Bosch", ecuacion: "N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)  (Fe, 400–500°C, 150–300 atm)", tipo: "síntesis", descripcion: "La reacción industrial más importante de la historia. Utiliza principio de Le Châtelier: alta P favorece el lado con menos moles de gas (2 < 4)." },
      { nombre: "Disolución en agua (base débil)", ecuacion: "NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)  Kb = 1.8×10⁻⁵", tipo: "ácido-base", descripcion: "Base débil de Brønsted-Lowry. Solo ∼1% ionizado a concentraciones típicas. pKb = 4.74; pKa(NH₄⁺) = 9.25." },
      { nombre: "Proceso Ostwald (paso 1)", ecuacion: "4 NH₃(g) + 5 O₂(g) → 4 NO(g) + 6 H₂O(g)  (Pt, 850°C)", tipo: "redox", descripcion: "Oxidación catalítica de NH₃ para producir ácido nítrico. El Pt reduce la energía de activación." },
      { nombre: "Neutralización con ácido fuerte", ecuacion: "NH₃(aq) + HCl(aq) → NH₄Cl(aq)", tipo: "neutralización", descripcion: "Forma cloruro de amonio, usado en fertilizantes y como fundente en soldadura." },
    ],
    educacion: {
      teoriaResumida: "NH₃ es una base débil (Kb = 1.8×10⁻⁵) que acepta protones del agua. Su par libre de electrones en N es responsable tanto de su basicidad como de su capacidad de actuar como ligando (Lewis) en complejos metálicos. La inversión del nitrógeno (barrera ~24 kJ/mol) impide aislar enantiómeros de aminas quirales.",
      erroresComunes: [
        "Confundir NH₃ (base débil) con NaOH (base fuerte) — NH₃ no se ioniza completamente.",
        "Olvidar el par libre de N al dibujar la estructura de Lewis — es crucial para explicar la basicidad.",
        "Creer que la geometría es 'plana' — la pirámide trigonal tiene al N arriba y los 3 H en la base.",
        "Confundir el ángulo N–H (107.8°) con el de CH₄ (109.5°) — el par libre comprime ligeramente.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el amoníaco huele tan fuerte?", "¿Es NH₃ ácido o base? ¿Por qué?", "¿Dónde se usa el amoníaco en la vida diaria?"],
      ejerciciosSecundario: ["Calcula el pH de una solución 0.10 M de NH₃ (Kb = 1.8×10⁻⁵).", "Dibuja la estructura de Lewis del NH₄⁺ y compara su geometría con NH₃.", "Usando Le Châtelier, explica cómo la temperatura y la presión afectan el rendimiento del proceso Haber-Bosch."],
      ejerciciosUniversitario: ["Calcula el grado de ionización de NH₃ 0.10 M y el pH de la solución.", "Escribe las ecuaciones para el tampón NH₃/NH₄Cl y calcula su pH si [NH₃] = [NH₄⁺] = 0.10 M.", "Explica la inversión del nitrógeno y por qué impide la quiralidad en aminas simples."],
    },
  },

  // ── CH₄ ──────────────────────────────────────────────────────────────────
  "CH4": {
    formula: "CH4", formulaDisplay: "CH₄",
    nombre: "Metano", familia: "Hidrocarburo (alcano)", color: "orange", masaMolar: 16.043,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Metano",
      stock: "Hidruro de carbono(IV)",
      sistematica: "Tetrahidruro de carbono",
      tipo: "Hidrocarburo saturado (alcano) / hidruro de carbono",
      nota: "Para compuestos orgánicos, la nomenclatura IUPAC usa los nombres de la serie homóloga (metano, etano…), no la sistemática inorgánica.",
    },
    lewis: {
      descripcion: "C central con 4 e⁻ de valencia. Forma 4 enlaces simples C–H (8 e⁻ totales). No quedan pares libres en C. Octeto del C completo.",
      esIonico: false, electronosValenciaTotal: 8,
      atomoCentral: "C", paresLibresCentral: 0, enlacesSimples: 4, enlacesDobles: 0, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "4 pares enlazantes, 0 pares libres en C → geometría electrónica y molecular tetraédrica perfecta. Los 4 enlaces C–H son idénticos; el ángulo de 109.5° minimiza la repulsión.",
      esIonico: false, notacionAXE: "AX₄",
      geometriaElectronica: "Tetraédrica", geometriaMolecular: "Tetraédrica",
      anguloEnlace: "109.5°", hibridacion: "sp³",
    },
    polaridad: {
      esPolar: false, tipoEnlace: "Covalente apolar",
      diferenciaEN: 0.35, momentoDipolar: "0 D",
      explicacion: "ΔEN(C–H) = 2.55 − 2.20 = 0.35 (muy pequeño). Geometría tetraédrica perfectamente simétrica → los cuatro pequeños dipolos C–H se cancelan exactamente → μ = 0 D. Molécula completamente apolar.",
    },
    formacion: {
      proceso: "Formación geológica natural por descomposición anaeróbica de materia orgánica o por procesos termogénicos en el subsuelo.",
      ecuacion: "C(s) + 2 H₂(g) → CH₄(g)  ΔHf° = −74.8 kJ/mol",
      tipoEnlaceFormado: "Covalente apolar (C–H)",
      estadosOxidacion: { "C": "−4", "H": "+1" },
      entalpiaFormacion: "−74.8 kJ/mol",
    },
    reacciones: [
      { nombre: "Combustión completa", ecuacion: "CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g)  ΔH = −890 kJ/mol", tipo: "combustión", descripcion: "Combustión limpia con exceso de O₂. Es la reacción que calienta los hogares. Con O₂ insuficiente forma CO (monóxido) o hollín (C)." },
      { nombre: "Reformado con vapor (H₂ industrial)", ecuacion: "CH₄(g) + H₂O(g) → CO(g) + 3 H₂(g)  (Ni, 700–1100°C)", tipo: "síntesis", descripcion: "Principal método industrial de producción de H₂ ('hidrógeno gris'). El CO formado se convierte en CO₂ en la etapa shift." },
      { nombre: "Cloración radical", ecuacion: "CH₄ + Cl₂ → CH₃Cl + HCl  (hν o calor)", tipo: "síntesis", descripcion: "Sustitución radical en cadena (iniciación, propagación, terminación). Puede continuar hasta CCl₄." },
    ],
    educacion: {
      teoriaResumida: "CH₄ es el alcano más simple y el principal componente del gas natural. Sus enlaces C–H son fuertes (BDE = 439 kJ/mol) y las reacciones requieren alta energía de activación. Como molécula apolar, solo presenta fuerzas de dispersión de London, lo que explica su muy bajo punto de ebullición (−161.5°C). Es el hidrocarburo más importante energéticamente y como materia prima química.",
      erroresComunes: [
        "Creer que los enlaces C–H son polares y por tanto CH₄ es polar — el ΔEN es solo 0.35 y la simetría Td cancela todo dipolo.",
        "Confundir combustión completa (productos: CO₂ + H₂O) con incompleta (CO o C).",
        "Olvidar que CH₄ es un potente gas de efecto invernadero (×80 más que CO₂ a 20 años).",
        "Calcular mal el estado de oxidación de C en CH₄: como H es +1, C debe ser −4 (no +4).",
      ],
      ejerciciosPrincipiante: ["¿Por qué el gas natural no tiene olor por sí mismo?", "¿Qué gases se producen al quemar gas natural?", "¿CH₄ se disuelve bien en agua? ¿Por qué?"],
      ejerciciosSecundario: ["Ajusta la ecuación de combustión completa del butano (C₄H₁₀).", "Dibuja la estructura de Lewis del CH₄ y compara su geometría con NH₃ y H₂O.", "Calcula el calor liberado al quemar 1 kg de metano (ΔHc = −890 kJ/mol)."],
      ejerciciosUniversitario: ["Calcula ΔH° de la combustión de CH₄ usando energías de enlace (BDE: C–H = 414, O=O = 498, C=O en CO₂ = 804, O–H = 460 kJ/mol).", "Escribe el mecanismo completo de la monocloración radical del metano.", "Justifica por qué la barrera de activación para la C–H activación de CH₄ en superficies metálicas es tan alta."],
    },
  },

  // ── NaCl ─────────────────────────────────────────────────────────────────
  "NaCl": {
    formula: "NaCl", formulaDisplay: "NaCl",
    nombre: "Cloruro de Sodio", familia: "Sal haloidea (sal iónica)", color: "yellow", masaMolar: 58.44,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Cloruro sódico",
      stock: "Cloruro de sodio",
      sistematica: "Cloruro de sodio",
      tipo: "Sal haloidea (haluro metálico)",
      nota: "Na siempre tiene estado de oxidación +1, por lo que no se añade número romano. Nombre trivial: 'sal de mesa' o 'sal común'.",
    },
    lewis: {
      descripcion: "Enlace iónico: Na cede 1 electrón a Cl. Na⁺ queda con configuración del Ne (capa completa). Cl⁻ queda con configuración del Ar (8 pares = 4 pares libres + octeto completo). No aplica estructura Lewis covalente.",
      esIonico: true, electronosValenciaTotal: 8,
      notaResonancia: "Estructura cristalina FCC: cada Na⁺ rodeado por 6 Cl⁻ y viceversa (número de coordinación = 6).",
    },
    vsepr: {
      descripcion: "Compuesto iónico. Forma una red cristalina cúbica de caras centradas (estructura tipo sal de roca). No aplica VSEPR molecular. Cada ion está coordinado por 6 iones del tipo contrario.",
      esIonico: true,
      notacionAXE: "N/A (iónico)",
      geometriaMolecular: "Red cristalina cúbica FCC",
      hibridacion: "N/A",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico",
      diferenciaEN: 2.23, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Na–Cl) = 3.16 − 0.93 = 2.23 > 1.7 → enlace iónico. Na transfiere prácticamente un electrón completo a Cl, formando Na⁺ y Cl⁻. La 'molécula' NaCl en fase gaseosa tiene μ = 9.0 D, pero en sólido es una red iónica.",
    },
    formacion: {
      proceso: "Transferencia de 1 electrón del Na (IE₁ = 496 kJ/mol) al Cl (EA = −349 kJ/mol). La energía reticular (−788 kJ/mol) estabiliza el cristal iónico.",
      ecuacion: "2 Na(s) + Cl₂(g) → 2 NaCl(s)  ΔHf° = −411.2 kJ/mol",
      tipoEnlaceFormado: "Iónico (Na⁺ + Cl⁻)",
      estadosOxidacion: { "Na": "+1", "Cl": "−1" },
      entalpiaFormacion: "−411.2 kJ/mol",
    },
    reacciones: [
      { nombre: "Electrólisis del NaCl fundido (cloroálcali)", ecuacion: "2 NaCl(l) → 2 Na(l) + Cl₂(g)  (electrólisis, >800°C)", tipo: "descomposición", descripcion: "Producción industrial de Na metálico y Cl₂ gas. Base de la industria cloroálcali." },
      { nombre: "Electrólisis de salmuera (proceso cloro-sosa)", ecuacion: "2 NaCl(aq) + 2 H₂O(l) → 2 NaOH(aq) + Cl₂(g) + H₂(g)  (electrólisis)", tipo: "redox", descripcion: "Proceso industrial fundamental. Produce NaOH (sosa cáustica), Cl₂ y H₂. Volumen anual: ∼70 Mt de NaOH/año." },
      { nombre: "Reacción con AgNO₃ (precipitación)", ecuacion: "NaCl(aq) + AgNO₃(aq) → AgCl(s)↓ + NaNO₃(aq)  (Ksp = 1.8×10⁻¹⁰)", tipo: "síntesis", descripcion: "Prueba clásica para detectar iones Cl⁻. El precipitado blanco de AgCl confirma la presencia de cloruro." },
    ],
    educacion: {
      teoriaResumida: "NaCl es el prototipo de enlace iónico. Se forma por el ciclo de Born-Haber: IE₁(Na) + ΔHsub(Na) + ½D(Cl₂) + EA(Cl) + U_reticular. La energía reticular (−788 kJ/mol) es el factor dominante que explica la estabilidad del cristal. En solución acuosa se disocia completamente: NaCl → Na⁺ + Cl⁻ (electrolito fuerte).",
      erroresComunes: [
        "Dibujar una 'molécula' de NaCl con estructura de Lewis covalente — es una red iónica infinita.",
        "Confundir la electrólisis de NaCl fundido (→Na metálico) con la de solución acuosa (→NaOH + Cl₂).",
        "Creer que NaCl es neutro en solución — Na⁺ y Cl⁻ son iones de ácido fuerte y base fuerte respectivamente, pH ≈ 7.",
        "Olvidar que el punto de fusión alto (801°C) refleja la fuerte energía reticular iónica.",
      ],
      ejerciciosPrincipiante: ["¿Por qué la sal se disuelve en agua pero no en aceite?", "¿Qué tipo de enlace tiene el NaCl?", "¿Por qué el NaCl conduce electricidad cuando está fundido pero no en sólido?"],
      ejerciciosSecundario: ["Calcula la concentración molar de una solución de NaCl 5.85 g/L.", "Explica el proceso de disolución del NaCl en agua usando el concepto de entalpía de hidratación.", "Describe el ciclo de Born-Haber para el NaCl e identifica el paso más exotérmico."],
      ejerciciosUniversitario: ["Calcula la energía reticular del NaCl usando el ciclo de Born-Haber completo.", "Calcula la solubilidad del AgCl en agua pura y en solución 0.010 M de NaCl (Ksp = 1.8×10⁻¹⁰).", "Explica la diferencia entre electrólisis de NaCl fundido y salmuera en términos de productos y mecanismo electrodico."],
    },
  },

  // ── HCl ──────────────────────────────────────────────────────────────────
  "HCl": {
    formula: "HCl", formulaDisplay: "HCl",
    nombre: "Cloruro de Hidrógeno / Ácido Clorhídrico", familia: "Hidrácido", color: "green", masaMolar: 36.461,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ácido clorhídrico (en solución acuosa)",
      stock: "Cloruro de hidrógeno (gas puro)",
      sistematica: "Cloruro de hidrógeno",
      tipo: "Hidrácido (ácido binario de hidrógeno con halógeno)",
      nota: "En estado gaseoso: cloruro de hidrógeno. Como solución acuosa (HCl·aq): ácido clorhídrico. En la nomenclatura tradicional de hidrácidos: ácido + elemento + sufijo '-hídrico'.",
    },
    lewis: {
      descripcion: "Cl es el átomo pesado central. 7 e⁻ de valencia de Cl + 1 de H = 8 e⁻ totales. 1 enlace simple H–Cl usa 2 e⁻; los 6 e⁻ restantes forman 3 pares libres en Cl.",
      esIonico: false, electronosValenciaTotal: 8,
      atomoCentral: "Cl", paresLibresCentral: 3, enlacesSimples: 1, enlacesDobles: 0, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "Molécula diatómica: el concepto de geometría VSEPR no aplica en el mismo sentido. Cl tiene 3 pares libres + 1 enlace → el 'entorno' de Cl es AX₁E₃ (tetraédrico). La molécula es lineal por ser diatómica.",
      esIonico: false, notacionAXE: "AX₁E₃ (en Cl)",
      geometriaElectronica: "Tetraédrica (entorno de Cl)", geometriaMolecular: "Lineal (diatómica)",
      anguloEnlace: "N/A", hibridacion: "sp³ (Cl)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 0.96, momentoDipolar: "1.08 D",
      explicacion: "ΔEN(H–Cl) = 3.16 − 2.20 = 0.96. Molécula diatómica polar → μ = 1.08 D. El extremo Cl es δ⁻ (mayor electronegatividad); H es δ⁺. En agua, el dipolo facilita la ionización completa: HCl → H⁺ + Cl⁻.",
    },
    formacion: {
      proceso: "Combinación directa de H₂ y Cl₂. Industrialmente también se produce como subproducto de la cloración de compuestos orgánicos.",
      ecuacion: "H₂(g) + Cl₂(g) → 2 HCl(g)  ΔHf° = −92.3 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (H–Cl)",
      estadosOxidacion: { "H": "+1", "Cl": "−1" },
      entalpiaFormacion: "−92.3 kJ/mol",
    },
    reacciones: [
      { nombre: "Ionización en agua (ácido fuerte)", ecuacion: "HCl(g) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)  (Ka >> 1)", tipo: "ácido-base", descripcion: "HCl es un ácido fuerte: ionización prácticamente completa en agua. El pH de 1M HCl es 0." },
      { nombre: "Neutralización", ecuacion: "HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)  ΔH = −57.3 kJ/mol", tipo: "neutralización", descripcion: "Reacción exotérmica rápida entre ácido fuerte y base fuerte. Usada en titulaciones ácido-base." },
      { nombre: "Reacción con metales activos", ecuacion: "Zn(s) + 2 HCl(aq) → ZnCl₂(aq) + H₂(g)", tipo: "redox", descripcion: "Los metales situados antes del H en la serie electroquímica desplazan al H₂ del ácido. Clave para entender la reactividad de los metales." },
      { nombre: "Reacción con carbonatos", ecuacion: "CaCO₃(s) + 2 HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑", tipo: "ácido-base", descripcion: "Reacción clásica para identificar carbonatos (efervescencia de CO₂). También explica la erosión de la caliza por la lluvia ácida." },
    ],
    educacion: {
      teoriaResumida: "HCl es el prototipo de ácido fuerte de Arrhenius y Brønsted-Lowry. En solución acuosa, la ionización es prácticamente completa (Ka ≈ 10⁷). El HCl gástrico (pH ≈ 1.5–3.5) ayuda a digerir proteínas y eliminar patógenos. Es también el ácido industrial más producido después del H₂SO₄.",
      erroresComunes: [
        "Confundir HCl(g) (gas tóxico) con HCl(aq) (ácido clorhídrico, líquido).",
        "Decir que HCl es un ácido débil — es un ácido FUERTE (ionización completa).",
        "Confundir ácido clorhídrico (HCl) con ácido hipocloroso (HClO) o ácido perclórico (HClO₄).",
        "Creer que todos los halogenuros de hidrógeno son ácidos fuertes — HF es un ácido débil (pKa = 3.17).",
      ],
      ejerciciosPrincipiante: ["¿Por qué el estómago tiene ácido clorhídrico?", "¿Qué ocurre al poner una piedra caliza en HCl diluido?", "¿Es el HCl ácido fuerte o débil?"],
      ejerciciosSecundario: ["Calcula el pH de una solución de HCl 0.050 M.", "Determina el volumen de NaOH 0.10 M necesario para neutralizar 25 mL de HCl 0.15 M.", "Escribe la ecuación iónica neta de la reacción de HCl con NaOH."],
      ejerciciosUniversitario: ["Calcula Ka del HCl a partir de ΔGf° de las especies en solución acuosa.", "Explica por qué HF es un ácido débil (pKa = 3.17) mientras que HCl es fuerte, usando argumentos de enlace.", "Calcula el pH de una mezcla de 50 mL HCl 0.10 M + 30 mL NaOH 0.10 M."],
    },
  },

  // ── HNO₃ ─────────────────────────────────────────────────────────────────
  "HNO3": {
    formula: "HNO3", formulaDisplay: "HNO₃",
    nombre: "Ácido Nítrico", familia: "Oxoácido (ácido ternario)", color: "red", masaMolar: 63.013,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ácido nítrico",
      stock: "Trioxonitrato(V) de hidrógeno",
      sistematica: "Ácido trioxonítrico(V)",
      tipo: "Oxoácido (ácido ternario de N en estado +5)",
      nota: "Estado de oxidación del N: +5. Nomenclatura del oxoácido: H₂O + N₂O₅ (anhídrido nítrico). Ácido nítrico fumante: >90% HNO₃ puro, libera NO₂ rojo-pardo.",
    },
    lewis: {
      descripcion: "N central (sp²). Estructura real: resonancia entre 2 formas. Una forma: N con doble enlace N=O, enlace simple N–O (del grupo OH), y enlace N–O⁻ (con carga formal). Total: 24 e⁻ de valencia.",
      esIonico: false, electronosValenciaTotal: 24,
      atomoCentral: "N", paresLibresCentral: 0, enlacesSimples: 1, enlacesDobles: 2, enlacesTriples: 0,
      notaResonancia: "El grupo NO₂ del HNO₃ presenta resonancia: los dos enlaces N–O del grupo nitro son equivalentes (longitud: 1.21 Å), intermedia entre N=O (1.20 Å) y N–O (1.36 Å).",
    },
    vsepr: {
      descripcion: "N central con 3 grupos de electrones (1 N–OH, 2 N=O con resonancia) → geometría electrónica y molecular plana trigonal. Ángulos ≈ 120°.",
      esIonico: false, notacionAXE: "AX₃ (con resonancia)",
      geometriaElectronica: "Plana trigonal", geometriaMolecular: "Plana trigonal",
      anguloEnlace: "≈120°", hibridacion: "sp²",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.24, momentoDipolar: "2.17 D",
      explicacion: "Múltiples enlaces polares (N–O, N=O, O–H) con ΔEN máx de 1.24 (O–H). Geometría plana no simétrica → momento dipolar neto significativo de 2.17 D.",
    },
    formacion: {
      proceso: "Proceso Ostwald (industrial): oxidación catalítica de NH₃, oxidación de NO a NO₂, absorción de NO₂ en agua.",
      ecuacion: "3 NO₂(g) + H₂O(l) → 2 HNO₃(aq) + NO(g)  (paso final del proceso Ostwald)",
      tipoEnlaceFormado: "Covalente polar (N–O, O–H)",
      estadosOxidacion: { "H": "+1", "N": "+5", "O": "−2" },
      entalpiaFormacion: "−174.1 kJ/mol",
    },
    reacciones: [
      { nombre: "Ionización (ácido fuerte)", ecuacion: "HNO₃(aq) → H⁺(aq) + NO₃⁻(aq)  (Ka >> 1)", tipo: "ácido-base", descripcion: "Ácido fuerte: ionización prácticamente completa. El ión nitrato (NO₃⁻) es el ácido conjugado débil." },
      { nombre: "Reacción con Cu (ácido diluido vs. concentrado)", ecuacion: "3 Cu + 8 HNO₃(dil.) → 3 Cu(NO₃)₂ + 2 NO↑ + 4 H₂O\n  Cu + 4 HNO₃(conc.) → Cu(NO₃)₂ + 2 NO₂↑ + 2 H₂O", tipo: "redox", descripcion: "HNO₃ disuelve metales innobles sin producir H₂. Diluido → NO (incoloro); concentrado → NO₂ (pardo)." },
      { nombre: "Nitración de tolueno (orgánica)", ecuacion: "C₆H₅CH₃ + HNO₃ → C₆H₄(CH₃)(NO₂) + H₂O  (H₂SO₄ cat.)", tipo: "síntesis", descripcion: "Reacción de sustitución electrófila aromática. Produce TNT (2,4,6-trinitrotolueno) en sucesivas nitraciones." },
    ],
    educacion: {
      teoriaResumida: "HNO₃ es un ácido fuerte oxidante. El N en estado +5 puede reducirse a NO (+2) o NO₂ (+4) según la concentración del ácido, haciendo que disuelva metales que el HCl no disuelve. El 'agua regia' (3 HCl : 1 HNO₃) disuelve el oro y el platino.",
      erroresComunes: [
        "Creer que HNO₃ diluido y concentrado reaccionan igual con los metales — el producto de reducción de N es diferente.",
        "Olvidar que HNO₃ es oxidante además de ácido — no libera H₂ al reaccionar con metales.",
        "Confundir nitrato (NO₃⁻) con nitrito (NO₂⁻) — son aniones diferentes del N.",
        "Escribir mal el estado de oxidación del N en HNO₃: NO es +5, aunque HNO₂ tiene N en +3.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el HNO₃ amarillea la piel?", "¿Para qué sirve el HNO₃ en la fabricación de fertilizantes?", "¿Qué es el 'agua regia'?"],
      ejerciciosSecundario: ["Ajusta la ecuación redox de Cu + HNO₃(diluido) → Cu(NO₃)₂ + NO + H₂O.", "Calcula el estado de oxidación del N en HNO₃, HNO₂, NO₃⁻ y NH₄⁺.", "¿Por qué el HNO₃ concentrado disuelve el cobre pero el HCl no?"],
      ejerciciosUniversitario: ["Ajusta la ecuación de Cu + HNO₃(conc.) usando el método del ion-electrón.", "Explica el mecanismo de la nitración del benceno con la mezcla sulfonítrica.", "Calcula el potencial redox estándar para NO₃⁻/NO y compáralo con el de H⁺/H₂."],
    },
  },

  // ── H₂SO₄ ────────────────────────────────────────────────────────────────
  "H2SO4": {
    formula: "H2SO4", formulaDisplay: "H₂SO₄",
    nombre: "Ácido Sulfúrico", familia: "Oxoácido (ácido ternario)", color: "red", masaMolar: 98.072,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ácido sulfúrico",
      stock: "Tetraoxosulfato(VI) de dihidrógeno",
      sistematica: "Ácido tetraoxosulfúrico(VI)",
      tipo: "Oxoácido diprótco de S en estado +6",
      nota: "Nombre histórico: 'aceite de vitriolo'. Estado de oxidación del S: +6 (máximo posible para el S). Segundo ácido: H₂SO₃ (S en +4).",
    },
    lewis: {
      descripcion: "S central con 6 e⁻ de valencia. Forma 2 grupos S=O (con expansión del octeto, pares d) y 2 grupos S–OH. Total electrones: 2+6+4×6+6 = 32 e⁻. S puede expandir el octeto usando orbitales 3d.",
      esIonico: false, electronosValenciaTotal: 32,
      atomoCentral: "S", paresLibresCentral: 0, enlacesSimples: 2, enlacesDobles: 2, enlacesTriples: 0,
      notaResonancia: "Los 4 enlaces S–O son equivalentes en el ión sulfato SO₄²⁻ (resonancia). En H₂SO₄, los 2 S=O son más cortos (1.43 Å) que los 2 S–OH (1.57 Å).",
    },
    vsepr: {
      descripcion: "S central con 4 grupos enlazantes (2 S=O + 2 S–OH), sin pares libres → geometría tetraédrica. Los ángulos O=S=O y O–S–OH son ≈ 109.5° (con ligeras distorsiones por los dobles enlaces).",
      esIonico: false, notacionAXE: "AX₄",
      geometriaElectronica: "Tetraédrica", geometriaMolecular: "Tetraédrica (entorno del S)",
      anguloEnlace: "≈109.5° (O=S=O: 119°; O–S–OH: 101°)", hibridacion: "sp³ (con participación de orbitales d)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.54, momentoDipolar: "2.72 D",
      explicacion: "ΔEN(S–O) = 3.44 − 2.58 = 0.86; ΔEN(O–H) = 1.24. Múltiples grupos polares S=O, S–OH sin cancelación simétrica → μ = 2.72 D. Molécula muy polar, miscible con agua en cualquier proporción.",
    },
    formacion: {
      proceso: "Proceso de contacto (industrial): 1) Combustión de S → SO₂. 2) Oxidación catalítica SO₂ → SO₃ (V₂O₅, 450°C). 3) Absorción en H₂SO₄ → oleum; dilución con agua.",
      ecuacion: "SO₃(g) + H₂O(l) → H₂SO₄(l)  ΔH = −130 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (S–O, O–H)",
      estadosOxidacion: { "H": "+1", "S": "+6", "O": "−2" },
      entalpiaFormacion: "−814.0 kJ/mol",
    },
    reacciones: [
      { nombre: "Primera ionización (ácido fuerte)", ecuacion: "H₂SO₄(aq) → H⁺(aq) + HSO₄⁻(aq)  Ka₁ >> 1", tipo: "ácido-base", descripcion: "Primera ionización completa (ácido fuerte). Segunda: HSO₄⁻ ⇌ H⁺ + SO₄²⁻, Ka₂ = 0.012 (moderada)." },
      { nombre: "Deshidratación de la sacarosa", ecuacion: "C₁₂H₂₂O₁₁ + H₂SO₄(conc.) → 12 C + 11 H₂O  (deshidratación)", tipo: "redox", descripcion: "El H₂SO₄ concentrado es un agente deshidratante poderoso: carboniza la sacarosa. NUNCA añadir agua al ácido." },
      { nombre: "Reacción con Cu (oxidante)", ecuacion: "Cu + 2 H₂SO₄(conc.) → CuSO₄ + SO₂↑ + 2 H₂O", tipo: "redox", descripcion: "El H₂SO₄ concentrado caliente actúa como oxidante, reduciendo S de +6 a +4 (SO₂)." },
      { nombre: "Reacción con NaOH (neutralización)", ecuacion: "H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O", tipo: "neutralización", descripcion: "Neutralización diprótica. En exceso de NaOH puede formar Na₂SO₄; en defecto de NaOH forma NaHSO₄." },
    ],
    educacion: {
      teoriaResumida: "H₂SO₄ es el producto químico industrial más fabricado del mundo (>200 Mt/año). Su peligrosidad triple: ácido fuerte (primera ionización completa), oxidante (S+6), y deshidratante. La disolución en agua es MUY exotérmica — siempre añadir ácido al agua, nunca al revés.",
      erroresComunes: [
        "Añadir agua al ácido concentrado (en vez de ácido al agua) — puede provocar salpicaduras violentas.",
        "Creer que H₂SO₄ es diprótrico fuerte — solo la primera ionización es completa; Ka₂ = 0.012.",
        "Confundir H₂SO₄ (S+6, sulfato) con H₂SO₃ (S+4, sulfito).",
        "Olvidar que el H₂SO₄ concentrado frío pasiviza el Fe y el Al — no los disuelve.",
      ],
      ejerciciosPrincipiante: ["¿Por qué se debe añadir ácido al agua y no al revés?", "¿Qué le ocurre al azúcar si se añade H₂SO₄ concentrado?", "¿Cuál es el uso principal del H₂SO₄ en baterías?"],
      ejerciciosSecundario: ["Calcula el pH de una solución de H₂SO₄ 0.050 M (considera solo Ka₁).", "Ajusta la ecuación redox de Cu + H₂SO₄(conc.) caliente.", "¿Cuántos mL de NaOH 0.20 M se necesitan para neutralizar 10 mL de H₂SO₄ 0.10 M?"],
      ejerciciosUniversitario: ["Calcula el pH de H₂SO₄ 0.050 M considerando ambas ionizaciones (Ka₂ = 0.012).", "Usando el ciclo de Born-Haber, justifica por qué ΔHf° de H₂SO₄ es tan negativa.", "Diseña un experimento para determinar la concentración de H₂SO₄ comercial por titulación con NaOH."],
    },
  },

  // ── Ca(OH)₂ ──────────────────────────────────────────────────────────────
  "Ca(OH)2": {
    formula: "Ca(OH)2", formulaDisplay: "Ca(OH)₂",
    nombre: "Hidróxido de Calcio", familia: "Hidróxido metálico (base)", color: "violet", masaMolar: 74.093,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Hidróxido cálcico",
      stock: "Hidróxido de calcio",
      sistematica: "Dihidróxido de calcio",
      tipo: "Hidróxido metálico (base de Arrhenius)",
      nota: "Nombres triviales: 'cal apagada' o 'cal hidratada' (Ca(OH)₂ en polvo); 'lechada de cal' (suspensión en agua); 'agua de cal' (solución saturada). La cal viva es CaO.",
    },
    lewis: {
      descripcion: "Compuesto iónico: Ca²⁺ + 2 OH⁻. El ión OH⁻ tiene 1 enlace covalente polar O–H y 3 pares libres en O. Ca²⁺ no tiene e⁻ de valencia (configuración del Ar).",
      esIonico: true, electronosValenciaTotal: 8,
      notaResonancia: "El enlace O–H en OH⁻ es covalente polar (ΔEN = 1.24). La carga formal del O en OH⁻ es −1.",
    },
    vsepr: {
      descripcion: "Compuesto iónico: Ca²⁺ coordinado por los O de los OH⁻ en la red cristalina (brucita, capas hexagonales). El ión OH⁻ aislado: geometría lineal (AX₁E₃ en O). VSEPR molecular no aplica.",
      esIonico: true,
      notacionAXE: "N/A (iónico) / OH⁻: AX₁E₃",
      geometriaMolecular: "Red cristalina (brucita, capa hexagonal compacta)",
      hibridacion: "sp³ (O en OH⁻)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico (Ca–O) / Covalente polar (O–H)",
      diferenciaEN: 2.44, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Ca–O) = 3.44 − 1.00 = 2.44 → enlace iónico. Dentro del OH⁻: ΔEN(O–H) = 1.24 → enlace covalente polar. Ca²⁺ cede 2 e⁻ totalmente a los 2 grupos OH⁻.",
    },
    formacion: {
      proceso: "Apagado de la cal viva (CaO) con agua. Reacción muy exotérmica: se usa en calefacción de emergencia y en producción de mortero y yeso.",
      ecuacion: "CaO(s) + H₂O(l) → Ca(OH)₂(s)  ΔH = −65.2 kJ/mol",
      tipoEnlaceFormado: "Iónico (Ca²⁺ + OH⁻) / Covalente polar (O–H)",
      estadosOxidacion: { "Ca": "+2", "O": "−2", "H": "+1" },
      entalpiaFormacion: "−986.1 kJ/mol",
    },
    reacciones: [
      { nombre: "Con CO₂ (test de cal)", ecuacion: "Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s)↓ + H₂O(l)", tipo: "ácido-base", descripcion: "El precipitado blanco de CaCO₃ 'enturbia el agua de cal'. Prueba clásica para detectar CO₂. Con exceso de CO₂ el CaCO₃ vuelve a disolverse." },
      { nombre: "Neutralización con HCl", ecuacion: "Ca(OH)₂(aq) + 2 HCl(aq) → CaCl₂(aq) + 2 H₂O(l)", tipo: "neutralización", descripcion: "Base dibásica: neutraliza 2 moles de ácido monoprótico por mol de Ca(OH)₂." },
      { nombre: "Fraguado del mortero", ecuacion: "Ca(OH)₂(s) + CO₂(g) → CaCO₃(s) + H₂O(g)  (lento, días-semanas)", tipo: "ácido-base", descripcion: "La carbonatación lenta del mortero de cal forma CaCO₃, dando rigidez a la construcción. Proceso usado desde la antigüedad." },
    ],
    educacion: {
      teoriaResumida: "Ca(OH)₂ es una base de Arrhenius moderadamente soluble (1.5 g/L a 25°C). pH solución saturada ≈ 12.4. Se usa ampliamente en construcción (mortero, hormigón), agricultura (corrección de suelos ácidos), tratamiento de aguas (elevación de pH) y producción de lejía (en combinación con NaOH).",
      erroresComunes: [
        "Confundir CaO (cal viva) con Ca(OH)₂ (cal apagada) — son compuestos diferentes.",
        "Creer que Ca(OH)₂ es muy soluble — es moderadamente soluble (Ksp = 5.5×10⁻⁶); forma suspensión (lechada) con exceso.",
        "Olvidar que Ca(OH)₂ es dibásico — neutraliza 2 equivalentes de ácido monoprótico.",
        "Confundir el enturbiamiento del agua de cal con CO₂ solamente — en exceso de CO₂ el precipitado se disuelve.",
      ],
      ejerciciosPrincipiante: ["¿Qué es el 'agua de cal' y cómo se hace?", "¿Por qué se añade cal a los suelos agrícolas ácidos?", "¿Qué gas se detecta con el agua de cal?"],
      ejerciciosSecundario: ["Calcula el pH de una solución saturada de Ca(OH)₂ (Ksp = 5.5×10⁻⁶).", "Escribe las ecuaciones de los dos pasos de ionización del Ca(OH)₂.", "¿Cuántos gramos de Ca(OH)₂ se necesitan para neutralizar 250 mL de HCl 0.10 M?"],
      ejerciciosUniversitario: ["Calcula la solubilidad del Ca(OH)₂ en solución tampón a pH 7 (Ksp = 5.5×10⁻⁶).", "Explica el mecanismo del fraguado del mortero de cal y del cemento Portland.", "Diseña un experimento para determinar Ksp de Ca(OH)₂ por conductimetría."],
    },
  },

  // ── CH₃COOH ──────────────────────────────────────────────────────────────
  "CH3COOH": {
    formula: "CH3COOH", formulaDisplay: "CH₃COOH",
    nombre: "Ácido Acético", familia: "Ácido carboxílico (orgánico)", color: "green", masaMolar: 60.052,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ácido acético",
      stock: "Ácido etanoico",
      sistematica: "Ácido etanoico",
      tipo: "Ácido carboxílico (compuesto orgánico con grupo –COOH)",
      nota: "Para compuestos orgánicos, la nomenclatura IUPAC usa la cadena carbonada: etano (2C) + sufijo -oico (ácido carboxílico). El nombre tradicional 'acético' viene del latín 'acetum' (vinagre).",
    },
    lewis: {
      descripcion: "2 átomos de C: C₁ (metilo, sp³): 4 enlaces simples C–H y C–C. C₂ (carboxilo, sp²): 1 doble enlace C=O, 1 enlace C–OH, 1 enlace C–C. El H del grupo –OH es el hidrógeno ácido (el que se ioniza).",
      esIonico: false, electronosValenciaTotal: 32,
      atomoCentral: "C₂ (carboxilo)", paresLibresCentral: 0, enlacesSimples: 5, enlacesDobles: 1, enlacesTriples: 0,
      notaResonancia: "El ión acetato (CH₃COO⁻) presenta resonancia: los dos enlaces C–O son equivalentes (longitud ≈ 1.25 Å, entre C–O simple 1.34 Å y C=O doble 1.21 Å).",
    },
    vsepr: {
      descripcion: "C metilo (sp³): AX₄, tetraédrico (109.5°). C carboxilo (sp²): AX₃, plano trigonal (≈120°). O del C=O: AX₁E₂. O del C–OH: AX₂E₂, angular.",
      esIonico: false, notacionAXE: "C metilo: AX₄ / C carboxilo: AX₃",
      geometriaElectronica: "C metilo: tetraédrica / C carboxilo: trigonal plana",
      geometriaMolecular: "C metilo: tetraédrico / C carboxilo: plano trigonal",
      anguloEnlace: "C metilo: 109.5° / C carboxilo: ≈120°", hibridacion: "C metilo: sp³ / C carboxilo: sp²",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.24, momentoDipolar: "1.74 D",
      explicacion: "Grupo carboxilo –COOH: C=O (ΔEN = 0.89) y O–H (ΔEN = 1.24) son muy polares. La molécula no es simétrica → μ = 1.74 D. La polaridad facilita la formación de puentes H intermoleculares y la ionización del H ácido.",
    },
    formacion: {
      proceso: "Natural: fermentación acética del etanol por bacterias Acetobacter. Industrial: proceso Monsanto (carbonilación del metanol con CO y catalizador de Rh).",
      ecuacion: "CH₃CH₂OH + O₂ → CH₃COOH + H₂O  (fermentación acética, Acetobacter)",
      tipoEnlaceFormado: "Covalente (C–C, C=O, C–OH, C–H)",
      estadosOxidacion: { "C₁ (metilo)": "−3", "C₂ (carboxilo)": "+3", "O": "−2", "H": "+1" },
      entalpiaFormacion: "−484.3 kJ/mol",
    },
    reacciones: [
      { nombre: "Ionización (ácido débil)", ecuacion: "CH₃COOH(aq) ⇌ CH₃COO⁻(aq) + H⁺(aq)  Ka = 1.8×10⁻⁵  pKa = 4.74", tipo: "ácido-base", descripcion: "Ácido débil: solo ∼1% ionizado en solución 0.1 M. El ión acetato es la base conjugada fuerte. Base del tampón acetato (pH 3.7–5.7)." },
      { nombre: "Esterificación de Fischer", ecuacion: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O  (H⁺ cat.)", tipo: "síntesis", descripcion: "Reacción reversible para formar acetato de etilo (aroma a frutas). Se favorece con exceso de alcohol o extrayendo el agua." },
      { nombre: "Neutralización con NaOH", ecuacion: "CH₃COOH + NaOH → CH₃COONa + H₂O", tipo: "neutralización", descripcion: "Forma acetato de sodio (CH₃COONa). La solución resultante es básica (pH > 7) por hidrólisis del acetato." },
    ],
    educacion: {
      teoriaResumida: "CH₃COOH es el ácido orgánico más estudiado en la escuela. Es un ácido débil (Ka = 1.8×10⁻⁵) porque el enlace O–H en el grupo carboxilo se ioniza parcialmente. La resonancia del acetato (CH₃COO⁻) estabiliza la base conjugada, que es por qué Ka > Ka(alcoholes). El vinagre contiene 4–8% de ácido acético.",
      erroresComunes: [
        "Confundir ácido débil con ácido diluido — la 'debilidad' es el grado de ionización (Ka), no la concentración.",
        "Creer que todos los H de CH₃COOH son ácidos — solo el H del grupo –COOH es ácido (pKa = 4.74); los del –CH₃ no son ácidos (pKa ≈ 50).",
        "Olvidar que la solución de CH₃COONa es BÁSICA (no neutra) por hidrólisis del acetato.",
        "Confundir la fórmula CH₃COOH con CH₃CHO (acetaldehído) — son compuestos muy diferentes.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el vinagre es ácido?", "¿Qué diferencia hay entre ácido fuerte y ácido débil?", "¿De qué está hecho el vinagre?"],
      ejerciciosSecundario: ["Calcula el pH de CH₃COOH 0.10 M (Ka = 1.8×10⁻⁵).", "¿Qué pH tiene la solución al mezclar volúmenes iguales de CH₃COOH 0.10 M y NaOH 0.05 M?", "Dibuja la estructura del ión acetato y explica la resonancia."],
      ejerciciosUniversitario: ["Calcula el grado de ionización y pH de CH₃COOH 0.010 M.", "Diseña un tampón acetato de pH 4.74 usando CH₃COOH y CH₃COONa.", "Usando ΔGf°, calcula Ka de CH₃COOH y compara con el valor experimental."],
    },
  },

  // ── MgS ──────────────────────────────────────────────────────────────────
  "MgS": {
    formula: "MgS", formulaDisplay: "MgS",
    nombre: "Sulfuro de Magnesio", familia: "Sal haloidea (sulfuro metálico)", color: "slate", masaMolar: 56.371,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Sulfuro de magnesio",
      stock: "Sulfuro de magnesio(II)",
      sistematica: "Monosulfuro de magnesio",
      tipo: "Sulfuro metálico (sal iónica del H₂S)",
      nota: "Mg siempre tiene estado de oxidación +2. La IUPAC acepta tanto 'sulfuro de magnesio' como 'sulfuro de magnesio(II)'. El nombre sistemático 'monosulfuro' es redundante pero correcto.",
    },
    lewis: {
      descripcion: "Enlace iónico: Mg cede 2 electrones a S. Mg²⁺ queda con configuración del Ne. S²⁻ queda con 8 e⁻ de valencia (configuración del Ar): 4 pares libres. No aplica estructura Lewis covalente.",
      esIonico: true, electronosValenciaTotal: 8,
      notaResonancia: "MgS forma red cristalina de tipo NaCl (estructura tipo sal de roca): Mg²⁺ rodeado de 6 S²⁻ y viceversa. Parámetro de red: a = 5.20 Å.",
    },
    vsepr: {
      descripcion: "Compuesto iónico con estructura de tipo NaCl (Fm3̄m). Número de coordinación = 6. VSEPR molecular no aplica. Energía reticular: −3238 kJ/mol (muy alta, explicando su alto punto de fusión: >2000°C).",
      esIonico: true,
      notacionAXE: "N/A (iónico)",
      geometriaMolecular: "Red cristalina cúbica (tipo NaCl, Fm3̄m)",
      hibridacion: "N/A",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico con carácter covalente parcial",
      diferenciaEN: 1.27, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Mg–S) = 2.58 − 1.31 = 1.27. En el límite iónico/covalente (ΔEN > 1.7 generalmente indica iónico; MgS es borderline). Se comporta como iónico en sólido pero con algo de carácter covalente (regla de Fajans: Mg²⁺ tiene carga alta y radio pequeño → puede distorsionar a S²⁻).",
    },
    formacion: {
      proceso: "Reacción directa de Mg con S elemental. El Mg tiene una gran afinidad por el S (y por el O). Se forma también en la reducción de MgO con H₂S.",
      ecuacion: "Mg(s) + S(s) → MgS(s)  ΔHf° = −346.0 kJ/mol",
      tipoEnlaceFormado: "Iónico (Mg²⁺ + S²⁻)",
      estadosOxidacion: { "Mg": "+2", "S": "−2" },
      entalpiaFormacion: "−346.0 kJ/mol",
    },
    reacciones: [
      { nombre: "Hidrólisis con agua", ecuacion: "MgS(s) + 2 H₂O(l) → Mg(OH)₂(s) + H₂S(g)↑", tipo: "ácido-base", descripcion: "El S²⁻ es la base conjugada del ácido muy débil H₂S (pKa₁ = 7.0). Reacciona lentamente con el agua produciendo H₂S (olor a huevo podrido)." },
      { nombre: "Reacción con ácido clorhídrico", ecuacion: "MgS(s) + 2 HCl(aq) → MgCl₂(aq) + H₂S(g)↑", tipo: "ácido-base", descripcion: "El ácido desplaza al H₂S (ácido más débil). Reacción rápida con ácidos fuertes." },
      { nombre: "Combustión en aire", ecuacion: "2 MgS(s) + 3 O₂(g) → 2 MgO(s) + 2 SO₂(g)  (alta T)", tipo: "redox", descripcion: "A alta temperatura, el MgS se oxida a MgO (S −2 → S +4 en SO₂). Importante en la pirometalurgia del magnesio." },
    ],
    educacion: {
      teoriaResumida: "MgS es un sulfuro iónico con propiedades que ilustran las reglas de Fajans y el carácter polarizante de los cationes pequeños de alta carga. Su ΔEN (1.27) está en el límite iónico-covalente. Es un semiconductor de brecha amplia (Eg ≈ 4.9 eV) con potenciales aplicaciones en electrónica. Reacciona con agua y ácidos, liberando H₂S.",
      erroresComunes: [
        "Creer que ΔEN = 1.27 implica un enlace covalente — MgS se comporta como iónico en sólido (energía reticular alta).",
        "Confundir el estado de oxidación del S en MgS (−2) con el de H₂S (−2) vs. SO₂ (+4) — el signo negativo en MgS indica que S ganó electrones.",
        "Olvidar que MgS se hidroliza lentamente con agua — no es estable en solución acuosa.",
        "Confundir sulfuro (S²⁻) con sulfato (SO₄²⁻) o sulfito (SO₃²⁻) — son aniones completamente diferentes.",
      ],
      ejerciciosPrincipiante: ["¿Qué tipo de enlace tiene el MgS?", "¿Qué gas se desprende al poner MgS en ácido clorhídrico?", "¿Cuál es el estado de oxidación del Mg en el MgS?"],
      ejerciciosSecundario: ["Escribe la configuración electrónica de Mg²⁺ y S²⁻ y compáralas con gases nobles.", "Calcula la masa de MgS que se disuelve en 100 mL de HCl 0.50 M.", "¿Por qué el MgS tiene un punto de fusión muy alto (>2000°C)?"],
      ejerciciosUniversitario: ["Usando las reglas de Fajans, predice si MgS tiene más o menos carácter covalente que NaCl. Justifica.", "Calcula la energía reticular del MgS usando el ciclo de Born-Haber.", "Explica por qué MgS puede funcionar como semiconductor comparado con MgO."],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Formula normalization — handles Unicode subscripts and common aliases
// ─────────────────────────────────────────────────────────────────────────────
const ALIASES: Record<string, string> = {
  "h2o": "H2O", "co2": "CO2", "nh3": "NH3", "ch4": "CH4",
  "nacl": "NaCl", "hcl": "HCl", "hno3": "HNO3", "h2so4": "H2SO4",
  "ca(oh)2": "Ca(OH)2", "caoh2": "Ca(OH)2", "ca(oh)₂": "Ca(OH)2",
  "ch3cooh": "CH3COOH", "ch3co2h": "CH3COOH", "acoh": "CH3COOH",
  "mgs": "MgS",
};

function desubscript(s: string): string {
  return s.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (c) => String("₀₁₂₃₄₅₆₇₈₉".indexOf(c)));
}

export function normalizeFormula(input: string): string {
  const ascii = desubscript(input.trim());
  if (PERFILES[ascii]) return ascii;
  const key = ascii.toLowerCase().replace(/\s/g, "");
  return ALIASES[key] ?? ascii;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export const MVP_COMPOUNDS = Object.keys(PERFILES);

export function generarPerfil(formula: string): PerfilUniversal | null {
  const key = normalizeFormula(formula);
  const perfil = PERFILES[key];
  if (!perfil) return null;
  return {
    ...perfil,
    lewis: { ...perfil.lewis, lewissvg: LEWIS_SVG[key] },
  };
}
