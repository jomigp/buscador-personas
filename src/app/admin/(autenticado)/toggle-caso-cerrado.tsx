"use client";

import { useState, useTransition } from "react";
import { toggleFieldAction } from "./acciones";

export default function ToggleCasoCerrado({
  id,
  value,
}: {
  id: string;
  value: boolean;
}) {
  const [v, setV] = useState(value);
  const [isPending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;
    if (next) {
      const ok = confirm(
        "¿Cerrar este caso? Se retirará de la vista pública de inmediato.",
      );
      if (!ok) return;
    }
    setV(next);
    startTransition(async () => {
      const res = await toggleFieldAction(id, "caso_cerrado", next);
      if (!res.ok) {
        setV(!next);
        alert(res.error);
      }
    });
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs text-zinc-700">
      <input
        type="checkbox"
        checked={v}
        disabled={isPending}
        onChange={onChange}
        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
      />
      <span>Caso cerrado (fuera del listado público)</span>
    </label>
  );
}