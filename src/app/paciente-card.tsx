"use client";

// Tarjeta mobile-first. El botón "Marcar como encontrado" abre un modal
// de confirmación y, al confirmar, llama a un Server Action que pide al
// personal de salud del centro cerrar el caso (la única vía válida es
// que personal autenticado marque caso_cerrado = true).

import { useEffect, useRef, useState, useTransition } from "react";
import type { Paciente } from "@/lib/supabase/types";
import {
  ESTADO_CLINICO_BADGE,
  ESTADO_CLINICO_LABEL,
  SEXO_LABEL,
  formatFecha,
} from "@/lib/clinical";
import { publicFotoUrl } from "@/lib/supabase/storage";
import { marcarEncontradoAction } from "./acciones";

type Props = { paciente: Paciente };

export default function PacienteCard({ paciente }: Props) {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fotoUrl = publicFotoUrl(paciente.foto_path);

  // Escape cierra el modal + restaura foco al trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setConfirmText("");
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Bloquear scroll del body mientras el modal está abierto
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await marcarEncontradoAction({
        id: paciente.id,
        confirm: confirmText.trim(),
      });
      if (res.ok) {
        setMensaje(
          "Gracias. Se notificó al centro para retirar el registro de inmediato.",
        );
        setOpen(false);
      } else {
        setMensaje(res.error);
      }
    });
  }

  const necesitaConfirmacion =
    confirmText.trim().toLowerCase() === "encontrado";

  return (
    <article className="rounded-xl border border-zinc-200 bg-white overflow-hidden flex flex-col">
      <div className="flex gap-3 p-4">
        <div className="shrink-0">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoUrl}
              alt=""
              className="h-20 w-20 rounded-lg object-cover bg-zinc-100"
              loading="lazy"
            />
          ) : (
            <div className="h-20 w-20 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">
              Sin foto
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-zinc-900 leading-snug break-words [hyphens:auto]">
              {paciente.nombre_completo}
            </h3>
            <span
              className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTADO_CLINICO_BADGE[paciente.estado_clinico]}`}
            >
              {ESTADO_CLINICO_LABEL[paciente.estado_clinico]}
            </span>
          </div>
          <p className="text-sm text-zinc-600">
            {paciente.edad_aprox != null ? `${paciente.edad_aprox} años` : "Edad desconocida"}
            {paciente.sexo ? ` · ${SEXO_LABEL[paciente.sexo]}` : ""}
          </p>
          <p className="text-sm text-zinc-700">
            <span className="font-medium">{paciente.centro_salud}</span>
          </p>
          <p className="text-xs text-zinc-500">
            {[
              paciente.municipio,
              paciente.estado_geografico,
            ]
              .filter(Boolean)
              .join(" · ") || "Ubicación no precisada"}
          </p>
          {paciente.verificado ? (
            <p className="text-xs font-medium text-emerald-700">
              ✓ Verificado por {paciente.centro_salud}
            </p>
          ) : null}
          {paciente.descripcion_fisica ? (
            <p className="text-xs text-zinc-500 line-clamp-2">
              {paciente.descripcion_fisica}
            </p>
          ) : null}
        </div>
      </div>
      <div className="border-t border-zinc-100 px-4 py-2 flex items-center justify-between gap-2 bg-zinc-50/50">
        <span className="text-xs text-zinc-500">
          Cargado {formatFecha(paciente.created_at)}
        </span>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="touch-target inline-flex items-center justify-center px-3 text-xs font-medium text-zinc-800 underline underline-offset-2 hover:text-zinc-950"
        >
          Marcar como encontrado
        </button>
      </div>

      {mensaje ? (
        <div className="border-t border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-800">
          {mensaje}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            // Click en el backdrop (no en el dialog) cierra el modal
            if (e.target === e.currentTarget) {
              setOpen(false);
              setConfirmText("");
              triggerRef.current?.focus();
            }
          }}
        >
          <div
            ref={dialogRef}
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white shadow-xl"
          >
            <form onSubmit={onConfirm} className="p-5 space-y-4">
              <div className="space-y-1">
                <h4
                  id="modal-title"
                  className="text-base font-semibold text-zinc-900"
                >
                  ¿Estás seguro de que {paciente.nombre_completo} ya fue
                  encontrado?
                </h4>
                <p className="text-sm text-zinc-600">
                  Cerraremos este registro en la vista pública y avisaremos al
                  centro. Esta acción no se puede deshacer desde aquí.
                </p>
              </div>
              <label className="block space-y-1">
                <span className="block text-sm font-medium text-zinc-800">
                  Escribe{" "}
                  <span className="font-mono">encontrado</span> para confirmar
                </span>
                <input
                  type="text"
                  autoFocus
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
              </label>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setConfirmText("");
                    triggerRef.current?.focus();
                  }}
                  disabled={isPending}
                  className="touch-target rounded-lg px-4 text-sm font-medium text-zinc-700 hover:text-zinc-900 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!necesitaConfirmacion || isPending}
                  className="touch-target rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-40"
                >
                  {isPending ? "Enviando…" : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </article>
  );
}