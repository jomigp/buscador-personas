import ImportarCSVForm from "./importar-csv-form";

export default function ImportarCSVPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Importar pacientes desde CSV
        </h1>
        <p className="text-sm text-zinc-600 mt-1">
          Sube un archivo CSV exportado de Google Sheets o Excel. Vas a ver
          una vista previa con los errores antes de confirmar la importación.
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
        <p className="font-medium text-zinc-800 mb-2">
          Columnas aceptadas (case-insensitive)
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-600">
          <li>
            <span className="font-mono text-zinc-800">nombre_completo</span>{" "}
            <span className="text-red-600">*</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">centro_salud</span>{" "}
            <span className="text-red-600">*</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">estado_clinico</span>{" "}
            <span className="text-red-600">*</span>{" "}
            <span className="text-zinc-500">
              (estable, critico, sin_identificar, fallecido)
            </span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">edad_aprox</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">sexo</span>{" "}
            <span className="text-zinc-500">(M, F, desconocido)</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">estado_geografico</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">municipio</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">descripcion_fisica</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">foto_path</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">verificado</span>{" "}
            <span className="text-zinc-500">(true / false)</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-zinc-500">
          Acepta separador coma o punto y coma. La primera fila debe tener
          los encabezados. Las fotos no se suben por CSV — eso va por el
          formulario individual.
        </p>
      </div>
      <ImportarCSVForm />
    </div>
  );
}