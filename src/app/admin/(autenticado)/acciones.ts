"use server";

// Acciones del admin: login, logout, crear paciente, actualizar,
// toggles verificado/caso_cerrado. Todas usan el cliente autenticado
// del servidor — el RLS permite escribir solo a usuarios autenticados.

import { createClient } from "@/lib/supabase/server";
import { FOTOS_BUCKET } from "@/lib/supabase/storage";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { EstadoClinico, Sexo } from "@/lib/supabase/types";

const MAX_FOTO_BYTES = 5 * 1024 * 1024; // 5 MB
const TIPOS_FOTO = new Set(["image/jpeg", "image/png", "image/webp"]);

// ---------- Auth ---------------------------------------------------------

export async function signInAction(formData: FormData): Promise<{
  ok: boolean;
  error?: string;
}> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { ok: false, error: "Correo y contraseña son obligatorios." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { ok: false, error: "Credenciales inválidas o cuenta inexistente." };
  }
  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Crear paciente ----------------------------------------------

export async function crearPacienteAction(formData: FormData): Promise<{
  ok: boolean;
  error?: string;
  id?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return { ok: false, error: "Sesión inválida. Vuelve a iniciar sesión." };
  }

  const nombre_completo = String(formData.get("nombre_completo") ?? "").trim();
  const centro_salud = String(formData.get("centro_salud") ?? "").trim();
  const estado_clinico = String(formData.get("estado_clinico") ?? "") as EstadoClinico;
  const edad_aprox_raw = String(formData.get("edad_aprox") ?? "").trim();
  const sexo = (String(formData.get("sexo") ?? "") || null) as Sexo | null;
  const estado_geografico = String(formData.get("estado_geografico") ?? "").trim() || null;
  const municipio = String(formData.get("municipio") ?? "").trim() || null;
  const descripcion_fisica = String(formData.get("descripcion_fisica") ?? "").trim() || null;
  const verificado = formData.get("verificado") === "on";

  if (!nombre_completo) return { ok: false, error: "Falta el nombre completo." };
  if (!centro_salud) return { ok: false, error: "Falta el centro de salud." };
  if (!["estable", "critico", "sin_identificar", "fallecido"].includes(estado_clinico)) {
    return { ok: false, error: "Estado clínico inválido." };
  }

  const edad_aprox = edad_aprox_raw.length > 0 ? Number(edad_aprox_raw) : null;
  if (edad_aprox_raw.length > 0 && (edad_aprox === null || Number.isNaN(edad_aprox) || edad_aprox < 0 || edad_aprox > 130)) {
    return { ok: false, error: "Edad inválida." };
  }

  // Foto opcional
  let foto_path: string | null = null;
  const file = formData.get("foto");
  if (file instanceof File && file.size > 0) {
    if (!TIPOS_FOTO.has(file.type)) {
      return { ok: false, error: "Tipo de archivo no permitido. Usa JPG, PNG o WebP." };
    }
    if (file.size > MAX_FOTO_BYTES) {
      return { ok: false, error: "La foto supera 5 MB." };
    }
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    foto_path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(FOTOS_BUCKET)
      .upload(foto_path, file, {
        contentType: file.type,
        upsert: false,
      });
    if (upErr) {
      return { ok: false, error: `No pudimos subir la foto: ${upErr.message}` };
    }
  }

  const { data, error } = await supabase
    .from("pacientes")
    .insert({
      nombre_completo,
      edad_aprox,
      sexo,
      estado_clinico,
      descripcion_fisica,
      centro_salud,
      estado_geografico,
      municipio,
      foto_path,
      registrado_por: user.email,
      verificado,
      origen: "manual",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: `No pudimos guardar el registro: ${error?.message ?? "error desconocido"}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, id: data.id };
}

// ---------- Actualizar paciente ----------------------------------------

export async function actualizarPacienteAction(
  id: string,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión inválida." };

  const updates: Record<string, unknown> = {};
  const fields: Array<[string, (v: string) => unknown]> = [
    ["nombre_completo", (v) => v.trim()],
    ["centro_salud", (v) => v.trim()],
    ["edad_aprox", (v) => (v.trim().length > 0 ? Number(v) : null)],
    ["sexo", (v) => (v.length > 0 ? v : null)],
    ["estado_clinico", (v) => v],
    ["estado_geografico", (v) => (v.trim().length > 0 ? v.trim() : null)],
    ["municipio", (v) => (v.trim().length > 0 ? v.trim() : null)],
    ["descripcion_fisica", (v) => (v.trim().length > 0 ? v.trim() : null)],
    ["verificado", (v) => v === "on"],
    ["caso_cerrado", (v) => v === "on"],
  ];

  for (const [name, transform] of fields) {
    const raw = formData.get(name);
    if (raw != null) updates[name] = transform(String(raw));
  }

  // Foto opcional (reemplazo)
  const file = formData.get("foto");
  if (file instanceof File && file.size > 0) {
    if (!TIPOS_FOTO.has(file.type)) {
      return { ok: false, error: "Tipo de archivo no permitido. Usa JPG, PNG o WebP." };
    }
    if (file.size > MAX_FOTO_BYTES) {
      return { ok: false, error: "La foto supera 5 MB." };
    }
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const foto_path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(FOTOS_BUCKET)
      .upload(foto_path, file, { contentType: file.type });
    if (upErr) {
      return { ok: false, error: `No pudimos subir la foto: ${upErr.message}` };
    }
    updates.foto_path = foto_path;
  }

  const { error } = await supabase
    .from("pacientes")
    .update(updates)
    .eq("id", id);
  if (error) {
    return { ok: false, error: `No pudimos actualizar: ${error.message}` };
  }
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/admin/${id}`);
  return { ok: true };
}

export async function toggleFieldAction(
  id: string,
  field: "verificado" | "caso_cerrado",
  value: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión inválida." };

  const { error } = await supabase
    .from("pacientes")
    .update({ [field]: value })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}