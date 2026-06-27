// Devuelve los valores distintos ya cargados en `pacientes` para usar
// como sugerencias en los inputs con datalist. Si escribís un valor
// nuevo y guardás, aparece automáticamente la próxima vez.

import { createClient } from "@/lib/supabase/server";

export type DistinctValues = {
  centros: string[];
  estados: string[];
  municipios: string[];
};

export async function getDistinctValues(): Promise<DistinctValues> {
  const supabase = await createClient();
  // Traemos solo las 3 columnas que necesitamos. Sin filtro: cualquier
  // paciente cargado por cualquier centro aporta valores al pool.
  const { data, error } = await supabase
    .from("pacientes")
    .select("centro_salud, estado_geografico, municipio");

  const empty: DistinctValues = { centros: [], estados: [], municipios: [] };
  if (error || !data) return empty;

  const centros = new Set<string>();
  const estados = new Set<string>();
  const municipios = new Set<string>();

  for (const row of data as Array<{
    centro_salud?: string | null;
    estado_geografico?: string | null;
    municipio?: string | null;
  }>) {
    const c = (row.centro_salud ?? "").trim();
    const e = (row.estado_geografico ?? "").trim();
    const m = (row.municipio ?? "").trim();
    if (c) centros.add(c);
    if (e) estados.add(e);
    if (m) municipios.add(m);
  }

  return {
    centros: Array.from(centros).sort((a, b) => a.localeCompare(b, "es")),
    estados: Array.from(estados).sort((a, b) => a.localeCompare(b, "es")),
    municipios: Array.from(municipios).sort((a, b) => a.localeCompare(b, "es")),
  };
}