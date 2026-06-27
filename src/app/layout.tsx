import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Buscador de personas — Emergencia sísmica 24 de junio de 2026",
  description:
    "Buscador público para que las familias encuentren a sus seres queridos ingresados en hospitales y centros de triaje tras el terremoto del 24 de junio de 2026 en Venezuela.",
  applicationName: "Buscador de personas",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
            <Link href="/" className="flex flex-col leading-tight">
              <span className="text-xs text-zinc-500">
                Medio aliado · Emergencia sísmica
              </span>
              <span className="text-base font-semibold text-zinc-900">
                Buscador de personas
              </span>
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 underline underline-offset-2"
            >
              Acceso personal de salud
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-zinc-600 space-y-2">
            <p className="font-medium text-zinc-800">Aviso de privacidad</p>
            <p>
              Este buscador existe para ayudar a las familias a localizar a sus
              seres queridos tras el terremoto del 24 de junio de 2026. La
              información proviene de personal de salud de los centros
              participantes. Mostramos solo los datos necesarios para la
              identificación. Si usted es familiar o representante de una
              persona listada y desea que su registro se retire o corrija,
              contáctenos y lo atenderemos a la brevedad. Los datos se
              conservarán únicamente durante la emergencia y se retirarán
              cuando dejen de ser necesarios.
            </p>
            <p>
              Proyecto{" "}
              <span className="font-medium">open source</span> · código abierto
              para que otros medios y comunidades puedan desplegarlo.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}