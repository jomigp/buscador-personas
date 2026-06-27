"use client";

// Formulario de búsqueda + filtros. Usa la URL como estado para que las
// búsquedas sean compartibles y refrescables.

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ESTADO_CLINICO_OPTIONS,
  SEXO_OPTIONS,
} from "@/lib/clinical";
import type { EstadoClinico, Sexo } from "@/lib/supabase/types";

type Props = {
  initial: {
    q?: string;
    estado_clinico?: EstadoClinico;
    estado_geografico?: string;
    municipio?: string;
    centro_salud?: string;
    sexo?: Sexo;
  };
  centros: string[];
  estados: string[];
  municipios: string[];
};

export default function Buscador({
  initial,
  centros,
  estados,
  municipios,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initial.q ?? "");
  const [estadoClinico, setEstadoClinico] = useState<EstadoClinico | "">(
    initial.estado_clinico ?? "",
  );
  const [sexo, setSexo] = useState<Sexo | "">(initial.sexo ?? "");
  const [estadoGeo, setEstadoGeo] = useState(initial.estado_geografico ?? "");
  const [municipio, setMunicipio] = useState(initial.municipio ?? "");
  const [centro, setCentro] = useState(initial.centro_salud ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    setOrDelete(next, "q", q);
    setOrDelete(next, "estado_clinico", estadoClinico);
    setOrDelete(next, "sexo", sexo);
    setOrDelete(next, "estado_geografico", estadoGeo);
    setOrDelete(next, "municipio", municipio);
    setOrDelete(next, "centro_salud", centro);
    startTransition(() => {
      router.push(`/?${next.toString()}`);
    });
  }

  function limpiar() {
    setQ("");
    setEstadoClinico("");
    setSexo("");
    setEstadoGeo("");
    setMunicipio("");
    setCentro("");
    startTransition(() => {
      router.push("/");
    });
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-4"
    >
      <div className="space-y-1">
        <label
          htmlFor="q"
          className="block text-sm font-medium text-zinc-800"
        >
          Nombre (o parte del nombre)
        </label>
        <input
          id="q"
          name="q"
          type="search"
          autoComplete="off"
          inputMode="search"
          placeholder="Ej. María Rodríguez"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 text-base focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Estado clínico">
          <select
            value={estadoClinico}
            onChange={(e) => setEstadoClinico(e.target.value as EstadoClinico | "")}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          >
            <option value="">Todos</option>
            {ESTADO_CLINICO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sexo">
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value as Sexo | "")}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          >
            <option value="">Todos</option>
            {SEXO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Estado (geográfico)">
          <input
            type="text"
            list="dl-home-estados"
            placeholder="Elegí o escribí un estado"
            value={estadoGeo}
            onChange={(e) => setEstadoGeo(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
          <datalist id="dl-home-estados">
            {estados.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
        </Field>

        <Field label="Municipio">
          <input
            type="text"
            list="dl-home-municipios"
            placeholder="Elegí o escribí un municipio"
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
          <datalist id="dl-home-municipios">
            {municipios.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Centro de salud">
            <input
              type="text"
              list="dl-home-centros"
              placeholder="Elegí o escribí el hospital"
              value={centro}
              onChange={(e) => setCentro(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
            <datalist id="dl-home-centros">
              {centros.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
        <button
          type="button"
          onClick={limpiar}
          disabled={isPending}
          className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 disabled:opacity-50"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-50"
        >
          {isPending ? "Buscando…" : "Buscar"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm font-medium text-zinc-800">{label}</span>
      {children}
    </label>
  );
}

function setOrDelete(
  params: URLSearchParams,
  key: string,
  value: string,
): void {
  if (value && value.length > 0) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}