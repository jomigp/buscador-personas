// Devuelve los valores distintos para usar como sugerencias en los inputs
// con datalist. Combina:
//   1. La seed de hospitales publicos de Venezuela (Convite AC, 2026)
//   2. Los valores ya cargados en `pacientes` (lo que el personal agrego)
//
// Si escribis un valor nuevo y guardas, aparece automaticamente la proxima
// vez (porque ya estara en la BD).

import { createClient } from "@/lib/supabase/server";
import { HOSPITALES_SEED } from "@/lib/hospitales-seed";

export type DistinctValues = {
  centros: string[];
  estados: string[];
  municipios: string[];
};

export async function getDistinctValues(): Promise<DistinctValues> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pacientes")
    .select("centro_salud, estado_geografico, municipio");

  if (error || !data) {
    // Fallback: solo seed
    return {
      centros: HOSPITALES_SEED.map((h) => h.centro_salud).sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
      estados: Array.from(
        new Set(HOSPITALES_SEED.map((h) => h.estado_geografico)),
      ).sort((a, b) => a.localeCompare(b, "es")),
      municipios: Array.from(
        new Set(HOSPITALES_SEED.map((h) => h.municipio).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "es")),
    };
  }

  const centros = new Set<string>();
  const estados = new Set<string>();
  const municipios = new Set<string>();

  // Seed primero (mas estable, ordenado)
  for (const h of HOSPITALES_SEED) {
    if (h.centro_salud) centros.add(h.centro_salud);
    if (h.estado_geografico) estados.add(h.estado_geografico);
    if (h.municipio) municipios.add(h.municipio);
  }

  // Luego los valores reales de la BD
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