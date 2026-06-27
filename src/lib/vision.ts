// Adaptador para extraer pacientes desde fotos usando Gemini 2.5 Flash.
//
// Decisiones de diseño:
//  - Server-side only: la API key NUNCA sale del servidor.
//  - JSON estructurado vía responseSchema: Gemini garantiza la forma.
//  - centro_salud, estado_geografico y municipio NO los pide en la foto:
//    los rellena el uploader al subir (la foto puede no tenerlos).
//  - Devuelve SIEMPRE un array, posiblemente vacío.

import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  EstadoClinico,
  Sexo,
} from "@/lib/supabase/types";

const MODEL = "gemini-2.5-flash";

export type ExtractedRow = {
  nombre_completo: string | null;
  edad_aprox: number | null;
  sexo: Sexo | null;
  estado_clinico: EstadoClinico | null;
  descripcion_fisica: string | null;
  notas: string | null;
  confianza: number;
};

export type ExtractResult = {
  rows: ExtractedRow[];
  raw: string; // Texto crudo del modelo, para debug
};

// Schema estricto que Gemini debe respetar.
const responseSchema = {
  type: "array" as const,
  items: {
    type: "object" as const,
    properties: {
      nombre_completo: {
        type: "string" as const,
        nullable: true,
        description: "Nombre completo del paciente tal como aparece en la lista",
      },
      edad_aprox: {
        type: "integer" as const,
        nullable: true,
        description: "Edad aproximada (entero). null si no se puede leer.",
      },
      sexo: {
        type: "string" as const,
        nullable: true,
        enum: ["M", "F", "desconocido"],
        description: "M, F, desconocido, o null",
      },
      estado_clinico: {
        type: "string" as const,
        nullable: true,
        enum: ["estable", "critico", "sin_identificar", "fallecido"],
        description: "Estado clínico del paciente, o null si no está claro",
      },
      descripcion_fisica: {
        type: "string" as const,
        nullable: true,
        description: "Rasgos físicos o vestimenta si aparecen",
      },
      notas: {
        type: "string" as const,
        nullable: true,
        description: "Palabras ilegibles, ambigüedades, o cualquier cosa que no encaje en los otros campos",
      },
      confianza: {
        type: "number" as const,
        description: "Tu nivel de certeza de la fila completa, de 0 a 1",
      },
    },
    required: [
      "nombre_completo",
      "estado_clinico",
      "confianza",
    ],
  },
};

const SYSTEM_INSTRUCTION = `Eres un asistente que transcribe listados de pacientes a partir de una foto, para ayudar a reunificar familias tras un terremoto en Venezuela. Tu única tarea es leer lo que aparece en la imagen y devolverlo de forma estructurada. Es un contexto de vida o muerte: la exactitud importa y no debes inventar datos.

Reglas:
- Devuelve EXCLUSIVAMENTE un array JSON válido que cumpla el esquema. Sin texto antes ni después, sin explicaciones.
- Un objeto por persona detectada en la lista.
- Usa null en cualquier campo que no puedas leer con seguridad. NUNCA inventes ni adivines un dato.
- No corrijas ni "mejores" nombres: transcribe lo que ves. Si una palabra es ilegible, ponla en "notas" y deja el campo en null.
- "estado_clinico" solo puede ser uno de: "estable", "critico", "sin_identificar", "fallecido". Sinónimos como "grave", "UCI", "delicado" → "critico". "alta", "egresado" → "estable". "muerto", "óbito" → "fallecido". Si la lista no lo indica con claridad, usa null.
- "sexo" solo puede ser "M", "F" o "desconocido".
- "confianza" es tu nivel de certeza de la fila completa, de 0 a 1. Si no estás seguro de NADA, pon 0.3 o menos.
- Si la imagen NO contiene una lista de personas legible (es otro documento, está vacía, está borrosa), devuelve un array vacío: [].
- La lista puede estar impresa o manuscrita. Puede estar en español o tener abreviaciones.`;

export async function extractPatientsFromImage(input: {
  imageBase64: string;
  mimeType: string;
  filename: string;
}): Promise<ExtractResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta la variable de entorno GEMINI_API_KEY. Configurala en Vercel.",
    );
  }

  const genai = new GoogleGenerativeAI(apiKey);
  const model = genai.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      // Cast necesario: la definición de tipos del SDK no acepta los
      // literales que la API sí acepta.
      responseSchema: responseSchema as never,
      temperature: 0,
      maxOutputTokens: 4096,
    },
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Archivo: ${input.filename}. Extrae los pacientes de esta lista. Recuerda devolver EXCLUSIVAMENTE el array JSON.`,
          },
          {
            inlineData: {
              data: input.imageBase64,
              mimeType: input.mimeType,
            },
          },
        ],
      },
    ],
  });

  const text = result.response.text();
  let rows: ExtractedRow[] = [];
  try {
    const parsed: unknown = JSON.parse(text);
    if (Array.isArray(parsed)) {
      rows = (parsed as ExtractedRow[]).filter(
        (r): r is ExtractedRow =>
          typeof r === "object" && r !== null && typeof r.confianza === "number",
      );
    }
  } catch {
    // Si el modelo devuelve algo no parseable, devolvemos vacío y exponemos
    // el raw text para debug en el admin.
  }
  return { rows, raw: text };
}