// Devuelve los valores distintos para usar como sugerencias en los inputs
// con datalist. Combina:
//   1. La tabla centros_salud en la BD (catalogo oficial, 241 centros)
//   2. Los valores ya cargados en pacientes (los centros donde hay
//      pacientes reales, que pueden no estar en el catalogo)
//   3. La seed embebida (fallback si la BD esta vacia)
//
// Si escribis un valor nuevo y guardas, aparece automaticamente la proxima
// vez (porque ya estara en la BD via pacientes).

import { createClient } from "@/lib/supabase/server";
import { HOSPITALES_SEED } from "@/lib/hospitales-seed";

export type DistinctValues = {
  centros: string[];
  estados: string[];
  municipios: string[];
};

type CentroRow = {
  nombre: string;
  estado: string;
  municipio: string | null;
};

export async function getDistinctValues(): Promise<DistinctValues> {
  const supabase = await createClient();

  // Intentar leer de centros_salud (catalogo oficial).
  let centrosFromDB: CentroRow[] = [];
  try {
    const { data } = await supabase
      .from("centros_salud")
      .select("nombre, estado, municipio");
    if (data) centrosFromDB = data as CentroRow[];
  } catch {
    // Si la tabla no existe aun, fallback al seed.
  }

  const useSeed = centrosFromDB.length === 0;

  // Tambien leer valores reales de la BD (los centros donde hay pacientes).
  let pacientesData: Array<{
    centro_salud?: string | null;
    estado_geografico?: string | null;
    municipio?: string | null;
  }> = [];
  try {
    const { data } = await supabase
      .from("pacientes")
      .select("centro_salud, estado_geografico, municipio");
    if (data) pacientesData = data as typeof pacientesData;
  } catch {
    /* ignore */
  }

  const centros = new Set<string>();
  const estados = new Set<string>();
  const municipios = new Set<string>();

  // Fuente 1: BD centros_salud (si existe) o seed estatico
  const fuenteCatalogo: Array<{
    centro_salud: string;
    estado_geografico: string;
    municipio: string;
  }> = useSeed
    ? HOSPITALES_SEED.map((h) => ({
        centro_salud: h.centro_salud,
        estado_geografico: h.estado_geografico,
        municipio: h.municipio,
      }))
    : centrosFromDB.map((c) => ({
        centro_salud: c.nombre,
        estado_geografico: c.estado,
        municipio: c.municipio ?? "",
      }));

  for (const h of fuenteCatalogo) {
    if (h.centro_salud) centros.add(h.centro_salud);
    if (h.estado_geografico) estados.add(h.estado_geografico);
    if (h.municipio) municipios.add(h.municipio);
  }

  // Fuente 2: valores reales de pacientes (puede traer centros no en catalogo)
  for (const row of pacientesData) {
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