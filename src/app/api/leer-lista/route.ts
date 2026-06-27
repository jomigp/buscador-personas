// Route Handler para Fase 2: extraer pacientes desde fotos con Gemini.
//
// Recibe FormData con:
//  - "fotos": uno o más archivos de imagen (jpg/png/webp)
//  - "centro_salud": string (obligatorio) — se aplica a TODAS las filas extraídas
//  - "estado_geografico": string opcional — default para todas las filas
//  - "municipio": string opcional — default para todas las filas
//
// Devuelve JSON con:
//  {
//    rows: [{ nombre_completo, edad_aprox, ..., confianza, sourceIndex }],
//    perImage: [{ filename, rowsCount, error }],
//    warnings: ["..."]
//  }
//
// La autenticación se valida igual que las Server Actions: el cliente debe
// tener una sesión activa (RLS + JWT en cookies). Esto evita que un visitante
// anónimo abuse del endpoint.

import { NextRequest, NextResponse } from "next/server";
import { extractPatientsFromImage } from "@/lib/vision";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB por imagen
const TIPOS_VALIDOS = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: NextRequest) {
  // 1. Verificar sesión
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  // 2. Parsear FormData
  const formData = await request.formData();
  const centro_salud = String(formData.get("centro_salud") ?? "").trim();
  const estado_geografico =
    String(formData.get("estado_geografico") ?? "").trim() || null;
  const municipio = String(formData.get("municipio") ?? "").trim() || null;

  if (!centro_salud) {
    return NextResponse.json(
      { error: "Falta el centro de salud." },
      { status: 400 },
    );
  }

  const fotos = formData.getAll("fotos").filter((f): f is File => f instanceof File);

  if (fotos.length === 0) {
    return NextResponse.json(
      { error: "Adjuntá al menos una imagen." },
      { status: 400 },
    );
  }

  // 3. Validar cada imagen antes de gastar la API
  const warnings: string[] = [];
  for (const f of fotos) {
    if (!TIPOS_VALIDOS.has(f.type)) {
      return NextResponse.json(
        { error: `Tipo no permitido: ${f.name} (${f.type}). Usa JPG, PNG o WebP.` },
        { status: 400 },
      );
    }
    if (f.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `${f.name} supera 8 MB.` },
        { status: 400 },
      );
    }
  }

  // 4. Procesar cada foto en paralelo (Gemini acepta varias imágenes por
  //    request, pero las mandamos separadas para aislar fallos y poder
  //    mostrar al admin qué fila vino de qué foto).
  const perImage: Array<{
    filename: string;
    rowsCount: number;
    error?: string;
  }> = [];
  const allRows: Array<ExtractedRowWithMeta> = [];

  const results = await Promise.allSettled(
    fotos.map(async (foto, idx) => {
      const buffer = Buffer.from(await foto.arrayBuffer());
      const base64 = buffer.toString("base64");
      const { rows } = await extractPatientsFromImage({
        imageBase64: base64,
        mimeType: foto.type,
        filename: foto.name,
      });
      // Adjuntar metadata común (centro, ubicación) por fila.
      const enriched = rows.map((r) => ({
        ...r,
        sourceIndex: idx,
        centro_salud,
        estado_geografico,
        municipio,
      }));
      return { filename: foto.name, idx, rows: enriched };
    }),
  );

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const filename = fotos[i].name;
    if (r.status === "fulfilled") {
      perImage.push({ filename, rowsCount: r.value.rows.length });
      allRows.push(...r.value.rows);
    } else {
      const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
      perImage.push({ filename, rowsCount: 0, error: msg });
      warnings.push(`${filename}: ${msg}`);
    }
  }

  // 5. Limpiar sourceIndex (no debe ir al insert).
  const rows = allRows.map(({ sourceIndex: _drop, ...rest }) => {
    void _drop;
    return rest;
  });

  return NextResponse.json({
    rows,
    perImage,
    warnings,
  });
}

type ExtractedRowWithMeta = Awaited<
  ReturnType<typeof extractPatientsFromImage>
>["rows"][number] & {
  sourceIndex: number;
  centro_salud: string;
  estado_geografico: string | null;
  municipio: string | null;
};