"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ESTADO_CLINICO_OPTIONS,
  SEXO_OPTIONS,
} from "@/lib/clinical";
import { crearPacienteAction } from "../acciones";

const CENTRO_LS_KEY = "buscador.centro_salud_sugerido";

export default function NuevoForm() {
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

    const centro = String(formData.get("centro_salud") ?? "").trim();
    if (centro) {
      try {
        window.localStorage.setItem(CENTRO_LS_KEY, centro);
      } catch {
        /* localStorage no disponible */
      }
    }

    startTransition(async () => {
      const res = await crearPacienteAction(formData);
      if (!res.ok) {
        setError(res.error ?? "Error desconocido");
        return;
      }
      setSuccess("Registro creado. Cargando lista…");
      form.reset();
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5"
    >
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      <Field label="Nombre completo" required>
        <input
          name="nombre_completo"
          required
          maxLength={120}
          className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Edad (aprox.)">
          <input
            name="edad_aprox"
            type="number"
            inputMode="numeric"
            min={0}
            max={130}
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
        <Field label="Centro de salud" required>
          <input
            name="centro_salud"
            required
            maxLength={120}
            placeholder="Ej. Hospital Central de Valencia"
            autoComplete="organization"
            className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </Field>
        <Field label="Estado (geográfico)">
          <input
            name="estado_geografico"
            maxLength={80}
            placeholder="Ej. Carabobo"
            className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </Field>
        <Field label="Municipio">
          <input
            name="municipio"
            maxLength={80}
            placeholder="Ej. Valencia"
            className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </Field>
      </div>

      <Field label="Descripción física (opcional)">
        <textarea
          name="descripcion_fisica"
          maxLength={500}
          rows={3}
          placeholder="Rasgos visibles, vestimenta, señas particulares. Sé breve y respetuoso."
          className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
        />
      </Field>

      <Field label="Foto (opcional, JPG/PNG/WebP, máx 5 MB)">
        <input
          name="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800"
        />
      </Field>

      <label className="inline-flex items-center gap-2 text-sm text-zinc-800">
        <input
          type="checkbox"
          name="verificado"
          defaultChecked
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
        />
        <span>Marcar como verificado por el centro</span>
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-50"
        >
          {isPending ? "Guardando…" : "Guardar paciente"}
        </button>
      </div>
    </form>
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
    <label className="block space-y-1">
      <span className="block text-sm font-medium text-zinc-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {children}
    </label>
  );
}