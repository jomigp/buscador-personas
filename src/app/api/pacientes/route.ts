// API publica para cargar más resultados del buscador con los mismos
// filtros que la página principal. Server-side, anon key (solo lectura).

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EstadoClinico, Sexo, Paciente } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

const ESTADOS_VALIDOS: EstadoClinico[] = [
  "estable",
  "critico",
  "sin_identificar",
  "fallecido",
];
const SEXOS_VALIDOS: Sexo[] = ["M", "F", "desconocido"];

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const offset = Math.max(0, Number(sp.get("offset") ?? "0") || 0);

  const supabase = await createClient();

  let query = supabase
    .from("pacientes")
    .select("*", { count: "exact" })
    .eq("caso_cerrado", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const q = sp.get("q")?.trim();
  if (q) query = query.ilike("nombre_completo", `%${q}%`);

  const estadoClinico = sp.get("estado_clinico")?.trim();
  if (estadoClinico && ESTADOS_VALIDOS.includes(estadoClinico as EstadoClinico)) {
    query = query.eq("estado_clinico", estadoClinico);
  }

  const sexo = sp.get("sexo")?.trim();
  if (sexo && SEXOS_VALIDOS.includes(sexo as Sexo)) {
    query = query.eq("sexo", sexo);
  }

  const estadoGeo = sp.get("estado_geografico")?.trim();
  if (estadoGeo) query = query.ilike("estado_geografico", `%${estadoGeo}%`);

  const municipio = sp.get("municipio")?.trim();
  if (municipio) query = query.ilike("municipio", `%${municipio}%`);

  const centro = sp.get("centro_salud")?.trim();
  if (centro) query = query.ilike("centro_salud", `%${centro}%`);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    rows: (data ?? []) as Paciente[],
    total: count ?? 0,
    offset,
    pageSize: PAGE_SIZE,
  });
}