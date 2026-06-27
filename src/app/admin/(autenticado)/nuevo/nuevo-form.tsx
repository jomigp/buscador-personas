"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ESTADO_CLINICO_OPTIONS,
  SEXO_OPTIONS,
} from "@/lib/clinical";
import { crearPacienteAction } from "../acciones";

type Props = {
  centros: string[];
  estados: string[];
  municipios: string[];
};

export default function NuevoForm({
  centros,
  estados,
  municipios,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await crearPacienteAction(formData);
      if (!res.ok) {
        setError(res.error ?? "Error desconocido");
        return;
      }
      setSuccess("Registro creado. Yendo al listado…");
      form.reset();
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 500);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
    >
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          <p className="font-medium">No se pudo guardar</p>
          <p className="text-xs mt-0.5">{error}</p>
        </div>
      ) : null}
      {success ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          {success}
        </div>
      ) : null}

      <Section title="Identificación">
        <Field label="Nombre completo" required>
          <input
            name="nombre_completo"
            required
            maxLength={120}
            placeholder="Ej. María Rodríguez"
            className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </Field>
      </Section>

      <Section title="Detalles clínicos">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Edad (aprox.)">
            <input
              name="edad_aprox"
              type="number"
              inputMode="numeric"
              min={0}
              max={130}
              placeholder="0–130"
              className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </Field>
          <Field label="Sexo">
            <select
              name="sexo"
              defaultValue="desconocido"
              className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            >
              {SEXO_OPTIONS.map((o) => (
                <option key={o.value ?? ""} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Estado clínico" required>
            <select
              name="estado_clinico"
              required
              defaultValue="sin_identificar"
              className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            >
              {ESTADO_CLINICO_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Ubicación">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Centro de salud" required>
            <input
              name="centro_salud"
              required
              maxLength={120}
              list="dl-centros"
              placeholder="Elegí o escribí el centro"
              autoComplete="organization"
              className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
            <datalist id="dl-centros">
              {centros.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className="text-xs text-zinc-500">
              Si el centro no aparece, escribilo. Quedará guardado para la próxima.
            </p>
          </Field>
          <Field label="Estado (geográfico)">
            <input
              name="estado_geografico"
              maxLength={80}
              list="dl-estados"
              placeholder="Elegí o escribí un estado"
              className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
            <datalist id="dl-estados">
              {estados.map((e) => (
                <option key={e} value={e} />
              ))}
            </datalist>
          </Field>
          <Field label="Municipio">
            <input
              name="municipio"
              maxLength={80}
              list="dl-municipios"
              placeholder="Elegí o escribí un municipio"
              className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
            <datalist id="dl-municipios">
              {municipios.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Field>
        </div>
      </Section>

      <Section title="Detalles adicionales">
        <Field label="Descripción física (opcional)">
          <textarea
            name="descripcion_fisica"
            maxLength={500}
            rows={3}
            placeholder="Rasgos visibles, vestimenta, señas particulares. Sé breve y respetuoso."
            className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </Field>
        <Field label="Foto (opcional)">
          <input
            name="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800"
          />
          <p className="text-xs text-zinc-500">JPG, PNG o WebP. Máx 5 MB.</p>
        </Field>
        <label className="touch-target inline-flex items-center gap-2 text-sm text-zinc-800 cursor-pointer">
          <input
            type="checkbox"
            name="verificado"
            defaultChecked
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
          />
          <span>Marcar como verificado por el centro</span>
        </label>
      </Section>

      <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
        <button
          type="submit"
          disabled={isPending}
          className="touch-target inline-flex items-center rounded-lg bg-zinc-900 px-6 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-50"
        >
          {isPending ? "Guardando…" : "Guardar paciente"}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-zinc-800">
        {label}
        {required ? <span className="text-red-600 ml-0.5">*</span> : null}
      </span>
      {children}
    </label>
  );
}