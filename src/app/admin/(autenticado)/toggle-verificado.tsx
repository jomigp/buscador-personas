"use client";

import { useState, useTransition } from "react";
import { toggleFieldAction } from "./acciones";

export default function ToggleVerificado({
  id,
  value,
}: {
  id: string;
  value: boolean;
}) {
  const [v, setV] = useState(value);
  const [isPending, startTransition] = useTransition();

  return (
    <label className="touch-target inline-flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
      <input
        type="checkbox"
        checked={v}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.checked;
          setV(next);
          startTransition(async () => {
            const res = await toggleFieldAction(id, "verificado", next);
            if (!res.ok) {
              setV(!next);
              alert(res.error);
            }
          });
        }}
        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
      />
      <span>Verificado por el centro</span>
    </label>
  );
}