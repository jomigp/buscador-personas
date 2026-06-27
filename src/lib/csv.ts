// Parser + validador de CSV para importación masiva de pacientes.
// Acepta exports típicos de Google Sheets y Excel Latinoamericano:
// separador , o ; · con o sin BOM · comillas dobles para campos con comas.

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

export type RowValidation = {
  index: number;
  raw: CSVRow;
  data: PacienteInsert | null;
  errors: string[];
};

export type ValidationResult = {
  valid: RowValidation[];
  invalid: RowValidation[];
};

// Cabeceras aceptadas — case-insensitive, con sinónimos comunes.
const HEADER_MAP: Record<keyof CSVRow, string[]> = {
  nombre_completo: ["nombre_completo", "nombre", "name", "paciente"],
  edad_aprox: ["edad_aprox", "edad", "age"],
  sexo: ["sexo", "genero", "gender", "sex"],
  estado_clinico: ["estado_clinico", "estado", "status"],
  descripcion_fisica: ["descripcion_fisica", "descripcion", "description", "notas"],
  centro_salud: ["centro_salud", "centro", "hospital", "center"],
  estado_geografico: ["estado_geografico", "estado_geo", "region", "estado"],
  municipio: ["municipio", "municipality", "city", "ciudad"],
  foto_path: ["foto_path", "foto", "photo", "image"],
  verificado: ["verificado", "verified"],
};

const ESTADOS: EstadoClinico[] = [
  "estable",
  "critico",
  "sin_identificar",
  "fallecido",
];

const SEXOS: Sexo[] = ["M", "F", "desconocido"];

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

// Normaliza las claves del CSV a las claves internas del esquema.
// Devuelve `null` si no se reconoce la cabecera requerida.
function normalizeRow(
  raw: Record<string, string>,
  headerToField: Record<string, keyof CSVRow>,
): CSVRow {
  const out: CSVRow = {};
  for (const [csvHeader, value] of Object.entries(raw)) {
    const field = headerToField[csvHeader];
    if (field) {
      out[field] = (value ?? "").toString().trim();
    }
  }
  return out;
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

export function validateRows(
  raw: CSVRow[],
  headerToField: Record<string, keyof CSVRow>,
  registradoPor: string,
): ValidationResult {
  const valid: RowValidation[] = [];
  const invalid: RowValidation[] = [];

  raw.forEach((rawRow, idx) => {
    const normalized = normalizeRow(
      rawRow as Record<string, string>,
      headerToField,
    );
    const errors: string[] = [];

    const nombre_completo = (normalized.nombre_completo ?? "").trim();
    if (!nombre_completo) errors.push("Falta nombre_completo");
    if (nombre_completo.length > 120) errors.push("nombre_completo > 120 chars");

    const centro_salud = (normalized.centro_salud ?? "").trim();
    if (!centro_salud) errors.push("Falta centro_salud");
    if (centro_salud.length > 120) errors.push("centro_salud > 120 chars");

    const estadoRaw = (normalized.estado_clinico ?? "").trim().toLowerCase();
    let estado_clinico: EstadoClinico | null = null;
    if (!estadoRaw) {
      errors.push("Falta estado_clinico");
    } else if (ESTADOS.includes(estadoRaw as EstadoClinico)) {
      estado_clinico = estadoRaw as EstadoClinico;
    } else {
      errors.push(
        `estado_clinico inválido: "${estadoRaw}" (usa: ${ESTADOS.join(", ")})`,
      );
    }

    let edad_aprox: number | null = null;
    const edadRaw = (normalized.edad_aprox ?? "").trim();
    if (edadRaw.length > 0) {
      const n = Number(edadRaw);
      if (Number.isNaN(n) || n < 0 || n > 130) {
        errors.push(`edad_aprox inválida: "${edadRaw}"`);
      } else {
        edad_aprox = Math.floor(n);
      }
    }

    let sexo: Sexo | null = null;
    const sexoRaw = (normalized.sexo ?? "").trim().toUpperCase();
    if (sexoRaw.length > 0) {
      if (SEXOS.includes(sexoRaw as Sexo)) {
        sexo = sexoRaw as Sexo;
      } else {
        errors.push(`sexo inválido: "${sexoRaw}" (usa: M, F, desconocido)`);
      }
    }

    const descripcion_fisica =
      (normalized.descripcion_fisica ?? "").trim() || null;
    const estado_geografico =
      (normalized.estado_geografico ?? "").trim() || null;
    const municipio = (normalized.municipio ?? "").trim() || null;
    const foto_path = (normalized.foto_path ?? "").trim() || null;
    const verificado =
      (normalized.verificado ?? "").trim().toLowerCase() === "true" ||
      (normalized.verificado ?? "").trim() === "1";

    if (errors.length > 0) {
      invalid.push({
        index: idx + 2, // +2 para saltar la cabecera + 1-indexed
        raw: normalized,
        data: null,
        errors,
      });
      return;
    }

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
    });
  });

  return { valid, invalid };
}

export type { PacienteInsert };