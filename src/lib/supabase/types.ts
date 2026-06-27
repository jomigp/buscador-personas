// Tipos del esquema `pacientes` — generados manualmente a partir de
// supabase/schema.sql. Mantener en sync si cambia el esquema.

export type EstadoClinico =
  | "estable"
  | "critico"
  | "sin_identificar"
  | "fallecido";

export type Sexo = "M" | "F" | "desconocido";

export type Origen = "manual" | "csv" | "foto_ocr";

export interface Paciente {
  id: string;
  nombre_completo: string;
  edad_aprox: number | null;
  sexo: Sexo | null;
  estado_clinico: EstadoClinico;
  descripcion_fisica: string | null;
  centro_salud: string;
  estado_geografico: string | null;
  municipio: string | null;
  foto_path: string | null;
  registrado_por: string;
  verificado: boolean;
  caso_cerrado: boolean;
  origen: Origen;
  created_at: string;
  updated_at: string;
}

// Forma para inserciones (campos autogenerados omitidos).
export type PacienteInsert = Pick<
  Paciente,
  | "nombre_completo"
  | "estado_clinico"
  | "centro_salud"
  | "registrado_por"
> &
  Partial<
    Pick<
      Paciente,
      | "edad_aprox"
      | "sexo"
      | "descripcion_fisica"
      | "estado_geografico"
      | "municipio"
      | "foto_path"
      | "verificado"
      | "origen"
    >
  >;

// Forma para actualizaciones (todo opcional).
export type PacienteUpdate = Partial<
  Omit<Paciente, "id" | "created_at" | "updated_at">
>;