// Buscador público — Server Component. Lee directamente desde Supabase
// con el cliente anon; el RLS garantiza que solo se ven casos abiertos.
// Carga los primeros 30 resultados; "Cargar más" pide los siguientes
// vía /api/pacientes con los mismos filtros.

import { createClient } from "@/lib/supabase/server";
import { getDistinctValues } from "@/lib/centros";
import type { Paciente, EstadoClinico, Sexo } from "@/lib/supabase/types";
import Buscador from "./buscador";
import PacientesList from "./pacientes-list";

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
    .select("*", { count: "exact" })
    .eq("caso_cerrado", false)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (params.q && params.q.trim().length > 0) {
    const q = params.q.trim();
    query = query.ilike("nombre_completo", `%${q}%`);
  }
  if (params.estado_clinico) {
    query = query.eq("estado_clinico", params.estado_clinico);
  }
  if (params.estado_geografico) {
    query = query.ilike("estado_geografico", `%${params.estado_geografico}%`);
  }
  if (params.municipio) {
    query = query.ilike("municipio", `%${params.municipio}%`);
  }
  if (params.centro_salud) {
    query = query.ilike("centro_salud", `%${params.centro_salud}%`);
  }
  if (params.sexo) {
    query = query.eq("sexo", params.sexo);
  }

  const { data, count, error } = await query;
  const pacientes: Paciente[] = data ?? [];
  const total = count ?? pacientes.length;

  const filtrosActivos = Object.entries(params).filter(
    ([, v]) => v && v.length > 0,
  ).length;
  const hayFiltros = filtrosActivos > 0;

  const filters: Record<string, string> = {};
  if (params.q) filters.q = params.q;
  if (params.estado_clinico) filters.estado_clinico = params.estado_clinico;
  if (params.estado_geografico) filters.estado_geografico = params.estado_geografico;
  if (params.municipio) filters.municipio = params.municipio;
  if (params.centro_salud) filters.centro_salud = params.centro_salud;
  if (params.sexo) filters.sexo = params.sexo;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 space-y-6">
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Emergencia sísmica · 24 de junio de 2026
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 text-balance leading-tight">
          Buscá a una persona ingresada en un hospital
        </h1>
        <p className="text-base text-zinc-600 max-w-2xl text-pretty">
          Escribí el nombre (o una parte) y usá los filtros para acotar la
          búsqueda. Los registros vienen de los centros de salud que están
          reportando pacientes. Si encontraste a tu familiar, usá{" "}
          <span className="font-medium text-zinc-900">
            &ldquo;Marcar como encontrado&rdquo;
          </span>{" "}
          en su tarjeta para retirarlo del listado.
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
          <p className="font-medium">No pudimos consultar la base de datos.</p>
          <p className="text-xs mt-1">
            Intentá de nuevo en un momento. Si el problema persiste,
            contactá al administrador.
          </p>
        </div>
      ) : null}

      <section aria-label="Resultados" className="space-y-3">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-sm font-medium text-zinc-700">
            {hayFiltros ? "Resultados" : "Pacientes reportados recientemente"}
            <span className="ml-2 text-zinc-500">
              ({total} {total === 1 ? "persona" : "personas"})
            </span>
          </h2>
          {total > 0 ? (
            <p className="text-xs text-zinc-500">Ordenadas por fecha de carga</p>
          ) : null}
        </div>

        <PacientesList initial={pacientes} total={total} filters={filters} />
      </section>
    </div>
  );
}