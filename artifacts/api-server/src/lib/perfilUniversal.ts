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

export interface PerfilPropiedades {
  estadoFisico: string;
  color: string;
  olor: string;
  puntoFusion: string;
  puntoEbullicion: string;
  densidad: string;
  solubilidadAgua: string;
  propiedadesQuimicas: string[];
}

export interface PerfilAplicaciones {
  industrial: string[];
  cotidiano: string[];
  biologico: string[];
  importanciaAmbiental: string;
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
  propiedades: PerfilPropiedades;
  aplicaciones: PerfilAplicaciones;
}

// ─────────────────────────────────────────────────────────────────────────────
// MVP compound data
// ─────────────────────────────────────────────────────────────────────────────

type PerfilBase = Omit<PerfilUniversal, 'propiedades' | 'aplicaciones'>;
const PERFILES: Record<string, PerfilBase> = {

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

  // ── NaOH ─────────────────────────────────────────────────────────────────
  "NaOH": {
    formula: "NaOH", formulaDisplay: "NaOH",
    nombre: "Hidróxido de Sodio", familia: "Hidróxido metálico (base fuerte)", color: "blue", masaMolar: 39.997,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Hidróxido sódico",
      stock: "Hidróxido de sodio",
      sistematica: "Hidróxido de sodio",
      tipo: "Hidróxido metálico (base de Arrhenius fuerte)",
      nota: "Nombres triviales: 'sosa cáustica' o 'lejía sólida'. Na tiene estado de oxidación +1 (no requiere número romano). Es una de las bases más importantes en la industria química.",
    },
    lewis: {
      descripcion: "Compuesto iónico: Na⁺ + OH⁻. Na cede 1 e⁻ (IE₁ = 496 kJ/mol), quedando con configuración del Ne. OH⁻ tiene 1 enlace covalente O–H y 3 pares libres en O. La carga formal del O en OH⁻ es −1.",
      esIonico: true, electronosValenciaTotal: 8,
      notaResonancia: "Estructura cristalina de NaOH: capas con Na⁺ coordinado por 6 O y los grupos OH⁻ orientados perpendicularmente a las capas.",
    },
    vsepr: {
      descripcion: "Compuesto iónico: Na⁺ y OH⁻ forman una red cristalina ortorrómbica. El ión OH⁻ aislado tiene geometría lineal (AX₁E₃ en O). VSEPR molecular no aplica al sólido iónico.",
      esIonico: true, notacionAXE: "N/A (iónico) / OH⁻: AX₁E₃",
      geometriaMolecular: "Red cristalina ortorrómbica",
      hibridacion: "sp³ (O en OH⁻)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico (Na–O) / Covalente polar (O–H)",
      diferenciaEN: 2.51, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Na–O) = 3.44 − 0.93 = 2.51 → enlace iónico puro. Na transfiere completamente 1 e⁻ al grupo OH⁻. El enlace O–H interno del OH⁻ es covalente polar (ΔEN = 1.24).",
    },
    formacion: {
      proceso: "Electrólisis de salmuera (proceso cloroálcali): oxidación del Cl⁻ en el ánodo, reducción del H₂O en el cátodo, Na⁺ migra y se combina con OH⁻.",
      ecuacion: "2 NaCl(aq) + 2 H₂O(l) → 2 NaOH(aq) + Cl₂(g) + H₂(g)  (electrólisis)",
      tipoEnlaceFormado: "Iónico (Na⁺ + OH⁻)",
      estadosOxidacion: { "Na": "+1", "O": "−2", "H": "+1" },
      entalpiaFormacion: "−425.8 kJ/mol",
    },
    reacciones: [
      { nombre: "Neutralización con ácido fuerte", ecuacion: "NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l)  ΔH = −57.3 kJ/mol", tipo: "neutralización", descripcion: "Base fuerte + ácido fuerte → sal neutra. Reacción cuantitativa usada en titulaciones. La solución resultante tiene pH = 7." },
      { nombre: "Saponificación", ecuacion: "RCOO–C₃H₇ + 3 NaOH → RCOONa + C₃H₇(OH)  (calor)", tipo: "síntesis", descripcion: "Hidrólisis básica de triglicéridos para producir jabón (sal sódica de ácido graso) y glicerol. Base de la industria del jabón." },
      { nombre: "Reacción con CO₂", ecuacion: "2 NaOH(aq) + CO₂(g) → Na₂CO₃(aq) + H₂O(l)", tipo: "ácido-base", descripcion: "Absorbe CO₂ del aire formando carbonato sódico. Por eso el NaOH sólido se 'carbonata' en contacto con el aire." },
      { nombre: "Reacción con Al (anfotérico)", ecuacion: "2 Al(s) + 2 NaOH(aq) + 2 H₂O(l) → 2 NaAlO₂(aq) + 3 H₂(g)↑", tipo: "redox", descripcion: "El Al es anfotérico: reacciona tanto con ácidos como con bases fuertes. Produce aluminato sódico e H₂ gaseoso." },
    ],
    educacion: {
      teoriaResumida: "NaOH es una base de Arrhenius fuerte: se disocia completamente en agua → Na⁺ + OH⁻. pH de 1M NaOH = 14. Es corrosivo: hidroliza proteínas y lípidos (grasa de la piel). Se produce mundialmente ∼70 Mt/año por el proceso cloroálcali. Su gran utilidad en la industria química hace que se lo conozca como la 'reina de las bases'.",
      erroresComunes: [
        "Confundir NaOH (base fuerte) con NH₃ (base débil) — NaOH se disocia completamente.",
        "Olvidar que NaOH(s) absorbe humedad (higroscópico) y CO₂ del aire — almacenar sellado.",
        "Calcular mal la concentración: NaOH sólido tiene masa molar 40 g/mol (no 39 ni 41).",
        "Creer que la solución de NaOH es neutra — pH de 1M NaOH = 14, altamente básico.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el NaOH se llama 'sosa cáustica'?", "¿Qué le ocurre a una grasa en contacto con NaOH?", "¿El NaOH se ioniza completa o parcialmente en agua?"],
      ejerciciosSecundario: ["Calcula el pH de NaOH 0.050 M.", "Determina el volumen de NaOH 0.10 M necesario para neutralizar 25 mL de H₂SO₄ 0.10 M.", "Escribe la ecuación de saponificación de la estearina (triestearato de glicerilo) con NaOH."],
      ejerciciosUniversitario: ["Calcula el ΔH de disolución de NaOH en agua usando las entalpías de hidratación de Na⁺ y OH⁻.", "Diseña una titulación potenciométrica para determinar la concentración de NaOH con HCl patrón.", "Explica por qué la lejía (NaOH + NaClO) es un limpiador eficaz usando la teoría ácido-base de Lewis."],
    },
  },

  // ── KOH ──────────────────────────────────────────────────────────────────
  "KOH": {
    formula: "KOH", formulaDisplay: "KOH",
    nombre: "Hidróxido de Potasio", familia: "Hidróxido metálico (base fuerte)", color: "violet", masaMolar: 56.105,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Hidróxido potásico",
      stock: "Hidróxido de potasio",
      sistematica: "Hidróxido de potasio",
      tipo: "Hidróxido metálico (base de Arrhenius fuerte)",
      nota: "Nombre trivial: 'potasa cáustica'. K tiene estado de oxidación +1 (no requiere número romano). Muy similar al NaOH pero con mayor solubilidad en alcoholes.",
    },
    lewis: {
      descripcion: "Compuesto iónico: K⁺ + OH⁻. K cede 1 e⁻ (IE₁ = 419 kJ/mol, menor que Na), quedando con configuración del Ar. OH⁻ tiene 1 enlace covalente O–H y 3 pares libres en O.",
      esIonico: true, electronosValenciaTotal: 8,
      notaResonancia: "KOH cristaliza en estructura tipo NaCl (cúbica). Radio iónico de K⁺ (138 pm) es mayor que Na⁺ (102 pm), lo que le da mayor solubilidad.",
    },
    vsepr: {
      descripcion: "Compuesto iónico con red cristalina cúbica tipo NaCl. El ión OH⁻ aislado tiene geometría lineal. VSEPR no aplica al sólido. A alta temperatura forma gas diatómico KOH con geometría angular.",
      esIonico: true, notacionAXE: "N/A (iónico)",
      geometriaMolecular: "Red cristalina cúbica (tipo NaCl)",
      hibridacion: "sp³ (O en OH⁻)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico (K–O) / Covalente polar (O–H)",
      diferenciaEN: 2.62, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(K–O) = 3.44 − 0.82 = 2.62 → enlace fuertemente iónico. K es uno de los metales más electropositivos. El OH⁻ interno tiene enlace O–H covalente polar (ΔEN = 1.24).",
    },
    formacion: {
      proceso: "Electrólisis de solución de KCl (proceso cloroálcali con cloruro de potasio). También por reacción de K₂O con agua o K metálico con agua.",
      ecuacion: "2 KCl(aq) + 2 H₂O(l) → 2 KOH(aq) + Cl₂(g) + H₂(g)  (electrólisis)",
      tipoEnlaceFormado: "Iónico (K⁺ + OH⁻)",
      estadosOxidacion: { "K": "+1", "O": "−2", "H": "+1" },
      entalpiaFormacion: "−424.8 kJ/mol",
    },
    reacciones: [
      { nombre: "Neutralización con HNO₃", ecuacion: "KOH(aq) + HNO₃(aq) → KNO₃(aq) + H₂O(l)", tipo: "neutralización", descripcion: "Produce nitrato de potasio (salitre), componente de fertilizantes y pólvora negra." },
      { nombre: "Reacción con CO₂", ecuacion: "2 KOH(aq) + CO₂(g) → K₂CO₃(aq) + H₂O(l)", tipo: "ácido-base", descripcion: "Forma carbonato de potasio (K₂CO₃). El KOH es un absorbente eficaz de CO₂ en laboratorio." },
      { nombre: "Saponificación en jabones de potasio", ecuacion: "RCOO–C₃H₇ + 3 KOH → RCOOK + C₃H₇(OH)  (calor)", tipo: "síntesis", descripcion: "El KOH produce jabones blandos (jabones de potasio) más solubles en agua que los de sodio. Usados en jabones líquidos." },
    ],
    educacion: {
      teoriaResumida: "KOH es una base fuerte muy similar al NaOH. Se prefiere en aplicaciones donde se necesita una base soluble en alcoholes (saponificación, electrólitos alcalinos). Las baterías alcalinas usan KOH como electrolito porque su conductividad iónica es mayor que la de NaOH a igual concentración, gracias al mayor radio y mobilidad del K⁺.",
      erroresComunes: [
        "Confundir KOH (base fuerte) con K₂CO₃ (base moderada) — son diferentes productos.",
        "Olvidar que K metálico reacciona explosivamente con agua: 2K + 2H₂O → 2KOH + H₂.",
        "Creer que KOH y NaOH son intercambiables en todos los usos — KOH es preferible en baterías y jabones líquidos.",
        "Confundir potasio (K) con sodio (Na) en las fórmulas — son metales alcalinos del grupo 1 pero con propiedades distintas.",
      ],
      ejerciciosPrincipiante: ["¿En qué se parece el KOH al NaOH?", "¿Por qué las baterías alcalinas usan KOH?", "¿Qué diferencia hay entre el jabón de sodio y el de potasio?"],
      ejerciciosSecundario: ["Calcula el pH de KOH 0.020 M.", "¿Cuántos gramos de KOH se necesitan para preparar 500 mL de solución 0.10 M?", "Escribe la ecuación de la reacción de K metálico con agua."],
      ejerciciosUniversitario: ["Compara la movilidad iónica de K⁺ y Na⁺ en solución acuosa y explica por qué KOH es preferido como electrolito.", "Calcula el ΔH de neutralización de KOH con HCl y compara con NaOH + HCl.", "Diseña un experimento para determinar la pureza de una muestra de KOH comercial por titulación."],
    },
  },

  // ── Mg(OH)₂ ──────────────────────────────────────────────────────────────
  "Mg(OH)2": {
    formula: "Mg(OH)2", formulaDisplay: "Mg(OH)₂",
    nombre: "Hidróxido de Magnesio", familia: "Hidróxido metálico (base débil por insolubilidad)", color: "emerald", masaMolar: 58.320,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Hidróxido magnésico",
      stock: "Hidróxido de magnesio(II)",
      sistematica: "Dihidróxido de magnesio",
      tipo: "Hidróxido metálico dibásico (base de Arrhenius poco soluble)",
      nota: "Nombre trivial: 'leche de magnesia' (suspensión en agua). Mg tiene estado de oxidación +2. Actúa como base débil por su muy baja solubilidad (Ksp = 5.61×10⁻¹²), no por ionización parcial.",
    },
    lewis: {
      descripcion: "Compuesto iónico: Mg²⁺ + 2 OH⁻. Mg cede 2 e⁻, quedando con configuración del Ne. Cada OH⁻ tiene enlace covalente O–H y 3 pares libres en O.",
      esIonico: true, electronosValenciaTotal: 8,
      notaResonancia: "Estructura cristalina de brucita (tipo Ca(OH)₂): capas de Mg²⁺ coordinados octaédricamente por 6 O de los grupos OH⁻.",
    },
    vsepr: {
      descripcion: "Compuesto iónico con estructura de brucita (hexagonal, P3̄m1). Mg²⁺ con coordinación octaédrica (6 OH⁻). Los grupos OH⁻ apuntan perpendiculares a las capas. VSEPR no aplica al sólido.",
      esIonico: true, notacionAXE: "N/A (iónico)",
      geometriaMolecular: "Red cristalina hexagonal (brucita)",
      hibridacion: "N/A",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico (Mg–O) / Covalente polar (O–H)",
      diferenciaEN: 2.44, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Mg–O) = 3.44 − 1.31 = 2.13 → enlace iónico. Mg²⁺ (carga +2, radio pequeño: 72 pm) tiene alto poder polarizante pero la diferencia de EN sigue siendo suficiente para clasificarlo como iónico.",
    },
    formacion: {
      proceso: "Reacción del óxido de magnesio con agua. También precipita al añadir una base a una solución de sal de Mg²⁺.",
      ecuacion: "MgO(s) + H₂O(l) → Mg(OH)₂(s)  ΔH = −37 kJ/mol",
      tipoEnlaceFormado: "Iónico (Mg²⁺ + OH⁻)",
      estadosOxidacion: { "Mg": "+2", "O": "−2", "H": "+1" },
      entalpiaFormacion: "−924.5 kJ/mol",
    },
    reacciones: [
      { nombre: "Disolución / ionización", ecuacion: "Mg(OH)₂(s) ⇌ Mg²⁺(aq) + 2 OH⁻(aq)  Ksp = 5.61×10⁻¹²", tipo: "ácido-base", descripcion: "Muy poco soluble: solo ∼9 mg/L se disuelven a 25°C. pH de la solución saturada ≈ 10.5. Actúa como base tamponante." },
      { nombre: "Neutralización con HCl", ecuacion: "Mg(OH)₂(s) + 2 HCl(aq) → MgCl₂(aq) + 2 H₂O(l)", tipo: "neutralización", descripcion: "Neutralización completa con ácido fuerte. Base de los antiácidos estomacales (leche de magnesia): neutraliza el HCl gástrico sin sobrecarga de Na⁺." },
      { nombre: "Descomposición térmica", ecuacion: "Mg(OH)₂(s) → MgO(s) + H₂O(g)  (>350°C)", tipo: "descomposición", descripcion: "Deshidratación térmica. El MgO obtenido absorbe calor (ignifugante): usado como retardante de llamas en materiales de construcción." },
    ],
    educacion: {
      teoriaResumida: "Mg(OH)₂ es el componente activo de la 'leche de magnesia' (antiácido). Actúa como base débil por ser poco soluble, no porque se ionice parcialmente como el NH₃. Su baja toxicidad, mecanismo tamponante (no eleva el pH gástrico excesivamente) y efecto laxante suave lo hacen ideal como antiácido. El MgO se usa industrialmente como refractario (p.f. >2800°C).",
      erroresComunes: [
        "Confundir la 'debilidad' de Mg(OH)₂ (baja solubilidad) con la de NH₃ (ionización parcial) — mecanismos diferentes.",
        "Creer que Mg(OH)₂ y Ca(OH)₂ son igualmente solubles — Ca(OH)₂ es ∼100× más soluble.",
        "Olvidar que Mg(OH)₂ es dibásico — consume 2 moles de ácido por mol de base.",
        "Confundir Mg(OH)₂ (blanco, insoluble) con MgCl₂ (sal soluble, usada como coagulante).",
      ],
      ejerciciosPrincipiante: ["¿Por qué la leche de magnesia ayuda con la acidez?", "¿Mg(OH)₂ es base fuerte o débil?", "¿Qué gas se libera al calentar fuertemente Mg(OH)₂?"],
      ejerciciosSecundario: ["Calcula el pH de la solución saturada de Mg(OH)₂ (Ksp = 5.61×10⁻¹²).", "¿Cuántos mL de HCl 0.10 M neutraliza 1.00 g de Mg(OH)₂?", "Compara la solubilidad de Mg(OH)₂ y Ca(OH)₂ usando sus respectivos Ksp."],
      ejerciciosUniversitario: ["Calcula la solubilidad de Mg(OH)₂ a pH = 8 (solución amortiguada) y compárala con la del agua pura.", "Explica por qué el Mg(OH)₂ es un buen retardante de llamas usando datos termodinámicos.", "Calcula la concentración de Mg²⁺ en una solución de NaOH 0.010 M (efecto del ion común)."],
    },
  },

  // ── H₃PO₄ ────────────────────────────────────────────────────────────────
  "H3PO4": {
    formula: "H3PO4", formulaDisplay: "H₃PO₄",
    nombre: "Ácido Fosfórico", familia: "Oxoácido (ácido ternario triprótido)", color: "red", masaMolar: 97.994,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ácido fosfórico",
      stock: "Tetraoxofosfato(V) de trihidrógeno",
      sistematica: "Ácido tetraoxofosfórico(V)",
      tipo: "Oxoácido triprótido de P en estado +5",
      nota: "P en estado +5 (máximo). El ácido fosfórico es el H₃PO₄; el 'metafosfórico' es HPO₃ (P también en +5). El 'ácido fosfónico' H₃PO₃ tiene P en +3.",
    },
    lewis: {
      descripcion: "P central con 5 e⁻ de valencia. Forma 1 doble enlace P=O y 3 enlaces P–OH. Sin pares libres en P (puede expandir el octeto con orbitales 3d). Total: 32 e⁻ de valencia.",
      esIonico: false, electronosValenciaTotal: 32,
      atomoCentral: "P", paresLibresCentral: 0, enlacesSimples: 3, enlacesDobles: 1, enlacesTriples: 0,
      notaResonancia: "En el ión fosfato PO₄³⁻, los 4 enlaces P–O son equivalentes (resonancia). En H₃PO₄, el enlace P=O es más corto (1.50 Å) que los P–OH (1.57 Å).",
    },
    vsepr: {
      descripcion: "P central con 4 grupos de electrones (1 P=O + 3 P–OH), sin pares libres → geometría tetraédrica. Similar al H₂SO₄ pero con un grupo –OH más y el átomo central es P.",
      esIonico: false, notacionAXE: "AX₄",
      geometriaElectronica: "Tetraédrica", geometriaMolecular: "Tetraédrica (entorno del P)",
      anguloEnlace: "≈109.5° (O=P–O: 115.8°; HO–P–OH: 102.0°)", hibridacion: "sp³",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.24, momentoDipolar: "≈2.7 D",
      explicacion: "ΔEN(O–H) = 1.24; ΔEN(P–O) = 3.44 − 2.19 = 1.25. Múltiples grupos polares sin cancelación simétrica → μ ≈ 2.7 D. La molécula es muy polar y miscible con agua en todas proporciones.",
    },
    formacion: {
      proceso: "Industrial: reacción de P₄O₁₀ con agua (proceso seco) o ataque de roca fosfórica (Ca₃(PO₄)₂) con H₂SO₄ (proceso húmedo, ∼90% de la producción mundial).",
      ecuacion: "P₄O₁₀(s) + 6 H₂O(l) → 4 H₃PO₄(l)  ΔH = −178 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (P–O, P=O, O–H)",
      estadosOxidacion: { "H": "+1", "P": "+5", "O": "−2" },
      entalpiaFormacion: "−1284.4 kJ/mol",
    },
    reacciones: [
      { nombre: "Primera ionización (ácido débil)", ecuacion: "H₃PO₄(aq) ⇌ H⁺ + H₂PO₄⁻  pKa₁ = 2.15", tipo: "ácido-base", descripcion: "Primera ionización moderada. H₃PO₄ es un ácido débil en la primera ionización (a diferencia de H₂SO₄). Predomina en soluciones muy ácidas." },
      { nombre: "Segunda y tercera ionización", ecuacion: "H₂PO₄⁻ ⇌ H⁺ + HPO₄²⁻  pKa₂ = 7.20\nHPO₄²⁻ ⇌ H⁺ + PO₄³⁻  pKa₃ = 12.35", tipo: "ácido-base", descripcion: "Los tres pKa permiten tampones en rangos muy diferentes. Los fosfatos son tamponantes fisiológicos esenciales (sangre: tampón H₂PO₄⁻/HPO₄²⁻ en pH 7.4)." },
      { nombre: "Neutralización total con Ca(OH)₂", ecuacion: "2 H₃PO₄ + 3 Ca(OH)₂ → Ca₃(PO₄)₂↓ + 6 H₂O", tipo: "neutralización", descripcion: "Produce fosfato de calcio insoluble, componente principal del esmalte dental y los huesos." },
      { nombre: "Reacción con NaOH (selectiva)", ecuacion: "H₃PO₄ + NaOH → NaH₂PO₄ + H₂O  (1:1)\nH₃PO₄ + 2 NaOH → Na₂HPO₄ + 2 H₂O  (1:2)", tipo: "neutralización", descripcion: "Según la relación molar base/ácido, se obtienen fosfato monosódico, disódico o trisódico — aditivos alimentarios." },
    ],
    educacion: {
      teoriaResumida: "H₃PO₄ es el ácido más importante del fósforo. Se produce a razón de ∼45 Mt/año (principalmente para fertilizantes: superfosfato triple). Los tres pKa (2.15, 7.20, 12.35) lo hacen el tampón fisiológico más versátil. El fósforo es esencial para ADN, ARN, ATP y los huesos (como Ca₃(PO₄)₂ e hidroxiapatita).",
      erroresComunes: [
        "Creer que H₃PO₄ es ácido fuerte — es ácido débil (pKa₁ = 2.15); el H₂SO₄ tiene la primera ionización completa.",
        "Confundir los tres estados de protonación: H₃PO₄ (ácido), H₂PO₄⁻ (anfótero), HPO₄²⁻ (anfótero), PO₄³⁻ (base).",
        "Escribir el estado de oxidación del P como +3 — en H₃PO₄ el P tiene +5.",
        "Olvidar que los fosfatos son los tamponantes sanguíneos y celulares más importantes.",
      ],
      ejerciciosPrincipiante: ["¿Por qué los refrescos de cola contienen ácido fosfórico?", "¿Para qué sirven los fosfatos en los fertilizantes?", "¿Cuántos H ácidos tiene el H₃PO₄?"],
      ejerciciosSecundario: ["Calcula el pH de H₃PO₄ 0.10 M (pKa₁ = 2.15, considera solo la primera ionización).", "Dibuja la estructura de Lewis del H₃PO₄ e indica los estados de oxidación.", "¿Qué sale de mezclar H₃PO₄ con exceso de Ca(OH)₂? Escribe la ecuación ajustada."],
      ejerciciosUniversitario: ["Calcula el pH de una solución 0.10 M de Na₂HPO₄ (pKa₂ = 7.20, pKa₃ = 12.35).", "Diseña un tampón fosfato de pH 7.20 con [H₂PO₄⁻] = [HPO₄²⁻] = 0.050 M.", "Explica por qué pKa₂ de H₃PO₄ (7.20) es ideal para tampones fisiológicos."],
    },
  },

  // ── H₂CO₃ ────────────────────────────────────────────────────────────────
  "H2CO3": {
    formula: "H2CO3", formulaDisplay: "H₂CO₃",
    nombre: "Ácido Carbónico", familia: "Oxoácido (ácido ternario diprótido, inestable)", color: "gray", masaMolar: 62.024,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ácido carbónico",
      stock: "Trioxocarbonato(IV) de dihidrógeno",
      sistematica: "Ácido trioxocarbónico(IV)",
      tipo: "Oxoácido diprótido de C en estado +4 (muy inestable en solución)",
      nota: "El H₂CO₃ 'verdadero' existe en pequeñísima proporción (< 0.3%) en agua carbonatada. La mayoría del 'ácido carbónico' es en realidad CO₂ disuelto. El pKa₁ aparente = 6.35 refleja [CO₂(aq)] + [H₂CO₃]; el pKa del H₂CO₃ puro ≈ 3.5.",
    },
    lewis: {
      descripcion: "C central (sp²) con 2 grupos C=O y 2 grupos C–OH. Geometría plana trigonal similar al CO₂ pero con 2 grupos –OH en lugar de un segundo =O. Total: 24 e⁻ de valencia.",
      esIonico: false, electronosValenciaTotal: 24,
      atomoCentral: "C", paresLibresCentral: 0, enlacesSimples: 2, enlacesDobles: 2, enlacesTriples: 0,
      notaResonancia: "El ión carbonato CO₃²⁻ presenta resonancia perfecta (D₃h): 3 enlaces C–O equivalentes (longitud ≈ 1.29 Å). El anión es más estable que el ácido, lo que favorece la ionización.",
    },
    vsepr: {
      descripcion: "C central con 3 grupos de electrones (2 C–OH + 1 C=O) → geometría plana trigonal (≈120°). La molécula es plana. En solución, se descompone rápidamente a CO₂ + H₂O.",
      esIonico: false, notacionAXE: "AX₃",
      geometriaElectronica: "Trigonal plana", geometriaMolecular: "Trigonal plana",
      anguloEnlace: "≈120°", hibridacion: "sp²",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.24, momentoDipolar: "≈2.1 D",
      explicacion: "ΔEN(O–H) = 1.24; ΔEN(C=O) = 0.89. Geometría plana no simétrica → momento dipolar neto ≈ 2.1 D. La molécula es polar pero extremadamente inestable en solución.",
    },
    formacion: {
      proceso: "Disolución de CO₂ en agua, seguida de hidratación (reacción lenta). Solo una fracción muy pequeña del CO₂(aq) se convierte en H₂CO₃ verdadero.",
      ecuacion: "CO₂(g) + H₂O(l) ⇌ H₂CO₃(aq)  K = 1.7×10⁻³ (a 25°C)",
      tipoEnlaceFormado: "Covalente polar (C–O, O–H)",
      estadosOxidacion: { "H": "+1", "C": "+4", "O": "−2" },
      entalpiaFormacion: "−699.65 kJ/mol",
    },
    reacciones: [
      { nombre: "Descomposición (reacción dominante)", ecuacion: "H₂CO₃(aq) → CO₂(g) + H₂O(l)  (muy rápido)", tipo: "descomposición", descripcion: "El H₂CO₃ es muy inestable: se descompone en microsegundos. Al abrir una bebida carbonatada, el CO₂ escapa por esta reacción." },
      { nombre: "Primera ionización (aparente)", ecuacion: "CO₂(aq) + H₂O ⇌ H⁺(aq) + HCO₃⁻(aq)  pKa₁(aparente) = 6.35", tipo: "ácido-base", descripcion: "El pKa₁ aparente incluye [CO₂(aq)] + [H₂CO₃]. Responsable de la acidez del agua de lluvia (pH ≈ 5.6) y del efecto tampón del bicarbonato en la sangre." },
      { nombre: "Segunda ionización", ecuacion: "HCO₃⁻(aq) ⇌ H⁺(aq) + CO₃²⁻(aq)  pKa₂ = 10.33", tipo: "ácido-base", descripcion: "El HCO₃⁻ (bicarbonato) puede ionizarse más. En condiciones normales de pH sanguíneo (7.4), domina el HCO₃⁻." },
      { nombre: "Neutralización con NaOH", ecuacion: "H₂CO₃ + 2 NaOH → Na₂CO₃ + 2 H₂O", tipo: "neutralización", descripcion: "Neutralización completa produce carbonato sódico (sosa). Parcial (1 mol NaOH) produce bicarbonato sódico (bicarbonato de sodio)." },
    ],
    educacion: {
      teoriaResumida: "H₂CO₃ es el ácido del CO₂ en agua y el motor del tampón bicarbonato (H₂CO₃/HCO₃⁻), responsable de mantener el pH sanguíneo en 7.4. El sistema respiratorio lo regula variando la presión de CO₂ (ecuación de Henderson-Hasselbalch). El pKa aparente de 6.35 (no 3.5 del H₂CO₃ puro) refleja que la mayor parte del 'ácido' es CO₂(aq) disuelto.",
      erroresComunes: [
        "Confundir el pKa aparente (6.35, incluye CO₂ disuelto) con el pKa del H₂CO₃ puro (≈3.5).",
        "Creer que el agua de lluvia es neutra — contiene CO₂ disuelto (pH ≈ 5.6) incluso sin contaminación.",
        "Confundir carbonato (CO₃²⁻) con bicarbonato (HCO₃⁻) — son aniones diferentes del mismo ácido.",
        "Pensar que el bicarbonato de sodio es ácido — en solución es ligeramente básico (pH ≈ 8.3).",
      ],
      ejerciciosPrincipiante: ["¿Por qué las bebidas carbonatadas son ácidas?", "¿Qué le ocurre al bicarbonato de sodio en el estómago?", "¿Qué es la lluvia ácida 'natural'?"],
      ejerciciosSecundario: ["Calcula el pH del agua en equilibrio con CO₂ atmosférico ([CO₂] = 1.2×10⁻⁵ M, pKa₁ = 6.35).", "Escribe las ecuaciones de las dos ionizaciones del H₂CO₃ e indica los pKa.", "¿Cuántos mL de HCl 0.10 M reaccionan con 5.0 g de Na₂CO₃?"],
      ejerciciosUniversitario: ["Usando la ecuación de Henderson-Hasselbalch, calcula la relación HCO₃⁻/CO₂(aq) en la sangre (pH = 7.40, pKa₁ = 6.35).", "Explica el mecanismo de compensación respiratoria de la acidosis metabólica.", "Calcula el pH de Na₂CO₃ 0.10 M (pKa₂ = 10.33)."],
    },
  },

  // ── H₂S ──────────────────────────────────────────────────────────────────
  "H2S": {
    formula: "H2S", formulaDisplay: "H₂S",
    nombre: "Sulfuro de Hidrógeno", familia: "Hidrácido (ácido binario)", color: "gray", masaMolar: 34.082,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ácido sulfhídrico (en solución acuosa)",
      stock: "Sulfuro de hidrógeno (gas puro)",
      sistematica: "Sulfuro de dihidrógeno",
      tipo: "Hidrácido (análogo al H₂O pero con S en lugar de O)",
      nota: "Similar nomenclatura al HCl: gas = sulfuro de hidrógeno; solución acuosa = ácido sulfhídrico. Es el análogo con azufre del agua, pero con muy diferentes propiedades (ángulo 92.1° vs 104.5° del H₂O).",
    },
    lewis: {
      descripcion: "S central con 6 e⁻ de valencia. Forma 2 enlaces simples S–H (4 e⁻). Los 8 e⁻ restantes forman 2 pares libres en S. Análogo al H₂O pero S (radio mayor, EN = 2.58) forma enlaces S–H más débiles y largos.",
      esIonico: false, electronosValenciaTotal: 8,
      atomoCentral: "S", paresLibresCentral: 2, enlacesSimples: 2, enlacesDobles: 0, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "Análogo al H₂O: 2 pares enlazantes + 2 pares libres en S → geometría electrónica tetraédrica → geometría molecular angular. Pero el ángulo H–S–H = 92.1° (< 104.5° del H₂O) porque los orbitales 3p del S son más grandes y los pares libres comprimen menos el ángulo.",
      esIonico: false, notacionAXE: "AX₂E₂",
      geometriaElectronica: "Tetraédrica", geometriaMolecular: "Angular (doblada)",
      anguloEnlace: "92.1°", hibridacion: "sp³ (con mayor carácter p que H₂O)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 0.38, momentoDipolar: "0.97 D",
      explicacion: "ΔEN(S–H) = 2.58 − 2.20 = 0.38 (mucho menor que O–H: 1.24). Geometría angular → momento dipolar neto de 0.97 D (mucho menor que H₂O: 1.85 D). H₂S es polar pero mucho menos que H₂O.",
    },
    formacion: {
      proceso: "Natural: descomposición anaerobia de proteínas con azufre (huevos podridos, volcanes, fuentes hidrotermales). Industrial: subproducto del refinado del petróleo (eliminación de azufre por hidrodesulfuración).",
      ecuacion: "H₂(g) + S(s) → H₂S(g)  ΔHf° = −20.6 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (S–H)",
      estadosOxidacion: { "H": "+1", "S": "−2" },
      entalpiaFormacion: "−20.6 kJ/mol",
    },
    reacciones: [
      { nombre: "Ionización en agua (ácido débil)", ecuacion: "H₂S(aq) ⇌ H⁺ + HS⁻  pKa₁ = 7.0\nHS⁻ ⇌ H⁺ + S²⁻  pKa₂ = 17", tipo: "ácido-base", descripcion: "Ácido diprótido débil. El pKa₁ = 7.0 lo hace útil en análisis gravimétrico para precipitar sulfuros metálicos selectivamente." },
      { nombre: "Combustión completa", ecuacion: "2 H₂S(g) + 3 O₂(g) → 2 SO₂(g) + 2 H₂O(g)  ΔH = −1124 kJ", tipo: "combustión", descripcion: "Arde con llama azul. En la industria del petróleo, el H₂S se quema en antorchas o se convierte en azufre elemental (proceso Claus)." },
      { nombre: "Precipitación de sulfuros metálicos", ecuacion: "Pb²⁺(aq) + H₂S(aq) → PbS(s)↓ + 2 H⁺(aq)  (negro)", tipo: "síntesis", descripcion: "El H₂S precipita selectivamente sulfuros metálicos según su Ksp. Usado en análisis cualitativo clásico (Grupo II de cationes)." },
    ],
    educacion: {
      teoriaResumida: "H₂S es el análogo con azufre del agua, pero con propiedades muy diferentes: ángulo más pequeño (92.1°), menor polaridad (μ = 0.97 D vs 1.85 D), menor punto de ebullición (−60°C vs 100°C) — sin puentes H fuertes. Es un gas tóxico (umbral olfativo: 0.005 ppm; mortal >700 ppm). Paradójicamente, el cuerpo humano lo produce en pequeñas cantidades como molécula señalizadora.",
      erroresComunes: [
        "Creer que H₂S tiene el mismo ángulo de enlace que H₂O — 92.1° vs 104.5° (diferencia por el tamaño del S).",
        "Confundir H₂S (gas, ácido débil, tóxico) con H₂SO₄ (líquido, ácido fuerte, corrosivo).",
        "Pensar que H₂S huele a azufre — el azufre elemental es inodoro; el olor a 'huevo podrido' es del H₂S.",
        "Olvidar que H₂S es diprótido: tiene dos pKa (7.0 y 17), no uno solo.",
      ],
      ejerciciosPrincipiante: ["¿A qué huele el H₂S?", "¿Por qué H₂S es más peligroso que CO₂?", "¿Por qué el H₂O hierve a 100°C y el H₂S a −60°C?"],
      ejerciciosSecundario: ["Compara los ángulos de enlace de H₂O (104.5°) y H₂S (92.1°) y justifica la diferencia.", "Calcula el pH de H₂S 0.10 M (pKa₁ = 7.0).", "¿Qué sulfuro precipita primero, CuS (Ksp = 10⁻³⁶) o FeS (Ksp = 10⁻¹⁸), al burbujear H₂S en una solución mixta?"],
      ejerciciosUniversitario: ["Explica usando orbitales moleculares por qué el ángulo H–S–H es casi 90° (casi puro p para los enlaces S–H).", "Calcula [S²⁻] en H₂S 0.10 M a pH = 9 (pKa₁=7.0, pKa₂=17).", "En el proceso Claus, 2 H₂S + SO₂ → 3 S + 2 H₂O. Calcula ΔH° usando ΔHf°."],
    },
  },

  // ── HF ───────────────────────────────────────────────────────────────────
  "HF": {
    formula: "HF", formulaDisplay: "HF",
    nombre: "Fluoruro de Hidrógeno / Ácido Fluorhídrico", familia: "Hidrácido (ácido débil por paradoja del F)", color: "green", masaMolar: 20.006,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ácido fluorhídrico (en solución acuosa)",
      stock: "Fluoruro de hidrógeno (gas puro)",
      sistematica: "Fluoruro de hidrógeno",
      tipo: "Hidrácido (análogo al HCl pero con F; es el único hidrácido débil de los halogenuros)",
      nota: "Paradoja del HF: aunque F es el elemento más electronegativo (EN = 3.98), HF es un ÁCIDO DÉBIL (pKa = 3.17). El enlace H–F es muy fuerte (BDE = 568 kJ/mol vs 432 kJ/mol en H–Cl), lo que dificulta la ionización.",
    },
    lewis: {
      descripcion: "F es el átomo pesado (único átomo no-H). 7 e⁻ de valencia de F + 1 de H = 8 e⁻. 1 enlace simple H–F usa 2 e⁻; los 6 e⁻ restantes forman 3 pares libres en F. Igual estructura que HCl pero F más electronegativo.",
      esIonico: false, electronosValenciaTotal: 8,
      atomoCentral: "F", paresLibresCentral: 3, enlacesSimples: 1, enlacesDobles: 0, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "Molécula diatómica lineal. El entorno de F es AX₁E₃ (como HCl). La longitud de enlace H–F (91.7 pm) es la más corta de todos los halogenuros de hidrógeno, reflejo del radio atómico pequeño del F.",
      esIonico: false, notacionAXE: "AX₁E₃ (en F)",
      geometriaElectronica: "Tetraédrica (entorno de F)", geometriaMolecular: "Lineal (diatómica)",
      anguloEnlace: "N/A", hibridacion: "sp³ (F)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.78, momentoDipolar: "1.91 D",
      explicacion: "ΔEN(H–F) = 3.98 − 2.20 = 1.78 (el mayor de todos los H–X). Molécula diatómica → dipolo directo = μ = 1.91 D, el más alto de todos los halogenuros de hidrógeno. A pesar de ello, el enlace es tan fuerte que HF no ioniza completamente (ácido débil).",
    },
    formacion: {
      proceso: "Reacción de fluorita (CaF₂) con H₂SO₄ concentrado. Proceso industrial principal de producción de HF.",
      ecuacion: "CaF₂(s) + H₂SO₄(conc.) → 2 HF(g) + CaSO₄(s)  ΔH = −58 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (H–F)",
      estadosOxidacion: { "H": "+1", "F": "−1" },
      entalpiaFormacion: "−271.1 kJ/mol",
    },
    reacciones: [
      { nombre: "Ionización (ácido débil)", ecuacion: "HF(aq) ⇌ H⁺(aq) + F⁻(aq)  Ka = 6.8×10⁻⁴  pKa = 3.17", tipo: "ácido-base", descripcion: "HF es el único hidrácido del grupo 17 que es ácido DÉBIL. La fuerza del enlace H–F (568 kJ/mol) impide la ionización completa." },
      { nombre: "Grabado del vidrio (SiO₂)", ecuacion: "SiO₂(s) + 4 HF(aq) → SiF₄(g) + 2 H₂O(l)", tipo: "síntesis", descripcion: "ÚNICO ácido que disuelve el vidrio (SiO₂). Forma SiF₄ gaseoso. Uso: grabado de vidrio, fabricación de semiconductores. MUY PELIGROSO: penetra piel y destruye huesos." },
      { nombre: "Reacción con NaOH", ecuacion: "HF(aq) + NaOH(aq) → NaF(aq) + H₂O(l)", tipo: "neutralización", descripcion: "Produce fluoruro de sodio (NaF), ingrediente del pasta dental para la prevención de caries (remineralización del esmalte)." },
    ],
    educacion: {
      teoriaResumida: "HF es la 'excepción de Pauling': a pesar de que F es el elemento más electronegativo, HF es ácido débil. La razón es la fuerza del enlace H–F (568 kJ/mol), que requiere demasiada energía para romperse. El ácido fluorhídrico es extremadamente peligroso: penetra tejidos, extrae Ca²⁺ de los huesos formando CaF₂ (insoluble), y puede causar hipocalcemia sistémica mortal incluso con pequeñas exposiciones cutáneas.",
      erroresComunes: [
        "Creer que HF es ácido fuerte porque F es el elemento más electronegativo — el pKa = 3.17 indica ácido débil.",
        "Confundir ácido fluorhídrico (HF, corroe vidrio) con ácido fluoroacético (CH₂FCOOH, tóxico diferente).",
        "Pensar que los demás hidrácidos de halógenos (HCl, HBr, HI) son débiles — solo HF es débil.",
        "Olvidar que HF forma puentes de hidrógeno inusualmente fuertes, lo que eleva su punto de ebullición (19.5°C) mucho más de lo esperado.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el HF graba el vidrio pero no el HCl?", "¿Es el HF ácido fuerte o débil?", "¿Para qué sirve el fluoruro en la pasta dental?"],
      ejerciciosSecundario: ["Calcula el pH de HF 0.10 M (pKa = 3.17).", "Compara la fuerza ácida de HF (pKa=3.17) y HCl (pKa≈−7). Explica la tendencia.", "Escribe la ecuación del grabado del vidrio con HF y explica por qué el SiO₂ reacciona."],
      ejerciciosUniversitario: ["Usando energías de enlace, explica cuantitativamente por qué HF es ácido débil y HCl fuerte.", "Calcula la concentración de H⁺ y F⁻ en HF 0.10 M considerando el efecto de la formación del dímero HF₂⁻ (K=3.9).", "Compara los puentes H del HF (entalpía ~29 kJ/mol) con los del H₂O (~21 kJ/mol) y explica la diferencia."],
    },
  },

  // ── SO₂ ──────────────────────────────────────────────────────────────────
  "SO2": {
    formula: "SO2", formulaDisplay: "SO₂",
    nombre: "Dióxido de Azufre", familia: "Óxido no metálico (óxido ácido del S⁴⁺)", color: "orange", masaMolar: 64.065,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Anhídrido sulfuroso",
      stock: "Óxido de azufre(IV)",
      sistematica: "Dióxido de azufre",
      tipo: "Óxido no metálico del azufre en estado +4",
      nota: "Estado de oxidación del S: +4 (no +6 como en SO₃). Anhídrido del ácido sulfuroso (H₂SO₃). No confundir con SO₃ (anhídrido sulfúrico, S en +6).",
    },
    lewis: {
      descripcion: "S central con 6 e⁻ de valencia. Estructura real: resonancia entre 2 formas. Una forma: S con doble enlace S=O, enlace simple S–O (con pares libres) y 1 par libre en S. Total: 18 e⁻ de valencia.",
      esIonico: false, electronosValenciaTotal: 18,
      atomoCentral: "S", paresLibresCentral: 1, enlacesSimples: 0, enlacesDobles: 2, enlacesTriples: 0,
      notaResonancia: "Resonancia: dos estructuras equivalentes con S=O y S–O intercambiados. Los dos enlaces S–O son equivalentes (longitud: 1.432 Å), intermedios entre S–O simple y S=O doble.",
    },
    vsepr: {
      descripcion: "S central con 2 dobles enlaces (o grupos de e⁻ por resonancia) + 1 par libre → AX₂E₁ → geometría electrónica trigonal plana → geometría molecular angular. El par libre comprime el ángulo O=S=O a 119.5°.",
      esIonico: false, notacionAXE: "AX₂E₁",
      geometriaElectronica: "Trigonal plana", geometriaMolecular: "Angular (doblada)",
      anguloEnlace: "119.5°", hibridacion: "sp²",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 0.86, momentoDipolar: "1.63 D",
      explicacion: "ΔEN(S=O) = 3.44 − 2.58 = 0.86. Geometría angular → los dos dipolos S=O no se cancelan (a diferencia del CO₂ lineal) → μ = 1.63 D. El S es el centro de carga positiva (δ⁺), los O son δ⁻.",
    },
    formacion: {
      proceso: "Combustión de azufre o de compuestos con azufre. Subproducto de la tostación de minerales sulfurosos en metalurgia. Principal contaminante de las emisiones industriales y volcánicas.",
      ecuacion: "S(s) + O₂(g) → SO₂(g)  ΔHf° = −296.8 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (S=O)",
      estadosOxidacion: { "S": "+4", "O": "−2" },
      entalpiaFormacion: "−296.8 kJ/mol",
    },
    reacciones: [
      { nombre: "Disolución en agua (ácido sulfuroso)", ecuacion: "SO₂(g) + H₂O(l) ⇌ H₂SO₃(aq) ⇌ H⁺ + HSO₃⁻  pKa₁ = 1.81", tipo: "ácido-base", descripcion: "Forma ácido sulfuroso (H₂SO₃). Principal causa de lluvia ácida junto con NOₓ. Reacción reversible: SO₂ escapa al calentar." },
      { nombre: "Oxidación a SO₃ (proceso de contacto)", ecuacion: "2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)  (V₂O₅, 450°C)  ΔH = −197 kJ", tipo: "síntesis", descripcion: "Paso clave en la producción de H₂SO₄. Reacción reversible y exotérmica — se controla la temperatura para maximizar rendimiento." },
      { nombre: "Reacción con NaOH", ecuacion: "SO₂(g) + 2 NaOH(aq) → Na₂SO₃(aq) + H₂O(l)", tipo: "ácido-base", descripcion: "Produce sulfito de sodio (Na₂SO₃), agente reductor y conservante alimentario (E-221 en la UE)." },
    ],
    educacion: {
      teoriaResumida: "SO₂ es el principal contaminante de la lluvia ácida (junto con NOₓ). Las fuentes volcánicas y la combustión de carbón y petróleo lo emiten en enormes cantidades. Como conservante alimentario (código E-220/E-221), inhibe bacterias y hongos. La geometría angular (119.5°) es clave: hace que SO₂ sea polar (μ=1.63D), a diferencia del CO₂ lineal y apolar.",
      erroresComunes: [
        "Confundir SO₂ (S+4, dióxido) con SO₃ (S+6, trióxido) — diferentes estados de oxidación y propiedades.",
        "Creer que SO₂ es lineal como CO₂ — el par libre en S produce geometría angular (119.5°).",
        "Confundir el ácido sulfuroso (H₂SO₃, de SO₂) con el sulfúrico (H₂SO₄, de SO₃) — son distintos.",
        "Olvidar que SO₂ es el gas de la lluvia ácida, mientras que el COO₂ contribuye a la acidez natural.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el SO₂ causa lluvia ácida?", "¿Cómo se diferencia SO₂ de SO₃?", "¿Por qué los volcanes emiten SO₂?"],
      ejerciciosSecundario: ["Dibuja la estructura de Lewis del SO₂ con resonancia y justifica por qué es angular.", "Calcula el pH del agua de lluvia si [SO₂] disuelto = 1.0×10⁻⁴ M (pKa₁ = 1.81).", "Compara la polaridad de SO₂ y CO₂ — ambos tienen dos dobles enlaces pero son muy diferentes."],
      ejerciciosUniversitario: ["Calcula la constante de equilibrio para 2SO₂ + O₂ ⇌ 2SO₃ a 450°C usando ΔGf°.", "Explica usando VSEPR y MO por qué SO₂ es angular y CO₂ es lineal.", "El SO₂ puede actuar como ácido de Lewis. Escribe la reacción con Na₂O y explica el mecanismo."],
    },
  },

  // ── SO₃ ──────────────────────────────────────────────────────────────────
  "SO3": {
    formula: "SO3", formulaDisplay: "SO₃",
    nombre: "Trióxido de Azufre", familia: "Óxido no metálico (óxido ácido del S⁶⁺)", color: "yellow", masaMolar: 80.065,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Anhídrido sulfúrico",
      stock: "Óxido de azufre(VI)",
      sistematica: "Trióxido de azufre",
      tipo: "Óxido no metálico del azufre en estado +6 (máximo)",
      nota: "Estado de oxidación del S: +6 (máximo). Es el anhídrido del ácido sulfúrico (H₂SO₄). No confundir con SO₂ (anhídrido sulfuroso, S en +4). La reacción SO₃ + H₂O → H₂SO₄ es violentamente exotérmica.",
    },
    lewis: {
      descripcion: "S central con 6 e⁻ de valencia (puede expandir octeto con 3d). Forma 3 dobles enlaces S=O. Sin pares libres en S. Total: 24 e⁻. En el ión sulfato SO₄²⁻ hay resonancia perfecta entre las 4 formas.",
      esIonico: false, electronosValenciaTotal: 24,
      atomoCentral: "S", paresLibresCentral: 0, enlacesSimples: 0, enlacesDobles: 3, enlacesTriples: 0,
      notaResonancia: "SO₃ tiene resonancia entre 3 estructuras equivalentes. Los 3 enlaces S=O son iguales (longitud: 1.42 Å). Altísima simetría D₃h.",
    },
    vsepr: {
      descripcion: "S central con 3 grupos de electrones (3 dobles enlaces), sin pares libres → geometría electrónica y molecular trigonal plana perfecta. Los tres ángulos O=S=O son exactamente 120°. Molécula COMPLETAMENTE PLANA Y SIMÉTRICA.",
      esIonico: false, notacionAXE: "AX₃",
      geometriaElectronica: "Trigonal plana", geometriaMolecular: "Trigonal plana",
      anguloEnlace: "120°", hibridacion: "sp²",
    },
    polaridad: {
      esPolar: false, tipoEnlace: "Covalente polar (enlaces) / apolar (molécula)",
      diferenciaEN: 0.86, momentoDipolar: "0 D",
      explicacion: "ΔEN(S=O) = 0.86 → cada enlace S=O es polar. Pero la geometría trigonal plana perfectamente simétrica (D₃h) cancela exactamente los tres dipolos → μ = 0 D. Paradójico: tiene 3 enlaces polares pero la molécula es apolar.",
    },
    formacion: {
      proceso: "Oxidación catalítica de SO₂ con O₂ (proceso de contacto). El V₂O₅ activa la reacción a 450°C y >1 atm. Paso clave en la industria del H₂SO₄.",
      ecuacion: "2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)  ΔH = −197 kJ/mol  (V₂O₅, 450°C)",
      tipoEnlaceFormado: "Covalente polar (S=O)",
      estadosOxidacion: { "S": "+6", "O": "−2" },
      entalpiaFormacion: "−395.7 kJ/mol",
    },
    reacciones: [
      { nombre: "Reacción con agua (formación de H₂SO₄)", ecuacion: "SO₃(g) + H₂O(l) → H₂SO₄(l)  ΔH = −130 kJ/mol", tipo: "síntesis", descripcion: "Reacción violentamente exotérmica. Por eso en industria se absorbe SO₃ en H₂SO₄ concentrado (oleum) y no directamente en agua — evita niebla sulfúrica." },
      { nombre: "Formación de oleum", ecuacion: "SO₃(g) + H₂SO₄(l) → H₂S₂O₇(l)  (oleum o ácido disulfúrico)", tipo: "síntesis", descripcion: "El oleum (o ácido de Nordhausen) es la disolución de SO₃ en H₂SO₄ concentrado. Más reactivo y corrosivo que el H₂SO₄ puro." },
      { nombre: "Con NaOH", ecuacion: "SO₃(g) + 2 NaOH(aq) → Na₂SO₄(aq) + H₂O(l)", tipo: "neutralización", descripcion: "Produce sulfato de sodio. La reacción es directa del óxido ácido con la base." },
    ],
    educacion: {
      teoriaResumida: "SO₃ es el intermedio más importante en la producción industrial de H₂SO₄ (>200 Mt/año). Su geometría trigonal plana y perfecta simetría D₃h lo hacen apolar a pesar de sus enlaces polares — análogo al CO₂ y SO₃ frente a H₂O y SO₂. Como ácido de Lewis muy fuerte (S en +6, sin pares libres), reacciona con casi cualquier base de Lewis.",
      erroresComunes: [
        "Confundir SO₃ (S+6, apolar, plano) con SO₂ (S+4, polar, angular) — geometrías completamente diferentes.",
        "Creer que SO₃ reacciona lentamente con agua — es una reacción violentamente exotérmica.",
        "Olvidar que el SO₃ en gas puede causar niebla ácida al reaccionar con la humedad del aire.",
        "Confundir 'oleum' con H₂SO₄ concentrado — el oleum es una mezcla de SO₃ en H₂SO₄.",
      ],
      ejerciciosPrincipiante: ["¿Qué produce la reacción de SO₃ con agua?", "¿Cómo se diferencia SO₂ de SO₃?", "¿Por qué el SO₃ se absorbe en H₂SO₄ en vez de agua en la industria?"],
      ejerciciosSecundario: ["Dibuja las 3 estructuras de resonancia del SO₃ y la del ión sulfato SO₄²⁻.", "¿Por qué SO₃ es apolar y SO₂ es polar si ambos tienen solo enlaces S–O?", "Calcula el ΔH de la reacción SO₂ + ½O₂ → SO₃ usando ΔHf° de SO₂ y SO₃."],
      ejerciciosUniversitario: ["Aplica el principio de Le Châtelier para determinar las condiciones óptimas (T, P) para producir SO₃ en el proceso de contacto.", "Explica por qué SO₃ es un ácido de Lewis más fuerte que CO₂.", "Usando SALC, describe el enlace π deslocalizado en SO₃."],
    },
  },

  // ── NO₂ ──────────────────────────────────────────────────────────────────
  "NO2": {
    formula: "NO2", formulaDisplay: "NO₂",
    nombre: "Dióxido de Nitrógeno", familia: "Óxido no metálico (radical libre paramagnético)", color: "rose", masaMolar: 46.006,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Dióxido de nitrógeno",
      stock: "Óxido de nitrógeno(IV)",
      sistematica: "Dióxido de nitrógeno",
      tipo: "Óxido no metálico del N en estado +4 (radical con e⁻ impar)",
      nota: "NO₂ es un radical (tiene 17 e⁻ totales, número impar). Por eso es paramagnético y se dimeriza espontáneamente a N₂O₄ incoloro. El gas marrón-rojizo de los tubos de ensayo al disolver metales en HNO₃ concentrado es NO₂.",
    },
    lewis: {
      descripcion: "N central con 5 e⁻ de valencia + 2×6 (O) = 17 e⁻ TOTALES (impar). No puede satisfacer el octeto sin un e⁻ desapareado. Una forma: N=O doble, N–O simple con e⁻ suelto en N. Molécula radical (1 e⁻ sin pareja).",
      esIonico: false, electronosValenciaTotal: 17,
      atomoCentral: "N", paresLibresCentral: 0, enlacesSimples: 1, enlacesDobles: 1, enlacesTriples: 0,
      notaResonancia: "Resonancia con e⁻ desapareado en N: 2 estructuras donde el doble enlace N=O y el sencillo N–O se intercambian. Ambos enlaces N–O son equivalentes (longitud 1.197 Å).",
    },
    vsepr: {
      descripcion: "N central con 2 grupos enlazantes + 1 e⁻ desapareado (cuenta como 'medio par libre'). AX₂E₀·₅ → ángulo O–N–O = 134.1° (mayor que en SO₂: 119.5° porque el e⁻ desapareado ocupa menos espacio que un par libre completo).",
      esIonico: false, notacionAXE: "AX₂E₀·₅ (radical)",
      geometriaElectronica: "Trigonal plana (aproximada)", geometriaMolecular: "Angular",
      anguloEnlace: "134.1°", hibridacion: "sp²",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.04, momentoDipolar: "0.316 D",
      explicacion: "ΔEN(N–O) = 3.44 − 3.04 = 0.40. Geometría angular → los dipolos N–O no se cancelan → μ = 0.316 D (pequeño). El e⁻ desapareado asimétrico contribuye a la polaridad total.",
    },
    formacion: {
      proceso: "Oxidación de NO con O₂ (proceso Ostwald, paso 2). También se forma en motores de combustión y en la atmósfera durante tormentas eléctricas.",
      ecuacion: "2 NO(g) + O₂(g) → 2 NO₂(g)  ΔH = −113 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (N=O, N–O)",
      estadosOxidacion: { "N": "+4", "O": "−2" },
      entalpiaFormacion: "+33.2 kJ/mol",
    },
    reacciones: [
      { nombre: "Dimerización (equilibrio)", ecuacion: "2 NO₂(g) ⇌ N₂O₄(g)  ΔH = −57.2 kJ/mol  (K a 25°C = 9.1 atm⁻¹)", tipo: "síntesis", descripcion: "NO₂ marrón-rojizo dimeriza al N₂O₄ incoloro. Al enfriar → más N₂O₄ (incoloro); al calentar → más NO₂ (marrón). Ejemplo clásico de equilibrio químico visible." },
      { nombre: "Reacción con agua (paso final del proceso Ostwald)", ecuacion: "3 NO₂(g) + H₂O(l) → 2 HNO₃(aq) + NO(g)", tipo: "síntesis", descripcion: "Produce ácido nítrico. El NO liberado puede oxidarse de nuevo a NO₂ y reiniciar el ciclo." },
      { nombre: "Contribución a smog fotoquímico", ecuacion: "NO₂(g) + hν → NO(g) + O(g)  (λ < 400 nm)\nO(g) + O₂(g) → O₃(g)", tipo: "síntesis", descripcion: "La luz UV rompe el NO₂, liberando O atómico que forma ozono troposférico (O₃). Base del smog fotoquímico." },
    ],
    educacion: {
      teoriaResumida: "NO₂ es un contaminante atmosférico de primer orden (fuentes: motores de combustión, industria química). El equilibrio NO₂ ⇌ N₂O₄ es el ejemplo más clásico de equilibrio homogéneo visible en el laboratorio — el cambio de color pardo a incoloro al enfriar es dramático y directo. Su carácter radical lo hace altamente reactivo y responsable del smog fotoquímico.",
      erroresComunes: [
        "Creer que NO₂ tiene un número par de electrones — tiene 17 e⁻ (impar), es un radical.",
        "Confundir el ángulo de NO₂ (134.1°) con el de SO₂ (119.5°) — el e⁻ desapareado ocupa menos espacio que un par libre.",
        "Pensar que N₂O₄ y NO₂ son sustancias diferentes — son formas de equilibrio del mismo sistema.",
        "Confundir NO₂ (N+4) con N₂O (N+1), NO (N+2) y N₂O₃ (N+3) — estados de oxidación distintos.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el NO₂ es marrón?", "¿Por qué el tubo de N₂O₄/NO₂ cambia de color con la temperatura?", "¿Qué tiene de especial el NO₂ que lo hace tan reactivo?"],
      ejerciciosSecundario: ["Escribe la estructura de Lewis del NO₂ e indica el electrón desapareado.", "Calcula Kc para 2NO₂ ⇌ N₂O₄ a 25°C (Kp = 9.1 atm⁻¹). ¿Cómo afecta la temperatura a K?", "Explica el smog fotoquímico: ¿qué papel tiene el NO₂?"],
      ejerciciosUniversitario: ["Calcula la fracción de NO₂ disociado en N₂O₄ a 25°C y 1 atm (Kp = 9.1 atm⁻¹).", "Usando OM, describe el e⁻ desapareado del NO₂ y por qué es un radical.", "Propón un mecanismo para la reacción 3NO₂ + H₂O → 2HNO₃ + NO."],
    },
  },

  // ── NO ───────────────────────────────────────────────────────────────────
  "NO": {
    formula: "NO", formulaDisplay: "NO",
    nombre: "Monóxido de Nitrógeno", familia: "Óxido no metálico (radical diatómico, gas señalizador)", color: "gray", masaMolar: 30.006,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Monóxido de nitrógeno",
      stock: "Óxido de nitrógeno(II)",
      sistematica: "Monóxido de nitrógeno",
      tipo: "Óxido no metálico del N en estado +2 (radical, molécula biológica activa)",
      nota: "NO es un radical libre (11 e⁻ totales) y la primera molécula gaseosa descubierta como neurotransmisor/señalizador biológico (Premio Nobel de Medicina 1998). No confundir con N₂O (óxido nitroso) ni con NO₂ (dióxido).",
    },
    lewis: {
      descripcion: "N y O: 5+6 = 11 e⁻ TOTALES (impar). Estructura mejor representada con triple enlace N≡O y un e⁻ desapareado en N, o con doble enlace N=O con e⁻ desapareado. El orbital molecular antienlazante π* está semilleno (1 e⁻).",
      esIonico: false, electronosValenciaTotal: 11,
      atomoCentral: "N", paresLibresCentral: 0, enlacesSimples: 0, enlacesDobles: 0, enlacesTriples: 1,
      notaResonancia: "La teoría de OM describe NO como N≡O con un e⁻ en un OM π* antienlazante. Orden de enlace = (8−3)/2 = 2.5 (entre doble y triple). Longitud: 1.154 Å.",
    },
    vsepr: {
      descripcion: "Molécula diatómica lineal. La VSEPR no aplica de forma directa. El orden de enlace 2.5 (OM) hace el enlace más corto y fuerte que un N=O doble. El e⁻ desapareado en π* antienlazante le da carácter paramagnético.",
      esIonico: false, notacionAXE: "AX₁ (lineal, diatómica)",
      geometriaElectronica: "Lineal", geometriaMolecular: "Lineal (diatómica)",
      anguloEnlace: "N/A", hibridacion: "sp (N y O)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 0.40, momentoDipolar: "0.159 D",
      explicacion: "ΔEN(N–O) = 3.44 − 3.04 = 0.40 (pequeño). Molécula diatómica → dipolo neto de 0.159 D (muy pequeño). La distribución asimétrica del e⁻ desapareado en π* (principalmente en N) contribuye a la polaridad.",
    },
    formacion: {
      proceso: "Proceso Ostwald (paso 1): oxidación catalítica de NH₃. También se forma en motores de combustión (N₂ + O₂ a alta temperatura) y en el cuerpo humano (enzima NOS).",
      ecuacion: "4 NH₃(g) + 5 O₂(g) → 4 NO(g) + 6 H₂O(g)  (Pt, 850°C, Ostwald)",
      tipoEnlaceFormado: "Covalente polar (N≡O con orden enlace 2.5)",
      estadosOxidacion: { "N": "+2", "O": "−2" },
      entalpiaFormacion: "+90.3 kJ/mol",
    },
    reacciones: [
      { nombre: "Oxidación a NO₂", ecuacion: "2 NO(g) + O₂(g) → 2 NO₂(g)  ΔH = −113 kJ/mol", tipo: "redox", descripcion: "Reacción rápida con O₂ del aire. El NO incoloro se convierte inmediatamente en el NO₂ marrón-rojizo visible. Por eso el NO producido en procesos Ostwald se reoxida para continuar el ciclo." },
      { nombre: "Reacción con O₃ (troposfera)", ecuacion: "NO(g) + O₃(g) → NO₂(g) + O₂(g)  k muy alta", tipo: "redox", descripcion: "Reacción clave en la química troposférica. El NO emitido por los vehículos destruye el O₃ troposférico y contribuye al ciclo del smog fotoquímico." },
      { nombre: "Función biológica (vasodilatación)", ecuacion: "L-arginina + O₂ → NO + L-citrulina  (NOS, NO sintetasa)", tipo: "síntesis", descripcion: "Producción enzimática de NO en las células endoteliales. El NO difunde a músculo liso vascular, activa guanilato ciclasa → vasodilatación. Base del mecanismo de la nitroglicerina y el sildenafilo." },
    ],
    educacion: {
      teoriaResumida: "NO fue el primer gas descubierto como molécula señalizadora biológica (Nobel 1998: Furchgott, Ignarro, Murad). La enzima NO sintetasa (NOS) produce NO endógeno que regula la presión arterial, la neurotransmisión y el sistema inmunitario. Paradoja: este contaminante atmosférico tóxico (procedente de motores) también es un mensajero fisiológico esencial en concentraciones nanomolares.",
      erroresComunes: [
        "Confundir NO (N+2, incoloro, radical) con NO₂ (N+4, marrón, radical) y N₂O (N+1, 'gas de la risa').",
        "Creer que NO no puede ser un mensajero biológico porque es tóxico — la dosis hace al veneno.",
        "Olvidar que el orden de enlace del NO es 2.5 (por teoría de OM), no 2 ni 3.",
        "Decir que NO es 'estable' — reacciona rápidamente con O₂ del aire para dar NO₂.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el NO se vuelve marrón al salir al aire?", "¿Qué tiene que ver el NO con la nitroglicerina?", "¿Cómo se produce el NO en un motor de coche?"],
      ejerciciosSecundario: ["Calcula el orden de enlace del NO usando la teoría de OM.", "Ajusta la ecuación de oxidación de NO a NO₂ y clasifícala como redox.", "Escribe la reacción global del proceso Ostwald (NH₃ → NO → NO₂ → HNO₃)."],
      ejerciciosUniversitario: ["Dibuja el diagrama de OM del NO y explica su paramagnetismo y orden de enlace 2.5.", "Explica el mecanismo de vasodilatación inducida por NO (EDRF): desde la NOS hasta la activación del músculo liso.", "Calcula Kp para 2NO + O₂ ⇌ 2NO₂ a 25°C usando ΔGf°."],
    },
  },

  // ── O₃ ───────────────────────────────────────────────────────────────────
  "O3": {
    formula: "O3", formulaDisplay: "O₃",
    nombre: "Ozono", familia: "Alótropo del oxígeno (óxido activo)", color: "cyan", masaMolar: 47.998,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ozono",
      stock: "Trioxígeno",
      sistematica: "Trioxídano (IUPAC 2005)",
      tipo: "Alótropo del oxígeno (no un compuesto sino una forma alotrópica)",
      nota: "El ozono es un alótropo del oxígeno (O₃ vs O₂), no un compuesto de diferentes elementos. Nombre 'ozono' deriva del griego 'ozein' (oler). El ozono estratosférico (capa de ozono) protege de UV-B/C; el troposférico es contaminante.",
    },
    lewis: {
      descripcion: "O central con 6 e⁻ de valencia. Estructura real: resonancia entre 2 formas: cada una con O=O doble, O–O simple y 1 par libre en O central. Total: 18 e⁻. El O central tiene expansión del octeto en una forma.",
      esIonico: false, electronosValenciaTotal: 18,
      atomoCentral: "O (central)", paresLibresCentral: 1, enlacesSimples: 0, enlacesDobles: 2, enlacesTriples: 0,
      notaResonancia: "Resonancia entre 2 estructuras equivalentes: O=O–O ↔ O–O=O. Los dos enlaces O–O son equivalentes (longitud 1.278 Å, entre O–O simple 1.48 Å y O=O doble 1.21 Å).",
    },
    vsepr: {
      descripcion: "O central con 2 grupos enlazantes + 1 par libre → AX₂E₁ → geometría electrónica trigonal plana → geometría molecular angular. Ángulo O–O–O = 116.8°. Igual topología que SO₂.",
      esIonico: false, notacionAXE: "AX₂E₁",
      geometriaElectronica: "Trigonal plana", geometriaMolecular: "Angular (doblada)",
      anguloEnlace: "116.8°", hibridacion: "sp²",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente (homonuclear, pero polar por asimetría)",
      diferenciaEN: 0.0, momentoDipolar: "0.53 D",
      explicacion: "Molécula homonuclear (solo O), por lo que ΔEN = 0. Sin embargo, la geometría angular asimétrica del par libre crea un momento dipolar neto de 0.53 D. Es único: molécula 'polar' compuesta por un solo elemento.",
    },
    formacion: {
      proceso: "Natural: fotólisis del O₂ estratosférico por UV-C (< 240 nm). Industrial: descarga eléctrica (corona) sobre O₂ o aire seco. Se produce en las tormentas eléctricas.",
      ecuacion: "3 O₂(g) + hν → 2 O₃(g)  ΔHf° = +142.7 kJ/mol (endotérmica)",
      tipoEnlaceFormado: "Covalente (O–O, orden de enlace 1.5 por resonancia)",
      estadosOxidacion: { "O": "0 (formalmente)" },
      entalpiaFormacion: "+142.7 kJ/mol",
    },
    reacciones: [
      { nombre: "Ciclo de Chapman (formación/destrucción estratosférica)", ecuacion: "O₂ + hν(UV-C) → 2 O·\nO· + O₂ → O₃\nO₃ + hν(UV-B) → O₂ + O·\nO₃ + O· → 2 O₂", tipo: "síntesis", descripcion: "Ciclo catalítico que mantiene el equilibrio del ozono estratosférico. Los CFC (ClFC) actúan como catalizadores de la destrucción de O₃." },
      { nombre: "Oxidación de I⁻ (test de almidón-yodo)", ecuacion: "O₃(aq) + 2 KI(aq) + H₂SO₄ → I₂ + O₂ + K₂SO₄ + H₂O", tipo: "redox", descripcion: "El ozono oxida I⁻ a I₂, que tiñe el almidón de azul-violeta. Reacción cuantitativa para detectar y dosificar O₃ (ozometría)." },
      { nombre: "Descomposición catalítica", ecuacion: "2 O₃(g) → 3 O₂(g)  (Cl·, NO·, Br· como catalizadores)", tipo: "descomposición", descripcion: "Los radicales halógenos y NOₓ catalizan la destrucción del ozono. Base de la química de destrucción de la capa de ozono." },
    ],
    educacion: {
      teoriaResumida: "El ozono tiene un papel doble: en la estratosfera (15–35 km) protege la Tierra absorbiendo UV-B/C dañina; en la troposfera es un contaminante secundario del smog fotoquímico. Los CFC (clorofluorocarbonos) catalíticamente destruyen O₃ estratosférico (un átomo de Cl destruye hasta 100.000 moléculas de O₃). El olor característico cerca de las fotocopiadoras es O₃ generado por descargas eléctricas.",
      erroresComunes: [
        "Confundir el ozono 'bueno' (estratosférico, protector) con el ozono 'malo' (troposférico, contaminante).",
        "Creer que O₃ es un compuesto — es un alótropo (forma alotrópica del O₂).",
        "Decir que ΔEN = 0 implica molécula apolar — O₃ tiene μ = 0.53 D por su geometría asimétrica.",
        "Olvidar que O₃ es más reactivo que O₂ por sus enlaces O–O más débiles (orden 1.5) y su ΔHf° positivo.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el ozono nos protege del sol?", "¿Por qué los CFC dañan la capa de ozono?", "¿Qué alótropo del oxígeno eres tú al respirar? ¿Y el ozono?"],
      ejerciciosSecundario: ["Dibuja las 2 estructuras de resonancia del O₃ y calcula el orden de enlace O–O.", "Explica por qué el O₃ es más reactivo que el O₂ usando argumentos energéticos.", "¿Por qué el O₃ tiene momento dipolar si está compuesto por un solo elemento?"],
      ejerciciosUniversitario: ["Calcula el ΔG° de la reacción 2O₃ → 3O₂ y determina si el ozono es termodinámicamente estable.", "Escribe el mecanismo detallado de destrucción del O₃ por radicales Cl· (ciclo catalítico completo).", "Explica usando teoría de OM por qué el O₃ tiene un OM LUMO de baja energía que lo hace buen oxidante."],
    },
  },

  // ── N₂O ──────────────────────────────────────────────────────────────────
  "N2O": {
    formula: "N2O", formulaDisplay: "N₂O",
    nombre: "Óxido Nitroso", familia: "Óxido no metálico (anestésico general)", color: "purple", masaMolar: 44.013,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Óxido nitroso",
      stock: "Óxido de dinitrógeno(I)",
      sistematica: "Dinitrógeno monóxido",
      tipo: "Óxido no metálico del N en estado formal +1 (promedio: N₂ tiene 2 N en distintos estados +2 y 0, media +1)",
      nota: "Nombre popular: 'gas de la risa' o 'óxido de diazonio'. Es lineal como CO₂ y N₂. Estado de oxidación: en N₂O, los 2 N no son equivalentes: N terminal ≈ −1/3, N interno ≈ +1/3 aproximadamente (o +1 promedio formal).",
    },
    lewis: {
      descripcion: "Molécula lineal N–N–O. Forma canónica más importante: N≡N⁺–O⁻. Segunda forma: ⁻N=N=O → ⁺N=N–O⁻. Los 3 átomos tienen 4+5+6 = 16 e⁻ totales.",
      esIonico: false, electronosValenciaTotal: 16,
      atomoCentral: "N (terminal, más electroneg.)", paresLibresCentral: 0, enlacesSimples: 0, enlacesDobles: 0, enlacesTriples: 1,
      notaResonancia: "Resonancia: :N=N=O: ↔ :N≡N–O:⁻ (y otras formas). El N central tiene orden de enlace N–N ≈ 2.73 y N–O ≈ 1.61. Estructura análoga al CO₂ pero con los 2 átomos centrales diferentes (N=N=O vs O=C=O).",
    },
    vsepr: {
      descripcion: "Molécula triatómica lineal (AX₂ para el N central). Los 3 átomos son colineales, igual que CO₂. Sin pares libres en el átomo central → ángulo N–N–O = 180°.",
      esIonico: false, notacionAXE: "AX₂ (N central)",
      geometriaElectronica: "Lineal", geometriaMolecular: "Lineal",
      anguloEnlace: "180°", hibridacion: "sp",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 0.40, momentoDipolar: "0.166 D",
      explicacion: "Aunque es lineal, N₂O NO es simétrico (N–N–O vs O–C–O del CO₂). La distribución asimétrica de carga crea μ = 0.166 D (pequeño). El extremo O es δ⁻ y el N terminal es δ⁺.",
    },
    formacion: {
      proceso: "Descomposición térmica del nitrato de amonio. Cuidado: es una reacción exotérmica que puede ser explosiva a alta temperatura.",
      ecuacion: "NH₄NO₃(s) → N₂O(g) + 2 H₂O(g)  ΔH = −37 kJ/mol  (200–260°C)",
      tipoEnlaceFormado: "Covalente polar (N=N, N–O)",
      estadosOxidacion: { "N (terminal)": "−1/3", "N (central)": "+1/3", "O": "−2" },
      entalpiaFormacion: "+82.1 kJ/mol",
    },
    reacciones: [
      { nombre: "Descomposición a alta temperatura", ecuacion: "2 N₂O(g) → 2 N₂(g) + O₂(g)  ΔH = −163 kJ/mol  (>600°C)", tipo: "descomposición", descripcion: "Produce O₂ y es exotérmica — explica por qué soporta la combustión. Ejemplo: un fósforo ardiendo se reaviva en N₂O (como en O₂)." },
      { nombre: "Como oxidante en motores de alta performance", ecuacion: "2 N₂O(g) + C₃H₈(g) → 3 CO₂ + 2 N₂ + 4 H₂O  (combustión)", tipo: "combustión", descripcion: "Usado en automóviles de competición como oxidante adicional ('nitroso'). Al descomponerse libera N₂ y O₂, aumentando la densidad de oxígeno disponible para la combustión." },
      { nombre: "Disolución en crema (propelente)", ecuacion: "N₂O(g) ⇌ N₂O(aq)  (alta P → expansión → espuma)", tipo: "síntesis", descripcion: "N₂O es soluble en grasa bajo presión. Propelente en latas de nata montada: el gas disuelto en la grasa se expande al abrirse la válvula, creando la espuma." },
    ],
    educacion: {
      teoriaResumida: "N₂O es 300 veces más potente que el CO₂ como gas de efecto invernadero y tiene vida media atmosférica de ∼114 años. Paradójicamente, se usa como anestésico (el 'gas de la risa' de Humphry Davy en 1800), en propelentes alimentarios, y en automóviles de carrera. Su estructura lineal asimétrica (N–N–O) contrasta con la simétrica del CO₂ (O–C–O), lo que le da un pequeño momento dipolar.",
      erroresComunes: [
        "Confundir N₂O (N+1, anestésico, 'gas risa') con NO (N+2, biológico), NO₂ (N+4, marrón) y N₂O₄ (dímero del NO₂).",
        "Creer que N₂O es inerte como el N₂ — se descompone a >600°C liberando O₂ activo.",
        "Pensar que N₂O no es GEI — es un potente gas de efecto invernadero del suelo (fertilizantes nitrogenados).",
        "Confundir que N₂O tiene 2 N en estado +1 — en realidad los 2 N tienen estados diferentes (+1/3 y −1/3 formalmente).",
      ],
      ejerciciosPrincipiante: ["¿Por qué N₂O se llama 'gas de la risa'?", "¿Cómo soporta la combustión el N₂O?", "¿Por qué N₂O está en las latas de nata montada?"],
      ejerciciosSecundario: ["Dibuja las estructuras de resonancia del N₂O (N=N=O y N≡N⁺–O⁻).", "Calcula el estado de oxidación promedio del N en el N₂O.", "Compara la polaridad de N₂O (lineal, μ=0.166D) y CO₂ (lineal, μ=0D) — ¿por qué son diferentes?"],
      ejerciciosUniversitario: ["Usando VSEPR y OM, explica la estructura electrónica del N₂O y compara con CO₂.", "Calcula ΔGf° de N₂O a 25°C y determina si su descomposición a N₂ + O₂ es espontánea.", "Explica por qué el N₂O tiene una vida media atmosférica de ~114 años mientras el NO₂ se elimina en días."],
    },
  },

  // ── CaO ──────────────────────────────────────────────────────────────────
  "CaO": {
    formula: "CaO", formulaDisplay: "CaO",
    nombre: "Óxido de Calcio", familia: "Óxido metálico (óxido básico)", color: "orange", masaMolar: 56.077,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Óxido de calcio",
      stock: "Óxido de calcio(II)",
      sistematica: "Monoóxido de calcio",
      tipo: "Óxido metálico (óxido básico del calcio en estado +2)",
      nota: "Nombre trivial: 'cal viva' o 'cal'. La reacción de CaO con agua (apagado de la cal) es muy exotérmica y produce Ca(OH)₂ (cal apagada). Uno de los materiales más producidos por la humanidad (~420 Mt/año).",
    },
    lewis: {
      descripcion: "Compuesto iónico: Ca²⁺ + O²⁻. Ca cede 2 e⁻ y O acepta 2 e⁻. Ca²⁺ queda con configuración del Ar; O²⁻ (óxido) queda con 8 e⁻ (4 pares libres), configuración del Ne.",
      esIonico: true, electronosValenciaTotal: 8,
      notaResonancia: "Estructura cristalina de tipo NaCl (cúbica de cara centrada, Fm3̄m). Ca²⁺ coordinado por 6 O²⁻ y viceversa. Parámetro de red: a = 4.80 Å.",
    },
    vsepr: {
      descripcion: "Compuesto iónico con estructura tipo NaCl. VSEPR no aplica. Alta energía reticular (−3414 kJ/mol) — mayor que NaCl (−788 kJ/mol) porque las cargas son ±2. Punto de fusión muy alto: 2613°C.",
      esIonico: true, notacionAXE: "N/A (iónico)",
      geometriaMolecular: "Red cristalina cúbica (tipo NaCl)",
      hibridacion: "N/A",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico",
      diferenciaEN: 2.44, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Ca–O) = 3.44 − 1.00 = 2.44 → enlace fuertemente iónico. En la molécula gaseosa CaO (diatómica), μ ≈ 8.3 D (uno de los mayores). En sólido es red iónica.",
    },
    formacion: {
      proceso: "Calcinación de caliza (CaCO₃) a 900–1200°C en hornos industriales. Una de las reacciones químicas industriales más antiguas del mundo.",
      ecuacion: "CaCO₃(s) → CaO(s) + CO₂(g)  ΔH = +178 kJ/mol  (>900°C)",
      tipoEnlaceFormado: "Iónico (Ca²⁺ + O²⁻)",
      estadosOxidacion: { "Ca": "+2", "O": "−2" },
      entalpiaFormacion: "−635.1 kJ/mol",
    },
    reacciones: [
      { nombre: "Apagado de la cal (exotérmico)", ecuacion: "CaO(s) + H₂O(l) → Ca(OH)₂(s)  ΔH = −65.2 kJ/mol", tipo: "síntesis", descripcion: "Reacción muy exotérmica: la cal viva puede alcanzar >300°C al contacto con agua. 'Apagar la cal' era la reacción más peligrosa de las construcciones antiguas." },
      { nombre: "Reacción con CO₂", ecuacion: "CaO(s) + CO₂(g) → CaCO₃(s)  ΔH = −178 kJ/mol", tipo: "síntesis", descripcion: "Reacción inversa a la calcinación. Usada en la captura de CO₂ (ciclo CaO/CaCO₃ a alta temperatura) como tecnología para mitigación del cambio climático." },
      { nombre: "Reacción con ácidos fuertes", ecuacion: "CaO(s) + 2 HCl(aq) → CaCl₂(aq) + H₂O(l)  ΔH ≈ −200 kJ/mol", tipo: "neutralización", descripcion: "Reacción violenta entre el óxido básico y ácidos fuertes. Produce cloruro de calcio y agua." },
    ],
    educacion: {
      teoriaResumida: "CaO (cal viva) es uno de los compuestos inorgánicos más utilizados por la humanidad desde la antigüedad: construcción (cemento Portland contiene ∼65% CaO), tratamiento de agua (precipitación de metales pesados), producción de acero (extracción de impurezas silíceas), y agricultura (corrección del pH del suelo). El ciclo CaCO₃/CaO es uno de los ciclos geoquímicos más importantes del planeta (ciclo del carbono inorgánico).",
      erroresComunes: [
        "Confundir CaO (cal viva) con Ca(OH)₂ (cal apagada) — son compuestos diferentes con propiedades distintas.",
        "Olvidar que CaO reacciona violentamente con agua — el apagado incorrecto puede provocar quemaduras graves.",
        "Creer que todos los óxidos metálicos son óxidos básicos — Fe₂O₃ es anfótero, ZnO es anfótero.",
        "Confundir el proceso de calcinación (endotérmico, CaCO₃→CaO) con el de apagado (exotérmico, CaO→Ca(OH)₂).",
      ],
      ejerciciosPrincipiante: ["¿Qué es la 'cal viva'?", "¿Por qué la cal viva reacciona con agua tan energéticamente?", "¿Para qué sirve la cal en la construcción?"],
      ejerciciosSecundario: ["Escribe la reacción de calcinación del CaCO₃ y clasifícala como endotérmica o exotérmica.", "Calcula los gramos de CaO que se forman al calcinar 100 g de CaCO₃ (pureza 95%).", "¿Qué diferencia a un óxido ácido (como SO₃) de un óxido básico (como CaO)?"],
      ejerciciosUniversitario: ["Calcula la temperatura mínima para que la descomposición CaCO₃ → CaO + CO₂ sea espontánea (ΔH = +178 kJ/mol, ΔS = +159 J/mol·K).", "Diseña el ciclo CaO/CaCO₃ para captura de CO₂ a alta temperatura y evalúa su viabilidad termodinámica.", "Explica el papel del CaO en la producción de acero (purificación del arrabio)."],
    },
  },

  // ── Fe₂O₃ ────────────────────────────────────────────────────────────────
  "Fe2O3": {
    formula: "Fe2O3", formulaDisplay: "Fe₂O₃",
    nombre: "Óxido de Hierro(III)", familia: "Óxido metálico (anfótero, mineral de hierro)", color: "orange", masaMolar: 159.688,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Óxido férrico",
      stock: "Óxido de hierro(III)",
      sistematica: "Trióxido de dihierro",
      tipo: "Óxido metálico con Fe en estado +3 (número romano obligatorio por carga variable del Fe)",
      nota: "El Fe tiene estados +2 (ferroso, FeO) y +3 (férrico, Fe₂O₃). El nombre 'trióxido de dihierro' usa prefijos multiplicadores. Nombre mineral: hematita (Fe₂O₃), la mena de hierro más importante del mundo.",
    },
    lewis: {
      descripcion: "Compuesto iónico: 2 Fe³⁺ + 3 O²⁻. Cada Fe³⁺ (d⁵, configuración spin alto) cede 3 e⁻. Cada O²⁻ tiene 8 e⁻ de valencia (4 pares libres). Red cristalina corindon (hexagonal compacta).",
      esIonico: true, electronosValenciaTotal: 10,
      notaResonancia: "Estructura corindon (R3̄c hexagonal): cada Fe³⁺ coordinado octaédricamente por 6 O²⁻; cada O²⁻ coordinado por 4 Fe³⁺. La misma estructura que Al₂O₃ (corindón, rubí, zafiro).",
    },
    vsepr: {
      descripcion: "Compuesto iónico con estructura corindon. VSEPR no aplica. Fe³⁺ tiene coordinación octaédrica (6 O²⁻ vecinos). La energía reticular es muy alta por las cargas ±3 y ±2.",
      esIonico: true, notacionAXE: "N/A (iónico)",
      geometriaMolecular: "Red cristalina corindon (hexagonal, R3̄c)",
      hibridacion: "N/A",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico con contribución covalente",
      diferenciaEN: 1.83, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Fe–O) = 3.44 − 1.61 = 1.83 → enlace predominantemente iónico. La carga +3 del Fe³⁺ le da poder polarizante significativo (regla de Fajans), añadiendo carácter covalente parcial.",
    },
    formacion: {
      proceso: "Oxidación del hierro al aire ('corrosión del hierro'). Industrialmente, el mineral hematita es el principal mineral de hierro para la producción de acero.",
      ecuacion: "4 Fe(s) + 3 O₂(g) → 2 Fe₂O₃(s)  ΔHf° = −824.2 kJ/mol",
      tipoEnlaceFormado: "Iónico (Fe³⁺ + O²⁻)",
      estadosOxidacion: { "Fe": "+3", "O": "−2" },
      entalpiaFormacion: "−824.2 kJ/mol",
    },
    reacciones: [
      { nombre: "Reducción en el alto horno (producción de hierro)", ecuacion: "Fe₂O₃(s) + 3 CO(g) → 2 Fe(l) + 3 CO₂(g)  ΔH = −25 kJ", tipo: "redox", descripcion: "Reacción clave de la siderurgia. El CO reduce al Fe³⁺ a Fe⁰. En el alto horno, se producen ∼1900 Mt de arrabio/año a nivel mundial." },
      { nombre: "Reacción termita (soldadura aluminotérmica)", ecuacion: "Fe₂O₃(s) + 2 Al(s) → Al₂O₃(s) + 2 Fe(l)  ΔH = −851 kJ", tipo: "redox", descripcion: "Reacción extremadamente exotérmica (T > 2500°C). Se usa para soldar raíles de ferrocarril in situ. El hierro líquido resultante es el producto de valor." },
      { nombre: "Disolución en ácido fuerte", ecuacion: "Fe₂O₃(s) + 6 HCl(aq) → 2 FeCl₃(aq) + 3 H₂O(l)", tipo: "neutralización", descripcion: "El Fe₂O₃ (óxido básico) reacciona con ácidos para dar la sal correspondiente y agua. Reacción de desincrustación en tuberías." },
    ],
    educacion: {
      teoriaResumida: "Fe₂O₃ (hematita) es la mena de hierro más explotada del mundo (∼2500 Mt/año). La reacción termita (Fe₂O₃ + Al) es una de las más exotérmicas por gramo que se conocen (ΔH/g = −3.98 kJ/g). La 'corrosión del hierro' es Fe₂O₃·xH₂O (óxido hidratado), un proceso electroquímico que destruye infraestructuras por valor de billones de dólares anuales.",
      erroresComunes: [
        "Confundir Fe₂O₃ (Fe+3, hematita, rojo) con Fe₃O₄ (mezcla Fe+2/Fe+3, magnetita, negro) y FeO (Fe+2, verde-negro).",
        "Creer que la corrosión del hierro es solo Fe₂O₃ — en realidad es Fe₂O₃·xH₂O (hidratado).",
        "Olvidar que la termita necesita iniciación térmica muy alta (cinta de Mg ardiendo) — no se enciende sola.",
        "Confundir el estado de oxidación: en Fe₂O₃ cada Fe es +3 (no +3/2 en total).",
      ],
      ejerciciosPrincipiante: ["¿Qué color tiene el óxido de hierro (herrumbre)?", "¿Por qué el hierro se oxida y el oro no?", "¿Para qué sirve la mena de hierro en la industria?"],
      ejerciciosSecundario: ["Calcula los gramos de Fe₂O₃ que reaccionan con 100 g de Al en la reacción termita.", "Ajusta la ecuación redox de Fe₂O₃ + CO → Fe + CO₂ por el método del cambio de oxidación.", "¿Cuál es el estado de oxidación del Fe en: FeO, Fe₂O₃, Fe₃O₄?"],
      ejerciciosUniversitario: ["Calcula el ΔG° de la reacción termita y determina si es espontánea a 25°C.", "Explica el mecanismo electroquímico de la corrosión del hierro (cátodo y ánodo de la pila de corrosión).", "Calcula el ΔH de la reacción en el alto horno: Fe₂O₃ + 3CO → 2Fe + 3CO₂ usando ΔHf° de los reactivos y productos."],
    },
  },

  // ── C₂H₅OH ───────────────────────────────────────────────────────────────
  "C2H5OH": {
    formula: "C2H5OH", formulaDisplay: "C₂H₅OH",
    nombre: "Etanol", familia: "Alcohol (hidrocarburo oxigenado)", color: "emerald", masaMolar: 46.069,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Alcohol etílico",
      stock: "Etanol",
      sistematica: "Etanol",
      tipo: "Alcohol primario (grupo –OH en carbono primario de cadena etílica)",
      nota: "Para compuestos orgánicos, la nomenclatura IUPAC usa la cadena carbonada: et- (2C) + an (saturado) + ol (grupo –OH). El nombre 'alcohol' a secas se refiere al etanol. Fórmula condensada: CH₃CH₂OH.",
    },
    lewis: {
      descripcion: "2 C y 1 O: C₁(metilo, sp³): 3 C–H + 1 C–C. C₂(metileno del OH, sp³): 2 C–H + 1 C–O + 1 C–C. O(alcohol, sp³): 1 O–H + 1 O–C + 2 pares libres. El H del –OH es el único H con carácter (débilmente) ácido.",
      esIonico: false, electronosValenciaTotal: 20,
      atomoCentral: "O (del grupo OH)", paresLibresCentral: 2, enlacesSimples: 6, enlacesDobles: 0, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "Todos los carbonos sp³ (AX₄, tetraédrico, 109.5°). El O es sp³ (AX₂E₂, angular, ≈109.5° pero comprimido por pares libres). La molécula no es rígida — rotación libre alrededor del enlace C–C y C–O.",
      esIonico: false, notacionAXE: "C: AX₄ / O: AX₂E₂",
      geometriaElectronica: "C: tetraédrica / O: tetraédrica",
      geometriaMolecular: "C: tetraédrico / O: angular",
      anguloEnlace: "C–C–O: ≈107° / C–O–H: ≈109°", hibridacion: "C: sp³ / O: sp³",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.24, momentoDipolar: "1.69 D",
      explicacion: "ΔEN(O–H) = 1.24; ΔEN(C–O) = 0.89. El grupo –OH domina la polaridad: μ = 1.69 D. La polar miscibilidad del etanol con agua se debe a su capacidad de formar 2 puentes de hidrógeno (O–H···O y O···H–O).",
    },
    formacion: {
      proceso: "Fermentación alcohólica de glucosa por levaduras (Saccharomyces cerevisiae) en ausencia de O₂. Industrial: hidratación catalítica del etileno (eteno) con H₂SO₄ o ácido fosfórico.",
      ecuacion: "C₆H₁₂O₆(aq) → 2 C₂H₅OH(aq) + 2 CO₂(g)  (levaduras, T<40°C)",
      tipoEnlaceFormado: "Covalente polar (C–O, O–H, C–C, C–H)",
      estadosOxidacion: { "C (metilo)": "−3", "C (metileno)": "−1", "O": "−2", "H": "+1" },
      entalpiaFormacion: "−277.7 kJ/mol (líquido)",
    },
    reacciones: [
      { nombre: "Combustión completa", ecuacion: "C₂H₅OH(l) + 3 O₂(g) → 2 CO₂(g) + 3 H₂O(g)  ΔHc = −1367 kJ/mol", tipo: "combustión", descripcion: "Combustión limpia. El etanol anhidro se usa como biocombustible (mezcla E10, E85 con gasolina). Su llama es casi invisible." },
      { nombre: "Oxidación (aldehído → ácido)", ecuacion: "C₂H₅OH → CH₃CHO → CH₃COOH  (oxidación progresiva)", tipo: "redox", descripcion: "El etanol se oxida primero a acetaldehído (CH₃CHO, tóxico) y luego a ácido acético. El acetaldehído es el responsable de la resaca." },
      { nombre: "Deshidratación (ácido fosfórico, 180°C)", ecuacion: "C₂H₅OH → C₂H₄ + H₂O  (H₃PO₄, 180°C)", tipo: "síntesis", descripcion: "Deshidratación intramolecular para producir etileno (eteno). A 140°C se obtiene éter dietílico (C₂H₅OC₂H₅) por deshidratación intermolecular." },
      { nombre: "Esterificación", ecuacion: "C₂H₅OH + CH₃COOH ⇌ CH₃COOC₂H₅ + H₂O  (H⁺, reversible)", tipo: "síntesis", descripcion: "Esterificación de Fischer: produce acetato de etilo (olor a frutas, disolvente). Reacción reversible — se favorece con exceso de alcohol o extracción de agua." },
    ],
    educacion: {
      teoriaResumida: "El etanol es el segundo líquido orgánico más producido industrialmente (después del metanol). Es miscible con agua en todas proporciones gracias a los puentes H que forma el grupo –OH. La fermentación alcohólica (C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂) es una de las biotransformaciones más antiguas de la humanidad (∼10.000 años) y la base del bioetanol como combustible renovable.",
      erroresComunes: [
        "Confundir etanol (C₂H₅OH, potable en concentraciones adecuadas) con metanol (CH₃OH, tóxico, produce ceguera).",
        "Creer que el etanol y el éter dietílico son lo mismo — son compuestos diferentes (C₂H₅OH vs C₂H₅OC₂H₅).",
        "Olvidar que el acetaldehído (no el etanol) es el principal responsable de la toxicidad de la resaca.",
        "Confundir 'grados Brix' (azúcar en mosto) con 'grados de alcohol' (% vol. de etanol).",
      ],
      ejerciciosPrincipiante: ["¿Cómo se produce el alcohol en la fermentación?", "¿Por qué el alcohol se mezcla con agua?", "¿Por qué el etanol arde?"],
      ejerciciosSecundario: ["Calcula los moles de CO₂ producidos al fermentar 180 g de glucosa.", "Escribe la reacción de oxidación del etanol a ácido acético (dos pasos).", "Calcula el calor liberado al quemar 46 g de etanol (ΔHc = −1367 kJ/mol)."],
      ejerciciosUniversitario: ["Calcula el rendimiento teórico de etanol por fermentación de 1 kg de glucosa y compáralo con el valor industrial.", "Diseña una síntesis de acetato de etilo a partir de etanol maximizando el rendimiento (Le Châtelier).", "Explica por qué la mezcla 95.6% etanol / 4.4% agua es un azeótropo (no se puede separar por destilación normal)."],
    },
  },

  // ── C₆H₁₂O₆ ──────────────────────────────────────────────────────────────
  "C6H12O6": {
    formula: "C6H12O6", formulaDisplay: "C₆H₁₂O₆",
    nombre: "Glucosa (D-glucosa)", familia: "Monosacárido (azúcar simple, carbohidrato)", color: "green", masaMolar: 180.156,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Glucosa",
      stock: "No aplica nomenclatura inorgánica a orgánicos complejos",
      sistematica: "(2R,3S,4R,5R)-2,3,4,5,6-pentahidroxihexanal (forma abierta, IUPAC)",
      tipo: "Monosacárido aldopentosa-6 (aldosa de 6 C); en solución existe mayoritariamente como glucopiranosa (forma cíclica)",
      nota: "La glucosa existe en 3 formas: cadena abierta (aldehído), α-D-glucopiranosa (OH anomérico axial) y β-D-glucopiranosa (OH anomérico ecuatorial). En solución acuosa: ~0.002% cadena abierta, ~36% α, ~64% β.",
    },
    lewis: {
      descripcion: "Forma abierta: cadena de 6C con grupo aldehído (–CHO) en C1 y grupos –OH en C2–C6. Forma cíclica (pyranosa): el –OH de C5 ataca al C1 aldehídico, formando un anillo de 6 miembros con un enlace O glicosídico.",
      esIonico: false, electronosValenciaTotal: 96,
      atomoCentral: "C1 (anomérico)", paresLibresCentral: 0, enlacesSimples: 11, enlacesDobles: 1, enlacesTriples: 0,
      notaResonancia: "En solución acuosa, la glucosa muta-rota entre las formas α y β pasando por la forma abierta (mutarrotación). La mezcla equilibrio tiene [α]D²⁰ = +52.7°.",
    },
    vsepr: {
      descripcion: "Todos los C son sp³ en la forma piranosa (tetraédrico, AX₄). El C1 en la forma aldehídica (cadena abierta) es sp² (AX₃, plano trigonal). La conformación de silla de la glucopiranosa permite que todos los grupos voluminosos (OH, CH₂OH) sean ecuatoriales en β-D-glucosa.",
      esIonico: false, notacionAXE: "C piranosa: AX₄ / C1 aldehído: AX₃",
      geometriaElectronica: "C: tetraédrica / C1 aldehído: trigonal plana",
      geometriaMolecular: "Conformación silla (β-D-glucopiranosa, más estable)",
      anguloEnlace: "C–O–C glicosídico: ≈113° / C–C–C: ≈109.5°", hibridacion: "C: sp³ (piranosa)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Covalente polar",
      diferenciaEN: 1.24, momentoDipolar: "múltiple (5 grupos OH)",
      explicacion: "Cinco grupos –OH con ΔEN(O–H) = 1.24. La glucosa es extremadamente polar (solubilidad en agua: 909 g/L a 25°C). Los múltiples puentes H con el agua explican su extraordinaria solubilidad.",
    },
    formacion: {
      proceso: "Fotosíntesis: CO₂ y H₂O se convierten en glucosa usando energía lumínica (clorofila). Base de toda la cadena trófica de la Tierra.",
      ecuacion: "6 CO₂(g) + 6 H₂O(l) + hν → C₆H₁₂O₆(aq) + 6 O₂(g)  ΔG° = +2870 kJ/mol",
      tipoEnlaceFormado: "Covalente polar (C–O, O–H, C–H, C–C)",
      estadosOxidacion: { "C (promedio)": "0", "H": "+1", "O": "−2" },
      entalpiaFormacion: "−1274 kJ/mol (sólido)",
    },
    reacciones: [
      { nombre: "Combustión (respiración celular)", ecuacion: "C₆H₁₂O₆(aq) + 6 O₂(g) → 6 CO₂(g) + 6 H₂O(l)  ΔHc = −2803 kJ/mol", tipo: "combustión", descripcion: "Respiración aeróbica: proceso inverso a la fotosíntesis. Produce 38 moles de ATP por mol de glucosa. La energía libre (ΔG° = −2870 kJ/mol) impulsa la vida." },
      { nombre: "Fermentación alcohólica", ecuacion: "C₆H₁₂O₆(aq) → 2 C₂H₅OH(aq) + 2 CO₂(g)  ΔG° = −235 kJ/mol", tipo: "descomposición", descripcion: "Vía anaeróbica: las levaduras obtienen 2 moles de ATP por mol de glucosa. Mucho menos eficiente que la respiración aeróbica. Base de la producción de alcohol y pan." },
      { nombre: "Prueba de Benedict/Fehling (aldehídos reductores)", ecuacion: "C₆H₁₂O₆ + 2 Cu²⁺(azul) → ácido glucónico + Cu₂O(s)↓ (rojo ladrillo)", tipo: "redox", descripcion: "El grupo aldehído de la glucosa reduce los iones Cu²⁺ a Cu₂O (precipitado rojo). Prueba diagnóstica para diabetes (glucosa en orina)." },
    ],
    educacion: {
      teoriaResumida: "La glucosa es la molécula energética central de la vida: fuente de energía en respiración (36–38 ATP/molécula), monómero del almidón y la celulosa, y señal regulatoria de la insulina. La diferencia entre α-D-glucosa (almidón, digestible) y β-D-glucosa (celulosa, no digestible) es solo la configuración del C1 anomérico — ¡un solo cambio estereoquímico cambia el alimento de material de construcción!",
      erroresComunes: [
        "Confundir glucosa (C₆H₁₂O₆, monosacárido, dulce) con sacarosa (C₁₂H₂₂O₁₁, disacárido, azúcar de mesa).",
        "Creer que α y β glucosa son compuestos diferentes — son el mismo molécula con diferente configuración en C1.",
        "Olvidar que la celulosa (β-glucosa, enlace β-1,4) y el almidón (α-glucosa, enlace α-1,4) son ambos polímeros de glucosa.",
        "Confundir la fórmula molecular de la glucosa (C₆H₁₂O₆) con la de la fructosa — ambas tienen la misma fórmula (isómeros).",
      ],
      ejerciciosPrincipiante: ["¿Qué es la fotosíntesis en términos de glucosa?", "¿Por qué la glucosa es importante para las células?", "¿Qué diferencia hay entre glucosa y fructosa?"],
      ejerciciosSecundario: ["Escribe la ecuación balanceada de la combustión completa de la glucosa.", "Explica la prueba de Benedict: ¿qué indica el precipitado rojo-ladrillo?", "¿Cuántos ATP se obtienen teóricamente de la respiración aeróbica de 1 mol de glucosa?"],
      ejerciciosUniversitario: ["Calcula la eficiencia energética de la fermentación (ΔG = −235 kJ/mol) vs respiración (ΔG = −2870 kJ/mol).", "Explica la mutarrotación de la glucosa y calcula la composición en equilibrio usando rotaciones ópticas (α: +112.2°, β: +18.7°, equilibrio: +52.7°).", "Compara los puentes de hidrógeno en celulosa (cristalina, insoluble) vs almidón (amorfo, soluble) y justifica sus diferencias de solubilidad."],
    },
  },

  // ── C₂H₄ ─────────────────────────────────────────────────────────────────
  "C2H4": {
    formula: "C2H4", formulaDisplay: "C₂H₄",
    nombre: "Etileno (Eteno)", familia: "Hidrocarburo insaturado (alqueno)", color: "yellow", masaMolar: 28.054,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Etileno",
      stock: "Eteno",
      sistematica: "Eteno",
      tipo: "Alqueno de 2 carbonos (hidrocarburo con doble enlace C=C)",
      nota: "IUPAC prefiere 'eteno'. El nombre 'etileno' es el nombre trivial más usado industrialmente. Es el monómero del polietileno (PE) y la molécula orgánica de síntesis más producida del mundo (∼200 Mt/año).",
    },
    lewis: {
      descripcion: "2 átomos de C, cada uno sp². Doble enlace C=C: 1 enlace σ (orbital sp-sp) + 1 enlace π (orbitales p-p perpendiculares al plano). Cada C forma 2 enlaces C–H adicionales. 6 átomos, 12 e⁻ de valencia.",
      esIonico: false, electronosValenciaTotal: 12,
      atomoCentral: "C=C (ambos)", paresLibresCentral: 0, enlacesSimples: 4, enlacesDobles: 1, enlacesTriples: 0,
    },
    vsepr: {
      descripcion: "Cada C con 3 grupos enlazantes (1 C=C + 2 C–H), 0 pares libres → AX₃ → trigonal plana → ángulos ≈ 120°. TODA LA MOLÉCULA ES PLANA (los 6 átomos son coplanares). La barrera de rotación alrededor del C=C es alta (~263 kJ/mol) → no hay libre rotación.",
      esIonico: false, notacionAXE: "AX₃ (cada C)",
      geometriaElectronica: "Trigonal plana (cada C)", geometriaMolecular: "Plana (molécula completa coplanar)",
      anguloEnlace: "H–C=C: 121.3° / H–C–H: 117.4°", hibridacion: "sp² (ambos C)",
    },
    polaridad: {
      esPolar: false, tipoEnlace: "Covalente apolar",
      diferenciaEN: 0.35, momentoDipolar: "0 D",
      explicacion: "ΔEN(C–H) = 0.35 (pequeño). Molécula con plano de simetría: los 4 grupos C–H y el enlace C=C se cancelan simétricamente → μ = 0 D. Apolar, no soluble en agua, soluble en disolventes orgánicos.",
    },
    formacion: {
      proceso: "Industrial: craqueo (steam cracking) del etano o nafta a 750–900°C. Es la molécula orgánica más producida industrialmente del mundo.",
      ecuacion: "C₂H₆(g) → C₂H₄(g) + H₂(g)  ΔH = +137 kJ/mol  (craqueo térmico, 750°C)",
      tipoEnlaceFormado: "Covalente (C=C σ+π, C–H σ)",
      estadosOxidacion: { "C": "−2", "H": "+1" },
      entalpiaFormacion: "+52.5 kJ/mol",
    },
    reacciones: [
      { nombre: "Hidrogenación catalítica", ecuacion: "C₂H₄(g) + H₂(g) → C₂H₆(g)  ΔH = −137 kJ/mol  (Ni, Pd o Pt)", tipo: "síntesis", descripcion: "Adición de H₂ al doble enlace. El catalizador (Ni, Pd, Pt) adsorbe y activa el H₂. Base para obtener grasas sólidas de aceites vegetales (margarina)." },
      { nombre: "Polimerización (polietileno)", ecuacion: "n C₂H₄ → [–CH₂–CH₂–]ₙ  (catalizador de Ziegler-Natta)", tipo: "síntesis", descripcion: "La reacción industrial más importante del etileno. Produce polietileno (PE-LD, PE-HD, PE-UHMW). La catálisis de Ziegler-Natta recibió el Nobel en 1963." },
      { nombre: "Hormona vegetal natural", ecuacion: "C₂H₄ + proteínas receptor → maduración (proceso enzimático)", tipo: "síntesis", descripcion: "El etileno es una hormona vegetal gaseosa: induce maduración de frutas, caída de hojas y senescencia. Por eso las frutas cerca de otras maduras maduran más rápido." },
    ],
    educacion: {
      teoriaResumida: "El etileno es la molécula orgánica de síntesis más producida en el mundo (∼200 Mt/año). Es la base del polietileno (material plástico más común del mundo), del anticongelante (etilenglicol), del etanol industrial y de muchos otros productos. Paradójicamente, también es una hormona vegetal (fitohormona) natural que regula la maduración de frutas — los camiones de transporte usan atmósferas controladas de CO₂ para inhibir el etileno y retrasar la maduración.",
      erroresComunes: [
        "Confundir etileno (C₂H₄, doble enlace, plano) con etano (C₂H₆, simple enlace, sin restricción de rotación).",
        "Creer que el doble enlace C=C permite libre rotación — la barrera π (~263 kJ/mol) lo impide a temperatura ambiente.",
        "Olvidar que el etileno es la fitohormona que madura las frutas — base de la tecnología de maduración controlada.",
        "Confundir 'etileno' (nombre trivial) con 'eteno' (nombre IUPAC) — son el mismo compuesto.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el etileno madura las frutas?", "¿Qué diferencia hay entre etileno y polietileno?", "¿Por qué el etileno es 'plano'?"],
      ejerciciosSecundario: ["Dibuja la estructura de Lewis del C₂H₄ e indica la hibridación de cada C.", "Escribe la ecuación de polimerización del etileno y describe la estructura del polietileno.", "¿Por qué la hidrogenación catalítica requiere un catalizador? ¿Qué hace el catalizador?"],
      ejerciciosUniversitario: ["Usando la teoría de orbitales moleculares, describe el enlace σ y π del C₂H₄ y explica por qué hay restricción de rotación.", "Calcula ΔH° de la combustión del etileno a partir de ΔHf° y compáralo con el metano por gramo de combustible.", "Explica el mecanismo de la polimerización del etileno con catalizador de Ziegler-Natta (mecanismo de inserción-migración)."],
    },
  },

  // ── CaCO₃ ─────────────────────────────────────────────────────────────────
  "CaCO3": {
    formula: "CaCO3", formulaDisplay: "CaCO₃",
    nombre: "Carbonato de Calcio", familia: "Sal oxoácida (carbonato metálico)", color: "yellow", masaMolar: 100.087,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Carbonato cálcico",
      stock: "Carbonato de calcio",
      sistematica: "Trioxidocarbonato(2−) de calcio(2+)",
      tipo: "Sal del ácido carbónico (H₂CO₃) con calcio(II)",
      nota: "Minerales naturales: calcita (trigonal, más estable), aragonita (ortorrómbica, metaestable). Presente en mármol, caliza, creta, conchas de moluscos, corales, cáscaras de huevo y huesos.",
    },
    lewis: {
      descripcion: "Compuesto iónico: Ca²⁺ + CO₃²⁻. El ión carbonato tiene resonancia perfecta: C central con 3 grupos C–O equivalentes (1 doble enlace deslocalizado sobre 3 O por resonancia). Cada O tiene carga formal −2/3.",
      esIonico: true, electronosValenciaTotal: 24,
      notaResonancia: "CO₃²⁻ tiene 3 estructuras de resonancia equivalentes (D₃h). Todos los enlaces C–O son iguales (longitud 1.29 Å, entre simple 1.43 Å y doble 1.23 Å). El π deslocalizado cubre los 3 O.",
    },
    vsepr: {
      descripcion: "Ca²⁺ es iónico (no aplica VSEPR). El CO₃²⁻ tiene C central con 3 grupos enlazantes, sin pares libres → AX₃ → trigonal plana perfecta (D₃h, 120°). El ión carbonato es completamente plano.",
      esIonico: true, notacionAXE: "CO₃²⁻: AX₃ (C central)",
      geometriaMolecular: "Ca²⁺: iónico / CO₃²⁻: trigonal plana",
      hibridacion: "sp² (C en CO₃²⁻)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico (Ca–CO₃) / Covalente polar deslocalizado (C–O en CO₃²⁻)",
      diferenciaEN: 2.44, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Ca–O) = 3.44 − 1.00 = 2.44 → iónico. Dentro del CO₃²⁻: los 3 enlaces C–O polares con resonancia perfecta → μ = 0 (cancelación simétrica D₃h).",
    },
    formacion: {
      proceso: "Natural: precipitación biológica de CO₂ + Ca²⁺ disueltos por organismos marinos (fotosíntesis de algas, corales). Geológicamente forma caliza, mármol (metamorfismo) y travertino.",
      ecuacion: "Ca²⁺(aq) + CO₃²⁻(aq) → CaCO₃(s)↓  Ksp = 3.4×10⁻⁹ (calcita)",
      tipoEnlaceFormado: "Iónico (Ca²⁺ + CO₃²⁻)",
      estadosOxidacion: { "Ca": "+2", "C": "+4", "O": "−2" },
      entalpiaFormacion: "−1207.6 kJ/mol",
    },
    reacciones: [
      { nombre: "Reacción con HCl (efervescencia de CO₂)", ecuacion: "CaCO₃(s) + 2 HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑", tipo: "ácido-base", descripcion: "Reacción clásica para identificar carbonatos (efervescencia viva). También explica la erosión de la caliza por lluvia ácida y el 'sarro' en tuberías." },
      { nombre: "Calcinación (producción de cal viva)", ecuacion: "CaCO₃(s) → CaO(s) + CO₂(g)  ΔH = +178 kJ/mol  (>900°C)", tipo: "descomposición", descripcion: "Reacción industrial fundamental: produce CaO (cal viva) para construcción, acero, tratamiento de agua. Emite ∼7% del CO₂ industrial mundial." },
      { nombre: "Disolución en CO₂ (cárstico)", ecuacion: "CaCO₃(s) + CO₂(aq) + H₂O(l) ⇌ Ca²⁺(aq) + 2 HCO₃⁻(aq)", tipo: "ácido-base", descripcion: "El CO₂ del suelo disuelve la caliza, formando cavernas y estalactitas/estalagmitas. La reacción inversa precipita CaCO₃ al desgasificar el CO₂." },
    ],
    educacion: {
      teoriaResumida: "CaCO₃ es el mineral más abundante de la corteza terrestre después del feldespato y el cuarzo. Es la fuente primaria de Ca²⁺ en los ecosistemas acuáticos y la principal reguladora del pH oceánico. La acidificación de los océanos por CO₂ disuelve los arrecifes de coral (CaCO₃) según: CaCO₃ + CO₂ + H₂O → Ca²⁺ + 2HCO₃⁻. La calcinación industrial de CaCO₃ produce el 7–8% de las emisiones globales de CO₂.",
      erroresComunes: [
        "Creer que 'caliza', 'mármol' y 'creta' son compuestos diferentes — todos son CaCO₃ (diferentes formas cristalinas o pureza).",
        "Confundir carbonato de calcio (CaCO₃) con bicarbonato de calcio Ca(HCO₃)₂ — el bicarbonato es soluble, el carbonato no.",
        "Olvidar que la reacción CaCO₃ + HCl produce CO₂ y es la prueba clásica de identificación de carbonatos.",
        "Pensar que el 'sarro' de las tuberías es CaCO₃ puro — es mezcla de CaCO₃, Mg(OH)₂ y otros minerales.",
      ],
      ejerciciosPrincipiante: ["¿Por qué la caliza efervece con vinagre?", "¿De qué está hecho el mármol?", "¿Por qué los corales están en peligro por el CO₂?"],
      ejerciciosSecundario: ["Calcula los gramos de CaCO₃ que reaccionan con 50 mL de HCl 2.0 M.", "Escribe la ecuación de disolución cárstica del CaCO₃ y explica la formación de estalactitas.", "¿Cuántos litros de CO₂ (CNTP) se liberan al calcinar 1 kg de caliza (95% CaCO₃)?"],
      ejerciciosUniversitario: ["Calcula el pH del agua de mar en equilibrio con CaCO₃ y CO₂ atmosférico (Ksp=3.4×10⁻⁹, pKa₁=6.35, pKa₂=10.33).", "Calcula el Ksp de CaCO₃ a 25°C usando ΔGf° de los iones y del sólido.", "Diseña un experimento para medir la tasa de disolución de CaCO₃ en función del pH (relevante para acidificación oceánica)."],
    },
  },

  // ── Na₂CO₃ ────────────────────────────────────────────────────────────────
  "Na2CO3": {
    formula: "Na2CO3", formulaDisplay: "Na₂CO₃",
    nombre: "Carbonato de Sodio", familia: "Sal oxoácida (carbonato alcalino)", color: "blue", masaMolar: 105.988,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Carbonato sódico",
      stock: "Carbonato de disodio",
      sistematica: "Trioxidocarbonato(2−) de disodio",
      tipo: "Sal del ácido carbónico (H₂CO₃) con sodio(I)",
      nota: "Nombres triviales: 'sosa de lavar', 'sosa de Solvay', 'barilla'. Con 10 H₂O de cristalización: Na₂CO₃·10H₂O ('cristal de soda', 'sal de Glauber' del Na). No confundir con NaHCO₃ (bicarbonato de sodio, 'baking soda').",
    },
    lewis: {
      descripcion: "Compuesto iónico: 2 Na⁺ + CO₃²⁻. Na⁺ cede 1 e⁻ cada uno (IE₁ = 496 kJ/mol). CO₃²⁻ tiene resonancia perfecta: C con 3 enlaces C–O equivalentes y deslocalización π sobre los 4 átomos.",
      esIonico: true, electronosValenciaTotal: 24,
      notaResonancia: "CO₃²⁻ tiene resonancia D₃h: todos los enlaces C–O equivalentes (1.29 Å). El ion carbonato es plano y simétrico, análogo al ión nitrato (NO₃⁻) e isoelectrónico con él (24 e⁻).",
    },
    vsepr: {
      descripcion: "2 Na⁺ iónicos + CO₃²⁻ trigonal plano (AX₃ en C central, 120°). Red cristalina monoclínica. El CO₃²⁻ es completamente plano (D₃h) con deslocalización π.",
      esIonico: true, notacionAXE: "CO₃²⁻: AX₃ (C central)",
      geometriaMolecular: "Red cristalina monoclínica / CO₃²⁻: trigonal plana",
      hibridacion: "sp² (C en CO₃²⁻)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico (Na–CO₃) / Covalente deslocalizado (CO₃²⁻)",
      diferenciaEN: 2.51, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(Na–O) = 3.44 − 0.93 = 2.51 → iónico fuerte. El CO₃²⁻ tiene simetría D₃h perfecta → μ = 0 dentro del anión. La solución acuosa es básica por hidrólisis: CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻.",
    },
    formacion: {
      proceso: "Proceso Solvay (industrial, inventado en 1863): CO₂ + NH₃ + NaCl + H₂O → NaHCO₃ (precipita) → Na₂CO₃ (calcinación). Produce ∼45 Mt/año.",
      ecuacion: "2 NaHCO₃(s) → Na₂CO₃(s) + H₂O(g) + CO₂(g)  ΔH = +128 kJ/mol",
      tipoEnlaceFormado: "Iónico (2Na⁺ + CO₃²⁻)",
      estadosOxidacion: { "Na": "+1", "C": "+4", "O": "−2" },
      entalpiaFormacion: "−1130.7 kJ/mol",
    },
    reacciones: [
      { nombre: "Hidrólisis básica (en agua)", ecuacion: "CO₃²⁻(aq) + H₂O(l) ⇌ HCO₃⁻(aq) + OH⁻(aq)  Kb = 2.1×10⁻⁴", tipo: "ácido-base", descripcion: "El CO₃²⁻ es una base moderada (pH de Na₂CO₃ 0.1M ≈ 11.6). Se usa como agente desgrasante en limpieza industrial." },
      { nombre: "Neutralización con HCl", ecuacion: "Na₂CO₃(aq) + 2 HCl(aq) → 2 NaCl(aq) + H₂O(l) + CO₂(g)↑", tipo: "neutralización", descripcion: "Neutralización dibásica con efervescencia. El Na₂CO₃ es un patrón primario de acidimetría (determina la concentración exacta de ácidos)." },
      { nombre: "Reacción con Ca(OH)₂ (ablandamiento de agua)", ecuacion: "Na₂CO₃(aq) + Ca(HCO₃)₂(aq) → 2 NaHCO₃(aq) + CaCO₃(s)↓", tipo: "síntesis", descripcion: "El carbonato de sodio precipita el Ca²⁺ del agua dura permanente como CaCO₃. Uso clásico en ablandamiento de agua industrial." },
    ],
    educacion: {
      teoriaResumida: "Na₂CO₃ es uno de los 10 productos químicos más producidos del mundo. Sus usos principales: fabricación de vidrio (∼50% de la producción), detergentes (suavizante del agua, regulador de pH), industria del papel (proceso kraft), y en la cocina (fideo chino alcalino, mochi, pretzel). El proceso Solvay (inventado por Ernest Solvay en 1861) es uno de los mayores logros de la química industrial del s. XIX.",
      erroresComunes: [
        "Confundir Na₂CO₃ (carbonato, más básico, pH≈11.6) con NaHCO₃ (bicarbonato, menos básico, pH≈8.3) — son distintos.",
        "Olvidar que Na₂CO₃ se hidroliza en agua dando una solución básica (no neutra).",
        "Creer que el bicarbonato de sodio y la soda de lavar son lo mismo — 'baking soda' = NaHCO₃; 'washing soda' = Na₂CO₃.",
        "Confundir Na₂CO₃ (carbonato de sodio) con Na₂SO₄ (sulfato de sodio, sal de Glauber) — aniones diferentes.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el Na₂CO₃ se llama 'sosa de lavar'?", "¿Cómo se diferencia el carbonato del bicarbonato de sodio?", "¿Para qué se usa el Na₂CO₃ en la fabricación de vidrio?"],
      ejerciciosSecundario: ["Calcula el pH de Na₂CO₃ 0.10 M (Kb = 2.1×10⁻⁴).", "Na₂CO₃ es patrón primario: calcula la concentración de HCl si 0.530 g de Na₂CO₃ consume 25.0 mL de HCl.", "Describe el proceso Solvay y las ecuaciones de cada etapa."],
      ejerciciosUniversitario: ["Calcula el pH de una solución de Na₂CO₃ 0.10 M considerando las dos hidrólisis del CO₃²⁻ (pKa₁=6.35, pKa₂=10.33).", "Diseña una titulación con Na₂CO₃ como patrón primario para HCl, indica el indicador adecuado y el punto final.", "Explica por qué el vidrio de sosa-cal-sílice (Na₂O·CaO·6SiO₂) tiene un punto de fusión mucho más bajo que el SiO₂ puro."],
    },
  },

  // ── KNO₃ ─────────────────────────────────────────────────────────────────
  "KNO3": {
    formula: "KNO3", formulaDisplay: "KNO₃",
    nombre: "Nitrato de Potasio", familia: "Sal oxoácida (nitrato alcalino)", color: "rose", masaMolar: 101.103,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Nitrato potásico",
      stock: "Nitrato de potasio",
      sistematica: "Trioxidonitrato(−) de potasio",
      tipo: "Sal del ácido nítrico (HNO₃) con potasio(I)",
      nota: "Nombre histórico: 'salitre' o 'nitro'. K tiene estado de oxidación +1 (no requiere romano). El NO₃⁻ es la base conjugada débil del HNO₃. No confundir con KNO₂ (nitrito de potasio) ni con K₂NO₃.",
    },
    lewis: {
      descripcion: "Compuesto iónico: K⁺ + NO₃⁻. K⁺ es iónico (configuración del Ar). NO₃⁻ tiene resonancia perfecta: N central con 3 grupos N–O equivalentes (1 doble enlace deslocalizado). Total 24 e⁻ en el anión.",
      esIonico: true, electronosValenciaTotal: 24,
      notaResonancia: "NO₃⁻ es isoelectrónico con CO₃²⁻: resonancia D₃h perfecta con 3 estructuras equivalentes N=O, N–O⁻. Todos los enlaces N–O son iguales (1.24 Å).",
    },
    vsepr: {
      descripcion: "K⁺ iónico + NO₃⁻ trigonal plano (N central: AX₃, 120°). Red cristalina ortorrómbica (aragonita-tipo). El anión NO₃⁻ es plano y simétrico (D₃h).",
      esIonico: true, notacionAXE: "NO₃⁻: AX₃ (N central)",
      geometriaMolecular: "Red cristalina ortorrómbica / NO₃⁻: trigonal plana",
      hibridacion: "sp² (N en NO₃⁻)",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico (K–NO₃) / Covalente deslocalizado (NO₃⁻)",
      diferenciaEN: 2.62, momentoDipolar: "N/A (sólido iónico)",
      explicacion: "ΔEN(K–O) = 3.44 − 0.82 = 2.62 → iónico fuerte. Dentro del NO₃⁻: simetría D₃h → μ = 0. La solución acuosa es prácticamente neutra (NO₃⁻ es la base conjugada de HNO₃, ácido fuerte → no hidroliza significativamente).",
    },
    formacion: {
      proceso: "Reacción de HNO₃ con KOH o K₂CO₃. Natural: mineral 'salitre' (Chile, India). Industrial: proceso Haber-Bosch + Ostwald + neutralización con KOH.",
      ecuacion: "KOH(aq) + HNO₃(aq) → KNO₃(aq) + H₂O(l)  ΔH = −57.3 kJ/mol",
      tipoEnlaceFormado: "Iónico (K⁺ + NO₃⁻)",
      estadosOxidacion: { "K": "+1", "N": "+5", "O": "−2" },
      entalpiaFormacion: "−494.6 kJ/mol",
    },
    reacciones: [
      { nombre: "Descomposición térmica (oxidante fuerte)", ecuacion: "2 KNO₃(s) → 2 KNO₂(s) + O₂(g)  ΔH = +239 kJ/mol  (400°C)\n4 KNO₃(s) → 2 K₂O(s) + 4 NO₂(g) + O₂(g)  (>600°C)", tipo: "descomposición", descripcion: "Al calentar, libera O₂ activo: poderoso oxidante. Base de la pólvora negra (KNO₃ + C + S = 75:15:10) y algunos fuegos artificiales." },
      { nombre: "Pólvora negra (oxidación del carbón)", ecuacion: "2 KNO₃(s) + S(s) + 3 C(s) → K₂S(s) + 3 CO₂(g) + N₂(g)  (simplificado)", tipo: "redox", descripcion: "El KNO₃ es el oxidante de la pólvora negra (inventada en China, s. IX). Libera N₂ y CO₂ gaseosos rápidamente → expansión explosiva." },
      { nombre: "Uso como fertilizante (en solución)", ecuacion: "KNO₃(aq) → K⁺(aq) + NO₃⁻(aq)  (disociación completa)", tipo: "descomposición", descripcion: "Fertilizante binario (N+K): aporta simultáneamente nitrógeno (NO₃⁻) y potasio (K⁺), nutrientes esenciales para plantas. Muy soluble (316 g/L a 20°C)." },
    ],
    educacion: {
      teoriaResumida: "El KNO₃ (salitre) es uno de los materiales más históricos de la química: componente de la pólvora negra desde el s. IX (China), fue el material más estratégico de la humanidad durante siglos. Hoy se usa principalmente como fertilizante (principal fuente K+N en agricultura de precisión), en fuegos artificiales, en preservación de alimentos (E252), y como sal fundida en reactores de concentración solar.",
      erroresComunes: [
        "Confundir KNO₃ (nitrato) con KNO₂ (nitrito) — diferente estado de oxidación del N (+5 vs +3).",
        "Creer que KNO₃ en solución es ácido o básico — es prácticamente neutro (pH ≈ 7) porque K⁺ y NO₃⁻ no hidrolizan.",
        "Olvidar que el KNO₃ como oxidante es peligroso en mezclas con materiales orgánicos o reductores.",
        "Confundir el salitre (KNO₃) con el salitre de Chile (NaNO₃, nitratina) — son compuestos diferentes.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el KNO₃ es un componente de la pólvora?", "¿Para qué sirve el KNO₃ en los fertilizantes?", "¿Es el KNO₃ ácido, básico o neutro en agua?"],
      ejerciciosSecundario: ["Escribe la ecuación ajustada de descomposición de KNO₃ a 400°C y a >600°C.", "Calcula el pH de KNO₃ 0.10 M y justifica por qué es cercano a 7.", "¿Cuántos gramos de O₂ libera la descomposición de 50 g de KNO₃ a 400°C?"],
      ejerciciosUniversitario: ["Calcula ΔG° para 2KNO₃ → 2KNO₂ + O₂ a 25°C y determina a qué temperatura se vuelve espontánea.", "Explica la composición y química de la pólvora negra (KNO₃/C/S) y calcula el volumen de gas producido por gramo de mezcla.", "Compara la termodinámica de KNO₃ como oxidante frente a O₂ puro para aplicaciones de almacenamiento de energía (sales fundidas)."],
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

  // ── NH₄⁺ ─────────────────────────────────────────────────────────────────
  "NH4+": {
    formula: "NH4+", formulaDisplay: "NH₄⁺",
    nombre: "Ion Amonio", familia: "Ion poliatómico (catión)", color: "indigo", masaMolar: 18.04,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Ion amonio",
      stock: "Ion amonio",
      sistematica: "Azanio",
      tipo: "Ion poliatómico derivado del amoníaco (base conjugada del NH₃)",
      nota: "El nombre sistemático IUPAC es 'azanio'. Es un catión, no una molécula neutra. Se escribe NH₄⁺ con la carga formal +1 en el N.",
    },
    lewis: {
      descripcion: "El N central (5 e⁻ de valencia) usa su par libre para formar un cuarto enlace N–H con el H⁺ (enlace dativo/coordinado). Total: 4 enlaces simples, 0 pares libres en N. El N tiene carga formal +1. La carga global del ion es +1.",
      esIonico: false, electronosValenciaTotal: 8,
      atomoCentral: "N", paresLibresCentral: 0, enlacesSimples: 4, enlacesDobles: 0, enlacesTriples: 0,
      notaResonancia: "Los 4 enlaces N–H son equivalentes. El par libre del NH₃ forma el cuarto enlace mediante una donación dativa al H⁺.",
    },
    vsepr: {
      descripcion: "4 pares enlazantes + 0 pares libres → geometría tetraédrica perfecta. Ángulo H–N–H = 109.5°. Al eliminar el par libre de NH₃, desaparece la distorsión y el ángulo vuelve al ideal tetraédrico.",
      esIonico: false, notacionAXE: "AX₄",
      geometriaElectronica: "Tetraédrica", geometriaMolecular: "Tetraédrica",
      anguloEnlace: "109.5°", hibridacion: "sp³",
    },
    polaridad: {
      esPolar: false, tipoEnlace: "Covalente polar (enlace N–H) / ion simétrico",
      diferenciaEN: 0.84, momentoDipolar: "0 D",
      explicacion: "Aunque cada enlace N–H es polar (ΔEN = 0.84), la simetría tetraédrica perfecta cancela los 4 vectores dipolares → μ = 0 D. Análogo al CH₄. La carga +1 del ion no genera dipolo molecular neto.",
    },
    formacion: {
      proceso: "Reacción ácido-base de Brønsted-Lowry: NH₃ (base) acepta un protón H⁺ de un ácido. También es una reacción ácido-base de Lewis: el par libre del N en NH₃ dona al H⁺ (ácido de Lewis) formando un enlace dativo.",
      ecuacion: "NH₃(g) + H⁺(aq) → NH₄⁺(aq)   K = 1/Ka = 1.8×10⁹",
      tipoEnlaceFormado: "Covalente dativo (coordinado) N→H",
      estadosOxidacion: { "N": "−3", "H": "+1" },
    },
    reacciones: [
      { nombre: "Formación desde NH₃", ecuacion: "NH₃(aq) + H⁺(aq) → NH₄⁺(aq)", tipo: "ácido-base", descripcion: "Reacción de protonación. NH₃ actúa como base de Brønsted. Muy favorable (K ≈ 1.8×10⁹)." },
      { nombre: "Tampón NH₃ / NH₄⁺", ecuacion: "NH₄⁺(aq) ⇌ NH₃(aq) + H⁺(aq)   Ka = 5.6×10⁻¹⁰  (pKa = 9.25)", tipo: "ácido-base", descripcion: "Equilibrio del par ácido-base conjugado. Base del tampón fisiológico y de laboratorio en rango pH 8–10." },
      { nombre: "Descomposición del cloruro de amonio", ecuacion: "NH₄Cl(s) ⇿ NH₃(g) + HCl(g)   (∼340°C)", tipo: "descomposición", descripcion: "Sales de amonio se descomponen al calentar, liberando NH₃. Proceso reversible: NH₃ + HCl → NH₄Cl al enfriarse." },
      { nombre: "Neutralización con base fuerte", ecuacion: "NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)", tipo: "ácido-base", descripcion: "Reacción que libera NH₃ gaseoso (olor característico). Prueba analítica para detectar iones NH₄⁺: caliente + NaOH → vaho de NH₃ enrojece papel tornasol." },
    ],
    educacion: {
      teoriaResumida: "NH₄⁺ es el ácido conjugado del NH₃ (pKa = 9.25). Es un ácido débil: en solución acuosa establece el equilibrio NH₄⁺ ⇌ NH₃ + H⁺. Sus sales (NH₄Cl, (NH₄)₂SO₄, NH₄NO₃) son electrolitos fuertes ampliamente usados como fertilizantes. La geometría tetraédrica perfecta del NH₄⁺ (sin pares libres) contrasta con la pirámide distorsionada del NH₃.",
      erroresComunes: [
        "Confundir NH₃ con NH₄⁺: NH₃ es la molécula neutra (base débil); NH₄⁺ es su ácido conjugado (catión).",
        "Creer que el enlace N–H en NH₄⁺ es diferente a los otros tres — los 4 enlaces son idénticos e indistinguibles.",
        "Olvidar la carga +1 del ion al escribir reacciones — NH₄⁺ no es neutro.",
        "Pensar que NH₄⁺ es polar — la geometría tetraédrica simétrica da μ = 0 D.",
      ],
      ejerciciosPrincipiante: ["¿Qué ocurre cuando disuelves NH₃ en un ácido fuerte?", "¿Cuál es la diferencia entre NH₃ y NH₄⁺?", "¿Por qué el NH₄Cl en solución tiene pH < 7?"],
      ejerciciosSecundario: ["Dibuja la estructura de Lewis del NH₄⁺ y explica el enlace dativo N→H.", "Calcula el pH de una solución 0.20 M de NH₄Cl (Ka = 5.6×10⁻¹⁰).", "Compara la geometría de NH₃ y NH₄⁺: ángulos, hibridación y pares libres."],
      ejerciciosUniversitario: ["Usando el principio de Le Châtelier, explica cómo el pH afecta la distribución NH₃/NH₄⁺ en un sistema acuoso.", "Calcula el pH de un tampón preparado con 0.15 M NH₃ y 0.25 M NH₄Cl (pKa = 9.25).", "Explica por qué el Ka(NH₄⁺) × Kb(NH₃) = Kw y usa esto para calcular Ka del NH₄⁺."],
    },
  },

  // ── NaOH ─────────────────────────────────────────────────────────────────
  "NaOH": {
    formula: "NaOH", formulaDisplay: "NaOH",
    nombre: "Hidróxido de Sodio", familia: "Hidróxido (base fuerte)", color: "teal", masaMolar: 40.00,
    esCompuestoMVP: true,
    nomenclatura: {
      tradicional: "Sosa cáustica",
      stock: "Hidróxido de sodio",
      sistematica: "Hidróxido de sodio",
      tipo: "Hidróxido metálico de metal alcalino (base fuerte de Arrhenius)",
      nota: "Popularmente 'lejía' en solución concentrada, 'sosa cáustica' en pellets/escamas. El término 'lejía' en España también se aplica a NaClO (hipoclorito); no confundir.",
    },
    lewis: {
      descripcion: "Compuesto iónico: Na⁺ cede su único e⁻ de valencia al O. El ion OH⁻ tiene 1 enlace covalente O–H y 3 pares libres en O. El Na⁺ tiene configuración electrónica de Ne (8 e⁻ en capa de valencia del anión; 0 en Na⁺).",
      esIonico: true, electronosValenciaTotal: 8,
      atomoCentral: "O", paresLibresCentral: 3, enlacesSimples: 1, enlacesDobles: 0, enlacesTriples: 0,
      notaResonancia: "En solución, OH⁻ tiene 3 pares libres en O disponibles para coordinar con cationes metálicos (Lewis).",
    },
    vsepr: {
      descripcion: "Compuesto iónico. El ion OH⁻ aislado tiene geometría lineal (O–H). En la red cristalina, NaOH tiene estructura laminar (Pbnm) con capas de Na⁺ y OH⁻. Al fundir o disolver, los iones se separan completamente.",
      esIonico: true,
      geometriaMolecular: "Red iónica laminar (cristal); iones libres en solución",
    },
    polaridad: {
      esPolar: true, tipoEnlace: "Iónico (Na⁺ · OH⁻) con enlace covalente polar O–H en el ion OH⁻",
      diferenciaEN: 2.23, momentoDipolar: "N/A (compuesto iónico)",
      explicacion: "ΔEN(Na–O) = 3.44 − 1.21 = 2.23 → enlace predominantemente iónico. El ion OH⁻ también tiene enlace O–H covalente polar (ΔEN = 1.24). NaOH en solución disocia completamente: Na⁺(aq) + OH⁻(aq).",
    },
    formacion: {
      proceso: "Proceso cloro-álcali (industrial principal): electrólisis de salmuera (NaCl diluido). En laboratorio: reacción directa del metal Na con agua.",
      ecuacion: "2 NaCl(aq) + 2 H₂O(l) → 2 NaOH(aq) + Cl₂(g) + H₂(g)  (electrólisis, 2.2 V)",
      tipoEnlaceFormado: "Iónico (Na⁺ · OH⁻)",
      estadosOxidacion: { "Na": "+1", "O": "−2", "H": "+1" },
    },
    reacciones: [
      { nombre: "Neutralización con ácido fuerte", ecuacion: "NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l)  ΔH = −57.3 kJ/mol", tipo: "neutralización", descripcion: "Reacción prácticamente irreversible. Neutralización ácido fuerte-base fuerte. El ΔH = −57.3 kJ/mol corresponde a H⁺ + OH⁻ → H₂O." },
      { nombre: "Absorción de CO₂", ecuacion: "2 NaOH(aq) + CO₂(g) → Na₂CO₃(aq) + H₂O(l)", tipo: "ácido-base", descripcion: "Base de depuradores de CO₂ (submarinos, laboratorios, EPIs). Impide el uso de NaOH como estándar primario (absorbe CO₂ del aire)." },
      { nombre: "Saponificación", ecuacion: "RCOOR'(ac) + NaOH(aq) → RCOONa(ac) + R'OH(ac)", tipo: "síntesis", descripcion: "Hidrólisis básica de ésteres. Base de la fabricación de jabones (triglicéridos + NaOH → jabones de ácidos grasos + glicerol)." },
      { nombre: "Disolución del aluminio (anfótero)", ecuacion: "2 Al(s) + 2 NaOH(aq) + 2 H₂O(l) → 2 NaAlO₂(aq) + 3 H₂(g)", tipo: "redox", descripcion: "Reacción peligrosa: produce H₂ inflamable. Diferencia el Al de otros metales; prueba de carácter anfótero del Al₂O₃." },
    ],
    educacion: {
      teoriaResumida: "NaOH es una base fuerte de Arrhenius: en solución acuosa disocia completamente en Na⁺ + OH⁻. Concentraciones de 0.1 M dan pH ≈ 13. Es extremadamente cáustico — destruye tejido biológico por hidrólisis de proteínas y saponificación de lípidos. La reacción de disolución en agua es altamente exotérmica (ΔHdis = −44.5 kJ/mol): NUNCA añadir agua a NaOH sólido, siempre al contrario.",
      erroresComunes: [
        "Confundir NaOH (base fuerte, disociación total) con NH₃ (base débil, Kb = 1.8×10⁻⁵).",
        "Disolver NaOH sólido añadiendo agua encima — provoca ebullición y salpicaduras cáusticas. Añadir NaOH AL agua.",
        "Olvidar que NaOH absorbe CO₂ del aire y no puede usarse como estándar primario en volumetría.",
        "Usar NaOH en recipientes de vidrio borosilicado durante largo tiempo — el álcali ataca la sílice del vidrio.",
      ],
      ejerciciosPrincipiante: ["¿Por qué el NaOH es peligroso al contacto con la piel?", "¿Qué pH tiene una solución 0.1 M de NaOH?", "¿Para qué sirve el NaOH en la fabricación de jabones?"],
      ejerciciosSecundario: ["Calcula el pH de una solución 0.050 M de NaOH.", "Escribe la ecuación de neutralización de NaOH con H₂SO₄ y ajusta los coeficientes.", "Explica por qué NaOH no puede usarse como estándar primario en análisis volumétrico."],
      ejerciciosUniversitario: ["Usando termoquímica, explica por qué la disolución de NaOH en agua es exotérmica a nivel de enlace iónico.", "Calcula el volumen de NaOH 0.25 M necesario para neutralizar 25.0 mL de H₂SO₄ 0.15 M.", "Diseña un experimento para determinar la pureza de una muestra de NaOH usando HCl estándar y un indicador adecuado."],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Properties + Applications data (all 13 MVP compounds)
// ─────────────────────────────────────────────────────────────────────────────
const PROPIEDADES_DATA: Record<string, { propiedades: PerfilPropiedades; aplicaciones: PerfilAplicaciones }> = {
  "H2O": {
    propiedades: {
      estadoFisico: "Líquido (25°C, 1 atm)",
      color: "Incoloro",
      olor: "Inodoro",
      puntoFusion: "0°C (273.15 K)",
      puntoEbullicion: "100°C (373.15 K)",
      densidad: "0.997 g/mL (25°C); máxima a 4°C (1.000 g/mL)",
      solubilidadAgua: "Miscible consigo misma — disolvente universal polar",
      propiedadesQuimicas: [
        "Anfótera: actúa como ácido (dona H⁺) o base (acepta H⁺) según el medio",
        "Kw = [H⁺][OH⁻] = 1.0×10⁻¹⁴ a 25°C — base del pH",
        "Forma puentes de hidrógeno intermoleculares (∼20 kJ/mol), explicando su alto Peb",
        "Hidroliza sales, ésteres, proteínas y carbohidratos",
        "Alto calor específico: 4.184 J/(g·K) — excelente regulador térmico",
      ],
    },
    aplicaciones: {
      industrial: [
        "Refrigerante en reactores nucleares y plantas termoeléctricas",
        "Vapor de agua en turbinas para generación eléctrica (ciclo Rankine)",
        "Disolvente en síntesis química, electrodeposición y extracción",
        "Producción de hidrógeno por electrólisis (hidrógeno verde)",
      ],
      cotidiano: [
        "Agua potable: 2 L/día de ingesta recomendada por la OMS",
        "Cocción, higiene personal, limpieza doméstica",
        "Riego agrícola: 70% del agua dulce mundial se destina a riego",
        "Piscinas, fontanería, calefacción por agua caliente",
      ],
      biologico: [
        "Principal componente celular: 60–70% de la masa corporal humana",
        "Disolvente de nutrientes, iones y gases en sangre y linfa",
        "Reactivo en fotosíntesis y respiración celular aerobia",
        "Termorregulación: el sudor (evaporación) extrae ∼2400 kJ/L",
      ],
      importanciaAmbiental: "Ciclo hidrológico global: regula el clima, erosión, transporte de nutrientes y hábitat de todos los ecosistemas acuáticos. El vapor de agua es el gas de efecto invernadero más abundante de la Tierra.",
    },
  },
  "CO2": {
    propiedades: {
      estadoFisico: "Gas (25°C, 1 atm); sólido ('hielo seco') a −78.5°C",
      color: "Incoloro",
      olor: "Inodoro; levemente ácido a concentraciones >5%",
      puntoFusion: "−78.5°C (sublimación a 1 atm; punto triple a 5.11 atm, −56.6°C)",
      puntoEbullicion: "−78.5°C (sublima directamente a 1 atm)",
      densidad: "1.977 g/L (gas, 0°C, 1 atm); 1.562 g/mL (líquido, 20°C, 57 atm)",
      solubilidadAgua: "0.035 g/100 mL (25°C, 1 atm); Ka₁ = 4.3×10⁻⁷ → H₂CO₃/HCO₃⁻",
      propiedadesQuimicas: [
        "Óxido ácido: reacciona con bases → carbonatos y bicarbonatos",
        "Absorbente de radiación infrarroja (15 μm): gas de efecto invernadero",
        "Solvente supercrítico a T > 31.1°C, P > 73.8 atm (CO₂-sc): extrae cafeína, aromas",
        "No es inflamable ni comburente; apaga fuegos al desplazar O₂",
        "Sublima a −78.5°C: no deja residuo líquido a presión normal",
      ],
    },
    aplicaciones: {
      industrial: [
        "Extintores de CO₂ (clase B y C: líquidos inflamables, equipos eléctricos)",
        "Refrigerante R-744 en sistemas de aire acondicionado (bajo GWP = 1)",
        "Solvente supercrítico para descafeinado del café y extracción de lúpulo",
        "Neutralización de aguas alcalinas en tratamiento de aguas residuales",
      ],
      cotidiano: [
        "Gasificación de bebidas (refrescos, agua mineral, cerveza, champán)",
        "Hielo seco: transporte y conservación de alimentos y vacunas",
        "Atmósfera modificada (MAP) para prolongar vida útil de alimentos",
        "Fotografía e industria creativa: máquinas de humo y efectos especiales",
      ],
      biologico: [
        "Producto final de la respiración celular aerobia: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O",
        "Reactivo en fotosíntesis: 6CO₂ + 6H₂O + hν → glucosa + 6O₂",
        "Regulador del pH sanguíneo: sistema tampón CO₂/HCO₃⁻ (pH 7.35–7.45)",
        "Estímulo respiratorio: aumento de CO₂ activa receptores de quimiorreceptores",
      ],
      importanciaAmbiental: "Principal gas de efecto invernadero de origen antropogénico. La concentración atmosférica superó 420 ppm en 2024 (vs. 280 ppm preindustrial). Causa calentamiento global, acidificación oceánica (pH bajó de 8.25 a 8.10 desde 1750) y blanqueamiento de corales.",
    },
  },
  "NH3": {
    propiedades: {
      estadoFisico: "Gas (25°C, 1 atm); licuado a 20°C a solo 8.5 atm",
      color: "Incoloro",
      olor: "Penetrante, urticante y sofocante; detectable a 5 ppm",
      puntoFusion: "−77.7°C (195.45 K)",
      puntoEbullicion: "−33.4°C (239.75 K)",
      densidad: "0.769 g/L (gas, 0°C); 0.682 g/mL (líquido, −33.4°C)",
      solubilidadAgua: "89.9 g/100 mL (0°C); 31.1 g/100 mL (25°C). Muy soluble. Kb = 1.8×10⁻⁵",
      propiedadesQuimicas: [
        "Base débil de Brønsted (Kb = 1.8×10⁻⁵, pKb = 4.74): NH₃ + H₂O ⇌ NH₄⁺ + OH⁻",
        "Base de Lewis: el par libre del N dona a ácidos de Lewis (metales de transición → complejos)",
        "Combustible: arde en O₂ → N₂ + H₂O (llama amarilla-verde); no autoignición",
        "Refrigerante natural R-717: bajo GWP (0) y alto calor de vaporización (1371 kJ/kg)",
        "Forma puentes de hidrógeno N–H···N; Peb = −33.4°C (mucho mayor que PH₃ = −87.8°C)",
      ],
    },
    aplicaciones: {
      industrial: [
        "Fertilizantes: urea (CH₄N₂O), nitrato amónico (NH₄NO₃), sulfato amónico — alimenta ∼50% humanidad",
        "Síntesis de HNO₃ vía proceso Ostwald (4NH₃ + 5O₂ → 4NO + 6H₂O)",
        "Refrigerante industrial R-717 en plantas frigoríficas grandes",
        "Síntesis de plásticos (nylon, melamina), explosivos (TNT), colorantes",
      ],
      cotidiano: [
        "Limpiadores domésticos (solución acuosa 5–10%): vidrios, superficies",
        "Tintes capilares: abre la cutícula del cabello para penetrar el color",
        "Tratamiento de agua potable (cloraminas como desinfectante)",
      ],
      biologico: [
        "Producto del catabolismo de aminoácidos; detoxificado en hígado como urea (ciclo de la urea)",
        "NH₃ libre es tóxico para neuronas a concentraciones > 50 μM en sangre (encefalopatía hepática)",
        "Sustrato del ciclo del nitrógeno: bacterias nitrificantes (Nitrosomonas) oxidan NH₃ → NO₂⁻",
        "En plantas: fuente de N para síntesis de aminoácidos y nucleótidos",
      ],
      importanciaAmbiental: "Principal contaminante nitrogenado atmosférico de origen agrícola (emisiones de excrementos animales y fertilizantes). Contribuye a la deposición ácida y eutrofización de ecosistemas acuáticos. Ciclo del nitrógeno: fijación biológica (Rhizobium) y proceso Haber-Bosch transforman N₂ → NH₃.",
    },
  },
  "NH4+": {
    propiedades: {
      estadoFisico: "Ion en solución acuosa; sus sales son sólidos cristalinos (ej. NH₄Cl: blanco, 25°C)",
      color: "Incoloro (ion); sus sales suelen ser blancas",
      olor: "Inodoro (ion); NH₄Cl emite NH₃ al calentar",
      puntoFusion: "N/A (ion); NH₄Cl: 338°C (descomp.); NH₄NO₃: 210°C (descomp.)",
      puntoEbullicion: "N/A (ion en solución)",
      densidad: "N/A (ion); NH₄Cl: 1.527 g/cm³; (NH₄)₂SO₄: 1.769 g/cm³",
      solubilidadAgua: "Ion totalmente soluble; NH₄Cl: 39.5 g/100 mL (25°C). pH de solución 0.1 M NH₄Cl ≈ 5.12 (solución levemente ácida)",
      propiedadesQuimicas: [
        "Ácido débil de Brønsted: NH₄⁺ ⇌ NH₃ + H⁺ (Ka = 5.56×10⁻¹⁰, pKa = 9.25)",
        "Par ácido-base conjugado con NH₃ (pKb = 4.74 → pKa + pKb = pKw = 14.00)",
        "Sus sales son electrolitos fuertes: se disocian completamente en agua",
        "Sales de amonio se descomponen al calentar: NH₄Cl → NH₃ + HCl (∼340°C)",
        "NH₄NO₃ es oxidante potente; explosivo cuando se calienta bruscamente",
      ],
    },
    aplicaciones: {
      industrial: [
        "NH₄Cl: fundente en soldadura; fabricación de baterías de carbono-zinc",
        "(NH₄)₂SO₄: fertilizante nitrogenado de liberación rápida (21% N)",
        "NH₄NO₃: fertilizante (34% N) y componente de explosivos ANFO",
        "Carbonato de amonio: agente leudante en pastelería industrial",
      ],
      cotidiano: [
        "NH₄Cl ('sal de amoniaco'): usado en confitería (regaliz nórdico) y medicina tradicional",
        "NH₄HCO₃: levadura química en galletas y panes planos",
        "Cloruro de amonio: componente de las pastillas para la tos y gargarismos",
      ],
      biologico: [
        "Principal forma transportable del N metabólico en organismos acuáticos (excreción amoniotélica)",
        "En vertebrados: la urea (vía ciclo de la urea) desintoxica el NH₄⁺ libre",
        "Tampón NH₃/NH₄⁺ (pKa = 9.25) relevante en soluciones laboratorio de pH 8–10",
        "Ion esencial para la asimilación de nitrógeno en plantas a través de GS/GOGAT",
      ],
      importanciaAmbiental: "Sales de amonio (especialmente NH₄NO₃) son los fertilizantes nitrogenados más usados globalmente. Su exceso causa eutrofización de aguas. El ciclo del nitrógeno convierte NH₄⁺ → NO₃⁻ (nitrificación) y NO₃⁻ → N₂ (desnitrificación).",
    },
  },
  "CH4": {
    propiedades: {
      estadoFisico: "Gas (25°C, 1 atm)",
      color: "Incoloro",
      olor: "Inodoro puro (el 'olor a gas' es del mercaptano añadido como odorant de seguridad)",
      puntoFusion: "−182.5°C (90.65 K)",
      puntoEbullicion: "−161.5°C (111.65 K)",
      densidad: "0.656 g/L (gas, 25°C); 0.422 g/mL (líquido, −161.5°C)",
      solubilidadAgua: "0.0023 g/100 mL (25°C) — prácticamente insoluble (apolar)",
      propiedadesQuimicas: [
        "Alcano más simple: reactivo por radicales (sustitución radicalaria: CH₄ + Cl₂ → CH₃Cl + HCl)",
        "Combustión completa: CH₄ + 2O₂ → CO₂ + 2H₂O (ΔH = −890 kJ/mol, combustible limpio)",
        "Reformado de vapor: CH₄ + H₂O → CO + 3H₂ (800°C, Ni) — fuente de H₂ industrial",
        "Inerte frente a ácidos, bases y oxidantes comunes a temperatura ambiente",
        "Gas de efecto invernadero: GWP₁₀₀ = 27–30 (27–30× más potente que CO₂ en 100 años)",
      ],
    },
    aplicaciones: {
      industrial: [
        "Gas natural (∼90% CH₄): generación eléctrica en turbinas de ciclo combinado",
        "Síntesis de H₂ y CO (gas de síntesis) para proceso Fischer-Tropsch (combustibles sintéticos)",
        "Producción de negro de humo (C): pigmentos, caucho, tintas",
        "Materia prima para metanol (CH₄ + H₂O → CO + 3H₂ → CH₃OH) y amoniaco",
      ],
      cotidiano: [
        "Gas natural doméstico: calefacción, cocina, agua caliente",
        "GNC (gas natural comprimido) y GNL: combustible para vehículos y barcos",
        "Biogás (fermentación anaeróbica): aprovechamiento de residuos agrícolas y urbanos",
      ],
      biologico: [
        "Producido por metanógenos (arqueas anaerobias) en pantanos, tracto digestivo de rumiantes y depósitos de carbono",
        "Vacas: ∼100–200 L CH₄/día (eructos); contribución significativa al calentamiento global",
        "Metabolismo humano: algunas bacterias intestinales producen pequeñas cantidades de CH₄",
      ],
      importanciaAmbiental: "Gas de efecto invernadero con GWP₁₀₀ ≈ 27. Las fuentes principales son: ganadería (32%), explotación de gas/petróleo (33%) y vertederos (20%). Las concentraciones atmosféricas han aumentado de 700 ppb (preindustrial) a más de 1900 ppb (2024).",
    },
  },
  "NaCl": {
    propiedades: {
      estadoFisico: "Sólido cristalino (25°C)",
      color: "Blanco (incoloro como cristal puro)",
      olor: "Inodoro",
      puntoFusion: "801°C (1074 K)",
      puntoEbullicion: "1413°C (1686 K)",
      densidad: "2.165 g/cm³",
      solubilidadAgua: "35.7 g/100 mL (20°C); solución 0.9% m/v = suero fisiológico",
      propiedadesQuimicas: [
        "Electrolito fuerte: disocia completamente en Na⁺(aq) + Cl⁻(aq) → conductividad eléctrica",
        "Sal neutra (pH ≈ 7): catión Na⁺ (ácido muy débil) y anión Cl⁻ (base muy débil) no hidrolizan",
        "Reduce el punto de congelación del agua (crióscopia): 58.5 g NaCl eleva Kb en ∼1.82°C",
        "Fundido conduce electricidad: electrólisis → Na(l) + Cl₂(g) (proceso Downs)",
        "Solubilidad casi independiente de T (solubilidad retrógrada muy pequeña)",
      ],
    },
    aplicaciones: {
      industrial: [
        "Proceso cloro-álcali: electrólisis salmuera → Cl₂ + NaOH + H₂ (base de la industria química)",
        "Conservante alimentario: deshidratación osmótica, inhibición bacteriana",
        "Fundente vial: deshielo de carreteras (baja Pfus a −21°C con 23% NaCl)",
        "Curtido de pieles, fabricación de vidrio (Na₂CO₃ de Solvay usa NaCl)",
      ],
      cotidiano: [
        "Condimento universal: amplificador de sabores por estimulación del receptor ENaC",
        "Conservación de alimentos (salazón): jamones, bacalao, encurtidos, quesos",
        "Solución salina isotónica 0.9%: suero fisiológico, solución de contactos",
        "Gargarismos salinos: alivio de dolor de garganta por efecto osmótico",
      ],
      biologico: [
        "Principal catión extracelular (Na⁺): regula presión osmótica y volumen plasmático",
        "Potencial de acción neuronal: la entrada de Na⁺ (canales de Na⁺ voltaje-dependientes) despolariza la membrana",
        "Ingesta diaria recomendada: <5 g NaCl/día (OMS); el exceso causa hipertensión arterial",
        "Equilibrio ácido-base renal: reabsorción de Na⁺ acoplada a secreción de H⁺",
      ],
      importanciaAmbiental: "Fuentes: evaporación del agua de mar (sal marina) y minería de halita. La salinización de suelos agrícolas por riego con agua salina afecta a >20% de las tierras irrigadas mundiales. La contaminación de acuíferos con NaCl de las carreteras es un problema creciente en climas fríos.",
    },
  },
  "HCl": {
    propiedades: {
      estadoFisico: "Gas (25°C, 1 atm) / líquido como solución acuosa (ácido clorhídrico)",
      color: "Incoloro",
      olor: "Fuertemente ácido, picante e irritante; TLV = 5 ppm (ACGIH)",
      puntoFusion: "−114.2°C (158.95 K)",
      puntoEbullicion: "−85.1°C (188.05 K) para el gas puro",
      densidad: "1.639 g/L (gas, 25°C); 1.179 g/mL (sol. 37% en agua, 'ácido muriático')",
      solubilidadAgua: "82.3 g/100 mL (0°C); 72 g/100 mL (20°C); azeótropo 20.22% m/m a 108.6°C",
      propiedadesQuimicas: [
        "Ácido fuerte: disocia completamente en agua → H₃O⁺ + Cl⁻ (Ka ≈ 10⁷)",
        "Reacciona con metales activos (Zn, Fe, Al): libera H₂ y forma cloruros",
        "Disuelve la mayoría de hidróxidos y carbonatos metálicos",
        "Forma agua regia con HNO₃ (3:1 HCl:HNO₃): disuelve Au y Pt",
        "Fuertemente corrosivo con metales; humos blancos con NH₃",
      ],
    },
    aplicaciones: {
      industrial: [
        "Decapado de acero: elimina óxido de superficies antes de galvanizado o pintado",
        "Síntesis de cloruro de vinilo (PVC): CH₂=CH₂ + Cl₂ → CH₂ClCH₂Cl → CH₂=CHCl + HCl",
        "Producción de gelatina y gluten hidrolizados (hidrólisis ácida de proteínas)",
        "Regulación de pH en piscinas, tratamiento de agua y fabricación de papel",
      ],
      cotidiano: [
        "Componente del jugo gástrico (0.5% HCl, pH 1–2): digestión de proteínas",
        "Limpiadores de baño y piscinas ('salfumán'): elimina cal, óxido y manchas amarillas",
        "Descalcificación de calderas y equipos industriales",
      ],
      biologico: [
        "Jugo gástrico: 0.5% HCl (pH 1.5–2.0) activa el pepsinógeno → pepsina (digestión de proteínas)",
        "Barrera antimicrobiana: mata patógenos ingeridos (Salmonella, H. pylori parcialmente)",
        "El déficit de HCl (hipoclorhidria) causa malabsorción de B₁₂, hierro y calcio",
        "H. pylori sobrevive al HCl gástrico produciendo ureasa (NH₃ tampona el ácido local)",
      ],
      importanciaAmbiental: "El HCl gaseoso, liberado en incendios de PVC y volcanes, contribuye a la lluvia ácida. Los clorofluorocarbonos (CFC) liberan Cl· en la estratosfera, destruyendo el ozono. Tratamiento adecuado de residuos ácidos en industria para prevenir contaminación de acuíferos.",
    },
  },
  "HNO3": {
    propiedades: {
      estadoFisico: "Líquido (25°C, 1 atm)",
      color: "Incoloro (puro); amarillo pálido a naranja (por descomposición parcial → NO₂)",
      olor: "Sofocante, fuertemente oxidante; irritante de vías respiratorias",
      puntoFusion: "−41.6°C (231.55 K)",
      puntoEbullicion: "83°C (puro); azeótropo 68.4% → 120.5°C",
      densidad: "1.51 g/mL (puro, 100%); 1.42 g/mL (concentrado 68%)",
      solubilidadAgua: "Miscible en todas proporciones",
      propiedadesQuimicas: [
        "Ácido fuerte: disocia completamente en solución diluida → H₃O⁺ + NO₃⁻",
        "Oxidante potente: HNO₃ concentrado pasiva Fe, Al, Cr, Co, Ni (óxido protector)",
        "Con cobre: HNO₃ diluido → NO; concentrado → NO₂ (gases tóxicos)",
        "Forma agua regia (3:1 HCl:HNO₃): disuelve Au y Pt",
        "Reacción de nitración con aromáticos (HNO₃ + H₂SO₄ → NO₂⁺): síntesis de explosivos y colorantes",
      ],
    },
    aplicaciones: {
      industrial: [
        "Fabricación de fertilizantes: NH₃ + HNO₃ → NH₄NO₃ (nitrato de amonio, 34% N)",
        "Síntesis de explosivos: nitración de glicerina (nitroglicerina), tolueno (TNT), celulosa (piroxilina)",
        "Procesado de metales: decapado y grabado del acero inoxidable",
        "Síntesis de colorantes, plásticos y productos farmacéuticos vía nitración aromática",
      ],
      cotidiano: [
        "Muy pocas aplicaciones domésticas directas por su peligrosidad",
        "Grabado artístico en cobre y zinc (aguafuerte/etching)",
      ],
      biologico: [
        "No tiene rol biológico directo; los nitratos (NO₃⁻) de fertilizantes llegan a agua potable y pueden causar metahemoglobinemia en lactantes (síndrome del bebé azul)",
        "El NO₃⁻ en saliva se reduce a NO₂⁻ por bacterias bucales → precursor del óxido nítrico (NO) vasodilatador",
      ],
      importanciaAmbiental: "La lluvia ácida contiene HNO₃ (del NO₂ → HNO₃ en la atmósfera, émision de vehículos y plantas). El exceso de nitratos en aguas superficiales causa eutrofización. Tema central en química ambiental y legislación de calidad del agua.",
    },
  },
  "H2SO4": {
    propiedades: {
      estadoFisico: "Líquido viscoso (oleoso) (25°C, 1 atm)",
      color: "Incoloro a amarillo pálido",
      olor: "Inodoro (diluido); vapores de SO₃ acre en concentrado caliente",
      puntoFusion: "10.4°C (283.55 K) — solidifica cerca de temperatura ambiente",
      puntoEbullicion: "337°C (610 K) (concentrado)",
      densidad: "1.840 g/mL (concentrado 98%); 1.225 g/mL (solución 35%)",
      solubilidadAgua: "Miscible; disolución ALTAMENTE exotérmica (ΔH = −880 kJ/kg). SIEMPRE añadir ácido al agua, nunca al revés.",
      propiedadesQuimicas: [
        "Ácido dibásico fuerte: Ka₁ ≈ ∞ (primer H); Ka₂ = 1.2×10⁻² (segundo H, ligeramente débil)",
        "Agente deshidratante: carboniza sacarosa C₁₂H₂₂O₁₁ → 12C + 11H₂O (efecto espectacular)",
        "Oxidante concentrado en caliente: disuelve Cu, S, C; produce SO₂",
        "Forma HSO₄⁻ (bisulfato) con 1 mol base; SO₄²⁻ (sulfato) con 2 mol base",
        "Produce SO₃ por deshidratación: H₂SO₄ → SO₃ + H₂O (oleum en exceso de SO₃)",
      ],
    },
    aplicaciones: {
      industrial: [
        "Fertilizantes: reacción con fosfatos → superfosfato de calcio (mayor producción química mundial)",
        "Baterías de plomo-ácido: PbO₂ + Pb + 2H₂SO₄ ⇌ 2PbSO₄ + 2H₂O",
        "Petroquímica: alquilación del isobutano; refinado de petróleo",
        "Síntesis química: producción de HCl, HNO₃, ácido fosfórico y decenas de compuestos",
      ],
      cotidiano: [
        "Baterías de automóvil (ácido de batería, 37% H₂SO₄)",
        "Limpiadores de desagüe y desincrustantes de cal (concentrado)",
        "Antifúngico en algunos productos para pieles (muy diluido)",
      ],
      biologico: [
        "No tiene función biológica directa",
        "El SO₄²⁻ es un anión biológico importante: conjugación hepática (sulfatación) de xenobióticos",
        "Lluvia ácida (SO₂ → H₂SO₄): acidifica suelos y lagos, daña ecosistemas forestales",
      ],
      importanciaAmbiental: "La lluvia ácida contiene H₂SO₄ derivado del SO₂ (emisiones de centrales térmicas de carbón y fundiciones). La producción de H₂SO₄ (proceso de contacto: S→SO₂→SO₃→H₂SO₄) es un indicador del desarrollo industrial. El ácido de lluvia ha dañado bosques y acidificado lagos en Europa y Norteamérica.",
    },
  },
  "CH3COOH": {
    propiedades: {
      estadoFisico: "Líquido (25°C, 1 atm); sólido 'ácido acético glacial' < 16.6°C",
      color: "Incoloro",
      olor: "Vinagre, ácre, punzante; TLV = 10 ppm",
      puntoFusion: "16.6°C (289.75 K) — 'glacial' porque se solidifica en días fríos",
      puntoEbullicion: "117.9°C (391.05 K)",
      densidad: "1.049 g/mL (25°C, puro); 1.005 g/mL (5% en agua = vinagre)",
      solubilidadAgua: "Miscible en todas proporciones. Ka = 1.76×10⁻⁵ (pKa = 4.76)",
      propiedadesQuimicas: [
        "Ácido débil monocarboxílico: CH₃COOH ⇌ CH₃COO⁻ + H⁺ (Ka = 1.76×10⁻⁵, pKa = 4.76)",
        "Par ácido-base conjugado con acetato CH₃COO⁻: tampón acético en pH 3.76–5.76",
        "Reacciona con alcoholes (esterificación Fischer): CH₃COOH + ROH ⇌ RCOO R + H₂O",
        "Reacciona con bases fuertes: CH₃COOH + NaOH → CH₃COONa + H₂O",
        "Anhídrido acético ((CH₃CO)₂O) y cloruro de acetilo (CH₃COCl) son agentes acetilantes más reactivos",
      ],
    },
    aplicaciones: {
      industrial: [
        "Fabricación de acetato de celulosa (fibra textil, películas fotográficas, filtros de cigarrillos)",
        "Síntesis de aspirina (ácido acetilsalicílico): HOC₆H₄COOH + (CH₃CO)₂O → ASA",
        "Producción de acetona (CH₃COCH₃) y acetato de etilo (disolvente, esmaltes)",
        "Conservante alimentario (E260): encurtidos, mayonesa, salsas",
      ],
      cotidiano: [
        "Vinagre (5–8% CH₃COOH): condimento, conservación, limpieza de cal y óxido",
        "Descalcificador doméstico: reacciona con CaCO₃ de la cal",
        "Eliminación de manchas de pH alcalino (jabón, detergente)",
      ],
      biologico: [
        "Acetil-CoA (thioéster del ácido acético): molécula central del metabolismo energético (ciclo de Krebs)",
        "Producto de la fermentación acética: Acetobacter oxida etanol → ácido acético",
        "Neurotransmisor indirecto: la colina + Acetil-CoA → acetilcolina (ACh) por colin-acetiltransferasa",
        "Regulador epigenético: la acetilación de histonas (por HATs) activa genes",
      ],
      importanciaAmbiental: "Biodegradable: los microorganismos lo utilizan como fuente de carbono (acetoclástica metanogénesis en condiciones anaerobias). No persiste en el ambiente. El vinagre se ha usado milenariamente como conservante y limpiador, reduciendo el uso de biocidas sintéticos.",
    },
  },
  "NaOH": {
    propiedades: {
      estadoFisico: "Sólido (pellets, escamas o polvo) (25°C)",
      color: "Blanco",
      olor: "Inodoro",
      puntoFusion: "318°C (591 K)",
      puntoEbullicion: "1388°C (1661 K)",
      densidad: "2.13 g/cm³",
      solubilidadAgua: "111 g/100 mL (20°C) — muy soluble; exotérmica (ΔH = −44.5 kJ/mol). pH 0.1 M ≈ 13.0",
      propiedadesQuimicas: [
        "Base fuerte de Arrhenius: disocia completamente → Na⁺(aq) + OH⁻(aq)",
        "Absorbe CO₂ y H₂O del aire: NaOH + CO₂ → Na₂CO₃; debe guardarse herméticamente",
        "Corrosivo protéico: hidrólisis de enlaces peptídicos → destruye tejido biológico (quemadura química)",
        "Saponifica grasas: triglicérido + 3NaOH → 3 jabones (RCOO⁻Na⁺) + glicerol",
        "Ataca al vidrio a largo plazo: SiO₂ + 2NaOH → Na₂SiO₃ + H₂O (no guardar en vidrio)",
      ],
    },
    aplicaciones: {
      industrial: [
        "Proceso cloro-álcali: coproducto con Cl₂ en electrólisis de salmuera (industria química básica)",
        "Fabricación de papel kraft: digestión de madera → pulpa de celulosa (proceso Kraft)",
        "Tratamiento de aguas residuales: neutralización de efluentes ácidos",
        "Producción de jabones, detergentes y biodiesel (transesterificación)",
      ],
      cotidiano: [
        "Sosa cáustica: limpiador de hornos, desatascadores de tuberías (hidroliza grasas y pelo)",
        "Lejía (en combinación con NaClO): limpieza y desinfección del hogar",
        "Curaduría alimentaria: pretzel, olivas negras, huevos centenarios (tratamiento alcalino)",
        "Tintura capilar: abre la cutícula del cabello (pH > 10)",
      ],
      biologico: [
        "Sin función biológica directa; altamente tóxico para tejidos vivos",
        "Quemaduras por NaOH son más profundas que por ácidos (necrosis licuefactiva vs. coagulativa)",
        "El NaOH se usa en laboratorio para ajustar pH de tampones y soluciones biológicas",
        "Digestión alcalina de muestras biológicas (extracción de ADN, digestión de proteínas en análisis)",
      ],
      importanciaAmbiental: "Las aguas residuales alcalinas de NaOH deben neutralizarse antes de verterlas. La industria cloro-álcali requiere mucha energía eléctrica; la transición a energía renovable es clave para su descarbonización. Los productos derivados (jabones, papel) son fundamentales para higiene y sanidad pública.",
    },
  },
  "Ca(OH)2": {
    propiedades: {
      estadoFisico: "Sólido (polvo cristalino blanco) (25°C)",
      color: "Blanco",
      olor: "Inodoro",
      puntoFusion: "512°C (descomposición → CaO + H₂O, no fusión real)",
      puntoEbullicion: "No aplicable (descompone antes de hervir)",
      densidad: "2.211 g/cm³",
      solubilidadAgua: "0.173 g/100 mL (20°C) — poco soluble; solubilidad retrógrada (↓ al calentar). pH sat. ≈ 12.4. 'Agua de cal' = solución saturada",
      propiedadesQuimicas: [
        "Base moderada de Arrhenius: Ca(OH)₂ ⇌ Ca²⁺ + 2OH⁻ (Ksp = 4.68×10⁻⁶)",
        "Base dibásica: neutraliza 2 mol de ácido monoprótico por mol de Ca(OH)₂",
        "Reacciona con CO₂ → CaCO₃↓ (precipitado blanco): prueba clásica para detectar CO₂",
        "Fraguado del mortero: Ca(OH)₂ + CO₂ atmosférico → CaCO₃ (lentamente, semanas/meses)",
        "Solubilidad retrógrada: se disuelve menos al aumentar la temperatura (opuesto a la mayoría de sales)",
      ],
    },
    aplicaciones: {
      industrial: [
        "Construcción: mortero de cal, enlucidos, estuco (mezcla con arena y agua)",
        "Industria del azúcar: clarificación del jugo de caña (neutralización de ácidos, precipitación de impurezas)",
        "Tratamiento de aguas: eliminación de dureza temporal (Ca²⁺ + CO₂ + H₂O) y elevación de pH",
        "Producción de hipoclorito de calcio Ca(ClO)₂ (lejía de piscina): Ca(OH)₂ + Cl₂ → Ca(ClO)Cl + H₂O",
      ],
      cotidiano: [
        "Cal apagada: corrección de suelos ácidos en agricultura (eleva pH del suelo)",
        "Revoque y pintura de cal: paredes blancas tradicionales (efecto antimicrobiano por pH alto)",
        "Encurtidos: elaboración de tortillas y tamales de maíz (nixtamalización con Ca(OH)₂)",
        "Cal de piscinas: elevación del pH del agua",
      ],
      biologico: [
        "Fuente de calcio biodisponible en algunos suplementos y alimentos (tortillas nixtamalizadas)",
        "Endodoncia dental: relleno de conductos radiculares (bactericida por pH elevado)",
        "Desinfección de fosas sépticas y eliminación de patógenos en suelos contaminados",
        "Encalado de pastos: corrección de suelos ácidos mejora absorción de nutrientes por plantas",
      ],
      importanciaAmbiental: "La cal Ca(OH)₂ se produce calcinando CaCO₃ (cal viva CaO) y añadiendo agua. La producción de CaO libera CO₂ (proceso Kraft, cemento). Sin embargo, la carbonatación posterior del Ca(OH)₂ en construcción reabsorbe parte del CO₂. El encalado de suelos y lagos acidificados por lluvia ácida es una medida de mitigación ambiental.",
    },
  },
  "MgS": {
    propiedades: {
      estadoFisico: "Sólido cristalino (25°C)",
      color: "Rojo-naranja (natural, impuro); blanco a amarillento (sintético puro)",
      olor: "Inodoro (puro); olor a huevo podrido (H₂S) en presencia de humedad",
      puntoFusion: ">2000°C (descompone a T alta antes de fundir limpiamente)",
      puntoEbullicion: "No aplica (descompone a T extremas)",
      densidad: "2.68 g/cm³",
      solubilidadAgua: "Reacciona con agua: MgS + H₂O → Mg(OH)₂ + H₂S↑. Prácticamente insoluble como tal",
      propiedadesQuimicas: [
        "Compuesto iónico con ΔEN(Mg–S) = 1.27: en el límite iónico-covalente (reglas de Fajans)",
        "Reacciona con ácidos: MgS + 2HCl → MgCl₂ + H₂S↑ (gas tóxico y maloliente)",
        "Se hidroliza en agua: MgS + H₂O → Mg(OH)₂↓ + H₂S↑",
        "Semiconductor de brecha amplia: Eg ≈ 4.9 eV (potencial uso en electrónica de potencia UV)",
        "Elevada energía reticular (≈3300 kJ/mol) → altísimo punto de fusión",
      ],
    },
    aplicaciones: {
      industrial: [
        "Investigación en semiconductores: semiconductores II–VI de brecha ancha (junto con ZnS, CdS)",
        "Fotoluminiscencia: MgS dopado con Eu²⁺ emite en rojo (pantallas y luces de emergencia)",
        "Síntesis de H₂S controlado en laboratorio: MgS + ácido → H₂S",
        "Estudio de energía reticular en laboratorio de química del estado sólido",
      ],
      cotidiano: [
        "No tiene aplicaciones domésticas directas",
        "El mineral natural (ninigerita) aparece en meteoritos carbonáceos",
      ],
      biologico: [
        "No tiene función biológica conocida directa",
        "El Mg²⁺ liberado es esencial: cofactor de >300 enzimas, incluida la ATP-sintasa",
        "El S²⁻ liberado puede reaccionar con proteínas (grupos tiol); se relaciona con metabolismo del azufre en bacterias sulfato-reductoras",
      ],
      importanciaAmbiental: "Compuesto de interés geoquímico: MgS aparece en meteoritos condríticos y en depósitos de reducción de sulfatos en entornos anóxicos. Su hidrólisis libera H₂S, gas tóxico con LT50 inhalación en roedores a ∼600 ppm (similar al HCN). Relevante en química de sedimentos marinos.",
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
  // Ion amonio (main branch addition)
  "nh4+": "NH4+", "nh4": "NH4+", "amonio": "NH4+", "ion amonio": "NH4+", "azanio": "NH4+",
  // Bases
  "naoh": "NaOH", "sosa": "NaOH", "lejia": "NaOH", "lejía": "NaOH", "sosa caustica": "NaOH", "sosa cáustica": "NaOH",
  "koh": "KOH",
  "mg(oh)2": "Mg(OH)2", "mgoh2": "Mg(OH)2", "mg(oh)₂": "Mg(OH)2",
  // Ácidos
  "h3po4": "H3PO4", "h2co3": "H2CO3", "h2s": "H2S", "hf": "HF",
  // Óxidos
  "so2": "SO2", "so3": "SO3", "no2": "NO2", "no": "NO",
  "o3": "O3", "n2o": "N2O", "cao": "CaO",
  "fe2o3": "Fe2O3", "fe₂o₃": "Fe2O3",
  // Orgánicos
  "c2h5oh": "C2H5OH", "etanol": "C2H5OH", "ethanol": "C2H5OH",
  "c6h12o6": "C6H12O6", "glucosa": "C6H12O6", "glucose": "C6H12O6",
  "c2h4": "C2H4", "etileno": "C2H4", "eteno": "C2H4",
  // Sales
  "caco3": "CaCO3", "na2co3": "Na2CO3", "kno3": "KNO3",
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
  const base = PERFILES[key];
  if (!base) return null;
  const extras = PROPIEDADES_DATA[key];
  if (!extras) return null;
  return {
    ...base,
    ...extras,
    lewis: { ...base.lewis, lewissvg: LEWIS_SVG[key] },
  };
}
