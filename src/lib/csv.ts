// Parser + limpiador + validador de CSV para importación masiva de pacientes.
// La plataforma NORMALIZA automáticamente las columnas variables para que
// archivos exportados de cualquier fuente (Google Sheets, Excel, formularios
// improvisados) se importen sin necesidad de limpieza manual.
//
// Reglas de normalización:
//  - estado_clinico: fuzzy match contra sinónimos (Crítico/Crítica/Grave/UCI → critico)
//  - sexo: fuzzy match (Masculino/Hombre/Varon → M). Si no se reconoce → "desconocido"
//  - edad_aprox: extrae números de textos como "45 años" / "45a". Si no se puede → null
//  - Todos los strings: trim + colapso de espacios múltiples
//
// Lo que SÍ rechaza filas (errores graves, no se puede inventar):
//  - nombre_completo vacío
//  - centro_salud vacío
//  - estado_clinico completamente irreconocible

import Papa from "papaparse";
import type {
  EstadoClinico,
  Sexo,
  PacienteInsert,
} from "@/lib/supabase/types";

export type CSVRow = {
  nombre_completo?: string;
  edad_aprox?: string;
  sexo?: string;
  estado_clinico?: string;
  descripcion_fisica?: string;
  centro_salud?: string;
  estado_geografico?: string;
  municipio?: string;
  foto_path?: string;
  verificado?: string;
};

export type ParseResult = {
  headers: string[];
  rows: CSVRow[];
  totalRows: number;
};

export type Normalization = {
  field: string;
  from: string;
  to: string;
};

export type RowValidation = {
  index: number;
  raw: CSVRow;
  data: PacienteInsert | null;
  errors: string[];
  warnings: string[];
  normalizations: Normalization[];
};

export type ValidationResult = {
  valid: RowValidation[];
  invalid: RowValidation[];
  totalNormalizations: number;
  ignoredColumns: string[];
};

// Cabeceras aceptadas — case-insensitive, con sinónimos comunes.
// El orden importa: si dos campos comparten un sinónimo, gana el primero.
const HEADER_MAP: Record<keyof CSVRow, string[]> = {
  nombre_completo: [
    "nombre_completo",
    "nombre y apellido",
    "nombres y apellidos",
    "nombre",
    "nombres",
    "apellido y nombre",
    "apellido",
    "apellidos",
    "paciente",
    "name",
    "full name",
    "patient",
  ],
  estado_clinico: [
    "estado_clinico",
    "estado",
    "estado del paciente",
    "estado de salud",
    "status",
    "condicion",
    "condición",
    "situacion",
  ],
  centro_salud: [
    "centro_salud",
    "centro",
    "hospital",
    "centro de salud",
    "center",
    "clínica",
    "clinica",
  ],
  edad_aprox: ["edad_aprox", "edad", "age", "años"],
  sexo: ["sexo", "genero", "género", "gender", "sex"],
  descripcion_fisica: [
    "descripcion_fisica",
    "descripcion",
    "descripción",
    "description",
    "notas",
    "observaciones",
    "detalles",
  ],
  estado_geografico: [
    "estado_geografico",
    "estado_geo",
    "region",
    "región",
    "provincia",
  ],
  municipio: ["municipio", "municipality", "city", "ciudad", "localidad"],
  foto_path: ["foto_path", "foto", "photo", "image", "imagen"],
  verificado: ["verificado", "verified", "confirmado"],
};

const ESTADOS_VALIDOS: EstadoClinico[] = [
  "estable",
  "critico",
  "sin_identificar",
  "fallecido",
];

const SEXOS_VALIDOS: Sexo[] = ["M", "F", "desconocido"];

// Sinónimos para estado_clinico. Clave en minúsculas, sin acentos.
// Cobertura: palabras completas Y fragmentos ("muy grave" matchea "critico").
const ESTADO_SINONIMOS: Record<string, EstadoClinico> = {
  // estable
  "estable": "estable",
  "estables": "estable",
  "estable, alta": "estable",
  "alta": "estable",
  "altas": "estable",
  "egresado": "estable",
  "egresada": "estable",
  "egresado/a": "estable",
  "recuperado": "estable",
  "recuperada": "estable",
  "mejoria": "estable",
  "mejoría": "estable",
  "buen estado": "estable",
  "fuera de peligro": "estable",
  // critico
  "critico": "critico",
  "crítico": "critico",
  "critica": "critico",
  "crítica": "critico",
  "criticos": "critico",
  "graves": "critico",
  "grave": "critico",
  "delicado": "critico",
  "delicada": "critico",
  "muy grave": "critico",
  "uci": "critico",
  "ucip": "critico",
  "terapia intensiva": "critico",
  "intubado": "critico",
  "intubada": "critico",
  "inestable": "critico",
  // sin_identificar
  "sin_identificar": "sin_identificar",
  "sin identificar": "sin_identificar",
  "no identificado": "sin_identificar",
  "no identificada": "sin_identificar",
  "sin nombre": "sin_identificar",
  "nn": "sin_identificar",
  "n.n": "sin_identificar",
  "desconocido estado": "sin_identificar",
  "desconocida": "sin_identificar",
  // fallecido
  "fallecido": "fallecido",
  "fallecida": "fallecido",
  "fallecidos": "fallecido",
  "muerto": "fallecido",
  "muerta": "fallecido",
  "muertos": "fallecido",
  "muerte": "fallecido",
  "obito": "fallecido",
  "óbito": "fallecido",
  "deceased": "fallecido",
  "dead": "fallecido",
};

const SEXO_SINONIMOS: Record<string, Sexo> = {
  "m": "M",
  "masculino": "M",
  "hombre": "M",
  "varon": "M",
  "varón": "M",
  "varones": "M",
  "hombres": "M",
  "masculinos": "M",
  "f": "F",
  "femenino": "F",
  "mujer": "F",
  "mujeres": "F",
  "femeninos": "F",
  "femeninas": "F",
  "dama": "F",
  "damas": "F",
  "desconocido": "desconocido",
  "desconocida": "desconocido",
  "no especifica": "desconocido",
  "no especificado": "desconocido",
  "sin especificar": "desconocido",
  "n/a": "desconocido",
  "na": "desconocido",
  "no indica": "desconocido",
  "no se": "desconocido",
  "s/d": "desconocido",
  "sd": "desconocido",
};

export function parseCSV(text: string): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (result) => {
        const headers = result.meta.fields ?? [];
        const rows = result.data as CSVRow[];
        resolve({
          headers,
          rows,
          totalRows: rows.length,
        });
      },
      error: (err: Error) => reject(err),
    });
  });
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function parseEdad(raw: string): number | null {
  const n = normalize(raw);
  if (n.length === 0) return null;
  // Extraer el primer número entero del texto.
  const m = n.match(/\d+/);
  if (!m) return null;
  const num = Number(m[0]);
  if (Number.isNaN(num) || num < 0 || num > 130) return null;
  return Math.floor(num);
}

function normalizeEstado(raw: string): {
  value: EstadoClinico | null;
  matched: boolean;
} {
  const n = normalize(raw);
  if (n.length === 0) return { value: null, matched: false };
  // 1) match exacto contra el esquema
  if (ESTADOS_VALIDOS.includes(n as EstadoClinico)) {
    return { value: n as EstadoClinico, matched: true };
  }
  // 2) fuzzy contra sinónimos
  const alias = ESTADO_SINONIMOS[n];
  if (alias) {
    return { value: alias, matched: true };
  }
  // 3) contiene alguna palabra clave (para textos largos tipo "paciente crítico")
  for (const [key, val] of Object.entries(ESTADO_SINONIMOS)) {
    if (n.includes(key)) {
      return { value: val, matched: true };
    }
  }
  return { value: null, matched: false };
}

function normalizeSexo(raw: string): Sexo {
  const n = normalize(raw);
  if (n.length === 0) return "desconocido";
  // 1) match exacto
  if (SEXOS_VALIDOS.includes(n as Sexo)) {
    return n as Sexo;
  }
  // 2) fuzzy
  const alias = SEXO_SINONIMOS[n];
  if (alias) return alias;
  // 3) primer carácter como heurística (M/F)
  if (n[0] === "m") return "M";
  if (n[0] === "f") return "F";
  return "desconocido";
}

export function buildHeaderMap(headers: string[]): Record<string, keyof CSVRow> {
  const lower = headers.map((h) => h.trim().toLowerCase());
  const map: Record<string, keyof CSVRow> = {};
  for (let i = 0; i < lower.length; i++) {
    for (const [field, aliases] of Object.entries(HEADER_MAP) as Array<
      [keyof CSVRow, string[]]
    >) {
      if (aliases.includes(lower[i])) {
        map[headers[i]] = field;
      }
    }
  }
  return map;
}

function normalizeRow(
  raw: Record<string, string>,
  headerToField: Record<string, keyof CSVRow>,
): CSVRow {
  const out: CSVRow = {};
  for (const [csvHeader, value] of Object.entries(raw)) {
    const field = headerToField[csvHeader];
    if (field) {
      out[field] = (value ?? "").toString();
    }
  }
  return out;
}

export function validateRows(
  raw: CSVRow[],
  headerToField: Record<string, keyof CSVRow>,
  registradoPor: string,
): ValidationResult {
  const valid: RowValidation[] = [];
  const invalid: RowValidation[] = [];
  let totalNormalizations = 0;

  raw.forEach((rawRow, idx) => {
    const normalized = normalizeRow(
      rawRow as Record<string, string>,
      headerToField,
    );
    const errors: string[] = [];
    const warnings: string[] = [];
    const normList: Normalization[] = [];

    // ----- nombre_completo (obligatorio) -----
    const nombreRaw = normalized.nombre_completo ?? "";
    const nombre_completo = nombreRaw.replace(/\s+/g, " ").trim();
    if (!nombre_completo) {
      errors.push("Falta nombre_completo");
    } else if (nombre_completo.length > 120) {
      errors.push("nombre_completo > 120 chars");
    } else if (nombre_completo !== nombreRaw.trim()) {
      normList.push({
        field: "nombre_completo",
        from: nombreRaw,
        to: nombre_completo,
      });
    }

    // ----- centro_salud (obligatorio) -----
    const centroRaw = normalized.centro_salud ?? "";
    const centro_salud = centroRaw.replace(/\s+/g, " ").trim();
    if (!centro_salud) {
      errors.push("Falta centro_salud");
    } else if (centro_salud.length > 120) {
      errors.push("centro_salud > 120 chars");
    } else if (centro_salud !== centroRaw.trim()) {
      normList.push({
        field: "centro_salud",
        from: centroRaw,
        to: centro_salud,
      });
    }

    // ----- estado_clinico (obligatorio, fuzzy) -----
    const estadoRaw = normalized.estado_clinico ?? "";
    const estadoResult = normalizeEstado(estadoRaw);
    const estado_clinico: EstadoClinico | null = estadoResult.value;
    if (!estadoResult.matched) {
      if (estadoRaw.trim().length === 0) {
        errors.push("Falta estado_clinico");
      } else {
        errors.push(
          `estado_clinico irreconocible: "${estadoRaw}" (usa: ${ESTADOS_VALIDOS.join(", ")})`,
        );
      }
    } else if (estado_clinico !== normalize(estadoRaw)) {
      normList.push({
        field: "estado_clinico",
        from: estadoRaw,
        to: estado_clinico!,
      });
    }

    // ----- edad_aprox (opcional, extracción fuzzy) -----
    const edadRaw = normalized.edad_aprox ?? "";
    let edad_aprox: number | null = null;
    if (edadRaw.trim().length > 0) {
      edad_aprox = parseEdad(edadRaw);
      if (edad_aprox === null) {
        warnings.push(
          `edad_aprox no se pudo interpretar: "${edadRaw}" (se dejó vacío)`,
        );
      } else if (String(edad_aprox) !== edadRaw.trim()) {
        normList.push({
          field: "edad_aprox",
          from: edadRaw,
          to: String(edad_aprox),
        });
      }
    }

    // ----- sexo (opcional, fuzzy → desconocido si no matchea) -----
    const sexoRaw = normalized.sexo ?? "";
    let sexo: Sexo | null = null;
    if (sexoRaw.trim().length > 0) {
      sexo = normalizeSexo(sexoRaw);
      if (sexo === "desconocido" && normalize(sexoRaw).length > 0 && !SEXO_SINONIMOS[normalize(sexoRaw)]) {
        warnings.push(
          `sexo no reconocido: "${sexoRaw}" (se guardó como desconocido)`,
        );
      } else if (sexo !== normalize(sexoRaw).toUpperCase() && sexo !== "desconocido") {
        normList.push({
          field: "sexo",
          from: sexoRaw,
          to: sexo,
        });
      }
    } else {
      sexo = "desconocido";
    }

    // ----- campos opcionales de texto -----
    const descripcion_fisica =
      (normalized.descripcion_fisica ?? "").replace(/\s+/g, " ").trim() || null;
    const estado_geografico =
      (normalized.estado_geografico ?? "").replace(/\s+/g, " ").trim() || null;
    const municipio =
      (normalized.municipio ?? "").replace(/\s+/g, " ").trim() || null;
    const foto_path = (normalized.foto_path ?? "").trim() || null;

    // ----- verificado -----
    const verificadoRaw = (normalized.verificado ?? "").trim().toLowerCase();
    const verificado =
      verificadoRaw === "true" ||
      verificadoRaw === "1" ||
      verificadoRaw === "si" ||
      verificadoRaw === "sí" ||
      verificadoRaw === "yes";

    if (errors.length > 0) {
      invalid.push({
        index: idx + 2,
        raw: normalized,
        data: null,
        errors,
        warnings,
        normalizations: normList,
      });
      return;
    }

    if (normList.length > 0) totalNormalizations += normList.length;

    valid.push({
      index: idx + 2,
      raw: normalized,
      data: {
        nombre_completo,
        edad_aprox,
        sexo,
        estado_clinico: estado_clinico!,
        descripcion_fisica,
        centro_salud,
        estado_geografico,
        municipio,
        foto_path,
        registrado_por: registradoPor,
        verificado,
        origen: "csv",
      },
      errors: [],
      warnings,
      normalizations: normList,
    });
  });

  return {
    valid,
    invalid,
    totalNormalizations,
    ignoredColumns: Object.keys(headerToField).length === 0
      ? []
      : [],
  };
}

// Columnas que llegaron en el CSV pero NO se reconocieron.
// Útil para advertir al admin que algo se ignoró.
export function findIgnoredColumns(
  csvHeaders: string[],
  headerToField: Record<string, keyof CSVRow>,
): string[] {
  return csvHeaders.filter((h) => !headerToField[h]);
}

export type { PacienteInsert };