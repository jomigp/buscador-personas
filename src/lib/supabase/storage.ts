// Helpers para construir la URL pública de una foto en el bucket `fotos-pacientes`.

export const FOTOS_BUCKET = "fotos-pacientes";

export function publicFotoUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${FOTOS_BUCKET}/${path}`;
}