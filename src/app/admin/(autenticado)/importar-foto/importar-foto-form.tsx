"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ESTADO_CLINICO_OPTIONS,
  SEXO_OPTIONS,
} from "@/lib/clinical";
import { importarFotoOCRAction, type FotoRowInsert } from "../acciones";

type Props = {
  centros: string[];
  estados: string[];
  municipios: string[];
};

type Photo = {
  id: string;
  file: File;
  previewUrl: string;
};

type ExtractedRow = {
  rowId: string; // id cliente
  sourceIndex: number;
  sourceFilename: string;
  include: boolean;
  nombre_completo: string;
  edad_aprox: number | null;
  sexo: "M" | "F" | "desconocido" | "";
  estado_clinico: "estable" | "critico" | "sin_identificar" | "fallecido";
  descripcion_fisica: string;
  notas: string;
  confianza: number;
};

type Phase =
  | { kind: "config" }
  | { kind: "uploading" }
  | { kind: "review"; rows: ExtractedRow[]; warnings: string[] }
  | { kind: "importing" }
  | { kind: "done"; inserted: number }
  | { kind: "error"; message: string };

export default function ImportarFotoForm({ centros, estados, municipios }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [centro, setCentro] = useState("");
  const [estadoGeo, setEstadoGeo] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [phase, setPhase] = useState<Phase>({ kind: "config" });
  const [isPending, startTransition] = useTransition();

  function addFiles(files: FileList | File[]) {
    const next: Photo[] = [];
    for (const f of Array.from(files)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) continue;
      if (f.size > 8 * 1024 * 1024) continue;
      next.push({
        id: crypto.randomUUID(),
        file: f,
        previewUrl: URL.createObjectURL(f),
      });
    }
    if (next.length > 0) {
      setPhotos((prev) => [...prev, ...next]);
    }
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }

  async function procesar() {
    if (photos.length === 0) {
      setPhase({ kind: "error", message: "Adjuntá al menos una foto." });
      return;
    }
    if (!centro.trim()) {
      setPhase({
        kind: "error",
        message: "Elegí el centro de salud. Si no está en la lista, escribilo.",
      });
      return;
    }

    setPhase({ kind: "uploading" });

    const fd = new FormData();
    fd.set("centro_salud", centro.trim());
    fd.set("estado_geografico", estadoGeo.trim());
    fd.set("municipio", municipio.trim());
    for (const p of photos) fd.append("fotos", p.file, p.file.name);

    try {
      const res = await fetch("/api/leer-lista", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setPhase({
          kind: "error",
          message: data.error ?? `Error ${res.status}`,
        });
        return;
      }

      const rows: ExtractedRow[] = [];
      const filas = Array.isArray(data.rows) ? data.rows : [];
      for (let i = 0; i < filas.length; i++) {
        const r = filas[i];
        const filename = data.perImage?.[r.sourceIndex]?.filename ?? "";
        rows.push({
          rowId: crypto.randomUUID(),
          sourceIndex: r.sourceIndex,
          sourceFilename: filename,
          include: (r.confianza ?? 0) >= 0.5,
          nombre_completo: r.nombre_completo ?? "",
          edad_aprox: r.edad_aprox ?? null,
          sexo: (r.sexo ?? "") as ExtractedRow["sexo"],
          estado_clinico:
            (r.estado_clinico as ExtractedRow["estado_clinico"]) ||
            "sin_identificar",
          descripcion_fisica: r.descripcion_fisica ?? "",
          notas: r.notas ?? "",
          confianza: r.confianza ?? 0,
        });
      }

      setPhase({
        kind: "review",
        rows,
        warnings: data.warnings ?? [],
      });
    } catch (err) {
      setPhase({
        kind: "error",
        message:
          err instanceof Error
            ? `No pudimos contactar el servicio de visión: ${err.message}`
            : "No pudimos contactar el servicio de visión.",
      });
    }
  }

  function updateRow(id: string, patch: Partial<ExtractedRow>) {
    if (phase.kind !== "review") return;
    setPhase({
      ...phase,
      rows: phase.rows.map((r) => (r.rowId === id ? { ...r, ...patch } : r)),
    });
  }

  function removeRow(id: string) {
    if (phase.kind !== "review") return;
    setPhase({
      ...phase,
      rows: phase.rows.filter((r) => r.rowId !== id),
    });
  }

  function importar() {
    if (phase.kind !== "review") return;
    const toInsert: FotoRowInsert[] = phase.rows
      .filter((r) => r.include)
      .filter(
        (r) =>
          r.nombre_completo.trim().length > 0 && r.estado_clinico.length > 0,
      )
      .map((r) => ({
        nombre_completo: r.nombre_completo.trim(),
        estado_clinico: r.estado_clinico,
        edad_aprox: r.edad_aprox,
        sexo: r.sexo || null,
        descripcion_fisica: r.descripcion_fisica.trim() || null,
        centro_salud: centro.trim(),
        estado_geografico: estadoGeo.trim() || null,
        municipio: municipio.trim() || null,
      }));

    if (toInsert.length === 0) {
      setPhase({
        kind: "error",
        message:
          "No hay filas válidas para importar (todas están desmarcadas o vacías).",
      });
      return;
    }

    setPhase({ kind: "importing" });
    startTransition(async () => {
      const res = await importarFotoOCRAction(toInsert);
      if (!res.ok) {
        setPhase({
          kind: "error",
          message: res.error ?? "Error desconocido",
        });
        return;
      }
      setPhase({ kind: "done", inserted: res.inserted ?? toInsert.length });
      router.refresh();
    });
  }

  function reset() {
    photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPhotos([]);
    setPhase({ kind: "config" });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      {phase.kind === "config" || phase.kind === "error" ? (
        <>
          {phase.kind === "error" ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {phase.message}
            </div>
          ) : null}

          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              1. Centro y ubicación
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="block text-sm font-medium text-zinc-800">
                  Centro de salud <span className="text-red-600">*</span>
                </span>
                <input
                  list="dl-foto-centros"
                  value={centro}
                  onChange={(e) => setCentro(e.target.value)}
                  required
                  maxLength={120}
                  placeholder="Elegí o escribí el hospital"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
                <datalist id="dl-foto-centros">
                  {centros.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <p className="text-xs text-zinc-500">
                  Si la foto no muestra el hospital, escribilo acá y se
                  aplica a todas las filas extraídas.
                </p>
              </label>

              <label className="block space-y-1">
                <span className="block text-sm font-medium text-zinc-800">
                  Estado (geográfico)
                </span>
                <input
                  list="dl-foto-estados"
                  value={estadoGeo}
                  onChange={(e) => setEstadoGeo(e.target.value)}
                  maxLength={80}
                  placeholder="Opcional — se aplica a todas las filas"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
                <datalist id="dl-foto-estados">
                  {estados.map((e) => (
                    <option key={e} value={e} />
                  ))}
                </datalist>
              </label>

              <label className="block space-y-1 sm:col-span-2">
                <span className="block text-sm font-medium text-zinc-800">
                  Municipio
                </span>
                <input
                  list="dl-foto-municipios"
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  maxLength={80}
                  placeholder="Opcional — se aplica a todas las filas"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
                <datalist id="dl-foto-municipios">
                  {municipios.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              2. Fotos de la lista
            </h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 text-center"
            >
              <p className="text-sm text-zinc-600 mb-2">
                Arrastrá fotos o
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                }}
                className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800"
              />
              <p className="mt-2 text-xs text-zinc-500">
                JPG, PNG o WebP. Máx 8 MB por imagen. Podés subir varias.
              </p>
            </div>

            {photos.length > 0 ? (
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((p) => (
                  <li
                    key={p.id}
                    className="relative rounded-lg border border-zinc-200 bg-white overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.previewUrl}
                      alt={p.file.name}
                      className="w-full h-32 object-cover bg-zinc-100"
                    />
                    <div className="px-2 py-1 flex items-center justify-between gap-2 text-xs">
                      <span className="truncate text-zinc-700">
                        {p.file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        className="text-red-700 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={procesar}
                disabled={photos.length === 0 || !centro.trim()}
                className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-40"
              >
                Procesar {photos.length}{" "}
                {photos.length === 1 ? "foto" : "fotos"}
              </button>
            </div>
          </div>
        </>
      ) : null}

      {phase.kind === "uploading" ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center space-y-2">
          <p className="text-base font-medium text-zinc-900">
            Procesando fotos con visión…
          </p>
          <p className="text-sm text-zinc-600">
            Esto puede tardar entre 10 y 60 segundos según la cantidad de fotos.
          </p>
        </div>
      ) : null}

      {phase.kind === "review" ? (
        <ReviewPhase
          rows={phase.rows}
          warnings={phase.warnings}
          isPending={isPending}
          onUpdate={updateRow}
          onRemove={removeRow}
          onImport={importar}
          onReset={reset}
          centro={centro}
        />
      ) : null}

      {phase.kind === "importing" ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-700">
          Importando filas aprobadas…
        </div>
      ) : null}

      {phase.kind === "done" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
          <p className="text-base font-semibold text-emerald-900">
            ✓ {phase.inserted} pacientes importados (origen: foto OCR, sin
            verificar)
          </p>
          <p className="text-sm text-emerald-800">
            Los registros están en tu dashboard. Revisá y marcalos como
            verificados si coinciden con lo que tenés en el centro.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Cargar otra lista
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ReviewPhase({
  rows,
  warnings,
  isPending,
  onUpdate,
  onRemove,
  onImport,
  onReset,
  centro,
}: {
  rows: ExtractedRow[];
  warnings: string[];
  isPending: boolean;
  onUpdate: (id: string, patch: Partial<ExtractedRow>) => void;
  onRemove: (id: string) => void;
  onImport: () => void;
  onReset: () => void;
  centro: string;
}) {
  const included = rows.filter((r) => r.include).length;
  const validIncluded = rows.filter(
    (r) =>
      r.include &&
      r.nombre_completo.trim().length > 0 &&
      r.estado_clinico.length > 0,
  ).length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">
            3. Revisá fila por fila ({rows.length} detectadas)
          </h2>
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-zinc-700 underline underline-offset-2"
          >
            Cancelar
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">
            <span className="font-semibold">{included}</span> marcadas para importar
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-zinc-700">
            <span className="font-semibold">{validIncluded}</span> válidas
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-zinc-700">
            Centro: <span className="font-semibold">{centro}</span>
          </span>
        </div>

        {warnings.length > 0 ? (
          <details className="rounded-lg border border-amber-200 bg-amber-50">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-amber-900">
              {warnings.length} aviso{warnings.length === 1 ? "" : "s"} del
              procesador
            </summary>
            <ul className="px-3 pb-2 text-xs text-amber-800 space-y-0.5">
              {warnings.map((w, i) => (
                <li key={i}>⚠ {w}</li>
              ))}
            </ul>
          </details>
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onImport}
            disabled={validIncluded === 0 || isPending}
            className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-40"
          >
            {isPending ? "Importando…" : `Importar ${validIncluded} filas`}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-2 py-2 w-10">Incluir</th>
              <th className="px-2 py-2">Fuente</th>
              <th className="px-2 py-2">Confianza</th>
              <th className="px-2 py-2">Nombre</th>
              <th className="px-2 py-2 w-20">Edad</th>
              <th className="px-2 py-2 w-24">Sexo</th>
              <th className="px-2 py-2 w-40">Estado clínico</th>
              <th className="px-2 py-2">Descripción</th>
              <th className="px-2 py-2">Notas OCR</th>
              <th className="px-2 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const confBadge =
                r.confianza >= 0.75
                  ? "bg-emerald-100 text-emerald-900"
                  : r.confianza >= 0.5
                    ? "bg-amber-100 text-amber-900"
                    : "bg-red-100 text-red-900";
              return (
                <tr
                  key={r.rowId}
                  className={`border-t border-zinc-100 ${
                    r.include ? "" : "opacity-50"
                  }`}
                >
                  <td className="px-2 py-2">
                    <input
                      type="checkbox"
                      checked={r.include}
                      onChange={(e) =>
                        onUpdate(r.rowId, { include: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                  </td>
                  <td className="px-2 py-2 text-xs text-zinc-500 truncate max-w-[120px]">
                    {r.sourceFilename || `#${r.sourceIndex + 1}`}
                  </td>
                  <td className="px-2 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${confBadge}`}
                    >
                      {(r.confianza * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={r.nombre_completo}
                      onChange={(e) =>
                        onUpdate(r.rowId, { nombre_completo: e.target.value })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      max={130}
                      value={r.edad_aprox ?? ""}
                      onChange={(e) =>
                        onUpdate(r.rowId, {
                          edad_aprox:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      value={r.sexo}
                      onChange={(e) =>
                        onUpdate(r.rowId, {
                          sexo: e.target.value as ExtractedRow["sexo"],
                        })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1"
                    >
                      <option value="">—</option>
                      {SEXO_OPTIONS.map((o) => (
                        <option key={o.value ?? ""} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <select
                      value={r.estado_clinico}
                      onChange={(e) =>
                        onUpdate(r.rowId, {
                          estado_clinico: e.target
                            .value as ExtractedRow["estado_clinico"],
                        })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1"
                    >
                      {ESTADO_CLINICO_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={r.descripcion_fisica}
                      onChange={(e) =>
                        onUpdate(r.rowId, {
                          descripcion_fisica: e.target.value,
                        })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2 text-xs text-zinc-500">
                    {r.notas || "—"}
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => onRemove(r.rowId)}
                      className="text-xs text-red-700 hover:underline"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}