// Dashboard del admin: lista de pacientes del centro logueado +
// solicitudes de baja pendientes + acceso rapido a las acciones.

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { publicFotoUrl } from "@/lib/supabase/storage";
import {
  ESTADO_CLINICO_BADGE,
  ESTADO_CLINICO_LABEL,
  formatFecha,
} from "@/lib/clinical";
import type { Paciente } from "@/lib/supabase/types";
import ToggleVerificado from "./toggle-verificado";
import ToggleCasoCerrado from "./toggle-caso-cerrado";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Todos los pacientes (autenticado puede ver casos cerrados también).
  // Filtramos a los que este usuario registró, para mantener foco del MVP.
  const { data: pacientesData } = await supabase
    .from("pacientes")
    .select("*")
    .eq("registrado_por", user?.email ?? "")
    .order("created_at", { ascending: false })
    .limit(100);
  const pacientes = (pacientesData ?? []) as Paciente[];

  // Solicitudes de baja pendientes
  const ids = pacientes.map((p) => p.id);
  let solicitudes: Array<{
    id: string;
    paciente_id: string;
    created_at: string;
    nota: string | null;
  }> = [];
  if (ids.length > 0) {
    const { data } = await supabase
      .from("solicitudes_baja")
      .select("id, paciente_id, created_at, nota")
      .in("paciente_id", ids)
      .eq("atendida", false)
      .order("created_at", { ascending: false });
    solicitudes = data ?? [];
  }

  // Stats basicos
  const totalActivos = pacientes.filter((p) => !p.caso_cerrado).length;
  const totalCerrados = pacientes.filter((p) => p.caso_cerrado).length;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
          Pacientes cargados
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl">
          Aquí ves los registros cargados con tu cuenta. Editá el estado
          clínico, marcá como verificado o cerrá el caso cuando la persona
          sea entregada a su familia.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="/admin/nuevo"
            className="touch-target inline-flex items-center rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
          >
            + Cargar paciente
          </Link>
          <Link
            href="/admin/importar-csv"
            className="touch-target inline-flex items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Importar CSV
          </Link>
          <Link
            href="/admin/importar-foto"
            className="touch-target inline-flex items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Leer de foto
          </Link>
        </div>
      </section>

      {solicitudes.length > 0 ? (
        <section
          aria-labelledby="solicitudes-titulo"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-3"
        >
          <div>
            <h2
              id="solicitudes-titulo"
              className="text-base font-semibold text-amber-900"
            >
              {solicitudes.length} solicitud
              {solicitudes.length === 1 ? "" : "es"} de baja pendiente
              {solicitudes.length === 1 ? "" : "s"}
            </h2>
            <p className="text-xs text-amber-800 mt-1">
              Familiares pidieron retirar estos registros. Verificá y, si
              corresponde, marcá el caso como cerrado.
            </p>
          </div>
          <ul className="divide-y divide-amber-200 text-sm">
            {solicitudes.map((s) => {
              const p = pacientes.find((x) => x.id === s.paciente_id);
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="text-amber-900 min-w-0 truncate">
                    {p?.nombre_completo ?? s.paciente_id}
                    <span className="text-amber-700 text-xs ml-2">
                      · {formatFecha(s.created_at)}
                    </span>
                  </span>
                  {p ? (
                    <Link
                      href={`/admin/${p.id}`}
                      className="touch-target inline-flex items-center text-xs font-semibold text-amber-900 underline underline-offset-2 px-2"
                    >
                      Revisar
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {pacientes.length > 0 ? (
        <div
          className="flex flex-wrap gap-3 text-xs text-zinc-600"
          aria-label="Resumen"
        >
          <span>
            <span className="font-semibold text-zinc-900">{totalActivos}</span>{" "}
            activos
          </span>
          <span aria-hidden>·</span>
          <span>
            <span className="font-semibold text-zinc-900">{totalCerrados}</span>{" "}
            cerrados
          </span>
          <span aria-hidden>·</span>
          <span>
            <span className="font-semibold text-zinc-900">
              {pacientes.length}
            </span>{" "}
            en total
          </span>
        </div>
      ) : null}

      {pacientes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-white p-10 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xl">
            +
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-zinc-900">
              Aún no cargaste ningún paciente
            </p>
            <p className="text-sm text-zinc-600 max-w-sm mx-auto">
              Empezá cargando el primer registro de tu centro. Si tenés
              muchos, usá la importación por CSV o por foto.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Link
              href="/admin/nuevo"
              className="touch-target inline-flex items-center rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Cargar paciente
            </Link>
            <Link
              href="/admin/importar-csv"
              className="touch-target inline-flex items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Importar CSV
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {pacientes.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 flex gap-3"
            >
              <div className="shrink-0">
                {publicFotoUrl(p.foto_path) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={publicFotoUrl(p.foto_path)!}
                    alt=""
                    className="h-16 w-16 rounded-lg object-cover bg-zinc-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">
                    Sin foto
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/admin/${p.id}`}
                    className="text-base font-semibold text-zinc-900 hover:underline leading-snug break-words"
                  >
                    {p.nombre_completo}
                  </Link>
                  <span
                    className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_CLINICO_BADGE[p.estado_clinico]}`}
                  >
                    {ESTADO_CLINICO_LABEL[p.estado_clinico]}
                  </span>
                </div>
                <p className="text-sm text-zinc-600">
                  {p.edad_aprox != null
                    ? `${p.edad_aprox} años`
                    : "Edad desconocida"}
                  {" · "}
                  <span className="text-zinc-800">{p.centro_salud}</span>
                </p>
                <p className="text-xs text-zinc-500">
                  Cargado {formatFecha(p.created_at)}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
                  <ToggleVerificado id={p.id} value={p.verificado} />
                  <ToggleCasoCerrado id={p.id} value={p.caso_cerrado} />
                  <Link
                    href={`/admin/${p.id}`}
                    className="touch-target inline-flex items-center text-xs font-medium text-zinc-700 underline underline-offset-2 px-2"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}