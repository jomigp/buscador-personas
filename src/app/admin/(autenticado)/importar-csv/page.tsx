import ImportarCSVForm from "./importar-csv-form";

export default function ImportarCSVPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Importación masiva
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
          Importar pacientes desde CSV
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl">
          Subí un archivo CSV exportado de Google Sheets o Excel. La
          plataforma limpia automáticamente el archivo, te muestra una vista
          previa con los errores antes de guardar, y vos confirmás.
        </p>
      </div>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
        <summary className="cursor-pointer font-medium text-zinc-800 flex items-center gap-1">
          Ver columnas aceptadas
          <span aria-hidden="true" className="text-zinc-400 group-open:rotate-180 transition-transform">
            ▾
          </span>
        </summary>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <li>
            <span className="font-mono text-zinc-800">nombre_completo</span>
            <span className="text-red-600"> *</span>{" "}
            <span className="text-zinc-500">
              (o columnas Apellido + Nombre)
            </span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">centro_salud</span>
            <span className="text-red-600"> *</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">estado_clinico</span>
            <span className="text-red-600"> *</span>{" "}
            <span className="text-zinc-500">(estable, critico, sin_identificar, fallecido)</span>
          </li>
          <li>
            <span className="font-mono text-zinc-800">edad_aprox</span>{" "}
            <span className="text-zinc-500">(0–130)</span>
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
          Acepta separador coma o punto y coma (típico de Excel en español).
          Primera fila con encabezados. Las fotos no entran por CSV.
        </p>
      </details>

      <ImportarCSVForm />
    </div>
  );
}