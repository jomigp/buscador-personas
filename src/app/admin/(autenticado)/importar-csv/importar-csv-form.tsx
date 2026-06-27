"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  parseCSV,
  validateRows,
  buildHeaderMap,
  type ValidationResult,
  type PacienteInsert,
} from "@/lib/csv";
import { importarCSVAction } from "../acciones";

type PreviewState =
  | { kind: "idle" }
  | { kind: "parsing" }
  | { kind: "preview"; result: ValidationResult; rawRows: number }
  | { kind: "importing" }
  | { kind: "done"; inserted: number }
  | { kind: "error"; message: string };

export default function ImportarCSVForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<PreviewState>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();

  async function handleFile(file: File) {
    setState({ kind: "parsing" });
    try {
      const text = await file.text();
      const parsed = await parseCSV(text);
      if (parsed.rows.length === 0) {
        setState({
          kind: "error",
          message: "El archivo no tiene filas de datos.",
        });
        return;
      }
      const headerToField = buildHeaderMap(parsed.headers);
      const validado = validateRows(parsed.rows, headerToField, "cargando…");
      setState({
        kind: "preview",
        result: validado,
        rawRows: parsed.totalRows,
      });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error
            ? `No pudimos leer el archivo: ${err.message}`
            : "No pudimos leer el archivo.",
      });
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onImport() {
    if (state.kind !== "preview") return;
    const toInsert: PacienteInsert[] = state.result.valid
      .map((v) => v.data)
      .filter((d): d is PacienteInsert => d !== null);

    if (toInsert.length === 0) {
      setState({
        kind: "error",
        message: "No hay filas válidas para importar.",
      });
      return;
    }

    setState({ kind: "importing" });
    startTransition(async () => {
      const res = await importarCSVAction(toInsert);
      if (!res.ok) {
        setState({
          kind: "error",
          message: res.error ?? "Error desconocido",
        });
        return;
      }
      setState({ kind: "done", inserted: res.inserted ?? toInsert.length });
      router.refresh();
    });
  }

  function onReset() {
    setState({ kind: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      {state.kind === "idle" || state.kind === "error" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="rounded-xl border-2 border-dashed border-zinc-300 bg-white p-8 text-center space-y-3"
        >
          {state.kind === "error" ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 inline-block">
              {state.message}
            </div>
          ) : null}
          <p className="text-sm text-zinc-600">
            Arrastra un archivo CSV aquí o
          </p>
          <label className="inline-block">
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={onPick}
              className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800"
            />
          </label>
          <p className="text-xs text-zinc-500">Máx 5 MB</p>
        </div>
      ) : null}

      {state.kind === "parsing" ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-700">
          Leyendo archivo…
        </div>
      ) : null}

      {state.kind === "preview" ? (
        <PreviewPanel
          state={state}
          isPending={isPending}
          onImport={onImport}
          onReset={onReset}
        />
      ) : null}

      {state.kind === "importing" ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-700">
          Importando…
        </div>
      ) : null}

      {state.kind === "done" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
          <p className="text-base font-semibold text-emerald-900">
            ✓ {state.inserted} pacientes importados
          </p>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Importar otro archivo
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PreviewPanel({
  state,
  isPending,
  onImport,
  onReset,
}: {
  state: { kind: "preview"; result: ValidationResult; rawRows: number };
  isPending: boolean;
  onImport: () => void;
  onReset: () => void;
}) {
  const { valid, invalid } = state.result;
  const total = valid.length + invalid.length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">
            Vista previa ({total} filas)
          </h2>
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-zinc-700 underline underline-offset-2"
          >
            Cancelar
          </button>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">
            <span className="font-semibold">{valid.length}</span> válidas
          </span>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
              invalid.length === 0
                ? "bg-zinc-100 text-zinc-700"
                : "bg-red-100 text-red-900"
            }`}
          >
            <span className="font-semibold">{invalid.length}</span> con errores
          </span>
        </div>
        {invalid.length > 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Las filas con errores no se importarán. Solucionalas en el CSV
            original y vuelve a subirlo, o ignóralas y continúa.
          </div>
        ) : null}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onImport}
            disabled={valid.length === 0 || isPending}
            className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-40"
          >
            Importar {valid.length}{" "}
            {valid.length === 1 ? "fila válida" : "filas válidas"}
          </button>
        </div>
      </div>

      {invalid.length > 0 ? (
        <details className="rounded-xl border border-red-200 bg-red-50">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-red-900">
            Ver {invalid.length} fila(s) con errores
          </summary>
          <ul className="divide-y divide-red-200 px-4 pb-4">
            {invalid.map((row) => (
              <li key={row.index} className="py-2 text-sm">
                <p className="font-medium text-red-900">
                  Fila {row.index} — {row.raw.nombre_completo || "(sin nombre)"}
                </p>
                <ul className="ml-4 list-disc text-red-800">
                  {row.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <details className="rounded-xl border border-zinc-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-800">
          Ver primeras {Math.min(valid.length, 10)} filas válidas
        </summary>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="px-2 py-1">Fila</th>
                <th className="px-2 py-1">Nombre</th>
                <th className="px-2 py-1">Estado</th>
                <th className="px-2 py-1">Centro</th>
                <th className="px-2 py-1">Edad</th>
                <th className="px-2 py-1">Sexo</th>
                <th className="px-2 py-1">Municipio</th>
              </tr>
            </thead>
            <tbody>
              {valid.slice(0, 10).map((row) => (
                <tr key={row.index} className="border-t border-zinc-100">
                  <td className="px-2 py-1 text-zinc-500">{row.index}</td>
                  <td className="px-2 py-1 font-medium text-zinc-900">
                    {row.data?.nombre_completo}
                  </td>
                  <td className="px-2 py-1">{row.data?.estado_clinico}</td>
                  <td className="px-2 py-1">{row.data?.centro_salud}</td>
                  <td className="px-2 py-1">{row.data?.edad_aprox ?? "—"}</td>
                  <td className="px-2 py-1">{row.data?.sexo ?? "—"}</td>
                  <td className="px-2 py-1">{row.data?.municipio ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}