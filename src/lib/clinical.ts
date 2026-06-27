// Etiquetas en español y clases de color sobrias para el estado clínico.
// El color solo acentúa el estado; el resto de la UI es neutra.

import type { EstadoClinico, Sexo, Origen } from "@/lib/supabase/types";

export const ESTADO_CLINICO_LABEL: Record<EstadoClinico, string> = {
  estable: "Estable",
  critico: "Crítico",
  sin_identificar: "Sin identificar",
  fallecido: "Fallecido",
};

// Badge de color — verde / rojo / gris / negro. Fondo suave, texto fuerte.
export const ESTADO_CLINICO_BADGE: Record<EstadoClinico, string> = {
  estable: "bg-emerald-100 text-emerald-900 ring-emerald-300",
  critico: "bg-red-100 text-red-900 ring-red-300",
  sin_identificar: "bg-zinc-100 text-zinc-900 ring-zinc-300",
  fallecido: "bg-zinc-800 text-zinc-50 ring-zinc-700",
};

export const SEXO_LABEL: Record<NonNullable<Sexo>, string> = {
  M: "Masculino",
  F: "Femenino",
  desconocido: "Desconocido",
};

export const ORIGEN_LABEL: Record<Origen, string> = {
  manual: "Carga manual",
  csv: "Importado (CSV)",
  foto_ocr: "Foto (OCR revisado)",
};

export const SEXO_OPTIONS: Array<{ value: Sexo; label: string }> = [
  { value: "M", label: SEXO_LABEL.M },
  { value: "F", label: SEXO_LABEL.F },
  { value: "desconocido", label: SEXO_LABEL.desconocido },
];

export const ESTADO_CLINICO_OPTIONS: Array<{
  value: EstadoClinico;
  label: string;
}> = (Object.keys(ESTADO_CLINICO_LABEL) as EstadoClinico[]).map((k) => ({
  value: k,
  label: ESTADO_CLINICO_LABEL[k],
}));

export function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("es-VE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}