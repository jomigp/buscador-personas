"use server";

// Server Actions del flujo público. Usan el cliente anon del navegador:
// el RLS permite INSERT anónimo en solicitudes_baja y nada más.

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type Result =
  | { ok: true }
  | { ok: false; error: string };

export async function marcarEncontradoAction(input: {
  id: string;
  confirm: string;
}): Promise<Result> {
  if (input.confirm.trim().toLowerCase() !== "encontrado") {
    return { ok: false, error: "Confirmación inválida." };
  }
  if (!input.id) {
    return { ok: false, error: "Falta el identificador del registro." };
  }

  const supabase = await createClient();

  // Comprobar que el registro existe y NO está ya cerrado.
  const { data: paciente, error: e1 } = await supabase
    .from("pacientes")
    .select("id, caso_cerrado")
    .eq("id", input.id)
    .single();

  if (e1 || !paciente) {
    return {
      ok: false,
      error: "No encontramos este registro. Puede que ya haya sido retirado.",
    };
  }
  if (paciente.caso_cerrado) {
    return {
      ok: false,
      error: "Este registro ya fue retirado de la vista pública.",
    };
  }

  const { error: e2 } = await supabase.from("solicitudes_baja").insert({
    paciente_id: input.id,
    nota: "Solicitada desde el buscador público",
  });

  if (e2) {
    return {
      ok: false,
      error: "No pudimos registrar la solicitud. Intenta de nuevo.",
    };
  }

  revalidatePath("/");
  return { ok: true };
}