import ImportarFotoForm from "./importar-foto-form";
import { getDistinctValues } from "@/lib/centros";

export const dynamic = "force-dynamic";

export default async function ImportarFotoPage() {
  const { centros, estados, municipios } = await getDistinctValues();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Leer lista desde foto
        </h1>
        <p className="text-sm text-zinc-600 mt-1">
          Subí fotos de listas impresas o manuscritas. La plataforma extrae
          los datos, vos revisás fila por fila y solo entonces se guarda.
        </p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Importante</p>
        <ul className="mt-1 ml-4 list-disc space-y-0.5">
          <li>
            Si la foto <strong>no tiene</strong> el hospital escrito,
            elegilo abajo — se aplica a todas las filas extraídas.
          </li>
          <li>
            Cada fila extraída queda en revisión. Nunca se guarda nada
            sin tu OK.
          </li>
          <li>
            Filas con confianza baja (rojas) conviene revisarlas primero
            comparando con la foto.
          </li>
        </ul>
      </div>
      <ImportarFotoForm
        centros={centros}
        estados={estados}
        municipios={municipios}
      />
    </div>
  );
}