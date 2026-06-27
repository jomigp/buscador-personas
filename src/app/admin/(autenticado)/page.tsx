// Dashboard del admin: lista de pacientes del centro logueado + 
// solicitudes de baja pendientes + enlace a "Cargar nuevo".

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { publicFotoUrl } from "@/lib/supabase/storage";
import { ESTADO_CLINICO_BADGE, ESTADO_CLINICO_LABEL, formatFecha } from "@/lib/clinical";
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

  // Solicitudes de baja pendientes (mis pacientes)
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

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-zinc-900">Pacientes cargados</h1>
          <Link
            href="/admin/nuevo"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
          >
            + Cargar nuevo
          </Link>
        </div>
        <p className="text-sm text-zinc-600">
          Aquí ves los registros cargados con tu cuenta. Edita el estado
          clínico, marca como verificado o cierra el caso cuando la persona
          sea entregada a su familia.
        </p>
      </section>

      {solicitudes.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-amber-900">
            {solicitudes.length} solicitud{solicitudes.length === 1 ? "" : "es"} de baja pendiente{solicitudes.length === 1 ? "" : "s"}
          </h2>
          <p className="text-xs text-amber-800">
            Familiares pidieron retirar estos registros. Verifica y, si
            corresponde, marca el caso como cerrado.
          </p>
          <ul className="space-y-1 text-sm text-amber-900">
            {solicitudes.map((s) => {
              const p = pacientes.find((x) => x.id === s.paciente_id);
              return (
                <li key={s.id} className="flex items-center justify-between gap-2">
                  <span>
                    {p?.nombre_completo ?? s.paciente_id} · {formatFecha(s.created_at)}
                  </span>
                  {p ? (
                    <Link
                      href={`/admin/${p.id}`}
                      className="text-xs font-medium underline underline-offset-2"
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

      {pacientes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center space-y-2">
          <p className="font-medium text-zinc-800">
            Aún no cargaste ningún paciente.
          </p>
          <p className="text-sm text-zinc-600">
            Empieza cargando el primer registro de tu centro.
          </p>
          <Link
            href="/admin/nuevo"
            className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
          >
            Cargar paciente
          </Link>
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
                    className="text-base font-semibold text-zinc-900 hover:underline"
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
                  {p.edad_aprox != null ? `${p.edad_aprox} años` : "Edad desconocida"} ·{" "}
                  {p.centro_salud}
                </p>
                <p className="text-xs text-zinc-500">
                  Cargado {formatFecha(p.created_at)}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <ToggleVerificado id={p.id} value={p.verificado} />
                  <ToggleCasoCerrado id={p.id} value={p.caso_cerrado} />
                  <Link
                    href={`/admin/${p.id}`}
                    className="text-xs font-medium text-zinc-700 underline underline-offset-2"
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