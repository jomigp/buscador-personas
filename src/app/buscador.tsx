"use client";

// Buscador público con:
//  - Filtros en cascada (estado -> municipio -> hospital)
//  - Autocomplete con la seed de 171 hospitales + valores de la BD
//  - Auto-refresh con debounce 350ms al cambiar cualquier filtro
//  - Los filtros se preservan en la URL para que el link sea compartible

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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
  const [isAutoSearching, setIsAutoSearching] = useState(false);

  // Estado controlado de cada filtro
  const [q, setQ] = useState(initial.q ?? "");
  const [estadoClinico, setEstadoClinico] = useState<EstadoClinico | "">(
    initial.estado_clinico ?? "",
  );
  const [sexo, setSexo] = useState<Sexo | "">(initial.sexo ?? "");
  const [estadoGeoInput, setEstadoGeoInput] = useState(
    initial.estado_geografico ?? "",
  );
  const [municipioInput, setMunicipioInput] = useState(initial.municipio ?? "");
  const [centroInput, setCentroInput] = useState(initial.centro_salud ?? "");

  // Opciones en cascada segun el estado/municipio seleccionados.
  const municipiosFiltrados = useMemo(() => {
    if (!estadoGeoInput) return municipios;
    const set = new Set<string>();
    for (const h of HOSPITALES_SEED) {
      if (h.estado_geografico === estadoGeoInput && h.municipio) {
        set.add(h.municipio);
      }
    }
    return set.size > 0
      ? Array.from(set).sort((a, b) => a.localeCompare(b, "es"))
      : municipios;
  }, [estadoGeoInput, municipios]);

  const centrosFiltrados = useMemo(() => {
    if (!estadoGeoInput && !municipioInput) return centros;
    const set = new Set<string>();
    for (const h of HOSPITALES_SEED) {
      const matchEstado = !estadoGeoInput || h.estado_geografico === estadoGeoInput;
      const matchMunicipio = !municipioInput || h.municipio === municipioInput;
      if (matchEstado && matchMunicipio) {
        set.add(h.centro_salud);
      }
    }
    // Tambien incluir centros de la BD que no esten en seed.
    for (const c of centros) {
      let inSeed = false;
      for (const h of HOSPITALES_SEED) {
        if (h.centro_salud === c) { inSeed = true; break; }
      }
      if (!inSeed) set.add(c);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [estadoGeoInput, municipioInput, centros]);

  // El valor efectivo para submit es lo que el usuario escribio,
  // INCLUSO si no esta en la lista de sugerencias. Asi puede buscar
  // por texto parcial (ej. "Carlos Arvelo" para encontrar
  // "Hospital Militar Dr. Carlos Arveledo"). La cascada solo afecta
  // las opciones del datalist, no el valor del input.
  const estadoGeo = estadoGeoInput;
  const municipio = municipioInput;
  const centro = centroInput;

  // Auto-submit con debounce al cambiar cualquier filtro.
  const firstRender = useRef(true);
  useEffect(() => {
    // No auto-submit en el primer render (los filtros iniciales ya estan en la URL)
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setIsAutoSearching(true);
    const timer = setTimeout(() => {
      submit(false);
    }, 350);
    return () => {
      clearTimeout(timer);
      setIsAutoSearching(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, estadoClinico, sexo, estadoGeo, municipio, centro]);

  function submit(scrollTop: boolean) {
    const next = new URLSearchParams(searchParams);
    setOrDelete(next, "q", q);
    setOrDelete(next, "estado_clinico", estadoClinico);
    setOrDelete(next, "sexo", sexo);
    setOrDelete(next, "estado_geografico", estadoGeo);
    setOrDelete(next, "municipio", municipio);
    setOrDelete(next, "centro_salud", centro);
    const url = `/?${next.toString()}`;
    startTransition(() => {
      router.push(url, { scroll: scrollTop });
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(true);
  }

  function limpiar() {
    setQ("");
    setEstadoClinico("");
    setSexo("");
    setEstadoGeoInput("");
    setMunicipioInput("");
    setCentroInput("");
    startTransition(() => {
      router.push("/");
    });
  }

  return (
    <form
      onSubmit={onSubmit}
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
            placeholder="Elegí un estado"
            value={estadoGeo}
            onChange={(e) => setEstadoGeoInput(e.target.value)}
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
            placeholder={estadoGeo ? `Municipios de ${estadoGeo}` : "Municipio"}
            value={municipio}
            onChange={(e) => setMunicipioInput(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
          <datalist id="dl-home-municipios">
            {municipiosFiltrados.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Centro de salud">
            <input
              type="text"
              list="dl-home-centros"
              placeholder={
                estadoGeo
                  ? `Hospitales de ${estadoGeo}${municipio ? ` / ${municipio}` : ""}`
                  : "Elegí o escribí el hospital"
              }
              value={centro}
              onChange={(e) => setCentroInput(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
            <datalist id="dl-home-centros">
              {centrosFiltrados.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs text-zinc-500" aria-live="polite">
          {isPending || isAutoSearching ? "Buscando…" : " "}
        </p>
        <div className="flex gap-2">
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

// Importamos la seed para hacer el filtrado en cascada.
import { HOSPITALES_SEED } from "@/lib/hospitales-seed";