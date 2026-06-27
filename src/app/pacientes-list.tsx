"use client";

import { useState, useTransition } from "react";
import type { Paciente } from "@/lib/supabase/types";
import PacienteCard from "./paciente-card";

type Props = {
  initial: Paciente[];
  total: number;
  filters: Record<string, string>;
};

export default function PacientesList({
  initial,
  total,
  filters,
}: Props) {
  const [rows, setRows] = useState<Paciente[]>(initial);
  const [isLoading, startLoading] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const hasMore = rows.length < total;

  function loadMore() {
    setError(null);
    startLoading(async () => {
      try {
        const params = new URLSearchParams();
        // Solo los filtros que tengan valor
        for (const [k, v] of Object.entries(filters)) {
          if (v && v.length > 0) params.set(k, v);
        }
        params.set("offset", String(rows.length));
        const res = await fetch(`/api/pacientes?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        const data = (await res.json()) as { rows: Paciente[] };
        setRows((prev) => [...prev, ...data.rows]);
      } catch (err) {
        setError(
          err instanceof Error
            ? `No pudimos cargar más: ${err.message}`
            : "No pudimos cargar más.",
        );
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-700 space-y-2">
        <p className="font-medium">No encontramos resultados con esos filtros.</p>
        <p className="text-zinc-600">
          Algunas personas todavía no están en el sistema. Si no aparece,
          revisa también los demás centros de la zona o contacta
          directamente al hospital.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map((p) => (
          <li key={p.id}>
            <PacienteCard paciente={p} />
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-2 pt-2">
        <p className="text-xs text-zinc-500">
          Mostrando {rows.length} de {total}{" "}
          {total === 1 ? "persona listada" : "personas listadas"}
        </p>
        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50"
          >
            {isLoading ? "Cargando…" : "Cargar más resultados"}
          </button>
        ) : (
          <p className="text-xs text-zinc-400">
            No hay más resultados con estos filtros.
          </p>
        )}
        {error ? (
          <p className="text-xs text-red-700">{error}</p>
        ) : null}
      </div>
    </div>
  );
}