// Buscador público — Server Component. Lee directamente desde Supabase
// con el cliente anon; el RLS garantiza que solo se ven casos abiertos.

import { createClient } from "@/lib/supabase/server";
import { getDistinctValues } from "@/lib/centros";
import type { Paciente, EstadoClinico, Sexo } from "@/lib/supabase/types";
import Buscador from "./buscador";
import PacienteCard from "./paciente-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{
  q?: string;
  estado_clinico?: EstadoClinico;
  estado_geografico?: string;
  municipio?: string;
  centro_salud?: string;
  sexo?: Sexo;
}>;

const PAGE_SIZE = 30;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { centros, estados, municipios } = await getDistinctValues();

  let query = supabase
    .from("pacientes")
    .select("*")
    .eq("caso_cerrado", false)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (params.q && params.q.trim().length > 0) {
    const q = params.q.trim();
    // ILIKE sobre nombre_completo — el índice GIN ayuda con búsquedas
    // más largas, pero ILIKE simple es suficiente para el MVP y evita
    // tener que normalizar acentos.
    query = query.ilike("nombre_completo", `%${q}%`);
  }
  if (params.estado_clinico) {
    query = query.eq("estado_clinico", params.estado_clinico);
  }
  if (params.estado_geografico) {
    query = query.eq("estado_geografico", params.estado_geografico);
  }
  if (params.municipio) {
    query = query.eq("municipio", params.municipio);
  }
  if (params.centro_salud) {
    query = query.eq("centro_salud", params.centro_salud);
  }
  if (params.sexo) {
    query = query.eq("sexo", params.sexo);
  }

  const { data, error } = await query;
  const pacientes: Paciente[] = data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
          Buscar a una persona ingresada
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl">
          Escribe el nombre (o una parte) y aplica los filtros que conozcas.
          La información proviene de los centros de salud que están
          reportando pacientes. Si tu familiar está aquí y ya lo encontraste,
          usa el botón{" "}
          <span className="font-medium">&ldquo;Marcar como encontrado&rdquo;</span>{" "}
          para retirarlo del listado público.
        </p>
      </section>

      <Buscador
        initial={params}
        centros={centros}
        estados={estados}
        municipios={municipios}
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          No pudimos consultar la base de datos. Intenta de nuevo en un
          momento.
        </div>
      ) : null}

      <section aria-label="Resultados" className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-zinc-700">
            {pacientes.length === 0
              ? "Sin resultados"
              : `${pacientes.length} ${
                  pacientes.length === 1
                    ? "persona listada"
                    : "personas listadas"
                }`}
          </h2>
          <p className="text-xs text-zinc-500">Ordenadas por fecha de carga</p>
        </div>

        {pacientes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-700 space-y-2">
            <p className="font-medium">No encontramos resultados con esos filtros.</p>
            <p className="text-zinc-600">
              Algunas personas todavía no están en el sistema. Si no aparece,
              revisa también los demás centros de la zona o contacta
              directamente al hospital.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pacientes.map((p) => (
              <li key={p.id}>
                <PacienteCard paciente={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}